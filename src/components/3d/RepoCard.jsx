import { useState } from "react";
import { Float, Html, RoundedBox } from "@react-three/drei";
import { ArrowUpRight, Code2, GitFork, Star } from "lucide-react";

function RepoCard({ repo, onSelect, selected, dimmed }) {
  const [hovered, setHovered] = useState(false);

  const isFeatured = Boolean(repo.featured);

  const scale = selected ? 1.03 : hovered ? 1.015 : 1;

  return (
    <Float speed={1.1} rotationIntensity={0.015} floatIntensity={0.08}>
      <group
        position={repo.position}
        rotation={repo.rotation || [0, 0, 0]}
        scale={scale}
      >
        {/* Thin 3D glass body */}
        <RoundedBox args={[3.8, 2.35, 0.12]} radius={0.16} smoothness={6}>
          <meshPhysicalMaterial
            color={selected ? "#1b1b2a" : "#101017"}
            roughness={0.28}
            metalness={0.2}
            clearcoat={0.8}
            clearcoatRoughness={0.2}
            transparent
            opacity={dimmed ? 0.42 : 0.92}
          />
        </RoundedBox>

        {/* UI layer */}
        <Html
          center
          transform
          position={[0, 0, 0.075]}
          distanceFactor={6}
          occlude={false}
          style={{
            transition: "opacity 250ms ease",
            opacity: dimmed ? 0.38 : 1,
            pointerEvents: "auto",
          }}
        >
          <div className="w-[360px]">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSelect(repo);
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className={`
                group relative block w-full overflow-hidden rounded-[18px]
                border text-left
                transition-all duration-300
                ${
                  selected
                    ? "border-white/25 bg-white/[0.10] shadow-[0_20px_70px_rgba(0,0,0,0.45)]"
                    : "border-white/[0.10] bg-[#0c0c13]/95 hover:border-white/20 hover:bg-[#11111a]"
                }
              `}
            >
              {/* Subtle ambient glow */}
              <div
                className={`
                  pointer-events-none absolute inset-0
                  bg-[radial-gradient(circle_at_20%_0%,rgba(140,120,255,0.14),transparent_45%)]
                  transition-opacity duration-300
                  ${hovered || selected ? "opacity-100" : "opacity-40"}
                `}
              />

              <div className="relative p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`
                        flex size-10 shrink-0 items-center justify-center
                        rounded-xl border
                        ${
                          selected
                            ? "border-white/20 bg-white/10"
                            : "border-white/10 bg-white/[0.04]"
                        }
                      `}
                    >
                      <Code2 className="size-[18px] text-white/70" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">
                        Repository
                      </div>

                      <div className="mt-1 truncate text-[18px] font-semibold tracking-tight text-white">
                        {repo.name}
                      </div>
                    </div>
                  </div>

                  {isFeatured && (
                    <span className="shrink-0 rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-violet-200">
                      Featured
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-5 min-h-[48px] text-[13px] leading-[1.65] text-white/45">
                  {repo.description}
                </p>

                {/* Divider */}
                <div className="my-4 h-px bg-white/[0.07]" />

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-white/50">
                      {repo.language}
                    </span>

                    <span className="flex items-center gap-1 text-[10px] text-white/35">
                      <Star className="size-3" />
                      {repo.stars}
                    </span>

                    <span className="flex items-center gap-1 text-[10px] text-white/35">
                      <GitFork className="size-3" />
                      {repo.forks}
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-[10px] text-white/35 transition-colors group-hover:text-white/75">
                    Explore
                    <ArrowUpRight className="size-3" />
                  </span>
                </div>
              </div>
            </button>
          </div>
        </Html>
      </group>
    </Float>
  );
}

export default RepoCard;
