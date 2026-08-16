import { motion } from "framer-motion";
import { FileText, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreCircle } from "@/components/ScoreCircle";
import type { ResumeAnalysis } from "@/types/resume";

interface HistoryCardProps {
  analysis: ResumeAnalysis;
  onView: (analysis: ResumeAnalysis) => void;
  index: number;
}

export function HistoryCard({ analysis, onView, index }: HistoryCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass-card-hover rounded-xl p-4"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
          <FileText className="h-6 w-6 text-accent" />
        </div>
        
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-semibold text-foreground">{analysis.fileName}</h4>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(analysis.uploadDate)}
          </div>
        </div>

        <div className="hidden sm:block">
          <ScoreCircle score={analysis.atsScore} size="sm" />
        </div>

        <Button variant="ghost" size="sm" onClick={() => onView(analysis)}>
          View
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
