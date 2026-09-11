import {
  ArrowRight,
  Search,
  LoaderCircle,
} from "lucide-react";

const EXAMPLE_PROFILES = [
  "facebook",
  "vercel",
  "tailwindlabs",
];

function LandingHero({
  username,
  setUsername,
  onExplore,
  loading,
  error,
}) {
  const handleExample = (profile) => {
    onExplore(profile);
  };

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#030305] px-5 pb-10 pt-24 text-white sm:px-6 sm:pt-28">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Primary glow */}
        <div className="absolute left-1/2 top-[34%] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.09] blur-[140px]" />

        {/* Secondary accent */}
        <div className="absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-blue-500/[0.035] blur-[120px]" />

        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-fuchsia-500/[0.025] blur-[120px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `
              linear-gradient(
                to right,
                rgba(255,255,255,0.026) 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                rgba(255,255,255,0.026) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(circle at center, black 0%, transparent 76%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 0%, transparent 76%)",
          }}
        />

        {/* Center vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030305_82%)]" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#030305] to-transparent" />
      </div>

      {/* Brand */}
      <div className="absolute left-5 top-5 flex items-center gap-3 sm:left-6 sm:top-6 md:left-8 md:top-8">
        <img
          src="/favicon.svg"
          alt=""
          className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.035] p-1.5"
        />

        <div>
          <p className="text-sm font-semibold tracking-tight">
            Repoverse
          </p>

          <p className="text-[8px] font-medium uppercase tracking-[0.28em] text-white/30">
            GitHub in 3D
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="relative z-10 w-full max-w-xl text-center">
        {/* Repoverse mark */}
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-2 shadow-2xl shadow-violet-950/30 backdrop-blur-xl">
          <img
            src="/favicon.svg"
            alt="Repoverse"
            className="h-full w-full"
          />
        </div>

        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-violet-200/45 sm:text-[10px] sm:tracking-[0.35em]">
          Explore repositories spatially
        </p>

        <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl md:text-6xl">
          Your GitHub,
          <br />
          <span className="text-white/40">
            reimagined.
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/35 sm:mt-5">
          Turn any public GitHub profile into an
          interactive 3D universe of repositories.
        </p>

        {/* Search */}
        <form
          onSubmit={onExplore}
          className="mx-auto mt-8 max-w-md sm:mt-9"
        >
          <div className="flex min-h-14 items-center rounded-2xl border border-white/10 bg-white/[0.035] p-1.5 shadow-2xl shadow-black/30 backdrop-blur-2xl transition focus-within:border-white/20 focus-within:bg-white/[0.05] focus-within:shadow-violet-950/20">
            <Search className="ml-3 h-4 w-4 shrink-0 text-white/25" />

            <input
              id="github-username-search"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Enter a GitHub username…"
              className="min-w-0 flex-1 bg-transparent px-3 text-base text-white outline-none placeholder:text-white/25 sm:text-sm"
              disabled={loading}
              aria-label="GitHub username"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              enterKeyHint="go"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-black shadow-lg shadow-black/20 transition hover:bg-white/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4.5"
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  <span>Exploring</span>
                </>
              ) : (
                <>
                  <span>Explore</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Keyboard hint */}
          <div className="mt-2.5 hidden items-center justify-center gap-1.5 text-[9px] text-white/15 sm:flex">
            <kbd className="rounded border border-white/8 bg-white/[0.025] px-1.5 py-0.5 font-medium text-white/25">
              /
            </kbd>

            <span>to search</span>

            <span className="mx-0.5 text-white/10">·</span>

            <kbd className="rounded border border-white/8 bg-white/[0.025] px-1.5 py-0.5 font-medium text-white/25">
              ⌘ K
            </kbd>

            <span>quick search</span>
          </div>

          {error && (
            <div className="mt-3 rounded-xl border border-red-400/10 bg-red-400/[0.04] px-3 py-2.5 text-xs text-red-300/75">
              {error}
            </div>
          )}
        </form>

        {/* Examples */}
        <div className="mt-6">
          <p className="mb-2.5 text-[9px] font-medium uppercase tracking-[0.18em] text-white/20">
            Try a profile
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {EXAMPLE_PROFILES.map((profile) => (
              <button
                key={profile}
                type="button"
                onClick={() => handleExample(profile)}
                disabled={loading}
                className="group rounded-full border border-white/8 bg-white/[0.025] px-3 py-1.5 text-[10px] font-medium text-white/40 transition hover:border-white/15 hover:bg-white/[0.055] hover:text-white/75 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                @{profile}

              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-5 pb-5 sm:px-7 sm:pb-7 md:px-8 md:pb-8">
        <p className="text-[9px] font-medium tracking-wide text-white/25 sm:text-[10px]">
          Repoverse — GitHub in 3D.
          <span className="text-white/15">
            {" "}Designed & Built by{" "}
          </span>
          <span className="text-white/40">
            Mire.
          </span>
        </p>

        <div className="flex items-center gap-1">
          <a
            href="https://github.com/mirepatel"
            target="_blank"
            rel="noreferrer"
            aria-label="Mire on GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/25 transition hover:bg-white/[0.05] hover:text-white/70 active:scale-[0.97]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4 fill-current"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.88-1.54-3.88-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.08.78 2.18v3.22c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>

          <a
            href="https://www.linkedin.com/in/mirepatel"
            target="_blank"
            rel="noreferrer"
            aria-label="Mire on LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/25 transition hover:bg-white/[0.05] hover:text-white/70 active:scale-[0.97]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4 fill-current"
            >
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.38 4.27 5.48v6.27ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.54 20.45H7.1V8.99H3.54v11.46ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
            </svg>
          </a>
        </div>
      </footer>
    </main>
  );
}

export default LandingHero;