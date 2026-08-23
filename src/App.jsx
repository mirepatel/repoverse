import { useEffect, useState } from "react";

import {
  LoaderCircle,
  Search,
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
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProfile = async (value) => {
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
  };

  useEffect(() => {
    const initialUsername = getUsernameFromPath();

    if (initialUsername) {
      setUsername(initialUsername);
      loadProfile(initialUsername);
    }

    const handlePopState = () => {
      const pathUsername = getUsernameFromPath();

      setError("");
      setSelectedRepo(null);

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
  }, []);

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
  };

  /*
   * LANDING EXPERIENCE
   */

  if (!profile) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030305] px-6 text-white">
        {/* Background atmosphere */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.06] blur-[140px]" />

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

        <div className="absolute left-6 top-6 flex items-center gap-3 md:left-8 md:top-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
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
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl font-semibold shadow-2xl shadow-violet-950/20 backdrop-blur-xl">
            GH
          </div>

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/30">
            Explore GitHub differently
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Your GitHub,
            <br />
            <span className="text-white/40">
              reimagined.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-white/35">
            Turn any public GitHub profile into an interactive 3D
            universe of repositories.
          </p>

          <form
            onSubmit={handleExplore}
            className="mx-auto mt-9 max-w-md"
          >
            <div className="flex h-12 items-center rounded-xl border border-white/10 bg-white/[0.035] p-1.5 shadow-2xl backdrop-blur-xl transition focus-within:border-white/20 focus-within:bg-white/[0.05]">
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
                className="flex h-9 items-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    Exploring
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
    <main className="relative h-screen w-full overflow-hidden bg-[#030305] text-white">
      <Universe
        repositories={profile.repositories}
        selectedRepo={selectedRepo}
        onSelect={setSelectedRepo}
      />

      <ProfileHUD profile={profile} />

      {/* Atmospheric overlay */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,transparent_45%,rgba(0,0,0,0.45)_100%)]" />

      {/* Header */}

      <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-5 md:p-7">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-3 rounded-xl p-1 text-left transition hover:bg-white/[0.04]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
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

        {/* Profile */}

        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/30 py-1.5 pl-1.5 pr-3 backdrop-blur-xl">
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
      </header>

      {/* Universe info */}

      <div className="pointer-events-none absolute bottom-6 left-6 z-10 md:left-7">
        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/25">
          {profile.repositories.length} repositories
        </p>

        <h2 className="mt-1 text-lg font-medium tracking-tight text-white/70">
          @{profile.user.login}
        </h2>
      </div>

      {/* Navigation hint */}

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block">
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