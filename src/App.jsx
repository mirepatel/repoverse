import { useCallback, useEffect, useState } from "react";

import {
  Check,
  Copy,
  LoaderCircle,
  Search,
  Share2,
  Sparkles,
} from "lucide-react";

import { getGitHubProfile } from "./lib/github";
import Universe from "./components/3d/Universe";
import RepoPanel from "./components/RepoPanel";
import ProfileHUD from "./components/ProfileHUD";

function getUsernameFromPath() {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");

  if (!path) {
    return "";
  }

  return decodeURIComponent(path);
}

function App() {
  const [username, setUsername] = useState(() => getUsernameFromPath());
  const [profile, setProfile] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
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
      loadProfile(initialUsername);
    }

    const handlePopState = () => {
      const pathUsername = getUsernameFromPath();

      setError("");
      setSelectedRepo(null);
      setCopied(false);

      if (pathUsername) {
        setUsername(pathUsername);
        loadProfile(pathUsername);
      } else {
        setUsername("");
        setProfile(null);
        setLoading(false);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [loadProfile]);

  const handleExplore = async (event) => {
    event.preventDefault();

    const cleanUsername = username.trim().replace(/^@/, "");

    if (!cleanUsername) {
      setError("Enter a GitHub username.");
      return;
    }

    const nextPath = `/${encodeURIComponent(cleanUsername)}`;

    window.history.pushState({}, "", nextPath);

    await loadProfile(cleanUsername);
  };

  const handleReset = () => {
    window.history.pushState({}, "", "/");

    setProfile(null);
    setSelectedRepo(null);
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
        const textArea = document.createElement("textarea");

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
      <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#030305] px-5 text-white sm:px-6">
        {/* Background atmosphere */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/6 blur-[140px]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030305_75%)]" />
        </div>

        {/* Atmospheric points */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-[18%] top-[24%] h-1 w-1 rounded-full bg-white" />
          <div className="absolute left-[76%] top-[28%] h-1 w-1 rounded-full bg-white/60" />
          <div className="absolute left-[27%] top-[72%] h-1 w-1 rounded-full bg-white/50" />
          <div className="absolute left-[82%] top-[70%] h-1 w-1 rounded-full bg-white/70" />
        </div>

        {/* Brand */}
        <div className="absolute left-5 top-5 flex items-center gap-3 sm:left-6 sm:top-6 md:left-8 md:top-8">
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
        </div>

        {/* Main */}
        <section className="relative z-10 w-full max-w-xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/4 text-xl font-semibold shadow-2xl shadow-violet-950/20 backdrop-blur-xl sm:mb-6">
            GH
          </div>

          <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30 sm:text-[10px] sm:tracking-[0.35em]">
            Explore GitHub differently
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Your GitHub,
            <br />
            <span className="text-white/40">reimagined.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/35 sm:mt-5">
            Turn any public GitHub profile into an interactive 3D
            universe of repositories.
          </p>

          <form
            onSubmit={handleExplore}
            className="mx-auto mt-8 max-w-md sm:mt-9"
          >
            <div className="flex h-12 items-center rounded-xl border border-white/10 bg-white/[0.035] p-1.5 shadow-2xl backdrop-blur-xl transition focus-within:border-white/20 focus-within:bg-white/5">
              <Search className="ml-3 h-4 w-4 shrink-0 text-white/25" />

              <input
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setError("");
                }}
                placeholder="GitHub username"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25"
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading}
                className="flex h-9 shrink-0 items-center gap-2 rounded-lg bg-white px-3.5 text-xs font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    <span className="hidden xs:inline">Exploring</span>
                  </>
                ) : (
                  "Explore"
                )}
              </button>
            </div>

            {error && (
              <p className="mt-3 text-xs text-red-400/80">
                {error}
              </p>
            )}
          </form>

          <p className="mt-5 text-[10px] text-white/20">
            Try a public GitHub username
          </p>
        </section>
      </main>
    );
  }

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

      <ProfileHUD profile={profile} />

      {/* Atmospheric overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,transparent_45%,rgba(0,0,0,0.45)_100%)]" />

      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3.5 sm:p-5 md:p-7">
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

        {/* Profile + Share */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/55 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/6 hover:text-white sm:w-auto sm:gap-2 sm:px-3"
            aria-label={copied ? "Link copied" : "Share universe"}
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

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 backdrop-blur-xl sm:h-auto sm:w-auto sm:gap-3 sm:py-1.5 sm:pl-1.5 sm:pr-3">
            {profile.user.avatarUrl && (
              <img
                src={profile.user.avatarUrl}
                alt=""
                className="h-7 w-7 rounded-full"
              />
            )}

            <div className="hidden text-left sm:block">
              <p className="text-[11px] font-medium">
                {profile.user.name || profile.user.login}
              </p>

              <p className="text-[9px] text-white/30">
                @{profile.user.login}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Universe info */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 sm:bottom-6 sm:left-6 md:left-7">
        <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/25 sm:text-[9px] sm:tracking-[0.3em]">
          {profile.repositories.length} repositories
        </p>

        <h2 className="mt-1 text-base font-medium tracking-tight text-white/70 sm:text-lg">
          @{profile.user.login}
        </h2>
      </div>

      {/* Navigation hint */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 md:bottom-6 md:block">
        <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[9px] font-medium tracking-wide text-white/25 backdrop-blur-xl">
          Drag to explore · Scroll to zoom · Click a repository
        </div>
      </div>

      <RepoPanel
        repo={selectedRepo}
        onClose={() => setSelectedRepo(null)}
      />
    </main>
  );
}

export default App;