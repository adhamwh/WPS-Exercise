import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

function GuestRoute() {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="auth-loading" role="status" aria-live="polite">
        <span className="auth-loading__mark" aria-hidden="true" />
        <span>Checking your session…</span>
      </div>
    );
  }

  return user ? <Navigate to="/admin" replace /> : <Outlet />;
}

export default GuestRoute;
