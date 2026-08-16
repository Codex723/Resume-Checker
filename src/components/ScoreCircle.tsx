import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  sublabel?: string;
}

export function ScoreCircle({ score, size = "md", label, sublabel }: ScoreCircleProps) {
  const sizes = {
    sm: { container: "h-20 w-20", stroke: 6, text: "text-xl", label: "text-xs" },
    md: { container: "h-32 w-32", stroke: 8, text: "text-3xl", label: "text-sm" },
    lg: { container: "h-44 w-44", stroke: 10, text: "text-5xl", label: "text-base" },
  };

  const config = sizes[size];
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success stroke-success";
    if (score >= 60) return "text-accent stroke-accent";
    if (score >= 40) return "text-warning stroke-warning";
    return "text-destructive stroke-destructive";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("relative", config.container)}>
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={config.stroke}
            className="stroke-secondary"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={config.stroke}
            strokeLinecap="round"
            className={cn(getScoreColor(score))}
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className={cn("font-bold", config.text, getScoreColor(score).split(" ")[0])}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {score}
          </motion.span>
          {sublabel && (
            <span className="text-xs text-muted-foreground">{sublabel}</span>
          )}
        </div>
      </div>
      
      {label && (
        <span className={cn("font-medium text-foreground", config.label)}>
          {label}
        </span>
      )}
    </div>
  );
}
