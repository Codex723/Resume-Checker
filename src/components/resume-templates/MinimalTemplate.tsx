import type { ResumeProfile } from "@/types/resume";

interface TemplateProps {
  profile: ResumeProfile;
}

export function MinimalTemplate({ profile }: TemplateProps) {
  const contactLine = [profile.email, profile.phone, profile.location, profile.linkedin]
    .filter(Boolean)
    .join("   ·   ");

  return (
    <div className="w-[816px] bg-white px-16 py-14 text-neutral-900" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
      <h1 className="text-3xl font-light tracking-tight text-neutral-900">
        {profile.fullName || "Your Name"}
      </h1>
      <p className="mt-1 text-sm font-medium uppercase tracking-widest text-neutral-500">
        {profile.title}
      </p>
      {contactLine && <p className="mt-3 text-xs text-neutral-400">{contactLine}</p>}

      <div className="mt-10 space-y-9">
        {profile.summary && (
          <section>
            <p className="text-sm leading-relaxed text-neutral-700">{profile.summary}</p>
          </section>
        )}

        {profile.experience.length > 0 && (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Experience
            </h2>
            <div className="mt-4 space-y-6">
              {profile.experience.map((entry) => (
                <div key={entry.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-sm font-semibold text-neutral-900">{entry.role}</h3>
                    <span className="text-xs text-neutral-400">{entry.dates}</span>
                  </div>
                  <p className="text-xs text-neutral-500">{entry.company}</p>
                  <ul className="mt-2 space-y-1.5">
                    {entry.bullets.map((bullet, i) => (
                      <li key={i} className="flex text-sm leading-relaxed text-neutral-700">
                        <span className="mr-2 text-neutral-300">—</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.education.length > 0 && (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Education
            </h2>
            <div className="mt-4 space-y-3">
              {profile.education.map((entry) => (
                <div key={entry.id} className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">{entry.degree}</h3>
                    <p className="text-xs text-neutral-500">{entry.school}</p>
                  </div>
                  <span className="text-xs text-neutral-400">{entry.dates}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.skills.length > 0 && (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Skills
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700">{profile.skills.join(", ")}</p>
          </section>
        )}
      </div>
    </div>
  );
}
