import { motion } from "framer-motion";
import { Briefcase, ExternalLink } from "lucide-react";
import type { ResearchSource } from "@/types/resume";

interface ProfessionInsightsProps {
  profession: string;
  insights: string[];
  sources: ResearchSource[];
}

export function ProfessionInsights({ profession, insights, sources }: ProfessionInsightsProps) {
  if (insights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">
          Tailored for: <span className="text-accent">{profession}</span>
        </h3>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Researched from current job postings and hiring guidance for this profession.
      </p>

      <ul className="mt-4 space-y-2">
        {insights.map((insight, index) => (
          <li key={index} className="flex gap-2 text-sm leading-relaxed text-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {insight}
          </li>
        ))}
      </ul>

      {sources.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-medium text-muted-foreground">Sources</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground hover:text-accent"
              >
                {source.title}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
