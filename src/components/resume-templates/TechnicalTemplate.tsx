import type { ResumeProfile } from "@/types/resume";

interface TemplateProps {
  profile: ResumeProfile;
}

export function TechnicalTemplate({ profile }: TemplateProps) {
  const contactLine = [profile.email, profile.phone, profile.location, profile.linkedin]
    .filter(Boolean)
    .join("  /  ");

  return (
    <div className="w-[816px] bg-white px-12 py-10 text-neutral-900" style={{ fontFamily: "Consolas, Menlo, monospace" }}>
      <div className="border-b-2 border-neutral-900 pb-4">
        <h1 className="text-2xl font-bold text-neutral-900">{profile.fullName || "your_name"}</h1>
        <p className="mt-1 text-sm text-emerald-700">// {profile.title}</p>
        {contactLine && <p className="mt-2 text-xs text-neutral-500">{contactLine}</p>}
      </div>

      <div className="mt-6 space-y-6">
        {profile.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-700">$ summary</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">{profile.summary}</p>
          </section>
        )}

        {profile.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-700">$ stack</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded border border-neutral-300 bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {profile.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-700">$ experience</h2>
            <div className="mt-3 space-y-4">
              {profile.experience.map((entry) => (
                <div key={entry.id} className="rounded border border-neutral-200 p-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-sm font-bold text-neutral-900">
                      {entry.role} <span className="font-normal text-neutral-500">@ {entry.company}</span>
                    </h3>
                    <span className="text-xs text-neutral-400">{entry.dates}</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {entry.bullets.map((bullet, i) => (
                      <li key={i} className="flex text-sm leading-relaxed text-neutral-700">
                        <span className="mr-2 text-emerald-600">▸</span>
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-700">$ education</h2>
            <div className="mt-2 space-y-2">
              {profile.education.map((entry) => (
                <div key={entry.id} className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    {entry.degree} <span className="font-normal text-neutral-500">— {entry.school}</span>
                  </h3>
                  <span className="text-xs text-neutral-400">{entry.dates}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
