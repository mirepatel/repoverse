import { useState } from "react";
import { Float, Text } from "@react-three/drei";

function RepoCard({ repo, onSelect, selected, dimmed }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.3}>
      <mesh
        position={repo.position}
        scale={selected ? 1.12 : hovered ? 1.05 : dimmed ? 0.94 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(repo)}
      >
        <boxGeometry args={[3.5, 2.2, 0.3]} />

        <meshPhysicalMaterial
          color={selected ? "#3b3b5c" : hovered ? "#252535" : "#151515"}
          roughness={0.18}
          metalness={0.2}
          transmission={0.15}
          thickness={0.5}
          transparent
          opacity={dimmed ? 0.35 : 1}
        />

        <Text
          position={[0, 0, 0.2]}
          fontSize={0.35}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {repo.name}
        </Text>
      </mesh>
    </Float>
  );
}

export default RepoCard;
