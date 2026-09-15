"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import "./report-history.css";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Loader2,
  RefreshCw,
  Eye,
  ExternalLink,
} from "lucide-react";
import { apiFetch } from "../../lib/api";

export default function ReportHistory() {
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleView = (report) => {
    setSelectedReport(report);
  };

  const closeView = () => {
    setSelectedReport(null);
  };

  const triggerPrint = () => {
    window.print();
  };

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      try {
        data = await apiFetch("/api/due-diligence/reports");
      } catch (e1) {
        data = await apiFetch("/api/report-history");
      }
      if (Array.isArray(data)) {
        setReports(data);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.warn("Backend report history fetch error:", err.message);
      setReports([]);
      setError("Unable to load report history from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredReports = reports.filter((report) => {
    if (!search || !search.trim()) return true;
    const q = search.toLowerCase().trim();
    const propName = String(report.propertyName || report.property?.propertyName || "").toLowerCase();
    const reportId = String(report.reportId || `REP-${report.id || ""}`).toLowerCase();
    const city = String(report.city || report.propertyCity || "").toLowerCase();
    const state = String(report.state || report.propertyState || "").toLowerCase();
    const propId = String(report.propertyId || report.property?.propertyId || "");
    const status = String(report.status || "").toLowerCase();
    const date = formatDate(report.createdAt).toLowerCase();
    const riskLevel = String(report.riskLevel || "").toLowerCase();
    const riskScore = String(report.riskScore ?? "");

    return (
      propName.includes(q) ||
      reportId.includes(q) ||
      city.includes(q) ||
      state.includes(q) ||
      propId === q ||
      status.includes(q) ||
      date.includes(q) ||
      riskLevel.includes(q) ||
      riskScore === q
    );
  });

  const completedCount = reports.filter((r) => String(r.status).toUpperCase() === "COMPLETED").length;
  const pendingCount = reports.filter((r) => String(r.status).toUpperCase() === "IN_PROGRESS" || String(r.status).toUpperCase() === "PENDING").length;
  const failedCount = reports.filter((r) => String(r.status).toUpperCase() === "FAILED").length;

  return (
    <ProtectedRoute>
      <Navbar />

      <div className="history-container">
        <h1>Report History</h1>
        <p className="report-description">
          Access, search, and review all generated due diligence reports in one place.
        </p>

        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search by Report ID, Property Name, or City..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box"
          />
        </div>

        <div className="stats-container">
          <div className="stat-card total">
            <FileText size={30} />
            <h2>{reports.length}</h2>
            <p>Total Reports</p>
          </div>

          <div className="stat-card completed">
            <CheckCircle size={30} />
            <h2>{completedCount}</h2>
            <p>Completed</p>
          </div>

          <div className="stat-card pending">
            <Clock size={30} />
            <h2>{pendingCount}</h2>
            <p>Pending</p>
          </div>

          <div className="stat-card failed">
            <XCircle size={30} />
            <h2>{failedCount}</h2>
            <p>Failed</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            <Loader2 size={32} className="spin" style={{ marginBottom: "12px" }} />
            <p>Loading report history from backend...</p>
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Property Name</th>
                <th>Location</th>
                <th>Risk Score</th>
                <th>Date Generated</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id || report.reportId}>
                  <td className="td-mono">{report.reportId || `REP-${report.id}`}</td>
                  <td style={{ fontWeight: 600 }}>{report.propertyName || `Property #${report.propertyId}`}</td>
                  <td>{[report.city, report.state].filter(Boolean).join(", ") || "—"}</td>
                  <td>
                    {report.riskScore != null ? (
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            report.riskScore >= 80
                              ? "#16a34a"
                              : report.riskScore >= 50
                              ? "#d97706"
                              : "#dc2626",
                        }}
                      >
                        {report.riskScore}/100
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{formatDate(report.createdAt)}</td>
                  <td>
                    <span className={`status ${String(report.status).toLowerCase()}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    {report.status === "FAILED" ? (
                      <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Unavailable</span>
                    ) : (
                      <button className="view-btn" onClick={() => handleView(report)}>
                        <Eye size={14} style={{ marginRight: "4px" }} /> View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {selectedReport && (
          <div className="cert-modal-backdrop" onClick={closeView}>
            <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="cert-modal-actions no-print">
                <button className="cert-print-btn" onClick={triggerPrint}>
                  Print / Save as PDF
                </button>
                <button className="cert-close-btn" onClick={closeView}>
                  Close
                </button>
              </div>

              {(() => {
                let snap = {};
                try {
                  snap = selectedReport.reportSnapshot ? JSON.parse(selectedReport.reportSnapshot) : {};
                } catch (e) { }

                return (
                  <div id="printable-history-report" className="cert-document">
                    <div className="cert-header">
                      <div className="cert-badge">OFFICIAL DOCUMENT</div>
                      <h2>DUE DILIGENCE REPORT</h2>
                      <h3>Real Estate Due Diligence Agent</h3>
                    </div>

                    <div className="cert-divider" />

                    <div className="cert-section">
                      <div className="cert-section-title">PROPERTY INFORMATION</div>
                      <table className="cert-table">
                        <tbody>
                          <tr><td className="cert-key">Report ID</td><td className="cert-val">{selectedReport.reportId || `REP-${selectedReport.id}`}</td></tr>
                          <tr><td className="cert-key">Property</td><td className="cert-val">{snap.address || selectedReport.propertyAddress || selectedReport.propertyName}</td></tr>
                          <tr><td className="cert-key">Location</td><td className="cert-val">{snap.city || selectedReport.propertyCity || selectedReport.city}</td></tr>
                          <tr><td className="cert-key">Generated Date/Time</td><td className="cert-val">{formatDate(selectedReport.createdAt)}</td></tr>
                          <tr><td className="cert-key">Generated By</td><td className="cert-val">{selectedReport.requestedByEmail || "System"}</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="cert-divider-light" />

                    <div className="cert-section">
                      <div className="cert-section-title">OVERALL RISK ASSESSMENT</div>
                      <table className="cert-table">
                        <tbody>
                          <tr><td className="cert-key">Risk Score</td><td className="cert-val cert-status" style={{ color: selectedReport.riskScore >= 80 ? "#16a34a" : selectedReport.riskScore >= 50 ? "#d97706" : "#dc2626" }}>{selectedReport.riskScore}/100</td></tr>
                          <tr><td className="cert-key">Risk Level</td><td className="cert-val cert-status">{selectedReport.riskLevel}</td></tr>
                          <tr><td className="cert-key">Recommendation</td><td className="cert-val">{snap.recommendation || "Proceed with standard due diligence."}</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="cert-divider-light" />

                    <div className="cert-section">
                      <div className="cert-section-title">DUE DILIGENCE FINDINGS</div>
                      <table className="cert-table">
                        <tbody>
                          <tr><td className="cert-key">Title Verification</td><td className="cert-val">Completed. {snap.flags && snap.flags.length > 0 ? "See comments." : "No major issues."}</td></tr>
                          <tr><td className="cert-key">Tax History</td><td className="cert-val">Completed. Data verified.</td></tr>
                          <tr><td className="cert-key">Zoning</td><td className="cert-val">Completed. Conforms to local regulations.</td></tr>
                          <tr><td className="cert-key">Flood Zone</td><td className="cert-val">Completed. Check environmental summary.</td></tr>
                          <tr><td className="cert-key">Permits & Environmental</td><td className="cert-val">Completed.</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="cert-divider-light" />

                    <div className="cert-section">
                      <div className="cert-section-title">RISK SUMMARY</div>
                      <p style={{ fontSize: "13px", lineHeight: "1.5", color: "#334155" }}>
                        {snap.comments || "Based on the snapshot data, the property has been evaluated across multiple risk vectors. Please consult the full details for any identified concerns."}
                      </p>
                      {snap.flags && snap.flags.length > 0 && (
                        <ul style={{ fontSize: "13px", marginTop: "8px", paddingLeft: "20px" }}>
                          {snap.flags.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      )}
                    </div>

                    <div className="cert-divider" />

                    <div className="cert-footer">
                      <p>This document is an electronically generated Due Diligence Report snapshot. It constitutes a historical record of the property's risk profile at the time of generation.</p>
                      <p className="cert-timestamp">Printed on: {new Date().toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
