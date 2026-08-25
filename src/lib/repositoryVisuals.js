const LANGUAGE_STYLES = {
  JavaScript: {
    color: "#e8c547",
    glow: "#f0c93d",
  },

  TypeScript: {
    color: "#3178c6",
    glow: "#4f94e8",
  },

  Python: {
    color: "#4b8bbe",
    glow: "#63a4d8",
  },

  HTML: {
    color: "#e34c26",
    glow: "#f06a42",
  },

  CSS: {
    color: "#563d7c",
    glow: "#8060a8",
  },

  Java: {
    color: "#b07219",
    glow: "#d18a2b",
  },

  "C++": {
    color: "#f34b7d",
    glow: "#f66d96",
  },

  C: {
    color: "#555555",
    glow: "#888888",
  },

  Go: {
    color: "#00add8",
    glow: "#28c5e7",
  },

  Rust: {
    color: "#dea584",
    glow: "#f0bd99",
  },

  PHP: {
    color: "#4f5d95",
    glow: "#7180bd",
  },

  Ruby: {
    color: "#701516",
    glow: "#a52a2a",
  },

  Swift: {
    color: "#f05138",
    glow: "#ff765f",
  },

  Kotlin: {
    color: "#a97bff",
    glow: "#c09cff",
  },

  Dart: {
    color: "#00b4ab",
    glow: "#31d5cc",
  },

  Unknown: {
    color: "#696969",
    glow: "#8a8a8a",
  },
};

function clamp(value, min, max) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

function getActivityScore(repo) {
  if (!repo.updatedAt) {
    return 0.5;
  }

  const updated = new Date(repo.updatedAt);
  const now = new Date();

  const ageInDays =
    (now.getTime() - updated.getTime()) /
    (1000 * 60 * 60 * 24);

  return clamp(
    Math.exp(-ageInDays / 365),
    0.12,
    1
  );
}

function getPopularityScore(repo) {
  const stars = Math.max(
    repo.stars || 0,
    0
  );

  const forks = Math.max(
    repo.forks || 0,
    0
  );

  const starScore =
    Math.log10(stars + 1);

  const forkScore =
    Math.log10(forks + 1);

  return clamp(
    starScore * 0.8 +
      forkScore * 0.35,
    0,
    5
  );
}

function getPlanetSize(repo) {
  const popularity =
    getPopularityScore(repo);

  return clamp(
    0.26 + popularity * 0.055,
    0.26,
    0.58
  );
}

function getOrbitRadius(repo, index) {
  const activity =
    getActivityScore(repo);

  const baseRadius =
    3.5 + (index % 4) * 1.15;

  return (
    baseRadius +
    (1 - activity) * 3
  );
}

export function getRepositoryVisuals(
  repo,
  index
) {
  const language =
    LANGUAGE_STYLES[repo.language] ||
    LANGUAGE_STYLES.Unknown;

  const activity =
    getActivityScore(repo);

  const popularity =
    getPopularityScore(repo);

  return {
    color: language.color,
    glow: language.glow,
    size: getPlanetSize(repo),
    activity,
    popularity,
    orbitRadius: getOrbitRadius(
      repo,
      index
    ),
    archived: Boolean(repo.archived),
  };
}

export function getRepositoryPriority(repo) {
  const activity =
    getActivityScore(repo);

  const popularity =
    getPopularityScore(repo);

  return (
    popularity * 2 +
    activity
  );
}