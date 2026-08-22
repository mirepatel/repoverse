import { Html } from "@react-three/drei";
import { useMemo, useState } from "react";
import { Code2, Star } from "lucide-react";

import { getRepositoryVisuals } from "../../lib/repositoryVisuals";

function RepositoryNode({
  repo,
  index,
  selected,
  onSelect,
}) {
  const [hovered, setHovered] = useState(false);

  const visual = useMemo(
    () => getRepositoryVisuals(repo, index),
    [repo, index]
  );

  const position = useMemo(() => {
    /*
     * Golden-angle distribution.
     *
     * This gives us a natural-looking spread without
     * manually positioning every repository.
     */
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    const angle = index * goldenAngle;

    const verticalSpread =
      Math.sin(index * 1.37) * 1.8;

    return [
      Math.cos(angle) * visual.orbitRadius,
      verticalSpread,
      Math.sin(angle) * visual.orbitRadius,
    ];
  }, [index, visual.orbitRadius]);

  const scale = selected
    ? 1.28
    : hovered
      ? 1.12
      : 1;

  const opacity = visual.archived
    ? 0.35
    : 1;

  return (
    <group position={position}>
      {/* Atmospheric glow */}
      <mesh
        scale={scale}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(repo);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry
          args={[visual.size * 1.8, 32, 32]}
        />

        <meshBasicMaterial
          color={visual.glow}
          transparent
          opacity={
            selected
              ? 0.12
              : hovered
                ? 0.07
                : 0.025
          }
          depthWrite={false}
        />
      </mesh>

      {/* Planet */}
      <mesh
        scale={scale}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(repo);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry
          args={[
            visual.size,
            32,
            32,
          ]}
        />

        <meshStandardMaterial
          color={visual.color}
          emissive={visual.glow}
          emissiveIntensity={
            selected
              ? 1.5
              : 0.35 + visual.activity * 0.45
          }
          roughness={0.38}
          metalness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Activity ring */}
      {visual.activity > 0.65 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry
            args={[
              visual.size * 1.45,
              0.008 + visual.activity * 0.012,
              12,
              64,
            ]}
          />

          <meshBasicMaterial
            color={visual.glow}
            transparent
            opacity={
              selected
                ? 0.85
                : hovered
                  ? 0.5
                  : 0.18
            }
          />
        </mesh>
      )}

      {/* Selected state */}
      {selected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry
            args={[
              visual.size * 1.75,
              0.018,
              16,
              64,
            ]}
          />

          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.75}
          />
        </mesh>
      )}

      {/* Label */}
      {(hovered || selected) && (
        <Html
          center
          distanceFactor={8}
          position={[
            0,
            visual.size + 0.35,
            0,
          ]}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div className="whitespace-nowrap rounded-full border border-white/10 bg-black/65 px-3 py-1.5 text-white/80 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2">
              {repo.stars > 0 ? (
                <Star className="h-3 w-3 fill-current text-white/60" />
              ) : (
                <Code2 className="h-3 w-3 text-white/35" />
              )}

              <span className="text-[11px] font-medium">
                {repo.name}
              </span>

              {repo.language && (
                <span className="text-[9px] text-white/30">
                  {repo.language}
                </span>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default RepositoryNode;