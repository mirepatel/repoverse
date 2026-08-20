import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import RepoCard from "./components/3d/RepoCard";
import RepoPanel from "./components/RepoPanel";
import repositories from "./data/repositories";

function App() {
  const [selectedRepo, setSelectedRepo] = useState(null);

  return (
    <main className="h-screen w-full bg-black">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.4} />

        <directionalLight position={[4, 5, 6]} intensity={2} />

        <pointLight position={[-4, -2, 3]} intensity={15} distance={10} />

        {repositories.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            onSelect={setSelectedRepo}
            selected={selectedRepo?.id === repo.id}
          />
        ))}

        <OrbitControls />
      </Canvas>

      <RepoPanel repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
    </main>
  );
}

export default App;
