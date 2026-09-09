import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import {
  OrbitControls,
  PerspectiveCamera,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";

import RepositoryNode from "./RepositoryNode";
import UniverseCore from "./UniverseCore";
import ExplorationRocket from "./ExplorationRocket";

function RepositoryField({
  repositories,
  selectedRepo,
  onSelect,
  isInteracting,
}) {
  const groupRef = useRef();
  const currentSpeed = useRef(0.02);

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    const targetSpeed = isInteracting ? 0 : 0.02;

    currentSpeed.current = THREE.MathUtils.damp(
      currentSpeed.current,
      targetSpeed,
      4,
      delta
    );

    groupRef.current.rotation.y +=
      delta * currentSpeed.current;
  });

  return (
    <group ref={groupRef}>
      {repositories.map((repo, index) => (
        <RepositoryNode
          key={repo.id}
          repo={repo}
          index={index}
          selected={selectedRepo?.id === repo.id}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function UniverseScene({
  repositories,
  selectedRepo,
  onSelect,
  isExploreMode,
}) {
  const [isInteracting, setIsInteracting] =
    useState(false);

  return (
    <>
      {/* Universe core */}
      <UniverseCore />

      {/* Exploration rocket */}
      {isExploreMode && <ExplorationRocket />}

      {/* Repository orbital field */}
      <RepositoryField
        repositories={repositories}
        selectedRepo={selectedRepo}
        onSelect={onSelect}
        isInteracting={isInteracting}
      />

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
        onStart={() => setIsInteracting(true)}
        onEnd={() => setIsInteracting(false)}
      />
    </>
  );
}

function Universe({
  repositories,
  selectedRepo,
  onSelect,
  isExploreMode,
}) {
  const cameraRef = useRef();

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
          ref={cameraRef}
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

        <UniverseScene
          repositories={repositories}
          selectedRepo={selectedRepo}
          onSelect={onSelect}
          isExploreMode={isExploreMode}
        />
      </Canvas>
    </div>
  );
}

export default Universe;