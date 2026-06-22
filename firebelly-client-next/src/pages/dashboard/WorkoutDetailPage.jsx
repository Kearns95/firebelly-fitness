import { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { ArrowLeft, Check, CheckCircle2, CircleDashed } from "lucide-react";

import useWorkoutEditor from "@/features/workout/useWorkoutEditor";
import ExerciseEditor from "@/features/workout/ExerciseEditor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Splash from "@/components/common/Splash";

const SAVE_LABEL = {
  saving: "Saving…",
  saved: "Saved",
};

export default function WorkoutDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const accountId = location.state?.accountId;
  const weightUnit = useSelector((state) => state.user?.workoutWeightUnit || "lbs");

  const { workout, dirty, status, error, setAchieved, setComplete, save } =
    useWorkoutEditor(id, accountId);

  const groups = useMemo(
    () => (workout?.training || []).filter((g) => Array.isArray(g) && g.length),
    [workout]
  );

  if (status === "loading" && !workout) return <Splash label="Loading workout…" />;

  if (status === "error" && !workout) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 text-center md:px-8">
        <p className="text-destructive font-semibold">{error || "Workout not found."}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/workouts">Back to workouts</Link>
        </Button>
      </div>
    );
  }
  if (!workout) return <Splash label="Loading workout…" />;

  const date = workout.date ? dayjs(workout.date) : null;
  const categories = Array.isArray(workout.category) ? workout.category.filter(Boolean) : [];
  const complete = Boolean(workout.complete);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 pb-32 md:px-8 md:py-10">
      <Link
        to="/workouts"
        className="text-muted-foreground hover:text-foreground mb-5 inline-flex items-center gap-1.5 text-sm font-semibold"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Workouts
      </Link>

      <header className="mb-6 flex flex-col gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            {workout.title?.trim() || (date ? date.format("dddd") : "Workout")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {date ? date.format("dddd, MMM D, YYYY") : "Unscheduled"}
            {workout.workoutType ? ` · ${workout.workoutType}` : ""}
          </p>
        </div>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <span
                key={cat}
                className="bg-secondary text-secondary-foreground rounded-sm px-2 py-0.5 text-xs font-medium"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="flex flex-col gap-5">
        {groups.map((group, groupIdx) => (
          <section key={groupIdx} className="bg-card flex flex-col gap-5 rounded-xl border p-4 md:p-5">
            {group.length > 1 && (
              <span className="text-primary text-xs font-semibold uppercase tracking-wide">
                Superset
              </span>
            )}
            {group.map((entry, exIdx) => (
              <ExerciseEditor
                key={entry._id || exIdx}
                entry={entry}
                groupIdx={groupIdx}
                exIdx={exIdx}
                weightUnit={weightUnit}
                onAchievedChange={setAchieved}
              />
            ))}
          </section>
        ))}

        {groups.length === 0 && (
          <p className="text-muted-foreground rounded-xl border border-dashed py-12 text-center text-sm">
            This workout has no exercises.
          </p>
        )}
      </div>

      {/* Sticky save bar */}
      <div className="bg-background/85 fixed inset-x-0 bottom-0 z-20 border-t backdrop-blur md:left-60">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3 md:px-8">
          <button
            type="button"
            onClick={() => setComplete(!complete)}
            aria-pressed={complete}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors",
              "focus-visible:ring-ring/50 outline-none focus-visible:ring-2",
              complete
                ? "border-primary/40 bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {complete ? (
              <CheckCircle2 className="size-4" aria-hidden="true" />
            ) : (
              <CircleDashed className="size-4" aria-hidden="true" />
            )}
            {complete ? "Completed" : "Mark complete"}
          </button>

          <div className="ml-auto flex items-center gap-3">
            {status === "error" && workout && (
              <span className="text-destructive text-sm">{error}</span>
            )}
            {status === "saved" && !dirty && (
              <span className="text-primary inline-flex items-center gap-1 text-sm font-semibold">
                <Check className="size-4" aria-hidden="true" />
                Saved
              </span>
            )}
            <Button onClick={save} disabled={!dirty || status === "saving"}>
              {SAVE_LABEL[status] || "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
