import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { workoutApi } from "@/api/workoutApi";
import { updateTraining } from "@/Redux/actions";

const clone = (value) =>
  typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

const toNumber = (raw) => {
  if (raw === "" || raw == null) return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
};

// The `exercise` path is a ref; send only its id so Mongoose casts cleanly.
const buildSavePayload = (draft) => ({
  title: draft.title,
  date: draft.date,
  workoutType: draft.workoutType,
  cardio: draft.cardio,
  category: draft.category,
  complete: Boolean(draft.complete),
  workoutFeedback: draft.workoutFeedback,
  training: (draft.training || []).map((group) =>
    (group || []).map((entry) => ({
      ...entry,
      exercise: entry.exercise?._id || entry.exercise,
      achieved: {
        ...entry.achieved,
        reps: (entry.achieved?.reps || []).map(toNumber),
        weight: (entry.achieved?.weight || []).map(toNumber),
        seconds: (entry.achieved?.seconds || []).map(toNumber),
      },
    }))
  ),
});

/**
 * Loads a single workout (from the store when navigated from the list, else via
 * getTraining) into an editable local draft, exposes per-set achieved edits and
 * a complete toggle, and persists through the copied updateTraining thunk.
 */
export function useWorkoutEditor(workoutId, accountId) {
  const dispatch = useDispatch();

  const storeWorkout = useSelector((state) => {
    const buckets = accountId
      ? [state.workouts[accountId]]
      : Object.values(state.workouts || {});
    for (const bucket of buckets) {
      const found = bucket?.workouts?.find((w) => w._id === workoutId);
      if (found) return found;
    }
    return null;
  });

  const [draft, setDraft] = useState(null);
  const [dirty, setDirty] = useState(false);
  // idle | loading | saving | saved | error
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  // Seed the draft: prefer store data, otherwise fetch the populated training.
  useEffect(() => {
    if (draft) return;
    if (storeWorkout) {
      setDraft(clone(storeWorkout));
      return;
    }
    let active = true;
    setStatus("loading");
    workoutApi
      .getTraining({ _id: workoutId, client: accountId || null })
      .then((data) => {
        if (!active) return;
        if (data?.error || !data?._id) {
          setStatus("error");
          setError(data?.error || "Workout not found.");
          return;
        }
        setDraft(clone(data));
        setStatus("idle");
      })
      .catch(() => {
        if (active) {
          setStatus("error");
          setError("Unable to load this workout.");
        }
      });
    return () => {
      active = false;
    };
  }, [draft, storeWorkout, workoutId, accountId]);

  const setAchieved = useCallback((groupIdx, exIdx, field, setIdx, raw) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      const entry = next.training[groupIdx][exIdx];
      const arr = (entry.achieved[field] ||= []);
      while (arr.length <= setIdx) arr.push(0);
      arr[setIdx] = raw === "" ? "" : raw;
      entry.achieved.sets = entry.goals?.sets ?? arr.length;
      return next;
    });
    setStatus("idle");
    setDirty(true);
  }, []);

  const setComplete = useCallback((value) => {
    setDraft((prev) => (prev ? { ...prev, complete: Boolean(value) } : prev));
    setStatus("idle");
    setDirty(true);
  }, []);

  const save = useCallback(async () => {
    if (!draft) return;
    setStatus("saving");
    setError("");
    const saved = await dispatch(updateTraining(workoutId, buildSavePayload(draft)));
    if (!saved) {
      setStatus("error");
      setError("Couldn’t save your changes. Please try again.");
      return;
    }
    // Re-seed from the server's populated response so the draft matches the store.
    setDraft(clone(saved));
    setDirty(false);
    setStatus("saved");
  }, [dispatch, draft, workoutId]);

  return useMemo(
    () => ({ workout: draft, dirty, status, error, setAchieved, setComplete, save }),
    [draft, dirty, status, error, setAchieved, setComplete, save]
  );
}

export default useWorkoutEditor;
