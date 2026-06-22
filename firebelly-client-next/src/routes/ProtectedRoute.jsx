import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/** Gates protected routes. Bootstrap has already settled, so this is synchronous. */
export function ProtectedRoute() {
  const userId = useSelector((state) => state.user?._id);
  const location = useLocation();

  if (!userId) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
