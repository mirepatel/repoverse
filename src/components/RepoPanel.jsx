import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Button } from "./ui/button";

import { Badge } from "./ui/badge";

function RepoPanel({ repo, onClose }) {
  if (!repo) return null;

  return (
    <aside className="absolute right-8 top-8 z-10 w-[360px]">
      <Card className="border-white/10 bg-black/70 text-white shadow-2xl backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardDescription className="text-xs uppercase tracking-widest text-white/40">
                Repository
              </CardDescription>

              <CardTitle className="mt-2 text-3xl tracking-tight">
                {repo.name}
              </CardTitle>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close repository details"
              className="text-white/40 hover:bg-white/10 hover:text-white"
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm leading-6 text-white/60">{repo.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="secondary">{repo.language}</Badge>

            <Badge variant="secondary">⭐ {repo.stars}</Badge>

            <Badge variant="secondary">🍴 {repo.forks}</Badge>
          </div>

          <Button
            className="mt-6 w-full"
            onClick={() => window.open(repo.githubUrl, "_blank")}
          >
            View on GitHub ↗
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}

export default RepoPanel;
