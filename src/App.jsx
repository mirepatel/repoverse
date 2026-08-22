import { useEffect, useMemo, useState } from "react";

import { Canvas } from "@react-three/fiber";
import {
  Html,
  OrbitControls,
  Stars,
} from "@react-three/drei";

import { Search, X } from "lucide-react";

import RepoCard from "./components/3d/RepoCard";
import RepoPanel from "./components/RepoPanel";

import repositories from "./data/repositories";

function App() {
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRepositories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return repositories;
    }

    return repositories.filter((repo) => {
      return (
        repo.name.toLowerCase().includes(query) ||
        repo.description.toLowerCase().includes(query) ||
        repo.language.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  useEffect(() => {
    if (!selectedRepo) return;

    const query = searchQuery.trim().toLowerCase();

    if (!query) return;

    const stillMatches =
      selectedRepo.name.toLowerCase().includes(query) ||
      selectedRepo.description.toLowerCase().includes(query) ||
      selectedRepo.language.toLowerCase().includes(query);

    if (!stillMatches) {
      setSelectedRepo(null);
    }
  }, [searchQuery, selectedRepo]);

  const handleSelectRepo = (repo) => {
    setSelectedRepo((current) =>
      current?.id === repo.id ? null : repo
    );
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      {/* 3D Universe */}
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 50,
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={1.5}
        />

        <Stars
          radius={50}
          depth={30}
          count={2000}
          factor={2}
          saturation={0}
          fade
          speed={0.5}
        />

        {repositories.map((repo) => {
          const query = searchQuery.trim().toLowerCase();

          const searchMatched =
            !query ||
            repo.name.toLowerCase().includes(query) ||
            repo.description.toLowerCase().includes(query) ||
            repo.language.toLowerCase().includes(query);

          return (
            <RepoCard
              key={repo.id}
              repo={repo}
              onSelect={handleSelectRepo}
              selected={selectedRepo?.id === repo.id}
              dimmed={
                selectedRepo !== null &&
                selectedRepo.id !== repo.id
              }
              searchMatched={searchMatched}
            />
          );
        })}

        {filteredRepositories.length === 0 && (
          <Html center position={[0, 0, 0]}>
            <div className="w-[280px] text-center">
              <div className="text-sm font-medium text-white/70">
                No repositories found
              </div>

              <div className="mt-2 text-xs leading-5 text-white/30">
                Try searching by repository name, language,
                or description.
              </div>
            </div>
          </Html>
        )}

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          enablePan
          minDistance={4}
          maxDistance={18}
        />
      </Canvas>

      {/* Brand */}
      <header className="pointer-events-none absolute left-6 top-6 z-20">
        <div className="flex items-center gap-3">
          <div
            className="
              flex size-10 items-center justify-center
              rounded-xl
              border border-white/10
              bg-white/[0.04]
              shadow-[0_8px_30px_rgba(0,0,0,0.35)]
              backdrop-blur-xl
            "
          >
            <span className="text-lg text-white">✦</span>
          </div>

          <div>
            <div className="text-sm font-semibold tracking-tight text-white">
              Repoverse
            </div>

            <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-white/25">
              GitHub in 3D
            </div>
          </div>
        </div>
      </header>

      {/* GitHub */}
      <a
        href="https://github.com/mirepatel/repoverse"
        target="_blank"
        rel="noopener noreferrer"
        className="
          absolute right-6 top-6 z-20
          flex h-10 items-center
          rounded-full
          border border-white/10
          bg-white/[0.04]
          px-4
          text-xs font-medium
          text-white/50
          backdrop-blur-xl
          transition
          hover:border-white/20
          hover:bg-white/[0.08]
          hover:text-white
        "
      >
        GitHub ↗
      </a>

      {/* Search */}
      <div className="pointer-events-none absolute left-1/2 top-6 z-20 w-full max-w-[420px] -translate-x-1/2 px-6">
        <div className="pointer-events-auto relative">
          <Search
            className="
              pointer-events-none
              absolute left-4 top-1/2
              size-4
              -translate-y-1/2
              text-white/30
            "
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search repositories..."
            aria-label="Search repositories"
            className="
              h-11 w-full
              rounded-full
              border border-white/10
              bg-[#0a0a0f]/75
              pl-11 pr-11
              text-sm text-white
              outline-none
              backdrop-blur-2xl
              placeholder:text-white/25
              transition
              focus:border-white/20
              focus:bg-[#0c0c12]/90
            "
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="
                absolute right-2.5 top-1/2
                flex size-7
                -translate-y-1/2
                items-center justify-center
                rounded-full
                text-white/30
                transition
                hover:bg-white/10
                hover:text-white
              "
            >
              <X className="size-3.5" />
            </button>
          )}

          <div
            className="
              mt-2
              text-center
              text-[9px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-white/20
            "
          >
            {filteredRepositories.length}{" "}
            {filteredRepositories.length === 1
              ? "repository"
              : "repositories"}
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div
        className="
          pointer-events-none
          absolute bottom-6 left-1/2 z-20
          -translate-x-1/2
          whitespace-nowrap
          rounded-full
          border border-white/[0.08]
          bg-black/30
          px-4 py-2
          text-[10px]
          text-white/25
          backdrop-blur-xl
        "
      >
        Drag to explore · Scroll to zoom · Click a repository
      </div>

      {/* Repository Panel */}
      <RepoPanel
        repo={selectedRepo}
        onClose={() => setSelectedRepo(null)}
      />
    </main>
  );
}

export default App;