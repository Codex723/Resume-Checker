import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormatSuggestion } from "@/types/resume";

interface SuggestionCardProps {
  suggestion: FormatSuggestion;
  index: number;
}

export function SuggestionCard({ suggestion, index }: SuggestionCardProps) {
  const typeConfig = {
    error: {
      icon: AlertCircle,
      bg: "bg-destructive/5 border-destructive/20",
      iconColor: "text-destructive",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-warning/5 border-warning/20",
      iconColor: "text-warning",
    },
    info: {
      icon: Info,
      bg: "bg-accent/5 border-accent/20",
      iconColor: "text-accent",
    },
  };

  const config = typeConfig[suggestion.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn("rounded-xl border p-4", config.bg)}
    >
      <div className="flex gap-3">
        <div className={cn("mt-0.5", config.iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground">{suggestion.title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{suggestion.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
