"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { apiFetch } from "../../lib/api";
import "./audit-logs.css";

import {
  ClipboardList,
  CheckCircle,
  XCircle,
  CalendarClock,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const PAGE_SIZE = 20;

  const fetchLogs = async (pageNum = 0) => {
    try {
      setLoading(true);
      setError("");
      const response = await apiFetch(`/api/admin/audit-logs?page=${pageNum}&size=${PAGE_SIZE}`);

      if (response && Array.isArray(response.content)) {
        setLogs(response.content);
        setPage(response.number ?? pageNum);
        setTotalPages(response.totalPages ?? 1);
        setTotalElements(response.totalElements ?? response.content.length);
      } else if (Array.isArray(response)) {
        setLogs(response);
        setPage(0);
        setTotalPages(1);
        setTotalElements(response.length);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError(err.message || "Unable to load audit logs. Please try again.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const formatTimestamp = (createdAt) => {
    if (!createdAt) return "—";
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) {
      return createdAt;
    }
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatus = (outcome) => {
    if (!outcome) return "Unknown";
    const value = outcome.toUpperCase();
    if (value === "SUCCESS") return "Success";
    if (value === "FAILURE" || value === "FAILED") return "Failed";
    return outcome;
  };

  const filteredLogs = logs.filter((log) => {
    const term = search.trim().toLowerCase();
    const status = getStatus(log.outcome);

    const matchesSearch =
      term === "" ||
      String(log.id || "").toLowerCase().includes(term) ||
      String(log.actorEmail || "").toLowerCase().includes(term) ||
      String(log.action || "").toLowerCase().includes(term) ||
      String(log.entityType || "").toLowerCase().includes(term) ||
      String(log.details || "").toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const successfulLogs = logs.filter(
    (log) => String(log.outcome || "").toUpperCase() === "SUCCESS"
  ).length;

  const failedLogs = logs.filter((log) => {
    const outcome = String(log.outcome || "").toUpperCase();
    return outcome === "FAILURE" || outcome === "FAILED";
  }).length;

  const today = new Date();
  const todaysLogsCount = logs.filter((log) => {
    if (!log.createdAt) return false;
    const logDate = new Date(log.createdAt);
    return (
      logDate.getDate() === today.getDate() &&
      logDate.getMonth() === today.getMonth() &&
      logDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const handlePrevious = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handleRefresh = () => {
    fetchLogs(page);
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <Navbar />

      <div className="audit-container">
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "8px",
          }}
        >
          <div>
            <h1>Audit Logs</h1>
            <p className="audit-description">
              Monitor and review all user activities and system events for security and compliance.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 16px",
              width: "auto",
              flexShrink: 0,
              color: "var(--text-main)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--bg-card)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <RefreshCw size={17} className={loading ? "spin" : ""} />
            Refresh
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div
          className="search-container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by Log ID, User, Action, Entity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-box"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--text-main)",
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 16px",
              marginBottom: "20px",
              borderRadius: "10px",
              background: "#fef2f2",
              color: "#b91c1c",
            }}
          >
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* STATS */}
        <div className="stats-container">
          <div className="stat-card total">
            <ClipboardList size={30} />
            <h2>{totalElements}</h2>
            <p>Total Logs</p>
          </div>

          <div className="stat-card success">
            <CheckCircle size={30} />
            <h2>{successfulLogs}</h2>
            <p>Successful Events</p>
          </div>

          <div className="stat-card failed">
            <XCircle size={30} />
            <h2>{failedLogs}</h2>
            <p>Failed Events</p>
          </div>

          <div className="stat-card today">
            <CalendarClock size={30} />
            <h2>{todaysLogsCount}</h2>
            <p>Today's Logs</p>
          </div>
        </div>

        {/* TABLE */}
        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: "50px", textAlign: "center" }}>
              <RefreshCw size={28} className="spin" />
              <p>Loading audit logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ padding: "50px", textAlign: "center" }}>
              <ClipboardList size={40} />
              <h3>No audit logs found</h3>
              <p>
                {search || statusFilter !== "All"
                  ? "No logs match your search or filter."
                  : "There are no audit logs available."}
              </p>
            </div>
          ) : (
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => {
                  const status = getStatus(log.outcome);
                  return (
                    <tr key={log.id}>
                      <td>#{log.id}</td>
                      <td>{log.actorEmail || "System"}</td>
                      <td>{log.action || "—"}</td>
                      <td>{log.entityType || "—"}</td>
                      <td>{formatTimestamp(log.createdAt)}</td>
                      <td>
                        <span className={`status ${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              padding: "10px 0",
            }}
          >
            <span>
              Page {page + 1} of {totalPages}
            </span>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handlePrevious}
                disabled={page === 0}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "8px 14px",
                  borderRadius: "7px",
                  border: "1px solid var(--border)",
                  cursor: page === 0 ? "not-allowed" : "pointer",
                }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={page >= totalPages - 1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "8px 14px",
                  borderRadius: "7px",
                  border: "1px solid var(--border)",
                  cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
                }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
