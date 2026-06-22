import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

import { requestWorkoutsByRange } from "@/Redux/actions";

const LOOKBACK_DAYS = 13; // ~2 weeks of seeded workouts through today

const clientLabel = (rel) => {
  const c = rel?.client || {};
  const name = [c.firstName, c.lastName].filter(Boolean).join(" ");
  return name || c.username || c.email || "Client";
};

/**
 * Resolves which account's workouts to show, then loads them:
 *  - Trainers pick from their accepted clients (workouts live under each
 *    client's account id).
 *  - Clients see their own workouts (account id = their own user id).
 *
 * `requestWorkoutsByRange(start, end, accountId)` writes to
 * `state.workouts[accountId]`, which we read back here.
 */
export function useClientWorkouts() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isTrainer = Boolean(user?.isTrainer);

  // `requestClients()` is dispatched app-wide by useWorkoutRealtime.
  const clientRels = useSelector((state) => state.clients);
  const clients = useMemo(
    () =>
      (clientRels || [])
        .filter((rel) => rel?.accepted && (rel.client?._id || rel.client))
        .map((rel) => ({
          id: String(rel.client?._id || rel.client),
          label: clientLabel(rel),
        })),
    [clientRels]
  );

  const [selectedClientId, setSelectedClientId] = useState(null);

  // Default the trainer to their first client once clients load.
  useEffect(() => {
    if (!isTrainer) return;
    if (selectedClientId && clients.some((c) => c.id === selectedClientId)) return;
    if (clients.length) setSelectedClientId(clients[0].id);
  }, [isTrainer, clients, selectedClientId]);

  // The account whose workouts we load: chosen client (trainer) or self (client).
  const accountId = isTrainer ? selectedClientId : user?._id;

  const rangeEnd = useMemo(() => dayjs().format("YYYY-MM-DD"), []);
  const rangeStart = useMemo(
    () => dayjs().subtract(LOOKBACK_DAYS, "day").format("YYYY-MM-DD"),
    []
  );

  useEffect(() => {
    if (!accountId) return;
    // Trainers pass the client id; clients pass null (defaults to self).
    dispatch(requestWorkoutsByRange(rangeStart, rangeEnd, isTrainer ? accountId : null));
  }, [dispatch, accountId, isTrainer, rangeStart, rangeEnd]);

  const bucket = useSelector((state) =>
    accountId ? state.workouts[accountId] : undefined
  );

  const workouts = useMemo(() => {
    const list = bucket?.workouts ?? [];
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [bucket]);

  return {
    isTrainer,
    clients,
    selectedClientId,
    setSelectedClientId,
    accountId,
    rangeStart,
    rangeEnd,
    // No client chosen yet (trainer with clients still loading) vs fetched.
    loading: Boolean(accountId) && bucket === undefined,
    needsClient: isTrainer && clients.length === 0,
    workouts,
  };
}

export default useClientWorkouts;
