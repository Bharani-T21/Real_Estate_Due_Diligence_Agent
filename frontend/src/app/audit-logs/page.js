"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import "./audit-logs.css";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  CalendarClock,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { apiFetch } from "../../lib/api";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 20;

  const fetchLogs = async (pageNum = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/admin/audit-logs?page=${pageNum}&size=${PAGE_SIZE}`);
      // Spring Page response has content, totalPages, totalElements
      if (data && Array.isArray(data.content)) {
        setLogs(data.content);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || data.content.length);
      } else if (Array.isArray(data)) {
        setLogs(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        setLogs([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const handleRefresh = () => {
    setPage(0);
    fetchLogs(0);
  };

  // Filter in-memory for current page results
  const filtered = logs.filter((log) => {
    const term = search.toLowerCase();
    return (
      !term ||
      log.actorEmail?.toLowerCase().includes(term) ||
      log.action?.toLowerCase().includes(term) ||
      log.entityType?.toLowerCase().includes(term) ||
      log.outcome?.toLowerCase().includes(term)
    );
  });

  const getStatusIcon = (outcome) => {
    if (!outcome) return null;
    if (outcome.toUpperCase() === "SUCCESS") return <CheckCircle className="icon-success" size={16} />;
    if (outcome.toUpperCase() === "FAILURE" || outcome.toUpperCase() === "FAILED") return <XCircle className="icon-failure" size={16} />;
    return <CalendarClock size={16} className="icon-pending" />;
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "—";
    try { return new Date(ts).toLocaleString("en-IN"); } catch { return ts; }
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main, #f8fafc)" }}>
        <Navbar />
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", background: "var(--primary, #5e5af5)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                <ClipboardList size={22} />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>Audit Logs</h1>
                <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                  Real-time system audit trail from backend — {totalElements} total records
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer", fontSize: "14px" }}
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: "24px" }}>
            <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Filter logs by actor, action, entity type, or outcome…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 16px 12px 42px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "15px", background: "white", boxSizing: "border-box" }}
            />
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
              <p>Loading audit logs from backend…</p>
            </div>
          ) : error ? (
            <div style={{ background: "#fee2e2", color: "#991b1b", padding: "16px", borderRadius: "10px", display: "flex", gap: "10px" }}>
              <AlertCircle size={20} />
              <div>
                <strong>Failed to load audit logs:</strong> {error}
                <br /><small>Make sure you are logged in as an Admin.</small>
              </div>
            </div>
          ) : (
            <>
              <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                        {["Timestamp", "Actor", "Role", "Action", "Entity", "Entity ID", "Outcome", "IP Address"].map((h) => (
                          <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                            {logs.length === 0 ? "No audit log entries found in the database." : "No logs match your search filter."}
                          </td>
                        </tr>
                      ) : filtered.map((log, i) => (
                        <tr key={log.id || i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                          <td style={{ padding: "12px 16px", fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>{formatTimestamp(log.createdAt)}</td>
                          <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{log.actorEmail || "—"}</td>
                          <td style={{ padding: "12px 16px", fontSize: "12px", color: "#475569" }}>{log.actorRole || "—"}</td>
                          <td style={{ padding: "12px 16px", fontSize: "13px", color: "#334155" }}>{log.action || "—"}</td>
                          <td style={{ padding: "12px 16px", fontSize: "12px", color: "#64748b" }}>{log.entityType || "—"}</td>
                          <td style={{ padding: "12px 16px", fontSize: "12px", color: "#64748b", fontFamily: "monospace" }}>{log.entityId || "—"}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "4px 10px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: 700,
                              background: log.outcome?.toUpperCase() === "SUCCESS" ? "#dcfce7" : "#fee2e2",
                              color: log.outcome?.toUpperCase() === "SUCCESS" ? "#15803d" : "#dc2626",
                            }}>
                              {getStatusIcon(log.outcome)}
                              {log.outcome || "—"}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", fontSize: "12px", color: "#64748b", fontFamily: "monospace" }}>{log.ipAddress || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "24px" }}>
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    style={{ display: "flex", alignItems: "center", gap: "4px", padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: page === 0 ? "not-allowed" : "pointer", opacity: page === 0 ? 0.5 : 1, fontSize: "14px" }}
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <span style={{ fontSize: "14px", color: "#475569" }}>
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    style={{ display: "flex", alignItems: "center", gap: "4px", padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", opacity: page >= totalPages - 1 ? 0.5 : 1, fontSize: "14px" }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
