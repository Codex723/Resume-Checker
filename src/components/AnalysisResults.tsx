import { motion } from "framer-motion";
import { Download, TrendingUp, Target, Lightbulb, FileText, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreCircle } from "@/components/ScoreCircle";
import { SkillTag } from "@/components/SkillTag";
import { SuggestionCard } from "@/components/SuggestionCard";
import { ProfessionInsights } from "@/components/ProfessionInsights";
import type { ResumeAnalysis, FilterCategory } from "@/types/resume";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AnalysisResultsProps {
  analysis: ResumeAnalysis;
  onDownloadReport: () => void;
  onBuildResume: () => void;
}

export function AnalysisResults({ analysis, onDownloadReport, onBuildResume }: AnalysisResultsProps) {
  const [skillFilter, setSkillFilter] = useState<FilterCategory>("all");

  const filteredSkills = analysis.skills.filter(
    (skill) => skillFilter === "all" || skill.category === skillFilter
  );

  const categories: FilterCategory[] = ["all", "technical", "soft", "industry", "tools"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
          <p className="text-muted-foreground">
            <FileText className="mr-1 inline-block h-4 w-4" />
            {analysis.fileName}
          </p>
        </div>
        <Button variant="accent" onClick={onDownloadReport}>
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Build resume CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start gap-4 rounded-2xl border border-accent/30 bg-accent/5 p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Wand2 className="h-4 w-4 text-accent" />
            Build an improved resume
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a template, let AI rewrite weak sections, and download the updated version.
          </p>
        </div>
        <Button variant="accent" onClick={onBuildResume}>
          Build My Resume
        </Button>
      </motion.div>

      <ProfessionInsights
        profession={analysis.profession}
        insights={analysis.professionInsights}
        sources={analysis.sources}
      />

      {/* Score Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 text-center"
        >
          <ScoreCircle score={analysis.atsScore} size="md" label="ATS Score" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 text-center"
        >
          <ScoreCircle score={analysis.overallScore} size="md" label="Overall Score" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 text-accent">
            <TrendingUp className="h-6 w-6" />
            <span className="text-sm font-medium">Keyword Density</span>
          </div>
          <p className="mt-4 text-4xl font-bold text-foreground">
            {analysis.keywordDensity}%
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Industry average: 2-4%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 text-success">
            <Target className="h-6 w-6" />
            <span className="text-sm font-medium">Skills Found</span>
          </div>
          <p className="mt-4 text-4xl font-bold text-foreground">
            {analysis.skills.length}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {analysis.missingSkills.length} recommended to add
          </p>
        </motion.div>
      </div>

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-foreground">Identified Skills</h3>
        
        {/* Filter tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSkillFilter(category)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                skillFilter === category
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div className="mt-6 flex flex-wrap gap-2">
          {filteredSkills.map((skill, index) => (
            <SkillTag key={skill.name} skill={skill} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Missing Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-warning" />
          <h3 className="text-lg font-semibold text-foreground">Recommended Skills to Add</h3>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {analysis.missingSkills.map((skill, index) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="rounded-full border border-dashed border-warning/30 bg-warning/5 px-3 py-1.5 text-sm font-medium text-warning"
            >
              + {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Formatting Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-foreground">Formatting & Layout Suggestions</h3>
        <div className="space-y-3">
          {analysis.formatSuggestions.map((suggestion, index) => (
            <SuggestionCard key={index} suggestion={suggestion} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Section Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-foreground">Section Analysis</h3>
        <div className="mt-6 space-y-4">
          {analysis.sections.map((section, index) => (
            <div key={section.name}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{section.name}</span>
                <span className="text-sm text-muted-foreground">{section.score}/100</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${section.score}%` }}
                  transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
                  className={cn(
                    "h-full rounded-full",
                    section.score >= 80 ? "bg-success" : section.score >= 60 ? "bg-accent" : "bg-warning"
                  )}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{section.feedback}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
