import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ExplorationRocket() {
  const groupRef = useRef();

  useFrame((state) => {
  if (!groupRef.current) {
    return;
  }

  const time = state.clock.elapsedTime;

  // Subtle flight motion
  groupRef.current.position.y =
    Math.sin(time * 0.8) * 0.08;

  groupRef.current.position.x =
    Math.sin(time * 0.35) * 0.035;

  // Very slight course correction
  groupRef.current.rotation.z =
    Math.sin(time * 0.5) * 0.035;

  groupRef.current.rotation.x =
    Math.sin(time * 0.3) * 0.02;
  });

  return (
    <group
      ref={groupRef}
      position={[0, 1.2, 3]}
      rotation={[0, Math.PI, 0]}
    >
      {/* Rocket body */}
      <mesh>
        <capsuleGeometry
          args={[0.14, 0.42, 8, 16]}
        />
        <meshStandardMaterial
          color="#e9e7ff"
          emissive="#8b5cf6"
          emissiveIntensity={0.45}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Rocket nose */}
      <mesh position={[0, 0.34, 0]}>
        <coneGeometry
          args={[0.14, 0.24, 16]}
        />
        <meshStandardMaterial
          color="#c4b5fd"
          emissive="#8b5cf6"
          emissiveIntensity={0.6}
          roughness={0.25}
          metalness={0.45}
        />
      </mesh>

      {/* Left fin */}
      <mesh
        position={[-0.13, -0.13, 0]}
        rotation={[0, 0, -0.35]}
      >
        <coneGeometry
          args={[0.09, 0.24, 3]}
        />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#6d28d9"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.35}
        />
      </mesh>

      {/* Right fin */}
      <mesh
        position={[0.13, -0.13, 0]}
        rotation={[0, 0, 0.35]}
      >
        <coneGeometry
          args={[0.09, 0.24, 3]}
        />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#6d28d9"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.35}
        />
      </mesh>

      {/* Engine glow */}
      <mesh position={[0, -0.34, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial
          color="#c4b5fd"
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default ExplorationRocket;