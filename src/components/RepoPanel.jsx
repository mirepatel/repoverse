function RepoPanel({ repo, onClose }) {
  if (!repo) return null

  return (
    <aside className="absolute right-6 top-6 z-10 w-80 rounded-2xl border border-white/10 bg-black/70 p-6 text-white shadow-2xl backdrop-blur-xl">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-white/50 transition hover:text-white"
      >
        ×
      </button>

      <p className="mb-2 text-sm text-white/50">
        Repository
      </p>

      <h2 className="text-2xl font-semibold">
        {repo.name}
      </h2>

      <p className="mt-3 text-sm leading-6 text-white/60">
        {repo.description}
      </p>

      <div className="mt-5 flex gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
          {repo.language}
        </span>

        <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
          ⭐ {repo.stars}
        </span>
      </div>
    </aside>
  )
}

export default RepoPanel