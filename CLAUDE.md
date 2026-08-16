# CLAUDE.md

Resume analyzer: upload a PDF/DOCX, get an ATS score, skill gaps, and
profession-specific feedback researched via live search — then build and
download an improved resume from a template. Frontend calls a small
Express server that extracts the resume text and talks to Gemini.

## Stack

- Vite 5 + React 18 + TypeScript, React Router v6 (single route, `/`)
- Tailwind + a trimmed-down shadcn-ui (`button`, `toast`, `toaster`,
  `tooltip`, `sonner` only — don't `npx shadcn add` more without checking
  it'll actually get used, this repo used to have 60 unused ones)
- Framer Motion for all animation — no Tailwind keyframes, no CSS
  transitions for view changes
- Server: Express (`server/index.js`), single file, no framework beyond that
- `@google/genai` on the server only, model pinned via the `MODEL` const in
  `server/index.js` — currently `gemini-3.5-flash`. Don't switch this to
  the `gemini-flash-latest` alias again without checking free-tier status
  first: it silently followed a just-launched model with no free quota
  yet and broke analysis. Never import `@google/genai` or reference
  `GEMINI_API_KEY` from `src/`

## Commands

- `npm run dev` — frontend only, :8080
- `npm run server` — backend only, :3001
- `npm run dev:full` — both, via `concurrently`
- `npm run build` — `tsc` runs implicitly through Vite; also run
  `npx tsc --noEmit` directly if you want a standalone type check
- `npm run lint`

## Architecture

- `src/pages/Index.tsx` owns all view state (`upload` / `analyzing` /
  `results` / `builder` / `error`) and analysis history. No router-level
  state, no context, no external store — this app is small enough that
  prop drilling from Index is fine. Don't reach for Redux/Zustand here.
- `src/utils/analyzeApi.ts` — the only place that calls `/api/analyze` and
  `/api/enhance-resume`. Throws `AnalysisApiError` on failure; there is no
  mock/demo fallback anywhere — a failed analysis shows a real error with
  a retry button, on purpose.
- `server/index.js` — `POST /api/analyze` makes one Gemini call by
  default: `responseSchema` structured output that scores the resume and
  extracts a `ResumeProfile`, using the model's own knowledge of hiring
  practices. Set `GROUNDED_RESEARCH=true` in `.env` to add a second call
  first, using the `googleSearch` tool to research the person's specific
  profession via live search — better insights, but burns through the
  free tier's (much smaller) search quota fast, which is why it's opt-in.
  Both calls go through `withRetry()`, which backs off and retries on
  transient 429s; a real quota exhaustion still surfaces as an error after
  retries run out. `POST /api/enhance-resume` takes a profile + suggestions
  and returns a rewritten profile — same schema, always ungrounded.
- `src/types/resume.ts` is the source of truth for both `ResumeAnalysis`
  (scores/feedback) and `ResumeProfile` (name, summary, experience,
  education, skills — what actually goes on the printed resume). If you
  change either shape, update the matching schema in `server/index.js` in
  the same commit.
- `src/components/resume-templates/` — one file per downloadable template,
  each a pure presentational component taking `profile: ResumeProfile`.
  Add a template by dropping in a new component and registering it in
  `index.ts`; no other wiring needed.
- `src/components/ResumeBuilder.tsx` owns all profile-editing state after
  analysis. `src/utils/downloadResume.ts` rasterizes whatever's in the
  preview ref via html2canvas and slices it into A4 pages with jsPDF — it
  captures the DOM as-is, so template layout changes show up in the PDF
  automatically.

## Conventions actually in this code

- No default exports except pages and `App.tsx`. Components are named
  exports (`export function Header()`), consistent everywhere.
- Tailwind classes only — no inline `style={}` except where jsPDF-style
  computed values genuinely need it (there are none in `src/`).
- `cn()` from `@/lib/utils` for conditional classes, not template strings.
- Errors from the API surface through the existing toast system
  (`useToast` from `@/hooks/use-toast`), not `alert()` or new UI.

## Hard rules

- Don't add shadcn components speculatively. Add one when a component
  actually needs it, in the same PR that uses it.
- Don't put API keys or secrets anywhere under `src/` — they'd ship to the
  browser. Server-only, via `.env` (see `.env.example`).
- Don't reintroduce dark mode CSS/tokens unless there's an actual toggle
  being built — it was dead weight before and got removed.
- Ask before adding a state management library, a CSS-in-JS solution, or a
  second animation library. None of the three are needed at this size.

## Gotchas

- The Vite dev server proxies `/api/*` to `:3001` (see `vite.config.ts`).
  If you run `npm run dev` without also starting the server, you'll get a
  real error on the upload screen now — there's no silent mock-data
  fallback anymore, on purpose.
- `.doc` (legacy binary Word format) is explicitly unsupported and throws
  a clear error — don't try to add a parser for it casually, it's a real
  time sink. PDF and `.docx` cover the actual use case.
- `eslint.config.js` only lints `**/*.{ts,tsx}` — `server/index.js` isn't
  linted at all. Keep it simple/obviously-correct since there's no lint
  safety net there.
- Grounding with `googleSearch` is off by default (`GROUNDED_RESEARCH`)
  because it exhausted the free tier almost immediately in testing — a
  429 on a fresh key was traced back to this. Don't flip it on by default
  again without a real quota check, and don't add it to
  `/api/enhance-resume` or other frequently-hit endpoints.
