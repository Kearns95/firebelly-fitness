import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-primary text-5xl font-bold">404</p>
      <div>
        <h1 className="font-display text-xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          That page doesn’t exist or has moved.
        </p>
      </div>
      <Button asChild>
        <Link to="/">Back to schedule</Link>
      </Button>
    </div>
  );
}
