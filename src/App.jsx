import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  Copy,
  Search,
  Share2,
  X,
} from "lucide-react";

import {
  getGitHubProfile,
  normalizeUsername,
} from "./lib/github";

import {
  getRepositoryPriority,
} from "./lib/repositoryVisuals";

import Universe from "./components/3d/Universe";
import RepoPanel from "./components/RepoPanel";
import ProfilePopover from "./components/ProfilePopover";
import LandingHero from "./components/landing/LandingHero";

const MAX_VISIBLE_REPOSITORIES = 120;

function getUsernameFromPath() {
  const path =
    window.location.pathname.replace(
      /^\/+|\/+$/g,
      ""
    );

  if (!path) {
    return "";
  }

  return decodeURIComponent(path);
}

function updatePageMeta(profile) {
  if (profile?.user?.login) {
    const login = profile.user.login;

    document.title = `@${login} · Repoverse`;

    const description =
      `Explore @${login}'s public GitHub repositories in an interactive 3D universe.`;

    const descriptionMeta =
      document.querySelector(
        'meta[name="description"]'
      );

    if (descriptionMeta) {
      descriptionMeta.setAttribute(
        "content",
        description
      );
    }

    const ogTitle =
      document.querySelector(
        'meta[property="og:title"]'
      );

    if (ogTitle) {
      ogTitle.setAttribute(
        "content",
        `@${login} · Repoverse`
      );
    }

    const ogDescription =
      document.querySelector(
        'meta[property="og:description"]'
      );

    if (ogDescription) {
      ogDescription.setAttribute(
        "content",
        description
      );
    }

    const twitterTitle =
      document.querySelector(
        'meta[name="twitter:title"]'
      );

    if (twitterTitle) {
      twitterTitle.setAttribute(
        "content",
        `@${login} · Repoverse`
      );
    }

    const twitterDescription =
      document.querySelector(
        'meta[name="twitter:description"]'
      );

    if (twitterDescription) {
      twitterDescription.setAttribute(
        "content",
        description
      );
    }

    return;
  }

  document.title =
    "Repoverse | GitHub in 3D";

  const defaultDescription =
    "Repoverse turns public GitHub profiles into interactive 3D universes of repositories.";

  const descriptionMeta =
    document.querySelector(
      'meta[name="description"]'
    );

  if (descriptionMeta) {
    descriptionMeta.setAttribute(
      "content",
      defaultDescription
    );
  }

  const ogTitle =
    document.querySelector(
      'meta[property="og:title"]'
    );

  if (ogTitle) {
    ogTitle.setAttribute(
      "content",
      "Repoverse | GitHub in 3D"
    );
  }

  const ogDescription =
    document.querySelector(
      'meta[property="og:description"]'
    );

  if (ogDescription) {
    ogDescription.setAttribute(
      "content",
      "Explore public GitHub repositories as an interactive 3D universe."
    );
  }

  const twitterTitle =
    document.querySelector(
      'meta[name="twitter:title"]'
    );

  if (twitterTitle) {
    twitterTitle.setAttribute(
      "content",
      "Repoverse | GitHub in 3D"
    );
  }

  const twitterDescription =
    document.querySelector(
      'meta[name="twitter:description"]'
    );

  if (twitterDescription) {
    twitterDescription.setAttribute(
      "content",
      "Explore public GitHub repositories as an interactive 3D universe."
    );
  }
}

