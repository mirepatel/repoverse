import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

import {
  ArrowUpRight,
  Code2,
  ExternalLink,
  GitFork,
  Star,
  X,
} from "lucide-react";

function RepoPanel({ repo, onClose }) {
  if (!repo) return null;

  return (
    <aside
      className="
        absolute right-6 top-20 z-30
        w-[380px] max-w-[calc(100vw-3rem)]
        animate-in fade-in slide-in-from-right-4
        duration-300
      "
    >
      <Card className="overflow-hidden border-white/10 bg-[#09090e]/90 text-white shadow-[0_24px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        {/* Accent */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-5">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Code2 className="size-[18px] text-white/60" />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">
                  Repository
                </p>

                <CardTitle className="mt-1 truncate text-xl tracking-tight">
                  {repo.name}
                </CardTitle>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close repository details"
              className="size-8 shrink-0 rounded-full text-white/30 hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          <p className="text-[13px] leading-6 text-white/50">
            {repo.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="border-white/10 bg-white/[0.06] text-white/60"
            >
              {repo.language}
            </Badge>

            <div className="flex items-center gap-1.5 text-[11px] text-white/35">
              <Star className="size-3" />
              {repo.stars}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-white/35">
              <GitFork className="size-3" />
              {repo.forks}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.07]" />

          {/* Repository action */}
          <Button
            className="
              h-10 w-full justify-between
              rounded-xl
              bg-white text-black
              hover:bg-white/90
            "
            onClick={() =>
              window.open(
                repo.githubUrl,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <span className="flex items-center gap-2">
              View on GitHub
              <ArrowUpRight className="size-3.5" />
            </span>

            <ExternalLink className="size-3.5 opacity-40" />
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}

export default RepoPanel;