import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import * as THREE from "three";

import { getRepositoryVisuals } from "../../lib/repositoryVisuals";

function RepositoryWorldScene({ repo }) {
  const visuals = getRepositoryVisuals(repo, 0);
  return (
    <>
      <color attach="background" args={["#030305"]} />

      <fog
        attach="fog"
        args={["#030305", 10, 26]}
      />

      <PerspectiveCamera
        makeDefault
        position={[0, 1.5, 9]}
        fov={48}
      />

      <ambientLight intensity={0.2} />

      <pointLight
        position={[0, 0, 2]}
        intensity={2.4}
        distance={10}
      />

      <Stars
        radius={55}
        depth={35}
        count={1200}
        factor={1.5}
        saturation={0}
        fade
        speed={0.2}
      />

      {/* Repository core */}
      <mesh>
        <sphereGeometry args={[1.35, 48, 48]} />
        <meshStandardMaterial
          color={visuals.color}
          emissive={visuals.glow}
          emissiveIntensity={0.7}
          roughness={0.24}
          metalness={0.35}
        />
      </mesh>

      {/* Outer atmosphere */}
      <mesh>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial
          color={visuals.glow}
          transparent
          opacity={0.07}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.07}
        enableRotate
        enablePan={false}
        enableZoom
        rotateSpeed={0.45}
        zoomSpeed={0.7}
        minDistance={4}
        maxDistance={18}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.82}
      />
    </>
  );
}

function RepositoryWorld({ repo, onBack }) {
  const visuals = getRepositoryVisuals(repo, 0);
  return (
    <div className="absolute inset-0 bg-[#030305]">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        style={{
          touchAction: "none",
        }}
      >
        <RepositoryWorldScene repo={repo} />
      </Canvas>

      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 top-4 z-20 flex h-9 items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3.5 text-[10px] font-medium text-white/50 backdrop-blur-xl transition hover:border-white/15 hover:bg-white/[0.06] hover:text-white active:scale-[0.98] sm:left-6 sm:top-6"
      >
        <span>←</span>
        Back to universe
      </button>

      <div className="pointer-events-none absolute inset-x-0 top-8 z-10 text-center sm:top-10">
        <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-violet-300/45">
          Repository World
        </p>

        <h1 className="mt-2 px-6 text-xl font-semibold tracking-tight text-white/75 sm:text-2xl">
          {repo.name}
        </h1>
      </div>
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/[0.06] bg-black/20 px-4 py-2 text-[9px] uppercase tracking-[0.16em] text-white/35 backdrop-blur-md">
        <span>
          Activity{" "}
          <span className="text-white/55">
            {Math.round(visuals.activity * 100)}%
          </span>
        </span>

        <span className="h-2.5 w-px bg-white/10" />

        <span>
          Popularity{" "}
          <span className="text-white/55">
            {visuals.popularity.toFixed(1)}
          </span>
        </span>
      </div>
    </div>
  );
}

export default RepositoryWorld;