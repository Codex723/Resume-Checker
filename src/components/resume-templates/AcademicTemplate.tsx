import type { ResumeProfile } from "@/types/resume";

interface TemplateProps {
  profile: ResumeProfile;
}

export function AcademicTemplate({ profile }: TemplateProps) {
  const contactLine = [profile.email, profile.phone, profile.location, profile.linkedin]
    .filter(Boolean)
    .join("   ·   ");

  return (
    <div className="w-[816px] bg-white px-14 py-12 text-neutral-900" style={{ fontFamily: "Cambria, Georgia, serif" }}>
      <div className="border-b-2 border-neutral-800 pb-3 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">{profile.fullName || "Your Name"}</h1>
        {contactLine && <p className="mt-1 text-xs text-neutral-600">{contactLine}</p>}
      </div>

      <div className="mt-6 space-y-6">
        {profile.education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-900">Education</h2>
            <div className="mt-2 space-y-3">
              {profile.education.map((entry) => (
                <div key={entry.id} className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">{entry.school}</h3>
                    <p className="text-sm italic text-neutral-700">{entry.degree}</p>
                  </div>
                  <span className="text-xs text-neutral-500">{entry.dates}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-900">Research & Professional Summary</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">{profile.summary}</p>
          </section>
        )}

        {profile.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-900">Positions & Experience</h2>
            <div className="mt-3 space-y-4">
              {profile.experience.map((entry) => (
                <div key={entry.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-sm font-semibold text-neutral-900">
                      {entry.role}, <span className="italic">{entry.company}</span>
                    </h3>
                    <span className="text-xs text-neutral-500">{entry.dates}</span>
                  </div>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5">
                    {entry.bullets.map((bullet, i) => (
                      <li key={i} className="text-sm leading-relaxed text-neutral-700">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-900">Skills & Competencies</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">{profile.skills.join(", ")}</p>
          </section>
        )}
      </div>
    </div>
  );
}
