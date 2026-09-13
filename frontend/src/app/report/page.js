"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import {
  FileText,
  Building2,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ChevronDown,
  Printer,
  RefreshCw,
  User,
  DollarSign,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { apiFetch } from "../../lib/api";
import "./report.css";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const RISK_META = {
  CLEAR: {
    cls: "risk-clear",
    icon: <CheckCircle2 size={20} />,
    label: "Clear — No Issues Detected",
    desc: "This property has no active liens, violations, or delinquent taxes.",
  },
  CONCERNS_FOUND: {
    cls: "risk-concerns",
    icon: <AlertTriangle size={20} />,
    label: "Concerns Found",
    desc: "There are active medium-severity records that require review.",
  },
  HIGH_RISK: {
    cls: "risk-danger",
    icon: <XCircle size={20} />,
    label: "High Risk",
    desc: "Active high-severity records or delinquent taxes detected. Proceed with caution.",
  },
};

// ─── Report Content (inner component that uses useSearchParams) ──────────────
function ReportContent() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("propertyId");

  const [properties, setProperties] = useState([]);
  const [selectedId, setSelectedId] = useState(preselectedId || "");
  const [report, setReport] = useState(null);
  const [loadingProps, setLoadingProps] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [errorProps, setErrorProps] = useState(null);
  const [errorReport, setErrorReport] = useState(null);

  // Load property list
  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch("/api/properties");
        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        setErrorProps(err.message);
      } finally {
        setLoadingProps(false);
      }
    };
    load();
  }, []);

  // Auto-load if preselected
  useEffect(() => {
    if (preselectedId && !report) {
      fetchReport(preselectedId);
    }
  }, [preselectedId]);

  const fetchReport = async (id) => {
    if (!id) return;
    setLoadingReport(true);
    setErrorReport(null);
    setReport(null);
    try {
      const data = await apiFetch(`/api/public-records/${id}/combined-report`);
      setReport(data);
    } catch (err) {
      setErrorReport(err.message);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleGenerate = () => fetchReport(selectedId);

  const risk = report ? RISK_META[report.overallRiskFlag] || RISK_META["CLEAR"] : null;

  return (
    <div className="rp-page">
      <header className="rp-header">
        <div className="rp-header-icon">
          <FileText size={28} />
        </div>
        <div>
          <h1 className="rp-title">Due Diligence Report</h1>
          <p className="rp-subtitle">
            Select a property to generate a comprehensive public records report.
          </p>
        </div>
      </header>

      {/* Property Selector */}
      <div className="rp-selector-card">
        <div className="rp-selector-row">
          <div className="rp-select-wrapper">
            <Building2 size={18} className="rp-select-icon" />
            {loadingProps ? (
              <div className="rp-select-loading">
                <Loader2 size={16} className="spin" />
                Loading properties…
              </div>
            ) : errorProps ? (
              <div className="rp-select-error">{errorProps}</div>
            ) : (
              <select
                id="property-select"
                className="rp-select"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                <option value="">Select a property…</option>
                {properties.map((p) => (
                  <option key={p.propertyId} value={p.propertyId}>
                    {p.propertyName || `Property #${p.propertyId}`} —{" "}
                    {[p.city, p.state].filter(Boolean).join(", ")}
                  </option>
                ))}
              </select>
            )}
            <ChevronDown size={16} className="rp-select-chevron" />
          </div>

          <button
            className="rp-generate-btn"
            onClick={handleGenerate}
            disabled={!selectedId || loadingReport}
          >
            {loadingReport ? (
              <>
                <Loader2 size={16} className="spin" />
                Generating…
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Generate Report
              </>
            )}
          </button>

          {report && (
            <button
              className="rp-print-btn"
              onClick={() => window.print()}
            >
              <Printer size={16} />
              Print
            </button>
          )}
        </div>
      </div>

      {/* Report Error */}
      {errorReport && (
        <div className="rp-error">
          <AlertTriangle size={20} />
          <div>
            <strong>Failed to generate report</strong>
            <p>{errorReport}</p>
          </div>
        </div>
      )}

      {/* Report Output */}
      {report && risk && (
        <div className="rp-report" id="printable-report">
          {/* Report Title Bar */}
          <div className="rp-report-topbar">
            <div>
              <p className="rp-report-label">DUE DILIGENCE REPORT</p>
              <h2 className="rp-report-name">
                {report.propertyAddress}, {report.propertyCity},{" "}
                {report.propertyState} {report.propertyZipCode}
              </h2>
            </div>
            <div className={`rp-risk-badge ${risk.cls}`}>
              {risk.icon}
              {risk.label}
            </div>
          </div>

          {/* Risk Summary Banner */}
          <div className={`rp-risk-banner ${risk.cls}`}>
            <div className="rp-risk-icon">{risk.icon}</div>
            <div>
              <strong>Overall Assessment: {risk.label}</strong>
              <p>{risk.desc}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="rp-stats-row">
            <div className="rp-stat-card">
              <User size={20} />
              <div>
                <span className="rp-stat-num">{report.totalOwnershipRecords}</span>
                <span className="rp-stat-label">Ownership Records</span>
              </div>
            </div>
            <div className="rp-stat-card">
              <DollarSign size={20} />
              <div>
                <span className="rp-stat-num">{report.totalTaxRecords}</span>
                <span className="rp-stat-label">Tax Records</span>
              </div>
            </div>
            <div className="rp-stat-card">
              <FileText size={20} />
              <div>
                <span className="rp-stat-num">{report.totalPublicRecords}</span>
                <span className="rp-stat-label">Public Records</span>
              </div>
            </div>
            <div className="rp-stat-card rp-stat-alert">
              <AlertCircle size={20} />
              <div>
                <span className="rp-stat-num">{report.activePublicRecordsCount}</span>
                <span className="rp-stat-label">Active Issues</span>
              </div>
            </div>
          </div>

          {/* Ownership History */}
          {report.ownershipHistory?.length > 0 && (
            <section className="rp-section">
              <h3 className="rp-section-title">
                <User size={18} />
                Ownership History
              </h3>
              <div className="rp-table-wrapper">
                <table className="rp-table">
                  <thead>
                    <tr>
                      <th>Owner</th>
                      <th>Type</th>
                      <th>Acquired</th>
                      <th>Released</th>
                      <th>Purchase Price</th>
                      <th>Deed Ref</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.ownershipHistory.map((r, i) => (
                      <tr key={i} className={r.currentOwner ? "row-highlight" : ""}>
                        <td className="fw-600">{r.ownerName || "—"}</td>
                        <td>{r.ownerType || "—"}</td>
                        <td>{formatDate(r.acquisitionDate)}</td>
                        <td>{r.releaseDate ? formatDate(r.releaseDate) : "Present"}</td>
                        <td>
                          {r.purchasePrice != null
                            ? `$${r.purchasePrice.toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="td-mono">{r.deedReference || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Tax History */}
          {report.taxHistory?.length > 0 && (
            <section className="rp-section">
              <h3 className="rp-section-title">
                <DollarSign size={18} />
                Tax History
              </h3>
              <div className="rp-table-wrapper">
                <table className="rp-table">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Assessed Value</th>
                      <th>Market Value</th>
                      <th>Tax Amount</th>
                      <th>Tax Rate</th>
                      <th>Payment Status</th>
                      <th>Payment Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.taxHistory.map((r, i) => (
                      <tr key={i}>
                        <td className="fw-600">{r.taxYear}</td>
                        <td>
                          {r.assessedValue != null
                            ? `$${r.assessedValue.toLocaleString()}`
                            : "—"}
                        </td>
                        <td>
                          {r.marketValue != null
                            ? `$${r.marketValue.toLocaleString()}`
                            : "—"}
                        </td>
                        <td>
                          {r.taxAmount != null
                            ? `$${r.taxAmount.toLocaleString()}`
                            : "—"}
                        </td>
                        <td>{r.taxRate != null ? `${r.taxRate}%` : "—"}</td>
                        <td>
                          <span
                            className={`tax-status ${
                              r.paymentStatus === "PAID"
                                ? "tax-paid"
                                : r.paymentStatus === "DELINQUENT"
                                ? "tax-delinquent"
                                : "tax-pending"
                            }`}
                          >
                            {r.paymentStatus || "—"}
                          </span>
                        </td>
                        <td>{r.paymentDate || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Public Records */}
          {report.publicRecords?.length > 0 && (
            <section className="rp-section">
              <h3 className="rp-section-title">
                <AlertCircle size={18} />
                Public Records & Liens
              </h3>
              <div className="rp-table-wrapper">
                <table className="rp-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th>Filed</th>
                      <th>Authority</th>
                      <th>Ref #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.publicRecords.map((r, i) => (
                      <tr key={i}>
                        <td>
                          <span className="rp-tag">{r.recordType || "—"}</span>
                        </td>
                        <td>{r.title || r.description || "—"}</td>
                        <td>
                          <span
                            className={`sev-badge sev-${(
                              r.severity || "low"
                            ).toLowerCase()}`}
                          >
                            {r.severity || "—"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`st-badge ${
                              r.status === "ACTIVE" ? "st-active" : "st-resolved"
                            }`}
                          >
                            {r.status || "—"}
                          </span>
                        </td>
                        <td>{formatDate(r.filingDate)}</td>
                        <td>{r.authority || "—"}</td>
                        <td className="td-mono">{r.referenceNumber || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Footer */}
          <div className="rp-footer">
            <ShieldCheck size={16} />
            Report generated by Diligence Agent · Property ID #{report.propertyId} ·{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page Export ─────────────────────────────────────────────────────────────
export default function ReportPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-main)",
      }}
    >
      <Navbar />
      <Suspense fallback={<div className="rp-loading"><Loader2 size={32} className="spin" /></div>}>
        <ReportContent />
      </Suspense>
    </div>
  );
}

