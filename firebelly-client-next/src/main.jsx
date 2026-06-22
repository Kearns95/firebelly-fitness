import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "@/styles/tailwind.css";
import { store } from "@/Redux/store";
import { initializeAuthTokenSync } from "@/api/client";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { AuthBootstrap } from "@/app/AuthBootstrap";
import App from "@/app/App";

// Wire cross-tab token sync (BroadcastChannel) once, before first render.
initializeAuthTokenSync();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthBootstrap>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthBootstrap>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
