import { Canvas, useThree } from "@react-three/fiber";

import {
  Float,
  OrbitControls,
  Stars,
} from "@react-three/drei";

import { useEffect } from "react";

import RepositoryNode from "./RepositoryNode";

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const mobile = size.width < 640;

    camera.position.set(
      0,
      mobile ? 1.1 : 1.5,
      mobile ? 15.5 : 12
    );

    camera.fov = mobile ? 55 : 48;

    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
}

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

        <fog
          attach="fog"
          args={["#030305", 14, 30]}
        />

        <ResponsiveCamera />

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
          count={2500}
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
            <sphereGeometry args={[0.45, 32, 32]} />

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
            selected={selectedRepo?.id === repo.id}
            onSelect={onSelect}
          />
        ))}

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