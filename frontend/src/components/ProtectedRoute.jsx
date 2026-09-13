"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (
      allowedRoles &&
      allowedRoles.length > 0 &&
      user?.role &&
      !allowedRoles.includes(user.role)
    ) {
      router.push("/properties");
    }
  }, [
    isAuthenticated,
    loading,
    user,
    allowedRoles,
    router,
    pathname,
  ]);

  if (loading || !isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg-main)",
          color: "var(--text-main)",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    user?.role &&
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}