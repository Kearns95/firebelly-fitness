import { Fragment, useMemo } from "react";
import dayjs from "dayjs";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Status presentation pairs color WITH a label (never color alone) so it
 * survives theme swaps and color blindness — see DESIGN.md.
 */
const STATUS_STYLES = {
  BOOKED: "bg-primary/15 text-primary",
  OPEN: "bg-primary/10 text-primary",
  REQUESTED: "bg-brand-flame/15 text-brand-flame",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-destructive/12 text-destructive",
};

const prettyStatus = (status) =>
  status ? status.charAt(0) + status.slice(1).toLowerCase() : "Scheduled";

const eventTitle = (event) => {
  if (event.eventType === "AVAILABILITY") return "Open availability";
  return (
    event.customClientName ||
    event.client?.firstName ||
    event.publicLabel ||
    "Training session"
  );
};

const formatMoney = (event) => {
  if (event.priceAmount == null) return null;
  const currency = (event.priceCurrency || "usd").toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(event.priceAmount / 100);
  } catch {
    return `${event.priceAmount / 100} ${currency}`;
  }
};

function StatusChip({ status }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-sm px-2 py-0.5 text-xs font-semibold",
        STATUS_STYLES[status] || "bg-muted text-muted-foreground"
      )}
    >
      {prettyStatus(status)}
    </span>
  );
}

function EventRow({ event }) {
  const start = dayjs(event.startDateTime);
  const end = dayjs(event.endDateTime);
  const money = formatMoney(event);

  return (
    <li className="bg-card flex items-center gap-4 rounded-lg border p-4">
      <div className="text-center">
        <p className="font-mono text-sm font-semibold tabular-nums">
          {start.format("h:mm")}
        </p>
        <p className="text-muted-foreground font-mono text-xs">
          {start.format("A")}
        </p>
      </div>
      <div className="bg-border h-10 w-px shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{eventTitle(event)}</p>
        <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <Clock className="size-3.5" aria-hidden="true" />
          {start.format("h:mm A")} – {end.format("h:mm A")}
          {money && <span className="text-foreground/70">· {money}</span>}
        </p>
      </div>
      <StatusChip status={event.status} />
    </li>
  );
}

export function ScheduleEventList({ events }) {
  const grouped = useMemo(() => {
    const byDay = new Map();
    for (const event of events) {
      const key = dayjs(event.startDateTime).format("YYYY-MM-DD");
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key).push(event);
    }
    return [...byDay.entries()];
  }, [events]);

  return (
    <div className="flex flex-col gap-6">
      {grouped.map(([day, dayEvents]) => (
        <Fragment key={day}>
          <section className="flex flex-col gap-2">
            <h2 className="text-muted-foreground text-sm font-semibold">
              {dayjs(day).format("dddd, MMM D")}
            </h2>
            <ul className="flex flex-col gap-2">
              {dayEvents.map((event) => (
                <EventRow key={event._id} event={event} />
              ))}
            </ul>
          </section>
        </Fragment>
      ))}
    </div>
  );
}

export default ScheduleEventList;
