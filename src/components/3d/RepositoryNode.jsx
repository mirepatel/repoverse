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
    const goldenAngle =
      Math.PI * (3 - Math.sqrt(5));

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

  const handlePointerOver = (event) => {
    event.stopPropagation();

    const pointerType =
      event.nativeEvent?.pointerType;

    if (pointerType === "touch") {
      return;
    }

    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "default";
  };

  const handleSelect = (event) => {
    event.stopPropagation();

    setHovered(false);
    document.body.style.cursor = "default";

    onSelect(repo);
  };

  /*
   * Only render an HTML label when it is actually
   * useful to the user.
   *
   * This prevents hundreds of Drei <Html> elements
   * from being mounted for large GitHub profiles.
   */
  const showLabel = hovered || selected;

  return (
    <group position={position}>
      {/* Atmospheric glow */}
      <mesh
        scale={scale}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry
          args={[
            visual.size * 1.8,
            24,
            24,
          ]}
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
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry
          args={[
            visual.size,
            24,
            24,
          ]}
        />

        <meshStandardMaterial
          color={visual.color}
          emissive={visual.glow}
          emissiveIntensity={
            selected
              ? 1.5
              : 0.35 +
                visual.activity * 0.45
          }
          roughness={0.38}
          metalness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Activity ring */}
      {visual.activity > 0.65 && (
        <mesh
          rotation={[
            Math.PI / 2,
            0,
            0,
          ]}
        >
          <torusGeometry
            args={[
              visual.size * 1.45,
              0.008 +
                visual.activity * 0.012,
              12,
              48,
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
        <mesh
          rotation={[
            Math.PI / 2,
            0,
            0,
          ]}
        >
          <torusGeometry
            args={[
              visual.size * 1.75,
              0.018,
              16,
              48,
            ]}
          />

          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.75}
          />
        </mesh>
      )}

      {/* Interactive repository label */}
      {showLabel && (
        <Html
          center
          distanceFactor={8}
          position={[
            0,
            visual.size + 0.35,
            0,
          ]}
          zIndexRange={[10, 10]}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            className={[
              "whitespace-nowrap rounded-full",
              "border border-white/10",
              "bg-black/70 px-3 py-1.5",
              "shadow-2xl shadow-black/40",
              "backdrop-blur-xl",
            ].join(" ")}
          >
            <div className="flex items-center gap-1.5">
              {repo.stars > 0 ? (
                <Star className="h-2.5 w-2.5 fill-current text-white/50" />
              ) : (
                <Code2 className="h-2.5 w-2.5 text-white/30" />
              )}

              <span className="text-[10px] font-medium text-white/75">
                {repo.name}
              </span>

              {repo.language && (
                <span className="text-[8px] text-white/30">
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