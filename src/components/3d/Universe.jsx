import { Canvas } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  PerspectiveCamera,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";

import RepositoryNode from "./RepositoryNode";

function Universe({
  repositories,
  selectedRepo,
  onSelect,
}) {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        style={{
          touchAction: "none",
        }}
        onPointerMissed={() => {
          if (selectedRepo) {
            onSelect(null);
          }
        }}
      >
        <color
          attach="background"
          args={["#030305"]}
        />

        <fog
          attach="fog"
          args={["#030305", 14, 30]}
        />

        <PerspectiveCamera
          makeDefault
          position={[0, 1.5, 12]}
          fov={48}
        />

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

        <Stars
          radius={70}
          depth={45}
          count={1800}
          factor={1.7}
          saturation={0}
          fade
          speed={0.25}
        />

        {/* Central light source */}
        <Float
          speed={0.7}
          rotationIntensity={0.05}
          floatIntensity={0.12}
        >
          <mesh>
            <sphereGeometry args={[0.45, 24, 24]} />

            <meshStandardMaterial
              color="#332b68"
              emissive="#6757ff"
              emissiveIntensity={1.2}
              roughness={0.35}
              metalness={0.45}
            />
          </mesh>
        </Float>

        {repositories.map((repo, index) => (
          <RepositoryNode
            key={repo.id}
            repo={repo}
            index={index}
            selected={
              selectedRepo?.id === repo.id
            }
            onSelect={onSelect}
          />
        ))}

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.07}
          enableRotate
          enablePan={false}
          enableZoom
          rotateSpeed={0.45}
          zoomSpeed={0.7}
          minDistance={5}
          maxDistance={24}
          minPolarAngle={Math.PI * 0.18}
          maxPolarAngle={Math.PI * 0.82}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
        />
      </Canvas>
    </div>
  );
}

export default Universe;