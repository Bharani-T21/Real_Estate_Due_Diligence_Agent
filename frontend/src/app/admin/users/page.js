"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { apiFetch } from "../../../lib/api";
import {
  Users,
  Search,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Loader2,
  AlertCircle,
  UserCog,
} from "lucide-react";

const ROLE_COLORS = {
  ADMIN: { bg: "#ede9fe", color: "#6d28d9" },
  BUYER: { bg: "#dbeafe", color: "#1d4ed8" },
  AGENT: { bg: "#dcfce7", color: "#15803d" },
  LEGAL_REVIEWER: { bg: "#fef9c3", color: "#a16207" },
  BANK: { bg: "#ffedd5", color: "#c2410c" },
  USER: { bg: "#f1f5f9", color: "#475569" },
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/api/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId, userName) => {
    if (!confirm(`Delete user "${userName || userId}"? This cannot be undone.`)) return;
    setDeletingId(userId);
    try {
      await apiFetch(`/api/users/${userId}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
      setSuccessMsg(`User "${userName || userId}" deleted.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      !term ||
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.role?.toLowerCase().includes(term)
    );
  });

  const roleStyle = (role) =>
    ROLE_COLORS[role?.toUpperCase()] || { bg: "#f1f5f9", color: "#475569" };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main, #f8fafc)" }}>
        <Navbar />
        <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justify: "space-between",
              marginBottom: "32px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: "var(--primary, #5e5af5)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justify: "center",
                  color: "white",
                }}
              >
                <UserCog size={22} />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>
                  User Management
                </h1>
                <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                  Admin-only: manage all registered users and roles
                </p>
              </div>
            </div>
            <button
              onClick={fetchUsers}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                background: "white",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>

          {successMsg && (
            <div
              style={{
                background: "#dcfce7",
                color: "#15803d",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "16px",
                border: "1px solid #bbf7d0",
              }}
            >
              {successMsg}
            </div>
          )}

          <div style={{ position: "relative", marginBottom: "24px" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 42px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "15px",
                background: "white",
                boxSizing: "border-box",
              }}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
              <p>Loading users from backend...</p>
            </div>
          ) : error ? (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "16px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertCircle size={20} /> {error}
            </div>
          ) : (
            <div
              style={{
                background: "white",
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      {["ID", "Name", "Email", "Role", "Actions"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "14px 20px",
                            textAlign: "left",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#64748b",
                            textTransform: "uppercase",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}
                        >
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((u, i) => {
                        const rs = roleStyle(u.role);
                        return (
                          <tr
                            key={u.userId}
                            style={{
                              borderBottom: "1px solid #f1f5f9",
                              background: i % 2 === 0 ? "white" : "#fafafa",
                            }}
                          >
                            <td
                              style={{
                                padding: "14px 20px",
                                fontSize: "13px",
                                color: "#64748b",
                                fontFamily: "monospace",
                              }}
                            >
                              #{u.userId}
                            </td>
                            <td
                              style={{
                                padding: "14px 20px",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#0f172a",
                              }}
                            >
                              {u.name || "—"}
                            </td>
                            <td
                              style={{
                                padding: "14px 20px",
                                fontSize: "14px",
                                color: "#334155",
                              }}
                            >
                              {u.email}
                            </td>
                            <td style={{ padding: "14px 20px" }}>
                              <span
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: "20px",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  background: rs.bg,
                                  color: rs.color,
                                }}
                              >
                                {u.role || "USER"}
                              </span>
                            </td>
                            <td style={{ padding: "14px 20px" }}>
                              {u.role?.toUpperCase() !== "ADMIN" ? (
                                <button
                                  onClick={() => handleDelete(u.userId, u.name)}
                                  disabled={deletingId === u.userId}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "6px 12px",
                                    background: "#fee2e2",
                                    color: "#dc2626",
                                    border: "1px solid #fecaca",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                  }}
                                >
                                  <Trash2 size={14} />{" "}
                                  {deletingId === u.userId ? "Deleting..." : "Delete"}
                                </button>
                              ) : (
                                <span
                                  style={{
                                    fontSize: "12px",
                                    color: "#94a3b8",
                                    fontStyle: "italic",
                                  }}
                                >
                                  Protected
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
