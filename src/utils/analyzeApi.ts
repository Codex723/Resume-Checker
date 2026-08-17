import type { ResumeAnalysis, ResumeProfile, EnhanceResult, ScoreSnapshot } from "@/types/resume";

const API_BASE = import.meta.env.VITE_API_URL || "";

export class AnalysisApiError extends Error {}

async function parseErrorResponse(response: Response, fallback: string) {
  const body = await response.json().catch(() => ({}));
  return new AnalysisApiError(body.error || fallback);
}

export async function analyzeResume(file: File): Promise<ResumeAnalysis> {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw await parseErrorResponse(response, `Analysis request failed (${response.status}).`);
  }

  const data = await response.json();
  return {
    ...data,
    uploadDate: new Date(data.uploadDate),
  };
}

interface EnhanceParams {
  profile: ResumeProfile;
  profession: string;
  suggestions: string[];
  professionInsights: string[];
  beforeScore: ScoreSnapshot;
}

export async function enhanceResume(params: EnhanceParams): Promise<EnhanceResult> {
  const response = await fetch(`${API_BASE}/api/enhance-resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw await parseErrorResponse(response, `Enhancement request failed (${response.status}).`);
  }

  return response.json();
}
