const GITHUB_API = "https://api.github.com";

const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
};

async function githubRequest(endpoint) {
  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    headers: GITHUB_HEADERS,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("GitHub user not found.");
    }

    if (response.status === 403) {
      throw new Error(
        "GitHub API rate limit reached. Try again later."
      );
    }

    if (response.status === 422) {
      throw new Error("Invalid GitHub username.");
    }

    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

function normalizeUsername(username) {
  const cleanUsername = username.trim().replace(/^@/, "");

  if (!cleanUsername) {
    throw new Error("Please enter a GitHub username.");
  }

  return cleanUsername;
}

export async function getGitHubUser(username) {
  const cleanUsername = normalizeUsername(username);

  return githubRequest(
    `/users/${encodeURIComponent(cleanUsername)}`
  );
}

export async function getGitHubRepositories(username) {
  const cleanUsername = normalizeUsername(username);

  const repositories = [];
  let page = 1;

  while (true) {
    const pageRepositories = await githubRequest(
      `/users/${encodeURIComponent(
        cleanUsername
      )}/repos?per_page=100&page=${page}&sort=updated`
    );

    repositories.push(...pageRepositories);

    if (pageRepositories.length < 100) {
      break;
    }

    page += 1;
  }

  return repositories.map((repo) => ({
    id: repo.id,
    name: repo.name,
    description:
      repo.description ||
      "No description available for this repository.",
    language: repo.language || "Unknown",
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    topics: repo.topics || [],
    size: repo.size || 0,

    githubUrl: repo.html_url,

    private: Boolean(repo.private),
    archived: Boolean(repo.archived),

    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,

    featured: false,
  }));
}

export async function getGitHubProfile(username) {
  const cleanUsername = normalizeUsername(username);

  const [user, repositories] = await Promise.all([
    getGitHubUser(cleanUsername),
    getGitHubRepositories(cleanUsername),
  ]);

  return {
    user: {
      login: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      followers: user.followers || 0,
      following: user.following || 0,
      publicRepos: user.public_repos || 0,
      profileUrl: user.html_url,
    },

    repositories,
  };
}