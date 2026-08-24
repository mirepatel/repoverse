import { ExternalLink, GitBranch, Users } from "lucide-react";

function ProfileHUD({ profile }) {
  if (!profile) return null;

  const { user, repositories } = profile;

  const languages = new Set(
    repositories
      .map((repo) => repo.language)
      .filter(Boolean)
      .filter((language) => language !== "Unknown")
  );

  const totalStars = repositories.reduce(
    (total, repo) => total + (repo.stars || 0),
    0
  );

  return (
    <aside className="absolute left-3 right-3 top-[68px] z-20 sm:left-5 sm:right-auto sm:top-24 sm:w-[280px] md:left-7">
      <div className="rounded-2xl border border-white/[0.08] bg-black/35 p-3 shadow-2xl backdrop-blur-2xl sm:p-4">
        {/* Identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.05] sm:h-11 sm:w-11">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-white/40">
                {user.login?.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold tracking-tight text-white/90">
              {user.name || user.login}
            </h2>

            <p className="truncate text-[10px] text-white/35">
              @{user.login}
            </p>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-3 hidden line-clamp-2 text-[11px] leading-5 text-white/40 sm:mt-4 sm:block">
            {user.bio}
          </p>
        )}

        {/* Divider */}
        <div className="my-3 h-px bg-white/[0.07] sm:my-4" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <Stat
            label="Repos"
            value={repositories.length}
            icon={<GitBranch className="h-3 w-3" />}
          />

          <Stat
            label="Followers"
            value={user.followers}
            icon={<Users className="h-3 w-3" />}
          />

          <Stat
            label="Stars"
            value={totalStars}
          />
        </div>

        {/* Languages */}
        <div className="mt-3 hidden items-center justify-between sm:flex">
          <span className="text-[9px] uppercase tracking-[0.18em] text-white/25">
            Languages
          </span>

          <span className="text-[10px] font-medium text-white/55">
            {languages.size}
          </span>
        </div>

        {/* Action */}
        <a
          href={user.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex h-8 items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] text-[10px] font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white sm:mt-4 sm:h-9"
        >
          View GitHub
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </aside>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-white/[0.025] px-2 py-1.5 sm:px-2.5 sm:py-2">
      <div className="flex items-center gap-1.5 text-white/25">
        {icon}

        <span className="text-[7px] uppercase tracking-wider sm:text-[8px]">
          {label}
        </span>
      </div>

      <p className="mt-0.5 text-xs font-medium text-white/75 sm:mt-1">
        {value ?? 0}
      </p>
    </div>
  );
}

export default ProfileHUD;