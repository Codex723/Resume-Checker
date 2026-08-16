import { motion } from "framer-motion";
import { FileSearch, Brain, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

const steps = [
  { icon: FileSearch, label: "Scanning document structure...", duration: 1500 },
  { icon: Brain, label: "Analyzing content with AI...", duration: 2000 },
  { icon: CheckCircle, label: "Generating recommendations...", duration: 1500 },
];

export function LoadingAnalysis() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, steps[currentStep]?.duration || 1500);

    return () => clearInterval(timer);
  }, [currentStep]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card mx-auto max-w-md rounded-2xl p-8 text-center"
    >
      <div className="relative mx-auto h-20 w-20">
        {/* Spinning ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-accent/20"
          style={{ borderTopColor: "hsl(var(--accent))" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: currentStep === index ? 1 : 0,
                scale: currentStep === index ? 1 : 0.5,
              }}
              className="absolute"
            >
              <step.icon className="h-8 w-8 text-accent" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: currentStep >= index ? 1 : 0.3,
            }}
            className="flex items-center justify-center gap-2 text-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: currentStep >= index ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {currentStep > index ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <div
                  className={`h-2 w-2 rounded-full ${
                    currentStep === index ? "animate-pulse-subtle bg-accent" : "bg-muted"
                  }`}
                />
              )}
            </motion.div>
            <span
              className={
                currentStep >= index ? "text-foreground" : "text-muted-foreground"
              }
            >
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        This usually takes 10-15 seconds
      </p>
    </motion.div>
  );
}
