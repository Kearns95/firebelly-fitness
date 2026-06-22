import { Outlet } from "react-router-dom";

import { FirebellyMark } from "@/components/common/FirebellyMark";

/** Centered card stage for auth screens, on the calm slate base. */
export function AuthLayout() {
  return (
    <div className="bg-background text-foreground relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      {/* faint emerald glow from the base — tonal, not decorative glassmorphism */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(16,185,129,0.10),transparent)]"
      />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <FirebellyMark className="size-11" />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Firebelly
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Coaching, scheduling, and training in one place.
            </p>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
