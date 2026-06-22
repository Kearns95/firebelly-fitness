import { cn } from "@/lib/utils";

/**
 * Compact brand mark: an emerald-ringed flame. Placeholder for the real logo —
 * uses the brand emerald + flame hues at the sanctioned ≤10% flame ratio.
 */
export function FirebellyMark({ className }) {
  return (
    <span
      className={cn(
        "bg-card ring-primary/40 inline-flex items-center justify-center rounded-xl ring-1",
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="size-3/5" aria-hidden="true">
        <path
          fill="#f59e0b"
          d="M12 2c1.5 3.5-1 5-1 7.5A3 3 0 0 0 14 12c.8-1 .8-2.5.4-3.5C17 10 18.5 13 18.5 15.5a6.5 6.5 0 1 1-13 0C5.5 11 9 8 9.5 4.5 10.4 5.4 11 6.7 11 8c1-1.5 1.3-4 1-6Z"
        />
        <path
          fill="#10b981"
          d="M12 9.5c.7 1 .7 2.3 0 3.2-.9 1.1-1 2.3-.4 3.3a3 3 0 1 0 3.3-4.6c.2.9 0 1.7-.6 2.3.3-1.4-.3-2.7-1.3-3.5a4 4 0 0 1-1 .8 4 4 0 0 0 0-1.8Z"
        />
      </svg>
    </span>
  );
}

export default FirebellyMark;
