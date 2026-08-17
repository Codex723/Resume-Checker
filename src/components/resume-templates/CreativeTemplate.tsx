import type { ResumeProfile } from "@/types/resume";

interface TemplateProps {
  profile: ResumeProfile;
}

export function CreativeTemplate({ profile }: TemplateProps) {
  return (
    <div className="flex w-[816px] bg-white text-neutral-900" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
      <div className="w-[260px] shrink-0 bg-gradient-to-b from-fuchsia-600 to-orange-500 px-6 py-10 text-white">
        <h1 className="text-2xl font-bold leading-tight">{profile.fullName || "Your Name"}</h1>
        <p className="mt-1 text-sm font-medium text-white/80">{profile.title}</p>

        <div className="mt-8 space-y-1 text-xs text-white/90">
          {profile.email && <p>{profile.email}</p>}
          {profile.phone && <p>{profile.phone}</p>}
          {profile.location && <p>{profile.location}</p>}
          {profile.linkedin && <p>{profile.linkedin}</p>}
        </div>

        {profile.skills.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/90">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <span key={skill} className="rounded bg-white/20 px-2 py-1 text-[11px] font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.education.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/90">Education</h2>
            <div className="mt-3 space-y-3">
              {profile.education.map((entry) => (
                <div key={entry.id}>
                  <p className="text-xs font-semibold">{entry.degree}</p>
                  <p className="text-[11px] text-white/80">{entry.school}</p>
                  <p className="text-[11px] text-white/70">{entry.dates}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 px-8 py-10">
        {profile.summary && (
          <section className="mb-7">
            <h2 className="text-xs font-bold uppercase tracking-widest text-fuchsia-600">About</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">{profile.summary}</p>
          </section>
        )}

        {profile.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-fuchsia-600">Experience</h2>
            <div className="mt-4 space-y-5">
              {profile.experience.map((entry) => (
                <div key={entry.id} className="border-l-2 border-fuchsia-200 pl-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-sm font-bold text-neutral-900">{entry.role}</h3>
                    <span className="text-xs text-neutral-400">{entry.dates}</span>
                  </div>
                  <p className="text-xs font-medium text-orange-600">{entry.company}</p>
                  <ul className="mt-1.5 space-y-1">
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
      </div>
    </div>
  );
}
