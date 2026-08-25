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

                <ArrowRight className="ml-1 inline-block h-2.5 w-2.5 -translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-60" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Small footer label */}
      <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-[9px] font-medium tracking-wide text-white/10 sm:block">
        Public GitHub profiles · No account required
      </div>
    </main>
  );
}

export default LandingHero;