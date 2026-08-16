import { useState } from "react";
import { motion } from "framer-motion";
import { History as HistoryIcon, SortAsc, Filter } from "lucide-react";
import { HistoryCard } from "@/components/HistoryCard";
import { Button } from "@/components/ui/button";
import type { ResumeAnalysis, SortOption } from "@/types/resume";
import { cn } from "@/lib/utils";

interface HistoryProps {
  analyses: ResumeAnalysis[];
  onViewAnalysis: (analysis: ResumeAnalysis) => void;
}

export function History({ analyses, onViewAnalysis }: HistoryProps) {
  const [sortBy, setSortBy] = useState<SortOption>("date");

  const sortedAnalyses = [...analyses].sort((a, b) => {
    if (sortBy === "date") {
      return b.uploadDate.getTime() - a.uploadDate.getTime();
    }
    if (sortBy === "atsScore") {
      return b.atsScore - a.atsScore;
    }
    return a.fileName.localeCompare(b.fileName);
  });

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "date", label: "Date" },
    { value: "atsScore", label: "ATS Score" },
    { value: "name", label: "Name" },
  ];

  if (analyses.length === 0) {
    return null;
  }

  return (
    <section id="history" className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <HistoryIcon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Analysis History</h2>
                <p className="text-sm text-muted-foreground">
                  {analyses.length} resume{analyses.length !== 1 ? "s" : ""} analyzed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                      sortBy === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {sortedAnalyses.map((analysis, index) => (
              <HistoryCard
                key={analysis.id}
                analysis={analysis}
                onView={onViewAnalysis}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
