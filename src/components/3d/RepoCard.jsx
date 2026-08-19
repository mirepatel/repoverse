import { useState } from "react";
import { Float, Text } from "@react-three/drei";

function RepoCard({ repo, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.3}>
      <mesh
        scale={selected ? 1.08 : hovered ? 1.05 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => {
          setSelected(!selected);
          onSelect(repo);
        }}
      >
        <boxGeometry args={[3.5, 2.2, 0.3]} />

        <meshPhysicalMaterial
          color={selected ? "#30304a" : hovered ? "#252535" : "#151515"}
          roughness={0.18}
          metalness={0.2}
          transmission={0.15}
          thickness={0.5}
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
