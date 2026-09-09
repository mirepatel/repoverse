import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import * as THREE from "three";

function RepositoryWorldScene() {
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
          color="#29145f"
          emissive="#7c3aed"
          emissiveIntensity={2}
          roughness={0.24}
          metalness={0.35}
        />
      </mesh>

      {/* Outer atmosphere */}
      <mesh>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.055}
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
        <RepositoryWorldScene />
      </Canvas>

      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 top-4 z-20 flex h-9 items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3.5 text-[10px] font-medium text-white/50 backdrop-blur-xl transition hover:border-white/15 hover:bg-white/[0.06] hover:text-white active:scale-[0.98] sm:left-6 sm:top-6"
      >
        <span>←</span>
        Back to universe
      </button>

      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 text-center">
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-violet-300/40">
          Repository World
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-white/90 sm:text-4xl">
          {repo.name}
        </h1>

        <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/20">
          A world built from this repository
        </p>
      </div>
    </div>
  );
}

export default RepositoryWorld;