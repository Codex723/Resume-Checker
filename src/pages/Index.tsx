import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FileUpload } from "@/components/FileUpload";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { AnalysisResults } from "@/components/AnalysisResults";
import { ResumeBuilder } from "@/components/ResumeBuilder";
import { History } from "@/components/History";
import { Button } from "@/components/ui/button";
import { analyzeResume } from "@/utils/analyzeApi";
import { generatePDFReport } from "@/utils/pdfGenerator";
import type { ResumeAnalysis } from "@/types/resume";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

type ViewState = "upload" | "analyzing" | "results" | "builder" | "error";

const Index = () => {
  const [viewState, setViewState] = useState<ViewState>("upload");
  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<ResumeAnalysis[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const { toast } = useToast();

  const runAnalysis = async (file: File) => {
    setPendingFile(file);
    setViewState("analyzing");

    try {
      const analysis = await analyzeResume(file);
      setCurrentAnalysis(analysis);
      setAnalysisHistory((prev) => [analysis, ...prev]);
      setViewState("results");

      toast({
        title: "Analysis Complete",
        description: `Your resume "${file.name}" has been analyzed successfully.`,
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
      setViewState("error");
    }
  };

  const handleViewFromHistory = (analysis: ResumeAnalysis) => {
    setCurrentAnalysis(analysis);
    setViewState("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadReport = () => {
    if (currentAnalysis) {
      generatePDFReport(currentAnalysis);
      toast({
        title: "Report Downloaded",
        description: "Your PDF report has been generated and downloaded.",
      });
    }
  };

  const handleNewAnalysis = () => {
    setViewState("upload");
    setCurrentAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <AnimatePresence mode="wait">
          {viewState === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero />
              <section id="analyze" className="pb-16">
                <div className="container mx-auto px-4 md:px-6">
                  <FileUpload onFileAccepted={runAnalysis} isAnalyzing={false} />
                </div>
              </section>
            </motion.div>
          )}

          {viewState === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24"
            >
              <div className="container mx-auto px-4 md:px-6">
                <LoadingAnalysis />
              </div>
            </motion.div>
          )}

          {viewState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24"
            >
              <div className="container mx-auto max-w-lg px-4 text-center md:px-6">
                <div className="glass-card rounded-2xl p-8">
                  <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
                  <h2 className="mt-4 text-lg font-semibold text-foreground">Analysis failed</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
                  <Button
                    variant="accent"
                    className="mt-6"
                    onClick={() => (pendingFile ? runAnalysis(pendingFile) : setViewState("upload"))}
                  >
                    <RotateCcw className="h-4 w-4" />
                    {pendingFile ? "Try Again" : "Back to Upload"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {viewState === "results" && currentAnalysis && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8"
            >
              <div className="container mx-auto px-4 md:px-6">
                <div className="mb-6">
                  <button onClick={handleNewAnalysis} className="text-sm font-medium text-accent hover:underline">
                    ← Analyze Another Resume
                  </button>
                </div>
                <AnalysisResults
                  analysis={currentAnalysis}
                  onDownloadReport={handleDownloadReport}
                  onBuildResume={() => setViewState("builder")}
                />
              </div>
            </motion.div>
          )}

          {viewState === "builder" && currentAnalysis && (
            <motion.div
              key="builder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8"
            >
              <div className="container mx-auto px-4 md:px-6">
                <div className="mb-6">
                  <button
                    onClick={() => setViewState("results")}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    ← Back to Analysis
                  </button>
                </div>
                <ResumeBuilder
                  initialProfile={currentAnalysis.profile}
                  profession={currentAnalysis.profession}
                  suggestions={currentAnalysis.formatSuggestions.map((s) => s.description)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <History analyses={analysisHistory} onViewAnalysis={handleViewFromHistory} />
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">© 2026 ResumeAI. Built for your career success.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
};

export default Index;
