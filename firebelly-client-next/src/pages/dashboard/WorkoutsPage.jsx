import dayjs from "dayjs";
import { Dumbbell, Users } from "lucide-react";

import useClientWorkouts from "@/features/workout/useClientWorkouts";
import ClientPicker from "@/features/workout/ClientPicker";
import WorkoutCard from "@/features/workout/WorkoutCard";

function WorkoutSkeleton() {
  return (
    <ul className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <li key={i} className="bg-card h-28 animate-pulse rounded-lg border" />
      ))}
    </ul>
  );
}

function Empty({ icon: Icon, title, body }) {
  return (
    <div className="border-border/70 flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
      <Icon className="text-muted-foreground size-8" aria-hidden="true" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-muted-foreground mt-1 text-sm">{body}</p>
      </div>
    </div>
  );
}

export default function WorkoutsPage() {
  const {
    isTrainer,
    clients,
    selectedClientId,
    setSelectedClientId,
    accountId,
    rangeStart,
    rangeEnd,
    loading,
    needsClient,
    workouts,
  } = useClientWorkouts();

  const rangeLabel = `${dayjs(rangeStart).format("MMM D")} – ${dayjs(rangeEnd).format(
    "MMM D, YYYY"
  )}`;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 pb-24 md:px-8 md:py-10">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Workouts
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Last two weeks · {rangeLabel}</p>
      </header>

      {isTrainer && clients.length > 0 && (
        <div className="mb-6">
          <ClientPicker
            clients={clients}
            selectedClientId={selectedClientId}
            onSelect={setSelectedClientId}
          />
        </div>
      )}

      {needsClient ? (
        <Empty
          icon={Users}
          title="No clients yet"
          body="Once you have an accepted client, their workouts show up here."
        />
      ) : loading ? (
        <WorkoutSkeleton />
      ) : workouts.length === 0 ? (
        <Empty
          icon={Dumbbell}
          title="No workouts in this range"
          body="Nothing logged in the last two weeks."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {workouts.map((workout) => (
            <WorkoutCard key={workout._id} workout={workout} accountId={accountId} />
          ))}
        </ul>
      )}
    </div>
  );
}
