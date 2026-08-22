import {
  Code2,
  ExternalLink,
  GitFork,
  Star,
  X,
} from "lucide-react";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "./ui/card";
import { Separator } from "./ui/separator";

function RepoPanel({ repo, onClose }) {
  if (!repo) return null;

  return (
    <aside className="absolute right-5 top-20 z-30 w-[min(380px,calc(100%-40px))] md:right-7 md:top-24">
      <Card className="overflow-hidden border-white/10 bg-[#0a0a0d]/90 text-white shadow-2xl shadow-black/50 backdrop-blur-2xl">
        <CardHeader className="p-5 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/30">
                Repository
              </p>

              <h2 className="truncate text-xl font-semibold tracking-tight">
                {repo.name}
              </h2>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 shrink-0 rounded-full text-white/30 hover:bg-white/10 hover:text-white"
              aria-label="Close repository"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 px-5 pb-5">
          <p className="text-sm leading-6 text-white/50">
            {repo.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="border border-white/10 bg-white/[0.05] text-white/70"
            >
              <Code2 className="mr-1.5 h-3 w-3" />
              {repo.language || "Unknown"}
            </Badge>

            <Badge
              variant="secondary"
              className="border border-white/10 bg-white/[0.05] text-white/70"
            >
              <Star className="mr-1.5 h-3 w-3" />
              {repo.stars ?? 0}
            </Badge>

            <Badge
              variant="secondary"
              className="border border-white/10 bg-white/[0.05] text-white/70"
            >
              <GitFork className="mr-1.5 h-3 w-3" />
              {repo.forks ?? 0}
            </Badge>
          </div>

          {repo.topics?.length > 0 && (
            <>
              <Separator className="bg-white/10" />

              <div>
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                  Topics
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {repo.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-md border border-white/10 bg-white/[0.035] px-2 py-1 text-[10px] text-white/45"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          <Button
            asChild
            className="h-10 w-full rounded-lg bg-white text-black hover:bg-white/90"
          >
            <a
              href={repo.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}

export default RepoPanel;