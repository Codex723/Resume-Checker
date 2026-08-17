# ResumeAI

Upload a resume (PDF or DOCX), get back an ATS score, an overall score,
detected/missing skills, section feedback, and profession-specific advice
researched via live search. From there, pick from 8 resume templates, have
AI rewrite weak sections (with a before/after score so you can see whether
it actually helped), and download the result as a PDF.

Frontend is Vite + React + TypeScript + Tailwind + shadcn-ui. The analysis
itself runs on a small Express server that extracts the resume text and
sends it to Gemini.

No tool — this one included — can guarantee a resume gets someone hired;
too much of that depends on the job market, the specific employer, and the
interview. What this does is remove the common, fixable reasons a resume
gets passed over: weak ATS formatting, generic phrasing, and missing
profession-specific keywords and structure.

## Setup

```sh
npm install
cp .env.example .env
```

Put a real key in `.env`:

```
GEMINI_API_KEY=AIza...
```

Get one free, no card required, from https://aistudio.google.com/app/apikey.

Each analysis researches the person's specific profession via live Google
Search before scoring, so advice reflects current hiring norms rather than
generic template advice. This uses a smaller free-tier quota than plain
analysis, and it's the most likely source of a `429` error. If that
happens: it's Google's real rate limit, not a bug — wait a bit and retry,
check usage at https://ai.dev/rate-limit, or set `GROUNDED_RESEARCH=false`
in `.env` to fall back to ungrounded (still real, just not live-searched)
analysis.

## Running it

```sh
npm run dev:full
```

That starts the API on `:3001` and the frontend on `:8080` together. Vite
proxies `/api/*` to the backend, so the frontend just hits `/api/analyze`.

Backend not running, or no key set? The app shows a clear error with a
retry button — there's no demo/fake data fallback, since the whole point
is a real analysis.

## Layout

```
src/        frontend
  components/resume-templates/   the downloadable resume templates
server/     express api
  POST /api/analyze          upload + score + extract profile
  POST /api/enhance-resume   AI rewrite of summary/bullets
```

## Deploying

Frontend is static — build with `npm run build`, host `dist/` anywhere.
Backend needs a Node host (Render, Railway, Fly, etc.) with
`GEMINI_API_KEY` and `CLIENT_ORIGIN` set. If they end up on different
domains, set `VITE_API_URL` on the frontend build to point at the backend.
