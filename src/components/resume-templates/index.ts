import type { ComponentType } from "react";
import type { ResumeProfile, TemplateId } from "@/types/resume";
import { ModernTemplate } from "./ModernTemplate";
import { ClassicTemplate } from "./ClassicTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { ExecutiveTemplate } from "./ExecutiveTemplate";
import { CreativeTemplate } from "./CreativeTemplate";
import { TechnicalTemplate } from "./TechnicalTemplate";
import { CompactTemplate } from "./CompactTemplate";
import { AcademicTemplate } from "./AcademicTemplate";

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
  {
    id: "executive",
    name: "Executive",
    description: "Dark header, formal serif type. Built for leadership and senior management roles.",
    component: ExecutiveTemplate,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Color sidebar, asymmetric layout. Good for design, marketing, and portfolio-driven roles.",
    component: CreativeTemplate,
  },
  {
    id: "technical",
    name: "Technical",
    description: "Monospace accents, skill tags. Built for software/engineering roles.",
    component: TechnicalTemplate,
  },
  {
    id: "compact",
    name: "Compact",
    description: "Dense two-column layout that fits more content on a single page.",
    component: CompactTemplate,
  },
  {
    id: "academic",
    name: "Academic",
    description: "Education-forward, traditional CV structure. Good for research and academic roles.",
    component: AcademicTemplate,
  },
];

export function getTemplate(id: TemplateId) {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
