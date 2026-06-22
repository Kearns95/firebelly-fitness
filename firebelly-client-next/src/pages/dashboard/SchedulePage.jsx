import { CalendarDays } from "lucide-react";

import useScheduleRange from "@/features/schedule/useScheduleRange";
import ScheduleEventList from "@/features/schedule/ScheduleEventList";

function PageShell({ subtitle, children }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 pb-24 md:px-8 md:py-10">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          This week
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
      </header>
      {children}
    </div>
  );
}

function EventSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-card h-[72px] animate-pulse rounded-lg border"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-border/70 flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
      <CalendarDays className="text-muted-foreground size-8" aria-hidden="true" />
      <div>
        <p className="font-semibold">Nothing on the calendar</p>
        <p className="text-muted-foreground mt-1 text-sm">
          No sessions or availability scheduled for this week yet.
        </p>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const { loading, events, weekStart, weekEnd } = useScheduleRange();
  const rangeLabel = `${weekStart.format("MMM D")} – ${weekEnd.format("MMM D, YYYY")}`;

  return (
    <PageShell subtitle={rangeLabel}>
      {loading ? (
        <EventSkeleton />
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <ScheduleEventList events={events} />
      )}
    </PageShell>
  );
}
