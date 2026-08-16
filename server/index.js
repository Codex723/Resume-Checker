import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { randomUUID } from "crypto";
import { GoogleGenAI, Type } from "@google/genai";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

const app = express();
const PORT = process.env.PORT || 3001;
const MODEL = "gemini-3.5-flash";
// Search grounding has a much smaller free-tier quota than plain
// generation and was the main cause of 429s. Off by default — one
// Gemini call per analysis instead of two. Set to "true" in .env once
// you have enough quota headroom to want live-search-backed insights.
const GROUNDED_RESEARCH = process.env.GROUNDED_RESEARCH === "true";

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "[server] GEMINI_API_KEY is not set. Add it to your .env file — see .env.example."
  );
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:8080" }));
app.use(express.json({ limit: "2mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

async function extractText(file) {
  const { originalname, buffer, mimetype } = file;
  const lower = originalname.toLowerCase();

  if (mimetype === "application/pdf" || lower.endsWith(".pdf")) {
    const parsed = await pdfParse(buffer);
    return parsed.text;
  }

  if (
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lower.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (mimetype === "application/msword" || lower.endsWith(".doc")) {
    throw new Error(
      "Legacy .doc files aren't supported yet. Please upload a PDF or .docx file."
    );
  }

  throw new Error("Unsupported file type.");
}

const PROFILE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    fullName: { type: Type.STRING },
    title: { type: Type.STRING, description: "current or target job title" },
    email: { type: Type.STRING },
    phone: { type: Type.STRING },
    location: { type: Type.STRING },
    linkedin: { type: Type.STRING, description: "leave empty string if not present" },
    summary: { type: Type.STRING, description: "2-4 sentence professional summary" },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          company: { type: Type.STRING },
          dates: { type: Type.STRING },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["role", "company", "dates", "bullets"],
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          school: { type: Type.STRING },
          degree: { type: Type.STRING },
          dates: { type: Type.STRING },
        },
        required: ["school", "degree", "dates"],
      },
    },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["fullName", "title", "email", "phone", "location", "linkedin", "summary", "experience", "education", "skills"],
};

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    profession: { type: Type.STRING, description: "the person's target profession/role, e.g. 'Frontend Developer'" },
    atsScore: { type: Type.NUMBER, description: "0-100, how well the resume would parse/score in an ATS" },
    overallScore: { type: Type.NUMBER, description: "0-100, overall resume quality" },
    keywordDensity: { type: Type.NUMBER, description: "approximate % of relevant keywords, e.g. 3.2" },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING, enum: ["technical", "soft", "industry", "tools"] },
          strength: { type: Type.STRING, enum: ["strong", "moderate", "mentioned"] },
        },
        required: ["name", "category", "strength"],
      },
    },
    missingSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "valuable skills for this specific profession that are missing from the resume",
    },
    formatSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ["error", "warning", "info"] },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["type", "title", "description"],
      },
    },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
        },
        required: ["name", "score", "feedback"],
      },
    },
    professionInsights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "specific, actionable advice grounded in the profession research provided, tailored to this exact resume",
    },
    profile: PROFILE_SCHEMA,
  },
  required: [
    "profession",
    "atsScore",
    "overallScore",
    "keywordDensity",
    "skills",
    "missingSkills",
    "formatSuggestions",
    "sections",
    "professionInsights",
    "profile",
  ],
};

// Retries a Gemini call on transient 429s with exponential backoff.
// Free-tier per-minute limits are easy to hit with normal usage but
// usually clear within a few seconds — daily quota exhaustion (the
// bigger 429 cause) won't be helped by this and will still surface
// after the retries are exhausted.
async function withRetry(fn, { attempts = 3, baseDelayMs = 2000 } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const isQuotaError = (err.message || "").includes("RESOURCE_EXHAUSTED");
      if (!isQuotaError || i === attempts - 1) throw err;
      const delay = baseDelayMs * Math.pow(2, i);
      console.warn(`[server] Rate limited, retrying in ${delay}ms (attempt ${i + 1}/${attempts})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastErr;
}

// Step 1 (optional, off by default — see GROUNDED_RESEARCH): research
// what a strong resume looks like for this person's profession using
// live Google Search grounding rather than the model's static training
// data. Search grounding has a much smaller free-tier quota than plain
// generation, so this is skipped unless explicitly enabled, and fails
// soft even when enabled — the resume still gets scored either way.
async function researchProfession(resumeText) {
  if (!GROUNDED_RESEARCH) {
    return { research: "", sources: [] };
  }

  try {
    const response = await withRetry(() =>
      ai.models.generateContent({
        model: MODEL,
        contents: `Here is a resume:\n\n${resumeText.slice(0, 8000)}\n\nIdentify this person's target profession/role. Then search for and summarize current (2026) expectations for a strong resume in that specific profession: expected structure, keywords, common requirements, and mistakes to avoid. Be specific to the profession, not generic resume advice.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      })
    );

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((chunk) => chunk.web && { title: chunk.web.title || chunk.web.uri, url: chunk.web.uri })
      .filter(Boolean)
      .slice(0, 6);

    return { research: response.text || "", sources };
  } catch (err) {
    console.warn("[server] profession research skipped (continuing without it):", err.message || err);
    return { research: "", sources: [] };
  }
}

