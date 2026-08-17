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
- `server/index.js` — `POST /api/analyze` makes a `responseSchema`
  structured call that scores the resume and extracts a `ResumeProfile`.
  With `GROUNDED_RESEARCH` on (default), it first runs a `googleSearch`
  grounded call to research the person's specific profession via live
  search, feeding that into the scoring prompt — set to `false` in `.env`
  if you're hitting persistent 429s, since grounding uses a much smaller
  free-tier quota than plain generation. Both calls go through
  `withRetry()`, which backs off and retries transient 429s; a real quota
  exhaustion still surfaces as an error after retries run out.
  `POST /api/enhance-resume` rewrites a profile using the analysis
  suggestions plus the profession insights from the original analysis
  (reused, not re-searched — no extra grounding call here) and returns a
  self-reported before/after score plus a plain-language changelog, all
  in the same call via `ENHANCE_SCHEMA`.
- `src/types/resume.ts` is the source of truth for `ResumeAnalysis`,
  `ResumeProfile`, and `EnhanceResult`. If you change any of these shapes,
  update the matching schema in `server/index.js` in the same commit.
- `src/components/resume-templates/` — 8 templates, one file per, each a
  pure presentational component taking `profile: ResumeProfile`. Add a
  template by dropping in a new component and registering it in
  `index.ts`; no other wiring needed.
- `src/components/ResumeBuilder.tsx` owns all profile-editing state after
  analysis, plus the enhancement score card and page-break guides (drawn
  at 1056px increments to approximate US Letter at the templates' fixed
  816px render width — not exact, just enough to warn before download).
  `src/utils/downloadResume.ts` rasterizes whatever's in the preview ref
  via html2canvas and slices it into pages with jsPDF — it captures the
  DOM as-is, so template layout changes show up in the PDF
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
- Grounding with `googleSearch` (`GROUNDED_RESEARCH`, on by default) is
  what makes the profession research real instead of just the model's
  training data, per an explicit product requirement — but it's also what
  caused the 429s during initial testing. It fails soft (falls back to
  ungrounded analysis) and retries transient limits, but a genuinely
  exhausted daily quota isn't fixable from code. If persistent 429s come
  back, the honest fix is `GROUNDED_RESEARCH=false` or a paid tier, not
  another retry-logic tweak. Don't add grounding to `/api/enhance-resume`
  — it reuses the research from `/api/analyze` instead, on purpose, to
  keep quota usage to one grounded call per resume, not one per action.
