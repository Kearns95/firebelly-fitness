import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight, CircleDashed, Dumbbell, Heart } from "lucide-react";

import { cn } from "@/lib/utils";

const flattenExercises = (training) =>
  (training || [])
    .flat()
    .filter((entry) => entry && (entry.exercise || entry.exerciseType));

const exerciseName = (entry) =>
  typeof entry.exercise === "object" ? entry.exercise?.name : null;

export function WorkoutCard({ workout, accountId }) {
  const date = workout.date ? dayjs(workout.date) : null;
  const exercises = flattenExercises(workout.training);
  const names = exercises.map(exerciseName).filter(Boolean);
  const categories = Array.isArray(workout.category)
    ? workout.category.filter(Boolean)
    : [];
  const hasCardio = workout.cardio && Object.keys(workout.cardio).length > 0;
  const complete = Boolean(workout.complete);

  const title =
    workout.title?.trim() ||
    (date ? date.format("dddd") : null) ||
    workout.workoutType ||
    "Workout";

  return (
    <li>
      <Link
        to={`/workouts/${workout._id}`}
        state={{ accountId }}
        className={cn(
          "bg-card flex flex-col gap-3 rounded-lg border p-4 transition-colors",
          "hover:border-primary/40 hover:bg-card/80",
          "focus-visible:ring-ring/50 outline-none focus-visible:ring-2"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold">{title}</p>
            <p className="text-muted-foreground text-sm">
              {date ? date.format("ddd, MMM D") : "Unscheduled"}
              {workout.workoutType ? ` · ${workout.workoutType}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-semibold",
                complete
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {complete ? (
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
              ) : (
                <CircleDashed className="size-3.5" aria-hidden="true" />
              )}
              {complete ? "Completed" : "Planned"}
            </span>
            <ChevronRight
              className="text-muted-foreground size-4"
              aria-hidden="true"
            />
          </div>
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

      <div className="text-muted-foreground flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5">
          <Dumbbell className="size-4" aria-hidden="true" />
          {exercises.length} {exercises.length === 1 ? "exercise" : "exercises"}
        </span>
        {hasCardio && (
          <span className="flex items-center gap-1.5">
            <Heart className="size-4" aria-hidden="true" />
            Cardio
          </span>
        )}
      </div>

      {names.length > 0 && (
        <p className="text-muted-foreground/90 truncate text-sm">
          {names.slice(0, 4).join(" · ")}
          {names.length > 4 ? ` +${names.length - 4} more` : ""}
        </p>
      )}
      </Link>
    </li>
  );
}

export default WorkoutCard;
