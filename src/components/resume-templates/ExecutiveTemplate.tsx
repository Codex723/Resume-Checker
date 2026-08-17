import type { ResumeProfile } from "@/types/resume";

interface TemplateProps {
  profile: ResumeProfile;
}

export function ExecutiveTemplate({ profile }: TemplateProps) {
  const contactLine = [profile.email, profile.phone, profile.location, profile.linkedin]
    .filter(Boolean)
    .join("   |   ");

  return (
    <div className="w-[816px] bg-white text-neutral-900" style={{ fontFamily: "Georgia, serif" }}>
      <div className="bg-neutral-900 px-12 py-10 text-white">
        <h1 className="text-4xl font-bold tracking-tight">{profile.fullName || "Your Name"}</h1>
        <p className="mt-1 text-lg font-light text-neutral-300">{profile.title}</p>
        {contactLine && <p className="mt-3 text-xs tracking-wide text-neutral-400">{contactLine}</p>}
      </div>

      <div className="px-12 py-8 space-y-7">
        {profile.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Executive Summary</h2>
            <div className="mt-1 h-0.5 w-10 bg-neutral-900" />
            <p className="mt-3 text-sm leading-relaxed text-neutral-700">{profile.summary}</p>
          </section>
        )}

        {profile.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Leadership Experience</h2>
            <div className="mt-1 h-0.5 w-10 bg-neutral-900" />
            <div className="mt-4 space-y-5">
              {profile.experience.map((entry) => (
                <div key={entry.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-base font-bold text-neutral-900">{entry.company}</h3>
                    <span className="text-xs font-medium text-neutral-500">{entry.dates}</span>
                  </div>
                  <p className="text-sm font-medium italic text-neutral-600">{entry.role}</p>
                  <ul className="mt-2 space-y-1.5 pl-4">
                    {entry.bullets.map((bullet, i) => (
                      <li key={i} className="list-disc text-sm leading-relaxed text-neutral-700">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {profile.education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Education</h2>
              <div className="mt-1 h-0.5 w-10 bg-neutral-900" />
              <div className="mt-3 space-y-2">
                {profile.education.map((entry) => (
                  <div key={entry.id}>
                    <h3 className="text-sm font-bold text-neutral-900">{entry.degree}</h3>
                    <p className="text-xs text-neutral-600">
                      {entry.school} — {entry.dates}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {profile.skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Core Competencies</h2>
              <div className="mt-1 h-0.5 w-10 bg-neutral-900" />
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">{profile.skills.join(" • ")}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
