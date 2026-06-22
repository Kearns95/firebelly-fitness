import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicOnlyRoute from "@/routes/PublicOnlyRoute";
import SocketProvider from "@/app/providers/SocketProvider";
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "@/layouts/AppLayout";

import LoginPage from "@/pages/auth/LoginPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import SchedulePage from "@/pages/dashboard/SchedulePage";
import WorkoutsPage from "@/pages/dashboard/WorkoutsPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      {/* Public, auth-only (logged-in users bounce to app) */}
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
      </Route>

      {/* Email verification — reachable while logged out, no guard */}
      <Route element={<AuthLayout />}>
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* Protected app */}
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <SocketProvider>
              <AppLayout />
            </SocketProvider>
          }
        >
          <Route index element={<SchedulePage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      {/* Unknown public path */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
