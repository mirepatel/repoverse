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
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#030305] px-5 text-white sm:px-6">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[35%] h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/8 blur-[150px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[40px_40px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030305_78%)]" />
      </div>

      {/* Brand */}
      <div className="absolute left-5 top-5 flex items-center gap-3 sm:left-6 sm:top-6 md:left-8 md:top-8">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/4 backdrop-blur-xl">
          <div className="absolute h-4 w-4 rounded-full border border-violet-300/60" />
          <div className="h-1.5 w-1.5 rounded-full bg-violet-300" />
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

      {/* Hero */}
      <section className="relative z-10 w-full max-w-xl text-center">
        {/* Repoverse mark */}
        <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/4 shadow-2xl shadow-violet-950/20 backdrop-blur-xl">
          <div className="absolute h-7 w-7 rounded-full border border-violet-300/40" />
          <div className="absolute h-3 w-3 rounded-full border border-violet-200/70" />
          <div className="h-1.5 w-1.5 rounded-full bg-violet-200 shadow-[0_0_12px_rgba(196,181,253,0.8)]" />
        </div>

        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30 sm:text-[10px] sm:tracking-[0.35em]">
          Explore repositories spatially
        </p>

        <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">
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
          <div className="flex h-12 items-center rounded-xl border border-white/10 bg-white/[0.035] p-1.5 shadow-2xl backdrop-blur-xl transition focus-within:border-white/20 focus-within:bg-white/5">
            <Search className="ml-3 h-4 w-4 shrink-0 text-white/25" />

            <input
              id="github-username-search"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Search a GitHub username..."
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25"
              disabled={loading}
              aria-label="GitHub username"
              autoComplete="off"
              enterKeyHint="go"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-white px-3.5 text-xs font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
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

          {error && (
            <p className="mt-3 text-xs text-red-400/80">
              {error}
            </p>
          )}
        </form>

        {/* Examples */}
        <div className="mt-5">
          <p className="mb-2.5 text-[10px] text-white/20">
            Try exploring
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {EXAMPLE_PROFILES.map((profile) => (
              <button
                key={profile}
                type="button"
                onClick={() => handleExample(profile)}
                disabled={loading}
                className="group rounded-full border border-white/8 bg-white/3 px-3 py-1.5 text-[10px] font-medium text-white/40 transition hover:border-white/15 hover:bg-white/6 hover:text-white/70 disabled:pointer-events-none disabled:opacity-50"
              >
                @{profile}

                <ArrowRight className="ml-1 inline-block h-2.5 w-2.5 -translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-60" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingHero;