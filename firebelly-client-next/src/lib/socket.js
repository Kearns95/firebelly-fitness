import { io } from "socket.io-client";

import { getAccessToken, serverURL } from "@/api/client";

/**
 * Resolve the socket origin. In dev `serverURL` is "/api", so we connect to the
 * page origin and let the Vite proxy forward /socket.io (ws) to the backend.
 */
export const getSocketURL = () => {
  if (serverURL === "/api" || serverURL === "/") {
    return typeof window !== "undefined" ? window.location.origin : undefined;
  }
  return serverURL;
};

export const createSocket = () =>
  io(getSocketURL(), {
    path: "/socket.io",
    auth: { token: getAccessToken() },
    transports: ["websocket"],
    upgrade: false,
  });
