import type { ResumeProfile } from "@/types/resume";

interface TemplateProps {
  profile: ResumeProfile;
}

export function CompactTemplate({ profile }: TemplateProps) {
  const contactLine = [profile.email, profile.phone, profile.location, profile.linkedin]
    .filter(Boolean)
    .join("  •  ");

  return (
    <div className="w-[816px] bg-white px-10 py-8 text-neutral-900" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="flex items-baseline justify-between border-b border-neutral-300 pb-2">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{profile.fullName || "Your Name"}</h1>
          <p className="text-xs text-neutral-600">{profile.title}</p>
        </div>
        {contactLine && <p className="text-[10px] text-neutral-500">{contactLine}</p>}
      </div>

      {profile.summary && (
        <p className="mt-3 text-xs leading-relaxed text-neutral-700">{profile.summary}</p>
      )}

      <div className="mt-4 grid grid-cols-[1fr_200px] gap-6">
        <div className="space-y-4">
          {profile.experience.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Experience</h2>
              <div className="mt-2 space-y-3">
                {profile.experience.map((entry) => (
                  <div key={entry.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-xs font-bold text-neutral-900">
                        {entry.role}, {entry.company}
                      </h3>
                      <span className="text-[10px] text-neutral-400">{entry.dates}</span>
                    </div>
                    <ul className="mt-1 space-y-0.5">
                      {entry.bullets.map((bullet, i) => (
                        <li key={i} className="text-[11px] leading-snug text-neutral-700">
                          • {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-4">
          {profile.skills.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Skills</h2>
              <p className="mt-2 text-[11px] leading-snug text-neutral-700">{profile.skills.join(", ")}</p>
            </section>
          )}

          {profile.education.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Education</h2>
              <div className="mt-2 space-y-1.5">
                {profile.education.map((entry) => (
                  <div key={entry.id}>
                    <p className="text-[11px] font-semibold text-neutral-900">{entry.degree}</p>
                    <p className="text-[10px] text-neutral-500">
                      {entry.school}, {entry.dates}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
