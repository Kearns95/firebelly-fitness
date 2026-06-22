import { cn } from "@/lib/utils";

/** Horizontal, selectable client chips for a trainer choosing whose workouts to view. */
export function ClientPicker({ clients, selectedClientId, onSelect }) {
  if (!clients?.length) return null;

  return (
    <div
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
      role="tablist"
      aria-label="Clients"
    >
      {clients.map((client) => {
        const active = client.id === selectedClientId;
        return (
          <button
            key={client.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(client.id)}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors",
              "focus-visible:ring-ring/50 outline-none focus-visible:ring-2",
              active
                ? "bg-primary/15 text-primary"
                : "bg-card text-muted-foreground hover:text-foreground border"
            )}
          >
            {client.label}
          </button>
        );
      })}
    </div>
  );
}

export default ClientPicker;