function getRepositorySearchText(repo) {
  return [
    repo.name,
    repo.description,
    repo.language,
    ...(repo.topics || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function App() {
  const [username, setUsername] =
    useState(() =>
      getUsernameFromPath()
    );

  const [profile, setProfile] =
    useState(null);

  const [selectedRepo, setSelectedRepo] =
    useState(null);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const [repoQuery, setRepoQuery] =
    useState("");

  /*
   * PAGE META
   */

  useEffect(() => {
    updatePageMeta(profile);
  }, [profile]);

  /*
   * SEARCH + PERFORMANCE
   *
   * Large GitHub profiles can contain hundreds
   * of repositories. We keep search comprehensive
   * while limiting the number of WebGL nodes that
   * need to be rendered at once.
   */

  const repositoryResults = useMemo(() => {
    if (!profile?.repositories) {
      return {
        filtered: [],
        visible: [],
        limited: false,
      };
    }

    const repositories =
      profile.repositories;

    const query =
      repoQuery.trim().toLowerCase();

    if (!query) {
      if (
        repositories.length <=
        MAX_VISIBLE_REPOSITORIES
      ) {
        return {
          filtered: repositories,
          visible: repositories,
          limited: false,
        };
      }

      const visible =
        [...repositories]
          .sort(
            (a, b) =>
              getRepositoryPriority(b) -
              getRepositoryPriority(a)
          )
          .slice(
            0,
            MAX_VISIBLE_REPOSITORIES
          );

      return {
        filtered: repositories,
        visible,
        limited: true,
      };
    }

    const filtered =
      repositories.filter((repo) =>
        getRepositorySearchText(
          repo
        ).includes(query)
      );

    /*
     * Search results are ranked so exact repository
     * names always have a very high chance of appearing.
     */
    const ranked = [...filtered].sort(
      (a, b) => {
        const aName =
          a.name?.toLowerCase() || "";

        const bName =
          b.name?.toLowerCase() || "";

        const aExact =
          aName === query ? 100000 : 0;

        const bExact =
          bName === query ? 100000 : 0;

        const aStarts =
          aName.startsWith(query)
            ? 10000
            : 0;

        const bStarts =
          bName.startsWith(query)
            ? 10000
            : 0;

        return (
          bExact +
          bStarts +
          getRepositoryPriority(b) -
          (aExact +
            aStarts +
            getRepositoryPriority(a))
        );
      }
    );

    return {
      filtered,
      visible: ranked.slice(
        0,
        MAX_VISIBLE_REPOSITORIES
      ),
      limited:
        ranked.length >
        MAX_VISIBLE_REPOSITORIES,
    };
  }, [profile, repoQuery]);

  const filteredRepositories =
    repositoryResults.filtered;

  const visibleRepositories =
    repositoryResults.visible;

  /*
   * SEARCH KEYBOARD SHORTCUTS
   *
   * "/" or Cmd/Ctrl + K focuses the repository
   * search field on the universe page.
   */

  useEffect(() => {
    const handleSearchShortcut =
      (event) => {
        const target =
          event.target;

        const isTyping =
          target instanceof
            HTMLInputElement ||
          target instanceof
            HTMLTextAreaElement ||
          target instanceof
            HTMLSelectElement ||
          target?.isContentEditable;

        const isSlashShortcut =
          event.key === "/" &&
          !isTyping;

        const isCommandK =
          event.key.toLowerCase() ===
            "k" &&
          (event.metaKey ||
            event.ctrlKey);

        if (
          !isSlashShortcut &&
          !isCommandK
        ) {
          return;
        }

        event.preventDefault();

        const searchInput =
          document.getElementById(
            profile
              ? "repository-search"
              : "github-username-search"
          );

        searchInput?.focus();
      };

    window.addEventListener(
      "keydown",
      handleSearchShortcut
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleSearchShortcut
      );
    };
  }, [profile]);

  /*
   * LOAD PROFILE
   */

  const loadProfile =
    useCallback(
      async (value) => {
        let cleanUsername;

        try {
          cleanUsername =
            normalizeUsername(value);
        } catch (err) {
          setProfile(null);
          setError(
            err.message ||
              "Please enter a valid GitHub username."
          );
          return;
        }

        setLoading(true);
        setError("");
        setSelectedRepo(null);
        setProfileOpen(false);
        setCopied(false);
        setRepoQuery("");

        try {
          const data =
            await getGitHubProfile(
              cleanUsername
            );

          setProfile(data);
          setUsername(
            data.user.login
          );
        } catch (err) {
          setProfile(null);
          setError(
            err.message ||
              "Something went wrong."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  /*
   * INITIAL PROFILE / BROWSER NAVIGATION
   */

  useEffect(() => {
    const initialUsername =
      getUsernameFromPath();

    if (initialUsername) {
      let cancelled = false;

      const loadInitialProfile =
        async () => {
          let cleanUsername;

          try {
            cleanUsername =
              normalizeUsername(
                initialUsername
              );
          } catch (err) {
            if (cancelled) {
              return;
            }

            setProfile(null);
            setError(
              err.message ||
                "Please enter a valid GitHub username."
            );
            setLoading(false);
            return;
          }

          setLoading(true);
          setError("");

          try {
            const data =
              await getGitHubProfile(
                cleanUsername
              );

            if (cancelled) {
              return;
            }

            setProfile(data);
            setUsername(
              data.user.login
            );
          } catch (err) {
            if (cancelled) {
              return;
            }

            setProfile(null);
            setError(
              err.message ||
                "Something went wrong."
            );
          } finally {
            if (!cancelled) {
              setLoading(false);
            }
          }
        };

      loadInitialProfile();

      return () => {
        cancelled = true;
      };
    }

    const handlePopState =
      () => {
        const pathUsername =
          getUsernameFromPath();

        setError("");
        setSelectedRepo(null);
        setCopied(false);
        setProfileOpen(false);
        setRepoQuery("");

        if (pathUsername) {
          setUsername(pathUsername);
          loadProfile(
            pathUsername
          );
        } else {
          setUsername("");
          setProfile(null);
          setLoading(false);
        }
      };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, [loadProfile]);

  /*
   * EXPLORE PROFILE
   */

  const handleExplore = async (
    eventOrUsername
  ) => {
    if (
      typeof eventOrUsername !==
      "string"
    ) {
      eventOrUsername.preventDefault();
    }

    const value =
      typeof eventOrUsername ===
      "string"
        ? eventOrUsername
        : username;

    let cleanUsername;

    try {
      cleanUsername =
        normalizeUsername(value);
    } catch (err) {
      setError(
        err.message ||
          "Please enter a valid GitHub username."
      );
      return;
    }

    const nextPath =
      `/${encodeURIComponent(
        cleanUsername
      )}`;

    window.history.pushState(
      {},
      "",
      nextPath
    );

    await loadProfile(
      cleanUsername
    );
  };

  /*
   * RESET
   */

  const handleReset = () => {
    window.history.pushState(
      {},
      "",
      "/"
    );

    setProfile(null);
    setSelectedRepo(null);
    setProfileOpen(false);
    setUsername("");
    setError("");
    setLoading(false);
    setCopied(false);
    setRepoQuery("");
  };

  /*
   * SHARE
   */

  const handleShare = async () => {
    if (
      !profile?.user?.login
    ) {
      return;
    }

    const shareUrl =
      window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.user.login} · Repoverse`,
          text: `Explore @${profile.user.login}'s GitHub repositories in 3D.`,
          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(
        shareUrl
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (err) {
      if (
        err?.name ===
        "AbortError"
      ) {
        return;
      }

      try {
        const textArea =
          document.createElement(
            "textarea"
          );

        textArea.value =
          shareUrl;

        textArea.style.position =
          "fixed";

        textArea.style.opacity =
          "0";

        textArea.style.pointerEvents =
          "none";

        document.body.appendChild(
          textArea
        );

        textArea.focus();
        textArea.select();

        document.execCommand(
          "copy"
        );

        document.body.removeChild(
          textArea
        );

        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 1800);
      } catch {
        setError(
          "Unable to copy the share link."
        );
      }
    }
  };

  /*
   * LANDING EXPERIENCE
   */

  if (!profile) {
    return (
      <LandingHero
        username={username}
        setUsername={setUsername}
        loading={loading}
        error={error}
        onExplore={handleExplore}
      />
    );
  }

  const languages =
    new Set(
      profile.repositories
        .map(
          (repo) => repo.language
        )
        .filter(Boolean)
        .filter(
          (language) =>
            language !==
            "Unknown"
        )
    );

  const totalStars =
    profile.repositories.reduce(
      (total, repo) =>
        total +
        (repo.stars || 0),
      0
    );

  /*
   * REPOVERSE EXPERIENCE
   */

  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-[#030305] text-white">
      <Universe
        repositories={
          visibleRepositories
        }
        selectedRepo={selectedRepo}
        onSelect={setSelectedRepo}
      />

      {/* Atmospheric overlay */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_45%,transparent_0%,transparent_45%,rgba(0,0,0,0.45)_100%)]" />

      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-40 flex items-start justify-between p-3.5 sm:p-5 md:p-7">
        {/* Brand */}
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2.5 rounded-xl p-1 text-left transition hover:bg-white/4 sm:gap-3"
        >
          <img
            src="/favicon.svg"
            alt=""
            className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.035] p-1.5 backdrop-blur-xl"
          />

          <div>
            <p className="text-sm font-semibold tracking-tight">
              Repoverse
            </p>

            <p className="text-[8px] font-medium uppercase tracking-[0.28em] text-white/30">
              GitHub in 3D
            </p>
          </div>
        </button>

        {/* Actions */}
        <div className="relative flex items-center gap-2">
          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-black/30 px-3.5 text-white/55 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white active:scale-[0.97]"
            aria-label={
              copied
                ? "Link copied"
                : "Share universe"
            }
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : navigator.share ? (
              <Share2 className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}

            <span className="text-[10px] font-medium max-sm:hidden">
              {copied
                ? "Copied"
                : navigator.share
                  ? "Share"
                  : "Copy link"}
            </span>
          </button>

          {/* Profile */}
          <button
            type="button"
            onClick={() =>
              setProfileOpen(
                (open) => !open
              )
            }
            aria-expanded={profileOpen}
            aria-label="Open profile"
            className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/30 px-1.5 pr-3.5 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.97] max-sm:w-10 max-sm:justify-center max-sm:gap-0 max-sm:p-1"
          >
            {profile.user.avatarUrl ? (
              <img
                src={
                  profile.user
                    .avatarUrl
                }
                alt=""
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-[9px] font-medium text-white/50">
                {profile.user.login
                  ?.slice(0, 2)
                  .toUpperCase()}
              </div>
            )}

            <span className="max-w-[130px] truncate px-0.5 text-[11px] font-medium text-white/75 max-sm:hidden">
              {profile.user.name ||
                profile.user.login}
            </span>
          </button>

          {profileOpen && (
            <ProfilePopover
              profile={profile}
              onClose={() => setProfileOpen(false)}
              onExplore={(nextUsername) => {
                setProfileOpen(false);
                handleExplore(nextUsername);
              }}
              loading={loading}
              error={error}
            />
          )}
        </div>
      </header>

      {/* Repository search */}
      <div className="pointer-events-auto absolute left-1/2 top-20 z-30 w-[min(360px,calc(100vw-32px))] -translate-x-1/2 sm:top-24">
        <div className="flex h-10 items-center rounded-xl border border-white/10 bg-[#08080b]/65 p-1 backdrop-blur-2xl transition focus-within:border-white/20 focus-within:bg-[#09090c]/85">
          <Search className="ml-2.5 h-3.5 w-3.5 shrink-0 text-white/25" />

          <input
            id="repository-search"
            value={repoQuery}
            onChange={(event) => {
              setRepoQuery(
                event.target.value
              );

              if (
                selectedRepo &&
                !repositoryResults.filtered.some(
                  (repo) =>
                    repo.id ===
                    selectedRepo.id
                )
              ) {
                setSelectedRepo(null);
              }
            }}
            placeholder="Search repositories..."
            aria-label="Search repositories"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent px-2.5 text-xs text-white outline-none placeholder:text-white/25"
          />

          {repoQuery ? (
            <button
              type="button"
              onClick={() =>
                setRepoQuery("")
              }
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/10 hover:text-white"
              aria-label="Clear repository search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="mr-1.5 hidden rounded-md border border-white/8 bg-white/[0.025] px-1.5 py-0.5 text-[8px] font-medium text-white/20 sm:block">
              /
            </kbd>
          )}
        </div>

        {repoQuery && (
          <div className="mt-2 text-center text-[9px] text-white/25">
            {filteredRepositories.length}{" "}
            {filteredRepositories.length ===
            1
              ? "repository"
              : "repositories"}{" "}
            found
            {repositoryResults.limited &&
              " · showing top 120"}
          </div>
        )}

        {!repoQuery &&
          repositoryResults.limited && (
            <div className="mt-2 text-center text-[8px] text-white/20">
              Showing {MAX_VISIBLE_REPOSITORIES}{" "}
              of{" "}
              {profile.repositories.length}{" "}
              repositories
            </div>
          )}
      </div>

      {/* No search results */}
      {repoQuery &&
        filteredRepositories.length ===
          0 && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-sm font-medium text-white/45">
              No repositories found
            </p>

            <p className="mt-1 text-[10px] text-white/20">
              Try another name, language,
              or topic.
            </p>
          </div>
        )}

      {/* Universe information */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 sm:bottom-6 sm:left-6 md:left-7">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/25 sm:text-[9px] sm:tracking-[0.3em]">
            {repoQuery
              ? `${filteredRepositories.length} of `
              : ""}
            {profile.repositories.length}{" "}
            repositories
          </span>

          <span className="text-[8px] text-white/10">
            ·
          </span>

          <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/20 sm:text-[9px]">
            {languages.size} languages
          </span>

          <span className="text-[8px] text-white/10">
            ·
          </span>

          <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/20 sm:text-[9px]">
            {totalStars} stars
          </span>
        </div>

        <h2 className="mt-1 text-base font-medium tracking-tight text-white/70 sm:text-lg">
          @{profile.user.login}
        </h2>
      </div>

      {/* Navigation hint */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 md:bottom-6 md:block">
        <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[9px] font-medium tracking-wide text-white/25 backdrop-blur-xl">
          Drag to explore · Scroll to zoom ·
          Click a repository
        </div>
      </div>

      {/* Repository panel */}
      <RepoPanel
        repo={selectedRepo}
        onClose={() =>
          setSelectedRepo(null)
        }
      />
    </main>
  );
}

export default App;