import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types/resume";

interface SkillTagProps {
  skill: Skill;
  index: number;
}

export function SkillTag({ skill, index }: SkillTagProps) {
  const categoryStyles = {
    technical: "bg-accent/10 text-accent border-accent/20",
    soft: "bg-success/10 text-success border-success/20",
    industry: "bg-warning/10 text-warning border-warning/20",
    tools: "bg-primary/10 text-primary border-primary/20",
  };

  const strengthIndicator = {
    strong: "●●●",
    moderate: "●●○",
    mentioned: "●○○",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
        categoryStyles[skill.category]
      )}
    >
      <span>{skill.name}</span>
      <span className="text-[10px] opacity-60">{strengthIndicator[skill.strength]}</span>
    </motion.div>
  );
}
