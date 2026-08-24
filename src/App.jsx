import { useCallback, useEffect, useState } from "react";

import {
  Check,
  Copy,
  Share2,
  Sparkles,
} from "lucide-react";

import { getGitHubProfile } from "./lib/github";
import Universe from "./components/3d/Universe";
import RepoPanel from "./components/RepoPanel";
import ProfilePopover from "./components/ProfilePopover";
import LandingHero from "./components/landing/LandingHero";

function getUsernameFromPath() {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");

  if (!path) {
    return "";
  }

  return decodeURIComponent(path);
}

function App() {
  const [username, setUsername] = useState(() =>
    getUsernameFromPath()
  );

  const [profile, setProfile] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const loadProfile = useCallback(async (value) => {
    const cleanUsername = value.trim().replace(/^@/, "");

    if (!cleanUsername) {
      setProfile(null);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setSelectedRepo(null);
    setProfileOpen(false);

    try {
      const data = await getGitHubProfile(cleanUsername);

      setProfile(data);
      setUsername(data.user.login);
    } catch (err) {
      setProfile(null);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialUsername = getUsernameFromPath();

    if (initialUsername) {
      let cancelled = false;

      const loadInitialProfile = async () => {
        const cleanUsername = initialUsername
          .trim()
          .replace(/^@/, "");

        setLoading(true);
        setError("");

        try {
          const data =
            await getGitHubProfile(cleanUsername);

          if (cancelled) return;

          setProfile(data);
          setUsername(data.user.login);
        } catch (err) {
          if (cancelled) return;

          setProfile(null);
          setError(
            err.message || "Something went wrong."
          );
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

      loadInitialProfile();

      return () => {
        cancelled = true;
      };
    }

    const handlePopState = () => {
      const pathUsername = getUsernameFromPath();

      setError("");
      setSelectedRepo(null);
      setCopied(false);
      setProfileOpen(false);

      if (pathUsername) {
        setUsername(pathUsername);
        loadProfile(pathUsername);
      } else {
        setUsername("");
        setProfile(null);
        setLoading(false);
      }
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, [loadProfile]);

  const handleExplore = async (eventOrUsername) => {
    if (typeof eventOrUsername !== "string") {
      eventOrUsername.preventDefault();
    }

    const value =
      typeof eventOrUsername === "string"
        ? eventOrUsername
        : username;

    const cleanUsername = value
      .trim()
      .replace(/^@/, "");

    if (!cleanUsername) {
      setError("Enter a GitHub username.");
      return;
    }

    const nextPath = `/${encodeURIComponent(
      cleanUsername
    )}`;

    window.history.pushState({}, "", nextPath);

    await loadProfile(cleanUsername);
  };

  const handleReset = () => {
    window.history.pushState({}, "", "/");

    setProfile(null);
    setSelectedRepo(null);
    setProfileOpen(false);
    setUsername("");
    setError("");
    setLoading(false);
    setCopied(false);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.user.login}'s Repoverse`,
          text: `Explore @${profile.user.login}'s GitHub repositories in 3D.`,
          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(shareUrl);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (err) {
      if (err?.name === "AbortError") {
        return;
      }

      try {
        const textArea =
          document.createElement("textarea");

        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        textArea.style.pointerEvents = "none";

        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        document.execCommand("copy");
        document.body.removeChild(textArea);

        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 1800);
      } catch {
        setError("Unable to copy the share link.");
      }
    }
  };

  /*
   * LANDING EXPERIENCE
   */

  if (!profile) {
    return (
      <LandingHero
        username={username}
        setUsername={setUsername}
        loading={loading}
        error={error}
        onExplore={handleExplore}
      />
    );
  }

  const languages = new Set(
    profile.repositories
      .map((repo) => repo.language)
      .filter(Boolean)
      .filter(
        (language) => language !== "Unknown"
      )
  );

  const totalStars = profile.repositories.reduce(
    (total, repo) => total + (repo.stars || 0),
    0
  );

  /*
   * REPOVERSE EXPERIENCE
   */

  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-[#030305] text-white">
      <Universe
        repositories={profile.repositories}
        selectedRepo={selectedRepo}
        onSelect={setSelectedRepo}
      />

      {/* Atmospheric overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,transparent_45%,rgba(0,0,0,0.45)_100%)]" />

      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-40 flex items-start justify-between p-3.5 sm:p-5 md:p-7">
        {/* Brand */}
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2.5 rounded-xl p-1 text-left transition hover:bg-white/4 sm:gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/4 backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold tracking-tight">
              Repoverse
            </p>

            <p className="text-[8px] font-medium uppercase tracking-[0.28em] text-white/30">
              GitHub in 3D
            </p>
          </div>
        </button>

        {/* Actions */}
        <div className="relative flex items-center gap-1.5 sm:gap-2">
          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/55 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/6 hover:text-white sm:w-auto sm:gap-2 sm:px-3"
            aria-label={
              copied
                ? "Link copied"
                : "Share universe"
            }
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />

                <span className="hidden text-[10px] font-medium sm:inline">
                  Copied
                </span>
              </>
            ) : navigator.share ? (
              <>
                <Share2 className="h-3.5 w-3.5" />

                <span className="hidden text-[10px] font-medium sm:inline">
                  Share
                </span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />

                <span className="hidden text-[10px] font-medium sm:inline">
                  Copy link
                </span>
              </>
            )}
          </button>

          {/* Profile */}
          <button
            type="button"
            onClick={() =>
              setProfileOpen((open) => !open)
            }
            aria-expanded={profileOpen}
            aria-label="Open profile"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/5 sm:h-auto sm:w-auto sm:gap-3 sm:py-1.5 sm:pl-1.5 sm:pr-3"
          >
            {profile.user.avatarUrl ? (
              <img
                src={profile.user.avatarUrl}
                alt=""
                className="h-7 w-7 rounded-full"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-[9px] font-medium text-white/50">
                {profile.user.login
                  ?.slice(0, 2)
                  .toUpperCase()}
              </div>
            )}

            <div className="hidden text-left sm:block">
              <p className="text-[11px] font-medium">
                {profile.user.name ||
                  profile.user.login}
              </p>

              <p className="text-[9px] text-white/30">
                @{profile.user.login}
              </p>
            </div>
          </button>

          {profileOpen && (
            <ProfilePopover
              profile={profile}
              onClose={() =>
                setProfileOpen(false)
              }
            />
          )}
        </div>
      </header>

      {/* Universe information */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 sm:bottom-6 sm:left-6 md:left-7">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/25 sm:text-[9px] sm:tracking-[0.3em]">
            {profile.repositories.length}{" "}
            repositories
          </span>

          <span className="text-[8px] text-white/10">
            ·
          </span>

          <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/20 sm:text-[9px]">
            {languages.size} languages
          </span>

          <span className="text-[8px] text-white/10">
            ·
          </span>

          <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/20 sm:text-[9px]">
            {totalStars} stars
          </span>
        </div>

        <h2 className="mt-1 text-base font-medium tracking-tight text-white/70 sm:text-lg">
          @{profile.user.login}
        </h2>
      </div>

      {/* Navigation hint */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 md:bottom-6 md:block">
        <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[9px] font-medium tracking-wide text-white/25 backdrop-blur-xl">
          Drag to explore · Scroll to zoom · Click
          a repository
        </div>
      </div>

      {/* Repository panel */}
      <RepoPanel
        repo={selectedRepo}
        onClose={() => setSelectedRepo(null)}
      />
    </main>
  );
}

export default App;