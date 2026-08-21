import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

import RepoCard from "./components/3d/RepoCard";
import RepoPanel from "./components/RepoPanel";
import repositories from "./data/repositories";

function App() {
  const [selectedRepo, setSelectedRepo] = useState(null);

  const handleSelect = (repo) => {
    setSelectedRepo((current) => {
      if (current?.id === repo.id) {
        return null;
      }

      return repo;
    });
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#050509] text-white">
      {/* Top navigation */}
      <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-6">
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <span className="text-sm">✦</span>
          </div>

          <div>
            <h1 className="text-sm font-semibold tracking-tight">Repoverse</h1>

            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              GitHub in 3D
            </p>
          </div>
        </div>

        <a
          href="https://github.com/mirepatel/repoverse"
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          GitHub ↗
        </a>
      </header>

      {/* 3D Universe */}
      <Canvas
        camera={{
          position: [0, 0, 11],
          fov: 48,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#050509"]} />

        <ambientLight intensity={0.5} />

        <directionalLight position={[5, 6, 5]} intensity={1.5} />

        <pointLight position={[-5, 2, 3]} intensity={1} distance={15} />

        <Stars
          radius={50}
          depth={30}
          count={1800}
          factor={2}
          saturation={0}
          fade
          speed={0.35}
        />

        {repositories.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            selected={selectedRepo?.id === repo.id}
            dimmed={selectedRepo !== null && selectedRepo.id !== repo.id}
            onSelect={handleSelect}
          />
        ))}

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          enablePan
          minDistance={6}
          maxDistance={20}
        />
      </Canvas>

      {/* Bottom interaction hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
        <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-[11px] text-white/35 backdrop-blur-xl">
          Drag to explore · Scroll to zoom · Click a repository
        </div>
      </div>

      {/* Repository details */}
      <RepoPanel repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
    </main>
  );
}

export default App;
