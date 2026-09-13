"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Building2,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const roleStr = String(user?.role || "").toUpperCase();
  const emailStr = String(user?.email || "").toLowerCase();
  const isAdmin =
    isAuthenticated &&
    user &&
    (roleStr.includes("ADMIN") || emailStr.includes("admin"));

  const navLinks = [
    { name: "Properties", href: "/properties" },
    { name: "Tax History", href: "/tax-history" },
    { name: "Zoning", href: "/zoning" },
    { name: "Flood Zone", href: "/flood-zone" },
    { name: "Permits & Env", href: "/permits-environmental" },
    { name: "Report History", href: "/report-history" },
  ];

  if (isAdmin) {
    navLinks.push({
      name: "Admin Dashboard",
      href: "/admin",
    });
  }

  return (
    <header className="navbar">
      <Link href="/" className="navbar-brand">
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <Building2 size={24} className="text-primary" />
          <span>Diligence Agent</span>
        </span>
      </Link>

      <nav className="navbar-links">
        {isAuthenticated &&
          navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-link ${isActive ? "active" : ""}`}
                style={{
                  color: isActive ? "var(--primary)" : undefined,
                  fontWeight: isActive ? "700" : "600",
                }}
              >
                {link.name}
              </Link>
            );
          })}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {isAuthenticated ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "var(--radius-md)",
                background: isAdmin ? "#EEF2FF" : "var(--primary-light)",
                color: isAdmin ? "#4F46E5" : "var(--primary)",
                fontWeight: "600",
                fontSize: "14px",
                border: isAdmin ? "1px solid #C7D2FE" : "none",
              }}
            >
              {isAdmin ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
              <span>
                {user?.name || "User"}{user?.role ? ` (${user.role})` : ""}
              </span>
            </div>

            <Link href="/profile" className="navbar-btn">
              <User size={16} style={{ marginRight: "6px" }} />
              Profile
            </Link>

            <button
              onClick={logout}
              title="Sign Out"
              style={{
                width: "auto",
                padding: "8px 14px",
                fontSize: "14px",
                background: "transparent",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
                boxShadow: "none",
              }}
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="navbar-link"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <LogIn size={16} />
              Login
            </Link>

            <Link href="/register" className="navbar-btn">
              <UserPlus size={16} style={{ marginRight: "6px" }} />
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}