// Step 2: produce the actual scored analysis + extracted profile, informed
// by the research from step 1 when available. This is the only call made
// per analysis by default.
async function analyzeWithResearch(resumeText, research) {
  const researchBlock = research
    ? `Current research on what a strong resume looks like for this person's profession:\n\n${research.slice(0, 4000)}\n\nUsing that research, `
    : `Using your own knowledge of current (2026) hiring practices for this profession, `;

  const response = await withRetry(() =>
    ai.models.generateContent({
      model: MODEL,
      contents: `Resume text:\n\n${resumeText.slice(0, 15000)}\n\n${researchBlock}score this resume honestly, give profession-specific improvement advice, and extract its content into structured fields. Base every field on what's actually in the resume — do not invent achievements, employers, or dates. For the profile fields, if something genuinely isn't in the resume, use an empty string or empty array rather than guessing.`,
      config: {
        systemInstruction:
          "You are an expert resume reviewer and ATS specialist who tailors feedback to the person's specific profession.",
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
      },
    })
  );

  if (!response.text) {
    throw new Error("No response from the model.");
  }

  return JSON.parse(response.text);
}

function withIds(profile) {
  return {
    ...profile,
    experience: (profile.experience || []).map((entry) => ({ id: randomUUID(), ...entry })),
    education: (profile.education || []).map((entry) => ({ id: randomUUID(), ...entry })),
  };
}

function friendlyErrorMessage(err) {
  const raw = err.message || "";
  if (raw.includes("RESOURCE_EXHAUSTED") || raw.includes("429") || raw.includes("quota")) {
    return "Hit Gemini's free-tier rate limit. Wait a minute (or check https://ai.dev/rate-limit) and try again.";
  }
  return raw || "Analysis failed.";
}

app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error:
          "Server is missing GEMINI_API_KEY. Add it to your .env file and restart the server.",
      });
    }

    const resumeText = (await extractText(req.file)).trim();

    if (!resumeText || resumeText.length < 30) {
      return res.status(422).json({
        error:
          "Couldn't extract meaningful text from that file. Try a different PDF/DOCX export.",
      });
    }

    const { research, sources } = await researchProfession(resumeText);
    const parsed = await analyzeWithResearch(resumeText, research);

    const analysis = {
      id: randomUUID(),
      fileName: req.file.originalname,
      uploadDate: new Date().toISOString(),
      ...parsed,
      profile: withIds(parsed.profile),
      sources,
    };

    res.json(analysis);
  } catch (err) {
    console.error("[server] /api/analyze failed:", err);
    res.status(err.message?.includes("RESOURCE_EXHAUSTED") ? 429 : 500).json({ error: friendlyErrorMessage(err) });
  }
});

// Rewrites a resume profile to be stronger, using the analysis suggestions
// as guidance. Facts (employers, dates, degrees) are preserved — only
// phrasing, framing, and impact are improved.
app.post("/api/enhance-resume", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Server is missing GEMINI_API_KEY. Add it to your .env file and restart the server.",
      });
    }

    const { profile, profession, suggestions } = req.body || {};
    if (!profile) {
      return res.status(400).json({ error: "Missing profile in request body." });
    }

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: MODEL,
        contents: `Target profession: ${profession || "unspecified"}\n\nImprovement suggestions to apply:\n${(suggestions || []).map((s) => `- ${s}`).join("\n")}\n\nCurrent resume content (JSON):\n${JSON.stringify(profile, null, 2)}\n\nRewrite this into a stronger version. Use punchier, achievement-focused bullets with strong action verbs. Add quantification only where it's plausible from context — never invent specific numbers that aren't implied by the original text. Never change employers, job titles, companies, schools, or dates. Keep the summary to 2-4 sentences.`,
        config: {
          systemInstruction:
            "You are an expert resume writer. You improve phrasing and impact without fabricating facts.",
          responseMimeType: "application/json",
          responseSchema: PROFILE_SCHEMA,
        },
      })
    );

    if (!response.text) {
      throw new Error("No response from the model.");
    }

    const improved = withIds(JSON.parse(response.text));
    res.json(improved);
  } catch (err) {
    console.error("[server] /api/enhance-resume failed:", err);
    res.status(err.message?.includes("RESOURCE_EXHAUSTED") ? 429 : 500).json({ error: friendlyErrorMessage(err) });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
});

app.listen(PORT, () => {
  console.log(`[server] Resume analysis API running on http://localhost:${PORT}`);
});
