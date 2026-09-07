import { useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  GitBranch,
  LoaderCircle,
  Search,
  Star,
  Users,
  X,
} from "lucide-react";

import { normalizeUsername } from "../lib/github";

function ProfilePopover({
  profile,
  onClose,
  onExplore,
  loading = false,
  error = "",
}) {
  const [query, setQuery] = useState("");

  if (!profile) {
    return null;
  }

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

  function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    try {
      const cleanUsername = normalizeUsername(query);

      if (cleanUsername === user.login) {
        return;
      }

      onExplore(cleanUsername);
    } catch {
      return;
    }
  }

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
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3.5">
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
                  {user.name || user.login}
                </h2>

                <p className="mt-0.5 truncate text-[10px] text-white/35">
                  @{user.login}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.06] hover:text-white/60"
            >
              <X className="h-3.5 w-3.5" />
            </button>
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
              icon={<Star className="h-3 w-3" />}
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

          {/* Profile switcher */}
          <div className="my-4 h-px bg-white/7" />

          <div>
            <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.18em] text-white/25">
              Explore another profile
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-1.5"
            >
              <div className="flex min-w-0 flex-1 items-center rounded-xl border border-white/10 bg-white/[0.035] transition focus-within:border-white/20 focus-within:bg-white/[0.05]">
                <Search className="ml-3 h-3.5 w-3.5 shrink-0 text-white/25" />

                <input
                  type="text"
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Username or profile URL"
                  aria-label="GitHub profile"
                  disabled={loading}
                  className="h-10 min-w-0 flex-1 bg-transparent px-2.5 text-[10px] text-white/80 outline-none placeholder:text-white/20 disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                aria-label="Explore profile"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/45 transition hover:border-white/15 hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                {loading ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5" />
                )}
              </button>
            </form>

            {error && (
              <p className="mt-2 px-1 text-[9px] leading-4 text-red-300/60">
                {error}
              </p>
            )}
          </div>

          {/* GitHub action */}
          <a
            href={user.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] text-[10px] font-medium text-white/60 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white active:scale-[0.99]"
          >
            <span>View on GitHub</span>

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