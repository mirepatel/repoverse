import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

import { Button } from './ui/button'

import { Badge } from './ui/badge'

function RepoPanel({ repo, onClose }) {
  if (!repo) return null

  return (
    <aside className="absolute right-6 top-6 z-10 w-80">
      <Card className="border-white/10 bg-black/70 text-white shadow-2xl backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardDescription className="text-white/50">
                Repository
              </CardDescription>

              <CardTitle className="mt-2 text-2xl">
                {repo.name}
              </CardTitle>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/50 hover:bg-white/10 hover:text-white"
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm leading-6 text-white/60">
            {repo.description}
          </p>

          <div className="mt-5 flex gap-2">
            <Badge variant="secondary">
  {repo.language}
</Badge>

<Badge variant="secondary">
  ⭐ {repo.stars}
</Badge>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}

export default RepoPanel