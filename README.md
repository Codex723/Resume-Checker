# ResumeAI

ResumeAI is an AI-powered resume analysis tool that gives job seekers honest, profession-specific feedback on their resume  the kind of critique you'd normally have to pay a career coach for. Upload a PDF or DOCX, and within seconds you get a full breakdown of how the resume actually reads: an ATS compatibility score, an overall quality score, which skills are present versus missing, section-by-section feedback, and concrete advice tailored to the person's specific profession rather than generic "use action verbs" tips.

## The problem it solves

Most resume tools either run a shallow keyword match against a job description, or give the same boilerplate advice to everyone regardless of field. ResumeAI is built around a different idea: the model first figures out what profession the resume is actually targeting, then evaluates the resume against what *that* profession's hiring bar looks like  so a software engineer's resume and a nurse's resume aren't judged by the same yardstick.

## How it works

1. **Parsing**  the uploaded PDF or DOCX is parsed server-side to extract raw resume text.
2. **Profession research (optional)**  the resume can be paired with a live Google Search grounding step that pulls current expectations for that specific role: typical structure, in-demand keywords, and common mistakes for that field, rather than relying purely on the model's static training data.
3. **Scoring and extraction**  a single structured Gemini call scores the resume (ATS score, overall score, keyword density), evaluates each section, flags formatting issues, identifies present and missing skills, and extracts the resume's content into a clean structured profile (contact info, experience, education, skills)  all grounded strictly in what's actually written, with no invented achievements or dates.
4. **Rewriting**  once the analysis is in, the person can ask the AI to rewrite weak summaries or bullet points, with facts like employers, titles, and dates preserved and only the phrasing and impact improved.
5. **Templating and export**  the extracted profile can be dropped into one of several resume templates and exported as a polished, ready-to-send PDF.

## What you get back

- **ATS score**  how well the resume would likely parse and score in an applicant tracking system
- **Overall score**  general resume quality
- **Keyword density**  how saturated the resume is with role-relevant terms
- **Skill breakdown**  detected skills categorized as technical, soft, tools, or industry, each rated by how strongly they're demonstrated
- **Missing skills**  valuable skills for the target profession that the resume doesn't currently show
- **Section feedback**  a score and specific critique for each section of the resume
- **Format suggestions**  errors, warnings, and tips flagged by severity
- **Profession insights**  actionable advice specific to the detected role, with source links when live research is enabled

There's no fake/demo data path  if the backend or API key isn't available, the app surfaces a clear error instead of pretending to analyze anything.

## Design choices worth knowing

- **Structured output, not free text.** The analysis is returned as schema-validated JSON, so the frontend always gets predictable fields instead of parsing prose.
- **Grounding is opt-in.** Live search grounding produces more current, source-backed advice, but burns through API quota much faster than a plain generation call  so by default the analysis runs on a single Gemini call, and grounding is something you turn on deliberately.
- **Facts are preserved during rewriting.** The AI enhancement step is explicitly constrained to improve wording and framing, not to fabricate experience.

## Tech stack

- **Frontend:** Vite, React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Express (Node.js)
- **AI:** Google Gemini API, with optional Google Search grounding
- **Document handling:** `pdf-parse` and `mammoth` for extraction, `jsPDF` + `html2canvas` for export