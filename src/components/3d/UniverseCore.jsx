import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function UniverseCore() {
  const outerRef = useRef();
  const middleRef = useRef();
  const innerRef = useRef();
  const coreRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.012;
      outerRef.current.rotation.z =
        Math.sin(time * 0.12) * 0.025;
    }

    if (middleRef.current) {
      middleRef.current.rotation.y -= delta * 0.018;
      middleRef.current.rotation.x =
        Math.sin(time * 0.16) * 0.018;
    }

    if (innerRef.current) {
      innerRef.current.rotation.y += delta * 0.028;
    }

    if (coreRef.current) {
      const pulse =
        1 +
        Math.sin(time * 1.4) * 0.035;

      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      {/* Deep violet atmosphere */}
      <mesh>
        <sphereGeometry args={[1.55, 32, 32]} />

        <meshBasicMaterial
          color="#4c1d95"
          transparent
          opacity={0.035}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer electric-violet energy */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1.22, 32, 32]} />

        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Middle vivid-purple energy */}
      <mesh ref={middleRef}>
        <sphereGeometry args={[0.98, 32, 32]} />

        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.085}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner lavender energy */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.76, 32, 32]} />

        <meshBasicMaterial
          color="#a78bfa"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core energy body */}
      <mesh>
        <sphereGeometry args={[0.52, 40, 40]} />

        <meshStandardMaterial
          color="#29145f"
          emissive="#7c3aed"
          emissiveIntensity={2.6}
          roughness={0.22}
          metalness={0.35}
        />
      </mesh>

      {/* Bright inner energy */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.28, 32, 32]} />

        <meshBasicMaterial
          color="#c4b5fd"
          transparent
          opacity={0.38}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Central point of energy */}
      <mesh>
        <sphereGeometry args={[0.12, 24, 24]} />

        <meshBasicMaterial
          color="#f5f3ff"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default UniverseCore;