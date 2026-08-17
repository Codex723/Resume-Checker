# ResumeAI

ResumeAI is an AI-powered resume analysis and rebuilding tool that tells you exactly why your resume is getting passed over, and then helps you fix it.

Most job seekers never find out why their resume isn't getting responses. They send out dozens of applications, hear nothing back, and assume the problem is the job market or their experience. Often, the real problem is fixable: the resume fails to parse in an Applicant Tracking System (ATS), uses generic phrasing that blends into every other application, or is missing the specific keywords and structure that recruiters and automated screeners in that particular profession expect.

ResumeAI removes the guesswork. Upload a resume, and it produces a detailed, honest, profession-specific breakdown of what's working and what isn't, then gives you the tools to turn that feedback into a stronger resume you can actually download.

---

## What it does

### 1. Deep resume analysis

Upload a PDF or DOCX resume and ResumeAI runs a full diagnostic:

- **ATS Score (0-100)** — how well your resume would parse and score in an Applicant Tracking System. This covers layout, section structure, standard headings, and machine-readability.
- **Overall Score (0-100)** — an honest assessment of overall resume quality, including content strength, impact, and presentation.
- **Keyword Density** — the approximate percentage of relevant keywords in your resume, compared against the industry average of 2-4%.
- **Identified Skills** — every skill detected in your resume, categorized as technical, soft, industry, or tools, and rated by strength (strong, moderate, or mentioned).
- **Missing Skills** — the valuable skills for your specific profession that are absent from your resume, so you know exactly what to add.
- **Formatting & Layout Suggestions** — prioritized issues flagged as errors, warnings, or informational notes, covering everything from broken sections to weak phrasing.
- **Section-by-Section Analysis** — each major section (summary, experience, education, skills, etc.) scored individually with specific feedback on how to improve it.
- **Profession Insights** — actionable, tailored advice for your exact target role, grounded in live research on what a strong resume looks like in that profession today.

### 2. Profession-specific research

Before scoring, ResumeAI identifies your target profession and researches current expectations for that specific role using live Google Search. This means the advice reflects what hiring managers and ATS systems actually look for in your field right now, not generic resume tips from a decade ago. The analysis cites its research sources so you can verify the advice yourself.

### 3. Structured profile extraction

The AI extracts your resume into a clean, structured profile: contact details, professional summary, work experience with bullet points, education, and skills. Nothing is invented — if a field isn't in your resume, it's left empty rather than guessed.

### 4. Resume builder with 8 templates

Once your resume is analyzed, you can rebuild it in a full-featured editor:

- **8 professionally designed templates**, each suited to different industries and career stages:
  - **Modern** — bold header with a teal accent, a strong default for tech and design roles.
  - **Classic** — traditional centered layout, a safe choice for conservative industries and ATS parsing.
  - **Minimal** — understated and whitespace-heavy, ideal for senior and creative profiles.
  - **Executive** — dark header with formal serif type, built for leadership and senior management.
  - **Creative** — color sidebar with an asymmetric layout, made for design, marketing, and portfolio-driven roles.
  - **Technical** — monospace accents and skill tags, designed for software and engineering roles.
  - **Compact** — a dense two-column layout that fits more content on a single page.
  - **Academic** — an education-forward, traditional CV structure for research and academic roles.
- **Live editing** — every field is editable: personal info, summary, experience, education, and skills. Add or remove entries freely.
- **Real-time preview** — see your changes rendered instantly in the chosen template, with visible page-break guides so you always know exactly how many pages your resume will be before you download it.
- **Download as PDF** — export the finished resume as a clean, print-ready PDF.

### 5. AI-powered enhancement

The builder includes an **Enhance with AI** feature that rewrites your summary and bullet points to be stronger and more impactful. It works from your analysis results and profession research, so the rewrite targets the exact weaknesses that were identified.

- Facts are never changed — employers, job titles, companies, schools, and dates are all preserved. Only phrasing, framing, and impact are improved.
- The AI is explicitly instructed to avoid resume clichés and inflated buzzwords, and to write like a specific human describing their own work rather than AI-generated marketing copy.
- You get a **before/after score comparison** so you can see, honestly, how much the rewrite actually helped.
- A summary of exactly what was changed and why is shown after every enhancement, and you can edit anything that doesn't sound like you.

### 6. Analysis history

Every analysis is kept in your session history, so you can revisit past results, compare scores, and re-open any previous analysis to continue building on it.

### 7. PDF report download

Beyond the rebuilt resume, you can download the full analysis itself as a PDF report — a complete record of your scores, skills, suggestions, and profession insights that you can keep or share.

---

## The problem it solves

Every year, thousands of qualified candidates are filtered out before a human ever reads their resume. The reasons are usually the same:

- **ATS rejection** — resumes with complex layouts, missing standard section headings, or unparseable formatting get silently discarded by the software companies use to screen applications.
- **Generic phrasing** — "responsible for", "helped with", and other passive, vague language makes a resume indistinguishable from hundreds of others.
- **Missing keywords** — if the specific tools, technologies, and terms your profession expects aren't on the page, both the ATS and the recruiter will assume you don't have them.
- **No feedback loop** — unlike an interview, a resume gives you no signal about why it failed. You just never hear back.

ResumeAI turns that silent rejection into actionable feedback. It tells you precisely what's wrong, what's missing, and what to change, then gives you the templates and AI rewriting tools to actually make those changes and download the result.

---

## What it doesn't do

No tool — this one included — can guarantee a resume gets someone hired. Too much of that depends on the job market, the specific employer, and the interview. What ResumeAI does is remove the common, fixable reasons a resume gets passed over: weak ATS formatting, generic phrasing, and missing profession-specific keywords and structure.

The AI never fabricates achievements, employers, or dates. It won't invent metrics that aren't supported by your actual experience. And every AI rewrite should be read and edited by you before you send it — no rewrite is perfect, and the final voice should always be yours.

---

## How it works under the hood

- **Frontend** — a React + TypeScript single-page app built with Vite, styled with Tailwind CSS and shadcn/ui components, with Framer Motion animations and TanStack Query for data handling.
- **Backend** — a lightweight Express API that handles file uploads, extracts text from PDF and DOCX files (using pdf-parse and mammoth), and communicates with Google's Gemini model.
- **Analysis pipeline** — the server extracts the resume text, optionally researches the target profession via live Google Search, then asks Gemini to score the resume, extract its content into structured fields, and generate profession-specific feedback. All responses are validated against a strict JSON schema.
- **Resume rendering** — templates are rendered as React components and exported to PDF using jsPDF and html2canvas, with page-break guides shown in the preview so multi-page resumes are never a surprise.
- **Rate-limit resilience** — the server automatically retries transient API rate limits with exponential backoff, and surfaces clear, friendly error messages when Google's free-tier quota is genuinely exhausted.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| UI/UX | Framer Motion, Lucide icons, React Dropzone, Sonner toasts |
| Data | TanStack Query, React Router |
| Backend | Node.js, Express, Multer |
| Document parsing | pdf-parse, Mammoth |
| AI | Google Gemini (via @google/genai) with live Google Search grounding |
| PDF generation | jsPDF, html2canvas |