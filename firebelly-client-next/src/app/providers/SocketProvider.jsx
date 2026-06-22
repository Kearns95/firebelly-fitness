import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { createSocket } from "@/lib/socket";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

/**
 * Structural slot for realtime. Builds the socket once a user is present and
 * tears it down on logout. Event listeners (workoutUpdated, liveTrainingUpdate,
 * presence, …) are wired by the features that need them — deferred past the
 * first milestone.
 */
export function SocketProvider({ children }) {
  const userId = useSelector((state) => state.user?._id);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return undefined;
    const next = createSocket();
    setSocket(next);
    return () => {
      next.disconnect();
      setSocket(null);
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export default SocketProvider;
