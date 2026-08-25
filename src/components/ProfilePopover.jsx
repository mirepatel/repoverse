import {
  ExternalLink,
  GitBranch,
  Star,
  Users,
} from "lucide-react";

function ProfilePopover({
  profile,
  onClose,
}) {
  if (!profile) {
    return null;
  }

  const { user, repositories } =
    profile;

  const languages = new Set(
    repositories
      .map(
        (repo) => repo.language
      )
      .filter(Boolean)
      .filter(
        (language) =>
          language !== "Unknown"
      )
  );

  const totalStars =
    repositories.reduce(
      (total, repo) =>
        total +
        (repo.stars || 0),
      0
    );

  return (
    <>
      {/* Outside-click layer */}
      <button
        type="button"
        aria-label="Close profile"
        onClick={onClose}
        className="fixed inset-0 z-[-1] cursor-default"
      />

      <div className="absolute right-0 top-12 z-50 w-[min(340px,calc(100vw-24px))]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#09090c]/95 p-4 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl sm:p-5">
          {/* Identity */}
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-medium text-white/40">
                  {user.login
                    ?.slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold tracking-tight text-white/90">
                {user.name ||
                  user.login}
              </h2>

              <p className="mt-0.5 truncate text-[10px] text-white/35">
                @{user.login}
              </p>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="mt-3 text-[11px] leading-5 text-white/40">
              {user.bio}
            </p>
          )}

          {/* Divider */}
          <div className="my-4 h-px bg-white/7" />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-1.5">
            <Stat
              label="Repos"
              value={repositories.length}
              icon={
                <GitBranch className="h-3 w-3" />
              }
            />

            <Stat
              label="Followers"
              value={user.followers}
              icon={
                <Users className="h-3 w-3" />
              }
            />

            <Stat
              label="Stars"
              value={totalStars}
              icon={
                <Star className="h-3 w-3" />
              }
            />
          </div>

          {/* Languages */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/25">
              Languages
            </span>

            <span className="text-[10px] font-medium text-white/50">
              {languages.size}
            </span>
          </div>

          {/* GitHub action */}
          <a
            href={user.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] text-[10px] font-medium text-white/60 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white active:scale-[0.99]"
          >
            <span>
              View on GitHub
            </span>

            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  icon,
}) {
  return (
    <div className="rounded-xl border border-white/6 bg-white/[0.025] px-2.5 py-2.5">
      <div className="flex items-center gap-1.5 text-white/25">
        {icon}

        <span className="text-[8px] uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-1 text-xs font-medium text-white/75">
        {value ?? 0}
      </p>
    </div>
  );
}

export default ProfilePopover;