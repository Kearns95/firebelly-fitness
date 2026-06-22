/** Full-screen brand loading state shown while the session resolves. */
export function Splash({ label = "Loading…" }) {
  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col items-center justify-center gap-4">
      <div
        className="border-primary/30 border-t-primary size-9 animate-spin rounded-full border-3"
        aria-hidden="true"
      />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

export default Splash;
