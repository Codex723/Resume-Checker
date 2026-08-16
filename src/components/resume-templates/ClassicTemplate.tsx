import type { ResumeProfile } from "@/types/resume";

interface TemplateProps {
  profile: ResumeProfile;
}

export function ClassicTemplate({ profile }: TemplateProps) {
  const contactLine = [profile.email, profile.phone, profile.location, profile.linkedin]
    .filter(Boolean)
    .join("  |  ");

  return (
    <div className="w-[816px] bg-white px-14 py-12 text-neutral-900" style={{ fontFamily: "Times New Roman, Times, serif" }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wide text-neutral-900">
          {profile.fullName || "Your Name"}
        </h1>
        <p className="mt-1 text-base text-neutral-700">{profile.title}</p>
        {contactLine && <p className="mt-2 text-sm text-neutral-600">{contactLine}</p>}
      </div>

      <div className="mt-6 space-y-6">
        {profile.summary && (
          <section>
            <h2 className="border-b border-neutral-400 pb-1 text-sm font-bold uppercase tracking-wider text-neutral-900">
              Professional Summary
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-800">{profile.summary}</p>
          </section>
        )}

        {profile.experience.length > 0 && (
          <section>
            <h2 className="border-b border-neutral-400 pb-1 text-sm font-bold uppercase tracking-wider text-neutral-900">
              Professional Experience
            </h2>
            <div className="mt-3 space-y-4">
              {profile.experience.map((entry) => (
                <div key={entry.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-sm font-bold text-neutral-900">{entry.company}</h3>
                    <span className="text-xs italic text-neutral-600">{entry.dates}</span>
                  </div>
                  <p className="text-sm italic text-neutral-700">{entry.role}</p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5">
                    {entry.bullets.map((bullet, i) => (
                      <li key={i} className="text-sm leading-relaxed text-neutral-800">
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
            <h2 className="border-b border-neutral-400 pb-1 text-sm font-bold uppercase tracking-wider text-neutral-900">
              Education
            </h2>
            <div className="mt-3 space-y-2">
              {profile.education.map((entry) => (
                <div key={entry.id} className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-sm font-bold text-neutral-900">{entry.school}</h3>
                  <span className="text-xs italic text-neutral-600">{entry.dates}</span>
                  <p className="w-full text-sm text-neutral-700">{entry.degree}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.skills.length > 0 && (
          <section>
            <h2 className="border-b border-neutral-400 pb-1 text-sm font-bold uppercase tracking-wider text-neutral-900">
              Skills
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-800">{profile.skills.join("  •  ")}</p>
          </section>
        )}
      </div>
    </div>
  );
}
