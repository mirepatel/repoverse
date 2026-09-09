import { useRef } from "react";

import { useFrame } from "@react-three/fiber";

import * as THREE from "three";

function UniverseCore() {
  const outerRef = useRef();
  const middleRef = useRef();
  const innerRef = useRef();
  const coreRef = useRef();
  const flowRef = useRef();

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

    if (flowRef.current) {
      flowRef.current.rotation.y += delta * 0.012;
      flowRef.current.rotation.x =
        Math.sin(time * 0.14) * 0.018;

      flowRef.current.material.uniforms.uTime.value =
        time;
    }
  });

  return (
    <group>
      {/* Deep violet atmosphere */}
      <mesh>
        <sphereGeometry args={[1.55, 32, 32]} />
        <meshBasicMaterial
          color="#3b176f"
          transparent
          opacity={0.035}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer violet energy */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1.22, 32, 32]} />
        <meshBasicMaterial
          color="#6d28d9"
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Middle violet energy */}
      <mesh ref={middleRef}>
        <sphereGeometry args={[0.98, 32, 32]} />
        <meshBasicMaterial
          color="#5b21b6"
          transparent
          opacity={0.085}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner violet energy */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.76, 32, 32]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Dark core */}
      <mesh>
        <sphereGeometry args={[0.52, 48, 48]} />
        <meshStandardMaterial
          color="#120b2b"
          emissive="#35106f"
          emissiveIntensity={1.35}
          roughness={0.3}
          metalness={0.28}
        />
      </mesh>

      {/* Subtle cosmic flow */}
      <mesh ref={flowRef}>
        <sphereGeometry args={[0.525, 48, 48]} />

        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: {
              value: 0,
            },
          }}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vPosition;

            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;

              gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;

            varying vec3 vNormal;
            varying vec3 vPosition;

            float hash(vec3 p) {
              p = fract(p * 0.3183099 + 0.1);
              p *= 17.0;

              return fract(
                p.x * p.y * p.z *
                (p.x + p.y + p.z)
              );
            }

            float noise(vec3 p) {
              vec3 i = floor(p);
              vec3 f = fract(p);

              f = f * f * (3.0 - 2.0 * f);

              float a = hash(i);
              float b = hash(i + vec3(1.0, 0.0, 0.0));
              float c = hash(i + vec3(0.0, 1.0, 0.0));
              float d = hash(i + vec3(1.0, 1.0, 0.0));

              return mix(
                mix(a, b, f.x),
                mix(c, d, f.x),
                f.y
              );
            }

            void main() {
              vec3 p = normalize(vPosition);

              /*
                A slow, broad flow rather than
                many detailed energy bands.
              */
              float angle =
                atan(p.z, p.x);

              float flow =
                sin(
                  angle * 3.0 +
                  p.y * 4.0 -
                  uTime * 0.28
                );

              float detail =
                noise(p * 5.0);

              float energy =
                smoothstep(
                  0.42,
                  0.72,
                  flow * 0.5 + 0.5
                );

              /*
                Keep the noise very subtle so
                the surface stays clean.
              */
              energy *=
                0.78 +
                detail * 0.22;

              vec3 dark =
                vec3(0.025, 0.008, 0.07);

              vec3 violet =
                vec3(0.17, 0.018, 0.46);

              vec3 brightViolet =
                vec3(0.38, 0.07, 0.82);

              vec3 color =
                mix(
                  dark,
                  violet,
                  energy
                );

              color =
                mix(
                  color,
                  brightViolet,
                  smoothstep(
                    0.78,
                    0.96,
                    energy
                  ) * 0.35
                );

              /*
                Very soft edge glow.
              */
              float fresnel =
                pow(
                  1.0 -
                  max(
                    dot(
                      vNormal,
                      vec3(0.0, 0.0, 1.0)
                    ),
                    0.0
                  ),
                  2.4
                );

              /*
                Keep the shader mostly transparent
                so the dark core remains dominant.
              */
              float alpha =
                0.10 +
                energy * 0.34 +
                fresnel * 0.05;

              gl_FragColor =
                vec4(color, alpha);
            }
          `}
        />
      </mesh>

      {/* Bright inner energy */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.26}
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