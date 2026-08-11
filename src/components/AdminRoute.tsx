import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="route-loader">
        <div className="route-loader-spinner" />
        <span>Loading…</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  if (!user.isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
