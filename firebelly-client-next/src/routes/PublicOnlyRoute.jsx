import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/** Keeps logged-in users out of /login and /signup. */
export function PublicOnlyRoute() {
  const userId = useSelector((state) => state.user?._id);
  const location = useLocation();
  const dest = location.state?.from?.pathname || "/";

  if (userId) return <Navigate to={dest} replace />;
  return <Outlet />;
}

export default PublicOnlyRoute;
