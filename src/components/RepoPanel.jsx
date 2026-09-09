import {
  Code2,
  ExternalLink,
  GitFork,
  Star,
  X,
} from "lucide-react";

function RepoPanel({ repo, onClose, onExplore }) {
  if (!repo) return null;

  return (
    <aside className="absolute inset-x-3 bottom-3 z-30 sm:inset-x-auto sm:right-5 sm:top-20 sm:bottom-auto sm:w-[min(380px,calc(100%-40px))] md:right-7 md:top-24">
      <div className="max-h-[72svh] overflow-y-auto rounded-2xl border border-white/10 bg-[#09090c]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl sm:max-h-[calc(100svh-7rem)]">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-3.5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/30">
                Repository
              </p>

              <h2 className="truncate text-lg font-semibold tracking-tight text-white/90 sm:text-xl">
                {repo.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/30 transition hover:bg-white/10 hover:text-white"
              aria-label="Close repository"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          {/* Description */}
          {repo.description ? (
            <p className="text-xs leading-5 text-white/50 sm:text-sm sm:leading-6">
              {repo.description}
            </p>
          ) : (
            <p className="text-xs italic leading-5 text-white/25 sm:text-sm">
              No description provided.
            </p>
          )}

          {/* Metadata */}
          <div className="mt-3.5 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
            <MetaBadge
              icon={
                <Code2 className="h-3 w-3" />
              }
              value={repo.language || "Unknown"}
            />

            <MetaBadge
              icon={
                <Star className="h-3 w-3" />
              }
              value={repo.stars ?? 0}
            />

            <MetaBadge
              icon={
                <GitFork className="h-3 w-3" />
              }
              value={repo.forks ?? 0}
            />
          </div>

          {/* Divider */}
          <div className="my-4 h-px bg-white/7 sm:my-5" />

          {/* Topics */}
          {repo.topics?.length > 0 && (
            <div>
              <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                Topics
              </p>

              <div className="flex flex-wrap gap-1.5">
                {repo.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-lg border border-white/8 bg-white/[0.025] px-2 py-1 text-[10px] text-white/45"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Repository exploration */}
          <button
            type="button"
            onClick={() => onExplore(repo)}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-violet-400/10 bg-violet-400/[0.06] text-[10px] font-medium text-violet-200/70 transition hover:border-violet-400/20 hover:bg-violet-400/[0.1] hover:text-violet-200 active:scale-[0.99] sm:mt-5"
          >
            <span>Explore repository</span>
            <span className="text-violet-300/50">→</span>
          </button>

          {/* GitHub action */}
          <a
            href={repo.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2.5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] text-[10px] font-medium text-white/60 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white active:scale-[0.99]"
          >
            <span>View on GitHub</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}

function MetaBadge({ icon, value }) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 text-[10px] font-medium text-white/65">
      {icon}
      {value}
    </span>
  );
}

export default RepoPanel;