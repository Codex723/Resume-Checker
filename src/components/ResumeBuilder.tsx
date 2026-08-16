import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Sparkles, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn, randomId } from "@/lib/utils";
import { TEMPLATES } from "@/components/resume-templates";
import { downloadResumeAsPdf } from "@/utils/downloadResume";
import { enhanceResume } from "@/utils/analyzeApi";
import type { ResumeProfile, TemplateId, ExperienceEntry, EducationEntry } from "@/types/resume";

interface ResumeBuilderProps {
  initialProfile: ResumeProfile;
  profession: string;
  suggestions: string[];
}

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none";
const labelClass = "text-xs font-medium text-muted-foreground";

export function ResumeBuilder({ initialProfile, profession, suggestions }: ResumeBuilderProps) {
  const [profile, setProfile] = useState<ResumeProfile>(initialProfile);
  const [templateId, setTemplateId] = useState<TemplateId>("modern");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const Template = TEMPLATES.find((t) => t.id === templateId)?.component ?? TEMPLATES[0].component;

  const updateField = <K extends keyof ResumeProfile>(key: K, value: ResumeProfile[K]) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const updateExperience = (id: string, patch: Partial<ExperienceEntry>) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    }));
  };

  const updateEducation = (id: string, patch: Partial<EducationEntry>) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    }));
  };

  const addExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experience: [...prev.experience, { id: randomId(), role: "", company: "", dates: "", bullets: [""] }],
    }));
  };

  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [...prev.education, { id: randomId(), school: "", degree: "", dates: "" }],
    }));
  };

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      const improved = await enhanceResume(profile, profession, suggestions);
      setProfile(improved);
      toast({ title: "Resume enhanced", description: "AI rewrote your summary and bullets. Review and edit as needed." });
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    try {
      await downloadResumeAsPdf(previewRef.current, `${profile.fullName || "resume"}-${templateId}.pdf`);
      toast({ title: "Resume downloaded", description: "Your new resume PDF has been saved." });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-8 lg:grid-cols-[380px_1fr]"
    >
      {/* Editor panel */}
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Template</h3>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={cn(
                  "rounded-lg border p-2 text-left text-xs transition-colors",
                  templateId === t.id
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-accent/50"
                )}
              >
                <span className="font-medium">{t.name}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {TEMPLATES.find((t) => t.id === templateId)?.description}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <Button
            variant="accent"
            className="w-full"
            onClick={handleEnhance}
            disabled={isEnhancing}
          >
            {isEnhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isEnhancing ? "Enhancing..." : "Enhance with AI"}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Rewrites your summary and bullet points using the suggestions from your analysis. Facts (employers, dates, degrees) are never changed.
          </p>
        </div>

        <div className="glass-card space-y-4 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground">Personal Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Full name</label>
              <input className={fieldClass} value={profile.fullName} onChange={(e) => updateField("fullName", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input className={fieldClass} value={profile.title} onChange={(e) => updateField("title", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={fieldClass} value={profile.email} onChange={(e) => updateField("email", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input className={fieldClass} value={profile.phone} onChange={(e) => updateField("phone", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input className={fieldClass} value={profile.location} onChange={(e) => updateField("location", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>LinkedIn</label>
              <input className={fieldClass} value={profile.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Summary</label>
            <textarea
              className={cn(fieldClass, "min-h-[80px] resize-y")}
              value={profile.summary}
              onChange={(e) => updateField("summary", e.target.value)}
            />
          </div>
        </div>

        <div className="glass-card space-y-4 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Experience</h3>
            <button onClick={addExperience} className="text-xs font-medium text-accent hover:underline">
              <Plus className="mr-1 inline h-3 w-3" />
              Add
            </button>
          </div>
          {profile.experience.map((entry) => (
            <div key={entry.id} className="space-y-2 rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <input
                  className={cn(fieldClass, "font-medium")}
                  placeholder="Role"
                  value={entry.role}
                  onChange={(e) => updateExperience(entry.id, { role: e.target.value })}
                />
                <button
                  onClick={() =>
                    setProfile((prev) => ({ ...prev, experience: prev.experience.filter((x) => x.id !== entry.id) }))
                  }
                  className="ml-2 shrink-0 rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className={fieldClass}
                  placeholder="Company"
                  value={entry.company}
                  onChange={(e) => updateExperience(entry.id, { company: e.target.value })}
                />
                <input
                  className={fieldClass}
                  placeholder="Dates"
                  value={entry.dates}
                  onChange={(e) => updateExperience(entry.id, { dates: e.target.value })}
                />
              </div>
              <textarea
                className={cn(fieldClass, "min-h-[90px] resize-y")}
                placeholder="One bullet per line"
                value={entry.bullets.join("\n")}
                onChange={(e) => updateExperience(entry.id, { bullets: e.target.value.split("\n") })}
              />
            </div>
          ))}
        </div>

        <div className="glass-card space-y-4 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Education</h3>
            <button onClick={addEducation} className="text-xs font-medium text-accent hover:underline">
              <Plus className="mr-1 inline h-3 w-3" />
              Add
            </button>
          </div>
          {profile.education.map((entry) => (
            <div key={entry.id} className="space-y-2 rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <input
                  className={cn(fieldClass, "font-medium")}
                  placeholder="School"
                  value={entry.school}
                  onChange={(e) => updateEducation(entry.id, { school: e.target.value })}
                />
                <button
                  onClick={() =>
                    setProfile((prev) => ({ ...prev, education: prev.education.filter((x) => x.id !== entry.id) }))
                  }
                  className="ml-2 shrink-0 rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className={fieldClass}
                  placeholder="Degree"
                  value={entry.degree}
                  onChange={(e) => updateEducation(entry.id, { degree: e.target.value })}
                />
                <input
                  className={fieldClass}
                  placeholder="Dates"
                  value={entry.dates}
                  onChange={(e) => updateEducation(entry.id, { dates: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card space-y-2 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground">Skills</h3>
          <textarea
            className={cn(fieldClass, "min-h-[60px] resize-y")}
            placeholder="Comma-separated"
            value={profile.skills.join(", ")}
            onChange={(e) =>
              updateField(
                "skills",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </div>
      </div>

      {/* Preview panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Preview</h3>
          <Button variant="accent" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isDownloading ? "Preparing..." : "Download PDF"}
          </Button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-border bg-muted/30 p-6">
          <div ref={previewRef} className="mx-auto shadow-lg">
            <Template profile={profile} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
