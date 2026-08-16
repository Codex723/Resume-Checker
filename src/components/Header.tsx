import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";

export function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">ResumeAI</span>
        </div>
        
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#analyze" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Analyze
          </a>
          <a href="#history" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            History
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <motion.div 
            className="hidden items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent md:flex"
            whileHover={{ scale: 1.02 }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Powered
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
