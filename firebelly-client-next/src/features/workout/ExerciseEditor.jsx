import { cn } from "@/lib/utils";

const isTimeType = (entry) => /time|second|duration/i.test(entry.exerciseType || "");

const targetLabel = (entry, i, weightUnit) => {
  const g = entry.goals || {};
  const weight = g.weight?.[i];
  if (isTimeType(entry)) {
    const secs = g.seconds?.[i];
    return [secs != null ? `${secs}s` : null, weight ? `${weight} ${weightUnit}` : null]
      .filter(Boolean)
      .join(" @ ") || "—";
  }
  const exact = g.exactReps?.[i];
  const min = g.minReps?.[i];
  const max = g.maxReps?.[i];
  let reps = null;
  if (exact != null && exact !== "") reps = `${exact}`;
  else if (min != null && max != null) reps = min === max ? `${min}` : `${min}–${max}`;
  else if (min != null) reps = `${min}`;
  return [reps ? `${reps} reps` : null, weight ? `${weight} ${weightUnit}` : null]
    .filter(Boolean)
    .join(" @ ") || "—";
};

function AchievedInput({ label, value, onChange }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="sr-only">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        value={value === 0 || value ? String(value) : ""}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "border-input bg-white/[0.02] h-11 w-full rounded-md border text-center font-mono text-base tabular-nums",
          "outline-none transition-[color,box-shadow]",
          "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px]"
        )}
      />
    </label>
  );
}

/**
 * One exercise: target per set (goal) and large, editable achieved fields —
 * tuned for live, mid-set, phone-in-hand logging (DESIGN.md signature surface).
 */
export function ExerciseEditor({ entry, groupIdx, exIdx, weightUnit, onAchievedChange }) {
  const time = isTimeType(entry);
  const setCount = Math.max(
    entry.goals?.sets || 0,
    entry.achieved?.reps?.length || 0,
    entry.achieved?.seconds?.length || 0
  );
  const sets = Array.from({ length: setCount || 1 });
  const repField = time ? "seconds" : "reps";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-base font-semibold">
          {entry.exercise?.exerciseTitle || "Exercise"}
        </h3>
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
          {entry.exerciseType || "Reps"}
        </span>
      </div>

      {/* column headers */}
      <div className="text-muted-foreground grid grid-cols-[2rem_1fr_5rem_5rem] items-center gap-2 px-1 text-xs font-semibold">
        <span>Set</span>
        <span>Target</span>
        <span className="text-center">{time ? "Time" : "Reps"}</span>
        <span className="text-center">{weightUnit}</span>
      </div>

      <div className="flex flex-col gap-2">
        {sets.map((_, i) => (
          <div
            key={i}
            className="bg-secondary/40 grid grid-cols-[2rem_1fr_5rem_5rem] items-center gap-2 rounded-md p-1.5"
          >
            <span className="text-muted-foreground text-center font-mono text-sm font-semibold tabular-nums">
              {i + 1}
            </span>
            <span className="text-foreground/80 text-sm">
              {targetLabel(entry, i, weightUnit)}
            </span>
            <AchievedInput
              label={`Set ${i + 1} ${time ? "seconds" : "reps"}`}
              value={entry.achieved?.[repField]?.[i]}
              onChange={(v) => onAchievedChange(groupIdx, exIdx, repField, i, v)}
            />
            <AchievedInput
              label={`Set ${i + 1} weight`}
              value={entry.achieved?.weight?.[i]}
              onChange={(v) => onAchievedChange(groupIdx, exIdx, "weight", i, v)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExerciseEditor;
