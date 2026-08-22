import { Html } from "@react-three/drei";
import { useMemo, useState } from "react";
import { Code2, Star } from "lucide-react";

function RepositoryNode({
  repo,
  index,
  selected,
  onSelect,
}) {
  const [hovered, setHovered] = useState(false);

  const position = useMemo(() => {
    if (repo.id === "repoverse") {
      return [0, 0, 0];
    }

    const angle = index * 1.65;
    const ring = Math.floor(index / 6);

    const radius = 3.1 + ring * 1.7;

    return [
      Math.cos(angle) * radius,
      Math.sin(index * 0.9) * 1.4,
      Math.sin(angle) * radius,
    ];
  }, [repo.id, index]);

  const isFeatured = repo.featured;

  const size = isFeatured ? 0.48 : 0.32;

  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh
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
        scale={selected ? 1.28 : hovered ? 1.14 : 1}
      >
        <sphereGeometry args={[size * 1.45, 32, 32]} />

        <meshBasicMaterial
          color={isFeatured ? "#8b7cff" : "#6f6a9c"}
          transparent
          opacity={selected ? 0.13 : hovered ? 0.09 : 0.045}
          depthWrite={false}
        />
      </mesh>

      {/* Main planet */}
      <mesh
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
        scale={selected ? 1.28 : hovered ? 1.14 : 1}
      >
        <sphereGeometry args={[size, 32, 32]} />

        <meshStandardMaterial
          color={selected ? "#7568ff" : isFeatured ? "#5145b8" : "#292740"}
          emissive={selected ? "#766aff" : "#312a72"}
          emissiveIntensity={selected ? 1.4 : isFeatured ? 0.7 : 0.28}
          roughness={0.32}
          metalness={0.5}
        />
      </mesh>

      {/* Selection ring */}
      {selected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 1.7, 0.012, 12, 64]} />

          <meshBasicMaterial
            color="#958bff"
            transparent
            opacity={0.75}
          />
        </mesh>
      )}

      {/* Repository label */}
      {(hovered || selected || isFeatured) && (
        <Html
          center
          distanceFactor={8}
          position={[0, size + 0.35, 0]}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            className={[
              "whitespace-nowrap rounded-full border px-3 py-1.5",
              "bg-black/60 backdrop-blur-xl",
              "shadow-2xl transition-all",
              selected
                ? "border-white/20 text-white"
                : "border-white/10 text-white/65",
            ].join(" ")}
          >
            <div className="flex items-center gap-2">
              {isFeatured ? (
                <Star className="h-3 w-3 fill-current text-white/80" />
              ) : (
                <Code2 className="h-3 w-3 text-white/40" />
              )}

              <span className="text-[11px] font-medium tracking-tight">
                {repo.name}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default RepositoryNode;