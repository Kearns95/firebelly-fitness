import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

import { requestScheduleRange } from "@/Redux/actions";

/**
 * Loads the signed-in user's schedule events for a given week and reads them
 * back from the store. With no trainer/client override, the schedule thunk keys
 * results under `${user._id}:all`, so we read the same scope here.
 */
export function useScheduleRange(anchorDate) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user?._id);

  // Stable week window; `anchorDate` lets callers move weeks later.
  const [weekStart] = useState(() =>
    dayjs(anchorDate || undefined).startOf("week")
  );
  const startISO = useMemo(() => weekStart.toISOString(), [weekStart]);
  const endISO = useMemo(() => weekStart.add(7, "day").toISOString(), [weekStart]);

  const scopeKey = userId ? `${userId}:all` : null;
  const scope = useSelector((state) =>
    scopeKey ? state.scheduleEvents[scopeKey] : undefined
  );

  useEffect(() => {
    if (!userId) return;
    dispatch(requestScheduleRange({ startDate: startISO, endDate: endISO }));
  }, [dispatch, userId, startISO, endISO]);

  const events = useMemo(() => {
    const list = scope?.events ?? [];
    return [...list].sort(
      (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
    );
  }, [scope]);

  return {
    loading: scope === undefined,
    events,
    weekStart,
    weekEnd: weekStart.add(6, "day"),
  };
}

export default useScheduleRange;
