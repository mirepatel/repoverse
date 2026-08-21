import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

import RepoCard from "./components/3d/RepoCard";
import RepoPanel from "./components/RepoPanel";
import repositories from "./data/repositories";

function App() {
  const [selectedRepo, setSelectedRepo] = useState(null);

  return (
    <main className="h-screen w-full bg-black">
      <Canvas>
        <ambientLight intensity={0.4} />

        <directionalLight position={[5, 5, 5]} intensity={1.5} />

        <Stars
          radius={50}
          depth={30}
          count={2000}
          factor={2}
          saturation={0}
          fade
          speed={0.5}
        />

        {repositories.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            onSelect={(repo) =>
              setSelectedRepo(selectedRepo?.id === repo.id ? null : repo)
            }
            selected={selectedRepo?.id === repo.id}
            dimmed={selectedRepo !== null && selectedRepo.id !== repo.id}
          />
        ))}

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          enablePan
          minDistance={4}
          maxDistance={18}
        />
      </Canvas>

      <RepoPanel repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
    </main>
  );
}

export default App;
