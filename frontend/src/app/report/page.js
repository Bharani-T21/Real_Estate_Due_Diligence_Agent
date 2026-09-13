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
  CheckCircle2,
  ChevronDown,
  Printer,
  RefreshCw,
  User,
  Calendar,
  Loader2,
  Download,
} from "lucide-react";
import { apiFetch } from "../../lib/api";
import "./report.css";

function formatDate(date) {
  if (!date) return "—";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function formatDateTime(date) {
  if (!date) return "—";

  try {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

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

  // =========================================================
  // LOAD PROPERTIES
  // =========================================================
  useEffect(() => {
    const loadProperties = async () => {
      console.log("Loading properties...");

      try {
        const data = await apiFetch("/api/properties");

        console.log("Properties response:", data);

        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load properties:", err);

        setErrorProps(
          err?.message || "Failed to load properties."
        );
      } finally {
        setLoadingProps(false);
      }
    };

    loadProperties();
  }, []);

  // =========================================================
  // PRESELECT PROPERTY
  // =========================================================
  useEffect(() => {
    if (preselectedId) {
      console.log("Preselected property ID:", preselectedId);
      setSelectedId(preselectedId);
    }
  }, [preselectedId]);

  // =========================================================
  // GENERATE REPORT
  // =========================================================
  const fetchReport = async (propertyId) => {
    console.log("=================================");
    console.log("GENERATE REPORT FUNCTION CALLED");
    console.log("Property ID:", propertyId);
    console.log("=================================");

    if (!propertyId) {
      console.warn("No property selected.");

      setErrorReport(
        "Please select a property before generating the report."
      );

      return;
    }

    setLoadingReport(true);
    setErrorReport(null);
    setReport(null);

    const endpoint =
      `/api/due-diligence/${propertyId}/process`;

    console.log("Calling API:", endpoint);
    console.log("HTTP Method: POST");

    try {
      const data = await apiFetch(endpoint, {
        method: "POST",
      });

      console.log("=================================");
      console.log("REPORT GENERATION SUCCESS");
      console.log("Backend Response:");
      console.log(data);
      console.log("=================================");

      if (!data) {
        throw new Error(
          "Backend returned an empty response."
        );
      }

      setReport(data);
    } catch (err) {
      console.error("=================================");
      console.error("REPORT GENERATION FAILED");
      console.error("Error:", err);
      console.error("Error message:", err?.message);
      console.error("=================================");

      setErrorReport(
        err?.message ||
          "Unable to generate due diligence report."
      );
    } finally {
      setLoadingReport(false);
    }
  };

  // =========================================================
  // GENERATE BUTTON
  // =========================================================
  const handleGenerate = (event) => {
    event?.preventDefault();

    console.log("*********************************");
    console.log("GENERATE REPORT BUTTON CLICKED");
    console.log("Selected Property ID:", selectedId);
    console.log("*********************************");

    if (!selectedId) {
      alert("Please select a property first.");
      return;
    }

    fetchReport(selectedId);
  };

  // =========================================================
  // PDF DOWNLOAD
  // =========================================================
  const handlePdfDownload = async () => {
    if (!selectedId) {
      alert("Please select a property first.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/due-diligence/${selectedId}/export/pdf`,
        {
          method: "GET",
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `PDF download failed: ${response.status}`
        );
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download =
        `DueDiligenceReport_${selectedId}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);

      alert(
        err?.message ||
          "Unable to download PDF report."
      );
    }
  };

  // =========================================================
  // PRINT
  // =========================================================
  const handlePrint = () => {
    window.print();
  };

  // =========================================================
  // SELECTED PROPERTY
  // =========================================================
  const selectedProperty =
    properties.find(
      (property) =>
        String(property.propertyId) ===
        String(selectedId)
    ) || report?.property;

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="rp-page">

      {/* HEADER */}
      <header className="rp-header">

        <div className="rp-header-icon">
          <FileText size={28} />
        </div>

        <div>
          <h1 className="rp-title">
            Due Diligence Report
          </h1>

          <p className="rp-subtitle">
            Select a property and generate its due
            diligence report.
          </p>
        </div>

      </header>

      {/* PROPERTY SELECTOR */}
      <div className="rp-selector-card">

        <div className="rp-selector-row">

          <div className="rp-select-wrapper">

            <Building2
              size={18}
              className="rp-select-icon"
            />

            {loadingProps ? (
              <div className="rp-select-loading">

                <Loader2
                  size={16}
                  className="spin"
                />

                Loading properties...

              </div>
            ) : errorProps ? (
              <div className="rp-select-error">
                {errorProps}
              </div>
            ) : (
              <select
                id="property-select"
                className="rp-select"
                value={selectedId}
                onChange={(e) => {
                  const value = e.target.value;

                  console.log(
                    "Property selected:",
                    value
                  );

                  setSelectedId(value);
                  setReport(null);
                  setErrorReport(null);
                }}
              >

                <option value="">
                  Select a property...
                </option>

                {properties.map((property) => (
                  <option
                    key={property.propertyId}
                    value={property.propertyId}
                  >
                    {property.propertyName ||
                      `Property #${property.propertyId}`}
                    {" — "}
                    {[
                      property.city,
                      property.state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </option>
                ))}

              </select>
            )}

            {!loadingProps &&
              !errorProps && (
                <ChevronDown
                  size={16}
                  className="rp-select-chevron"
                />
              )}

          </div>

          {/* GENERATE REPORT BUTTON */}
          <button
            type="button"
            className="rp-generate-btn"
            onClick={handleGenerate}
            disabled={loadingReport}
          >

            {loadingReport ? (
              <>
                <Loader2
                  size={16}
                  className="spin"
                />

                Generating...

              </>
            ) : (
              <>
                <RefreshCw size={16} />

                Generate Report

              </>
            )}

          </button>

        </div>

      </div>

      {/* ERROR */}
      {errorReport && (
        <div className="rp-error">

          <AlertTriangle size={20} />

          <div>

            <strong>
              Failed to generate report
            </strong>

            <p>
              {errorReport}
            </p>

          </div>

        </div>
      )}

      {/* REPORT */}
      {report && (

        <div
          className="rp-report"
          id="printable-report"
        >

          {/* REPORT HEADER */}
          <div className="rp-report-topbar">

            <div>

              <p className="rp-report-label">
                DUE DILIGENCE REPORT
              </p>

              <h2 className="rp-report-name">

                {report.property?.propertyName ||
                  selectedProperty?.propertyName ||
                  `Property #${selectedId}`}

              </h2>

              <p>
                <MapPin size={15} />

                {report.property?.address ||
                  selectedProperty?.address ||
                  "Address not available"}
              </p>

              <p>
                {[
                  report.property?.city ||
                    selectedProperty?.city,

                  report.property?.state ||
                    selectedProperty?.state,

                  report.property?.zipCode ||
                    selectedProperty?.zipCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>

            </div>

            {/* STATUS */}
            <div
              className={`rp-risk-badge ${
                report.status === "COMPLETED"
                  ? "risk-clear"
                  : "risk-concerns"
              }`}
            >

              {report.status === "COMPLETED" ? (
                <CheckCircle2 size={20} />
              ) : (
                <AlertTriangle size={20} />
              )}

              {report.status || "UNKNOWN"}

            </div>

          </div>

          {/* PROCESSING STATUS */}
          <div className="rp-risk-banner risk-clear">

            <div className="rp-risk-icon">
              <ShieldCheck size={22} />
            </div>

            <div>

              <strong>
                Due Diligence Processing Status
              </strong>

              <p>
                {report.status === "COMPLETED"
                  ? "The due diligence report was generated successfully."
                  : "The report is not completed yet."}
              </p>

            </div>

          </div>

          {/* REPORT DETAILS */}
          <section className="rp-section">

            <h3 className="rp-section-title">
              <FileText size={18} />
              Report Details
            </h3>

            <div className="rp-stats-row">

              <div className="rp-stat-card">

                <FileText size={20} />

                <div>

                  <span className="rp-stat-num">
                    #{report.id || "—"}
                  </span>

                  <span className="rp-stat-label">
                    Report ID
                  </span>

                </div>

              </div>

              <div className="rp-stat-card">

                <Building2 size={20} />

                <div>

                  <span className="rp-stat-num">
                    #
                    {report.property?.propertyId ||
                      selectedId}
                  </span>

                  <span className="rp-stat-label">
                    Property ID
                  </span>

                </div>

              </div>

              <div className="rp-stat-card">

                <Calendar size={20} />

                <div>

                  <span className="rp-stat-num">
                    {formatDate(
                      report.createdAt
                    )}
                  </span>

                  <span className="rp-stat-label">
                    Generated On
                  </span>

                </div>

              </div>

              <div className="rp-stat-card">

                <RefreshCw size={20} />

                <div>

                  <span className="rp-stat-num">
                    {report.durationMs != null
                      ? `${report.durationMs} ms`
                      : "—"}
                  </span>

                  <span className="rp-stat-label">
                    Processing Time
                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* PROPERTY INFORMATION */}
          {report.property && (

            <section className="rp-section">

              <h3 className="rp-section-title">
                <Building2 size={18} />
                Property Information
              </h3>

              <div className="rp-table-wrapper">

                <table className="rp-table">

                  <tbody>

                    <tr>
                      <th>Property Name</th>
                      <td>
                        {report.property.propertyName ||
                          "—"}
                      </td>
                    </tr>

                    <tr>
                      <th>Address</th>
                      <td>
                        {report.property.address ||
                          "—"}
                      </td>
                    </tr>

                    <tr>
                      <th>City</th>
                      <td>
                        {report.property.city ||
                          "—"}
                      </td>
                    </tr>

                    <tr>
                      <th>State</th>
                      <td>
                        {report.property.state ||
                          "—"}
                      </td>
                    </tr>

                    <tr>
                      <th>ZIP Code</th>
                      <td>
                        {report.property.zipCode ||
                          "—"}
                      </td>
                    </tr>

                    <tr>
                      <th>Property Type</th>
                      <td>
                        {report.property.propertyType ||
                          "—"}
                      </td>
                    </tr>

                  </tbody>

                </table>

              </div>

            </section>

          )}

          {/* REQUESTED BY */}
          {report.requestedBy && (

            <section className="rp-section">

              <h3 className="rp-section-title">
                <User size={18} />
                Report Requested By
              </h3>

              <div className="rp-table-wrapper">

                <table className="rp-table">

                  <tbody>

                    <tr>
                      <th>Name</th>
                      <td>
                        {report.requestedBy.name ||
                          "—"}
                      </td>
                    </tr>

                    <tr>
                      <th>Email</th>
                      <td>
                        {report.requestedBy.email ||
                          "—"}
                      </td>
                    </tr>

                    <tr>
                      <th>Role</th>
                      <td>
                        {report.requestedBy.role
                          ?.roleName ||
                          report.requestedBy.role
                            ?.name ||
                          "—"}
                      </td>
                    </tr>

                  </tbody>

                </table>

              </div>

            </section>

          )}

          {/* TIMELINE */}
          <section className="rp-section">

            <h3 className="rp-section-title">
              <Calendar size={18} />
              Report Timeline
            </h3>

            <div className="rp-table-wrapper">

              <table className="rp-table">

                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td>
                      Report Created
                    </td>

                    <td>
                      {formatDateTime(
                        report.createdAt
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Report Completed
                    </td>

                    <td>
                      {formatDateTime(
                        report.completedAt
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Processing Duration
                    </td>

                    <td>
                      {report.durationMs != null
                        ? `${report.durationMs} milliseconds`
                        : "—"}
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </section>

          {/* REPORT PROCESSING ERROR */}
          {report.errorMessage && (

            <div className="rp-error">

              <AlertTriangle size={20} />

              <div>

                <strong>
                  Report Processing Error
                </strong>

                <p>
                  {report.errorMessage}
                </p>

              </div>

            </div>

          )}

          {/* ACTION BUTTONS */}
          <div
            className="rp-selector-card"
            style={{
              marginTop: "24px",
            }}
          >

            <div className="rp-selector-row">

              {/* PDF */}
              <button
                type="button"
                className="rp-generate-btn"
                onClick={handlePdfDownload}
              >
                <Download size={16} />
                Download PDF
              </button>

              {/* PRINT */}
              <button
                type="button"
                className="rp-print-btn"
                onClick={handlePrint}
              >
                <Printer size={16} />
                Print
              </button>

            </div>

          </div>

          {/* FOOTER */}
          <div className="rp-footer">

            <ShieldCheck size={16} />

            Report generated by Diligence Agent ·{" "}

            Report #{report.id || "—"} · Property ID #

            {report.property?.propertyId ||
              selectedId}

          </div>

        </div>

      )}

    </div>
  );
}

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

      <Suspense
        fallback={
          <div className="rp-loading">

            <Loader2
              size={32}
              className="spin"
            />

          </div>
        }
      >

        <ReportContent />

      </Suspense>

    </div>
  );
}
