import { useMemo, useState } from "react";
import { ExternalLink, Search, Sparkles, X } from "lucide-react";

import Universe from "./components/3d/Universe";
import RepoPanel from "./components/RepoPanel";
import repositories from "./data/repositories";

function App() {
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [search, setSearch] = useState("");

  const filteredRepositories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return repositories;

    return repositories.filter((repo) => {
      return (
        repo.name.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        repo.language?.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const handleSelect = (repo) => {
    setSelectedRepo((current) =>
      current?.id === repo.id ? null : repo
    );
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#030305] text-white">
      {/* 3D universe */}
      <Universe
        repositories={filteredRepositories}
        selectedRepo={selectedRepo}
        onSelect={handleSelect}
      />

      {/* Atmospheric vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,transparent_42%,rgba(0,0,0,0.45)_100%)]" />

      {/* Header */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-5 md:p-7">
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-white" />
          </div>

          <div>
            <h1 className="text-sm font-semibold tracking-tight">
              Repoverse
            </h1>

            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.28em] text-white/30">
              GitHub in 3D
            </p>
          </div>
        </div>

        <a
          href="https://github.com/mirepatel/repoverse"
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-medium text-white/60 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white md:flex"
        >
          GitHub
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </header>

      {/* Search */}
      <div className="absolute left-1/2 top-5 z-20 w-[min(420px,calc(100%-140px))] -translate-x-1/2 md:top-7">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search repositories..."
            className="h-11 w-full rounded-full border border-white/10 bg-black/40 pl-11 pr-11 text-sm text-white outline-none backdrop-blur-2xl transition placeholder:text-white/25 focus:border-white/20 focus:bg-black/60"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white/30 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <p className="mt-2 text-center text-[9px] font-medium uppercase tracking-[0.25em] text-white/20">
          {filteredRepositories.length} repositories
        </p>
      </div>

      {/* Empty search state */}
      {filteredRepositories.length === 0 && (
        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-sm text-white/60">No repository found.</p>

          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-3 text-xs text-white/30 underline underline-offset-4 transition hover:text-white"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Repository details */}
      <RepoPanel
        repo={selectedRepo}
        onClose={() => setSelectedRepo(null)}
      />

      {/* Interaction hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[10px] font-medium tracking-wide text-white/30 backdrop-blur-xl">
          Drag to explore · Scroll to zoom · Click a repository
        </div>
      </div>
    </main>
  );
}

export default App;