import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { useSocket } from "@/app/providers/SocketProvider";
import {
  requestClients,
  upsertWorkout,
  removeWorkouts,
} from "@/Redux/actions";

/**
 * App-level realtime wiring for workouts, mirroring the legacy App.jsx:
 *  - trainers load their client relationships (also feeds the workout picker)
 *  - subscribe to every workout "account" the user can see (self + clients +
 *    any already-loaded buckets) so cross-device edits stream in
 *  - apply workoutUpdated / workoutDeleted to the store
 *
 * Mount inside the protected subtree (under SocketProvider) so useSocket()
 * resolves to the live socket.
 */
export function useWorkoutRealtime() {
  const dispatch = useDispatch();
  const socket = useSocket();
  const isTrainer = useSelector((state) => state.user?.isTrainer);

  const accountIds = useSelector((state) => {
    const ids = new Set();
    if (state.user?._id) ids.add(String(state.user._id));
    Object.keys(state.workouts || {}).forEach((id) => id && ids.add(String(id)));
    (state.clients || []).forEach((rel) => {
      const clientId = rel?.client?._id || rel?.client;
      if (rel?.accepted && clientId) ids.add(String(clientId));
    });
    return Array.from(ids).sort();
  }, shallowEqual);

  // Trainers: load client relationships once.
  useEffect(() => {
    if (isTrainer) dispatch(requestClients());
  }, [dispatch, isTrainer]);

  // Apply streamed workout mutations.
  useEffect(() => {
    if (!socket) return undefined;

    const handleUpdated = (payload) => {
      const workout = payload?.workout || payload?.updatedWorkout;
      if (!workout?._id) return;
      dispatch(upsertWorkout(workout, payload.accountId));
    };
    const handleDeleted = (payload) => {
      if (!payload?.accountId || !payload?.workoutId) return;
      dispatch(removeWorkouts(payload.accountId, [payload.workoutId]));
    };

    socket.on("workoutUpdated", handleUpdated);
    socket.on("workoutDeleted", handleDeleted);
    return () => {
      socket.off("workoutUpdated", handleUpdated);
      socket.off("workoutDeleted", handleDeleted);
    };
  }, [dispatch, socket]);

  // Join/leave each account room as the visible set changes.
  useEffect(() => {
    if (!socket || accountIds.length === 0) return undefined;
    accountIds.forEach((accountId) => socket.emit("joinWorkoutAccount", { accountId }));
    return () => {
      accountIds.forEach((accountId) =>
        socket.emit("leaveWorkoutAccount", { accountId })
      );
    };
  }, [socket, accountIds]);
}

export default useWorkoutRealtime;
