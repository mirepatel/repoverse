import { Canvas } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  Stars,
} from "@react-three/drei";

import RepositoryNode from "./RepositoryNode";

function Universe({ repositories, selectedRepo, onSelect }) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{
          position: [0, 1.5, 12],
          fov: 48,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["#030305"]} />

        <fog attach="fog" args={["#030305", 14, 30]} />

        {/* Ambient illumination */}
        <ambientLight intensity={0.18} />

        <pointLight
          position={[0, 0, 2]}
          intensity={2.5}
          distance={12}
        />

        <pointLight
          position={[-8, 5, -8]}
          intensity={1.2}
          distance={18}
        />

        {/* Deep space */}
        <Stars
          radius={70}
          depth={45}
          count={2500}
          factor={1.7}
          saturation={0}
          fade
          speed={0.25}
        />

        {/* Central system */}
        <Float
          speed={0.7}
          rotationIntensity={0.05}
          floatIntensity={0.12}
        >
          <mesh>
            <sphereGeometry args={[0.72, 48, 48]} />

            <meshStandardMaterial
              color="#151526"
              emissive="#4c3cff"
              emissiveIntensity={0.8}
              roughness={0.28}
              metalness={0.45}
            />
          </mesh>

          <mesh>
            <sphereGeometry args={[0.9, 32, 32]} />

            <meshBasicMaterial
              color="#6d5cff"
              transparent
              opacity={0.055}
              depthWrite={false}
            />
          </mesh>
        </Float>

        {/* Repository nodes */}
        {repositories.map((repo, index) => (
          <RepositoryNode
            key={repo.id}
            repo={repo}
            index={index}
            selected={selectedRepo?.id === repo.id}
            onSelect={onSelect}
          />
        ))}

        {/* Free camera */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.07}
          enablePan
          enableZoom
          rotateSpeed={0.45}
          zoomSpeed={0.7}
          panSpeed={0.45}
          minDistance={5}
          maxDistance={24}
          minPolarAngle={Math.PI * 0.18}
          maxPolarAngle={Math.PI * 0.82}
        />
      </Canvas>
    </div>
  );
}

export default Universe;