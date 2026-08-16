import type { ComponentType } from "react";
import type { ResumeProfile, TemplateId } from "@/types/resume";
import { ModernTemplate } from "./ModernTemplate";
import { ClassicTemplate } from "./ClassicTemplate";
import { MinimalTemplate } from "./MinimalTemplate";

interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  component: ComponentType<{ profile: ResumeProfile }>;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Bold header with a teal accent. Good default for tech and design roles.",
    component: ModernTemplate,
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional, centered layout. Safe choice for conservative industries and ATS parsing.",
    component: ClassicTemplate,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Understated and whitespace-heavy. Works well for senior/creative profiles.",
    component: MinimalTemplate,
  },
];

export function getTemplate(id: TemplateId) {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
