import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Greenfield client. Dev server on :3002 (prod app holds :3000, never touch).
// Proxies /api + /socket.io to the shared dev backend on :6970 (firebellyDEVELOPMENT).
// The /api rewrite is load-bearing: the copied src/api builds "/api/login" and the
// backend serves "/login", so we must strip the /api prefix here.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_PROXY_TARGET || "http://localhost:6970";

  return {
    plugins: [react(), tailwindcss()],
    base: "/",
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: true,
      port: 3002,
      proxy: {
        "/api": {
          target,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/socket.io": {
          target,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});
