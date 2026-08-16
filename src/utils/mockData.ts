import type { ResumeAnalysis } from "@/types/resume";

export function generateMockAnalysis(fileName: string): ResumeAnalysis {
  const atsScore = Math.floor(Math.random() * 30) + 65;
  const overallScore = Math.floor(Math.random() * 25) + 70;
  
  return {
    id: crypto.randomUUID(),
    fileName,
    uploadDate: new Date(),
    atsScore,
    overallScore,
    keywordDensity: Number((Math.random() * 2 + 2).toFixed(1)),
    skills: [
      { name: "React", category: "technical", strength: "strong" },
      { name: "TypeScript", category: "technical", strength: "strong" },
      { name: "JavaScript", category: "technical", strength: "strong" },
      { name: "Node.js", category: "technical", strength: "moderate" },
      { name: "Python", category: "technical", strength: "mentioned" },
      { name: "Git", category: "tools", strength: "strong" },
      { name: "AWS", category: "tools", strength: "moderate" },
      { name: "Docker", category: "tools", strength: "mentioned" },
      { name: "Leadership", category: "soft", strength: "moderate" },
      { name: "Communication", category: "soft", strength: "strong" },
      { name: "Problem Solving", category: "soft", strength: "strong" },
      { name: "Agile", category: "industry", strength: "moderate" },
      { name: "CI/CD", category: "industry", strength: "mentioned" },
    ],
    missingSkills: [
      "GraphQL",
      "Kubernetes",
      "Redis",
      "PostgreSQL",
      "Testing (Jest/Cypress)",
    ],
    formatSuggestions: [
      {
        type: "warning",
        title: "Add Quantifiable Achievements",
        description: "Consider adding metrics and numbers to your accomplishments. For example: 'Increased sales by 25%' instead of 'Improved sales performance'.",
      },
      {
        type: "info",
        title: "Optimize Section Headers",
        description: "Use standard section headers like 'Work Experience', 'Education', and 'Skills' to improve ATS parsing.",
      },
      {
        type: "error",
        title: "Missing Contact Information",
        description: "LinkedIn profile URL and professional email should be clearly visible in the header section.",
      },
      {
        type: "info",
        title: "Consider Adding a Summary",
        description: "A 2-3 sentence professional summary at the top can help recruiters quickly understand your value proposition.",
      },
    ],
    sections: [
      { name: "Contact Information", score: 70, feedback: "Consider adding LinkedIn profile and portfolio URL" },
      { name: "Work Experience", score: 85, feedback: "Good structure, add more quantifiable achievements" },
      { name: "Skills", score: 78, feedback: "Well organized, consider adding proficiency levels" },
      { name: "Education", score: 90, feedback: "Excellent formatting and relevant details" },
      { name: "Projects", score: 72, feedback: "Add links to live demos or GitHub repositories" },
    ],
  };
}
