import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RepoCard from "./components/3d/RepoCard";
import { useState } from "react";
import RepoPanel from "./components/RepoPanel";

const repo = {
  name: "QuiQR",
  description: "A QR code generator built with React and TypeScript.",
  language: "TypeScript",
  stars: 0,
  forks: 0,
  githubUrl: "https://github.com/mirepatel/QuiQR",
};

function App() {
  const [selectedRepo, setSelectedRepo] = useState(null);

  return (
    <main className="h-screen w-full bg-black">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.4} />

        <directionalLight position={[4, 5, 6]} intensity={2} />

        <pointLight position={[-4, -2, 3]} intensity={15} distance={10} />

        <RepoCard repo={repo} onSelect={setSelectedRepo} />

        <OrbitControls />
      </Canvas>

      <RepoPanel repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
    </main>
  );
}

export default App;
