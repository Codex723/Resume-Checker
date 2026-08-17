import type { ResumeProfile } from "@/types/resume";

interface TemplateProps {
  profile: ResumeProfile;
}

export function ModernTemplate({ profile }: TemplateProps) {
  const contactLine = [profile.email, profile.phone, profile.location, profile.linkedin]
    .filter(Boolean)
    .join("   •   ");

  return (
    <div className="w-[816px] bg-white text-neutral-900" style={{ fontFamily: "Georgia, serif" }}>
      <div className="border-b-4 border-teal-600 px-12 py-10">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
          {profile.fullName || "Your Name"}
        </h1>
        <p className="mt-1 text-lg font-medium text-teal-700">{profile.title}</p>
        {contactLine && <p className="mt-3 text-sm text-neutral-500">{contactLine}</p>}
      </div>

      <div className="px-12 py-8 space-y-8">
        {profile.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-700">Summary</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">{profile.summary}</p>
          </section>
        )}

        {profile.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-700">Experience</h2>
            <div className="mt-3 space-y-5">
              {profile.experience.map((entry) => (
                <div key={entry.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-base font-semibold text-neutral-900">
                      {entry.role} <span className="font-normal text-neutral-500">— {entry.company}</span>
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

        {profile.education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-700">Education</h2>
            <div className="mt-3 space-y-3">
              {profile.education.map((entry) => (
                <div key={entry.id} className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    {entry.degree} <span className="font-normal text-neutral-500">— {entry.school}</span>
                  </h3>
                  <span className="text-xs text-neutral-500">{entry.dates}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-700">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
