const GITHUB_API = "https://api.github.com";

async function githubRequest(endpoint) {
  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    headers: {
      Accept: "application/vnd.github+json",
    },
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

    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export async function getGitHubUser(username) {
  const cleanUsername = username.trim().replace(/^@/, "");

  if (!cleanUsername) {
    throw new Error("Please enter a GitHub username.");
  }

  return githubRequest(
    `/users/${encodeURIComponent(cleanUsername)}`
  );
}

export async function getGitHubRepositories(username) {
  const cleanUsername = username.trim().replace(/^@/, "");

  if (!cleanUsername) {
    throw new Error("Please enter a GitHub username.");
  }

  const repositories = await githubRequest(
    `/users/${encodeURIComponent(
      cleanUsername
    )}/repos?per_page=100&sort=updated`
  );

  return repositories.map((repo) => ({
    id: repo.id,
    name: repo.name,
    description:
      repo.description ||
      "No description available for this repository.",

    language: repo.language || "Unknown",

    stars: repo.stargazers_count,
    forks: repo.forks_count,

    topics: repo.topics || [],

    size: repo.size,

    githubUrl: repo.html_url,

    private: repo.private,
    archived: repo.archived,

    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,

    featured: false,
  }));
}

export async function getGitHubProfile(username) {
  const [user, repositories] = await Promise.all([
    getGitHubUser(username),
    getGitHubRepositories(username),
  ]);

  return {
    user: {
      login: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      profileUrl: user.html_url,
    },

    repositories,
  };
}