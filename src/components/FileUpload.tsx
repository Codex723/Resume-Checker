import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
  isAnalyzing: boolean;
}

export function FileUpload({ onFileAccepted, isAnalyzing }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: isAnalyzing,
  });

  const handleAnalyze = () => {
    if (selectedFile) {
      onFileAccepted(selectedFile);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div
          {...getRootProps()}
          className={cn(
            "relative cursor-pointer rounded-2xl border-2 border-dashed p-8 md:p-12 transition-all duration-300",
            isDragActive 
              ? "border-accent bg-accent/5 scale-[1.02]" 
              : "border-border hover:border-accent/50 hover:bg-secondary/30",
            isAnalyzing && "pointer-events-none opacity-50"
          )}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-4 text-center">
            <motion.div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
                isDragActive ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
              )}
              animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            >
              <Upload className="h-8 w-8" />
            </motion.div>
            
            <div>
              <p className="text-lg font-semibold text-foreground">
                {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse • PDF, DOC, DOCX supported
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4"
          >
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                
                {!isAnalyzing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <motion.div 
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                variant="accent"
                size="lg"
                className="w-full"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
