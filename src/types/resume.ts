export interface ResumeAnalysis {
  id: string;
  fileName: string;
  uploadDate: Date;
  atsScore: number;
  overallScore: number;
  skills: Skill[];
  missingSkills: string[];
  formatSuggestions: FormatSuggestion[];
  keywordDensity: number;
  sections: ResumeSection[];
  profession: string;
  professionInsights: string[];
  sources: ResearchSource[];
  profile: ResumeProfile;
}

export interface Skill {
  name: string;
  category: 'technical' | 'soft' | 'industry' | 'tools';
  strength: 'strong' | 'moderate' | 'mentioned';
}

export interface FormatSuggestion {
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
}

export interface ResumeSection {
  name: string;
  score: number;
  feedback: string;
}

export interface ResearchSource {
  title: string;
  url: string;
}

// Structured resume content, extracted by the AI, used to fill the
// downloadable templates. The user can edit every field before exporting.
export interface ResumeProfile {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  dates: string;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  dates: string;
}

export type TemplateId = 'modern' | 'classic' | 'minimal';

export type SortOption = 'date' | 'atsScore' | 'name';
export type FilterCategory = 'all' | 'technical' | 'soft' | 'industry' | 'tools';
