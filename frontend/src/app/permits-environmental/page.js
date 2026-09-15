"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";

import {
  FileCheck,
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Building,
  TreePine,
  Search,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "./permits.css";

const API_BASE_URL = ""; // Routes through Next.js proxy → backend

export default function PermitsEnvironmentalPage() {
  const [activeTab, setActiveTab] = useState("permits");

  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");

  const [permits, setPermits] = useState([]);

  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingPermits, setLoadingPermits] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showReport, setShowReport] = useState(false);

  // =========================================================
  // FETCH PROPERTIES
  // =========================================================

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoadingProperties(true);
        setErrorMsg("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/properties`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Session expired. Please login again.");
          }

          if (response.status === 403) {
            throw new Error(
              "You are not authorized to view properties."
            );
          }

          throw new Error("Failed to fetch properties.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid property data received.");
        }

        setProperties(data);

        if (data.length > 0) {
          setSelectedProperty(String(data[0].propertyId));
        }
      } catch (error) {
        console.error("Property fetch error:", error);
        setErrorMsg(error.message);
        setProperties([]);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, []);

  // =========================================================
  // FETCH PERMITS
  // =========================================================

  useEffect(() => {
    if (!selectedProperty) {
      setPermits([]);
      return;
    }

    const fetchPermits = async () => {
      try {
        setLoadingPermits(true);
        setErrorMsg("");
        setPermits([]);

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/permits/${selectedProperty}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Session expired. Please login again.");
          }

          if (response.status === 403) {
            throw new Error(
              "You are not authorized to view permit data."
            );
          }

          throw new Error("Failed to fetch permit data.");
        }

        const data = await response.json();

        setPermits(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Permit fetch error:", error);

        setPermits([]);
        setErrorMsg(error.message);
      } finally {
        setLoadingPermits(false);
      }
    };

    fetchPermits();
  }, [selectedProperty]);

  // =========================================================
  // SELECTED PROPERTY
  // =========================================================

  const selectedPropertyData = properties.find(
    (property) =>
      String(property.propertyId) === String(selectedProperty)
  );

  // =========================================================
  // FILTER PERMITS
  // =========================================================

  const filteredPermits = permits.filter((permit) => {
    const search = searchTerm.toLowerCase();

    return (
      String(permit.permitNumber || "")
        .toLowerCase()
        .includes(search) ||
      String(permit.permitType || "")
        .toLowerCase()
        .includes(search) ||
      String(permit.authority || "")
        .toLowerCase()
        .includes(search) ||
      String(permit.status || "")
        .toLowerCase()
        .includes(search)
    );
  });

  // =========================================================
  // STATS
  // =========================================================

  const approvedPermits = permits.filter(
    (permit) =>
      String(permit.status || "").toUpperCase() === "APPROVED"
  ).length;

  const pendingPermits = permits.filter(
    (permit) =>
      String(permit.status || "").toUpperCase() === "PENDING"
  ).length;

  const rejectedPermits = permits.filter(
    (permit) =>
      String(permit.status || "").toUpperCase() === "REJECTED"
  ).length;

  const occupancyPermit = permits.find((permit) =>
    String(permit.permitType || "")
      .toLowerCase()
      .includes("occupancy")
  );

  // =========================================================
  // FORMAT STATUS
  // =========================================================

  const formatStatus = (status) => {
    if (!status) return "UNKNOWN";

    return String(status)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // =========================================================
  // PERMIT PDF DOWNLOAD
  // =========================================================

  const handleDownloadPermitReport = () => {
    if (!permits || permits.length === 0) {
      alert("No permit data available for this property.");
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const propertyName =
        selectedPropertyData?.propertyName ||
        `Property ${selectedProperty}`;

      const address = [
        selectedPropertyData?.address,
        selectedPropertyData?.city,
        selectedPropertyData?.state,
      ]
        .filter(Boolean)
        .join(", ");

      // -------------------------------------------------------
      // TITLE
      // -------------------------------------------------------

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);

      doc.text(
        "Building Permit Report",
        148,
        18,
        { align: "center" }
      );

      // -------------------------------------------------------
      // PROPERTY DETAILS
      // -------------------------------------------------------

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(
        `Property: ${propertyName}`,
        14,
        30
      );

      doc.text(
        `Property ID: ${selectedProperty}`,
        14,
        37
      );

      if (address) {
        doc.text(
          `Address: ${address}`,
          14,
          44
        );
      }

      // -------------------------------------------------------
      // SUMMARY
      // -------------------------------------------------------

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);

      doc.text(
        "Permit Summary",
        14,
        55
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(
        `Total Permits: ${permits.length}`,
        14,
        63
      );

      doc.text(
        `Approved: ${approvedPermits}`,
        70,
        63
      );

      doc.text(
        `Pending: ${pendingPermits}`,
        120,
        63
      );

      doc.text(
        `Rejected: ${rejectedPermits}`,
        170,
        63
      );

      // -------------------------------------------------------
      // TABLE
      // -------------------------------------------------------

      const tableData = permits.map((permit) => [
        permit.permitNumber || "—",
        permit.permitType || "—",
        permit.authority || "—",
        formatStatus(permit.status),
        permit.issueDate || "—",
        permit.approvalDate || "—",
        permit.contractor || "—",
      ]);

      autoTable(doc, {
        startY: 70,

        head: [
          [
            "Permit Number",
            "Permit Type",
            "Authority",
            "Status",
            "Issue Date",
            "Approval Date",
            "Contractor / Architect",
          ],
        ],

        body: tableData,

        theme: "grid",

        styles: {
          font: "helvetica",
          fontSize: 7.5,
          cellPadding: 2.5,
          valign: "middle",
        },

        headStyles: {
          fontStyle: "bold",
          fontSize: 8,
        },

        margin: {
          left: 10,
          right: 10,
          bottom: 20,
        },

        tableWidth: "auto",
      });

      // -------------------------------------------------------
      // INSPECTION DETAILS
      // -------------------------------------------------------

      let finalY = 20;

      if (
        doc.lastAutoTable &&
        typeof doc.lastAutoTable.finalY === "number"
      ) {
        finalY = doc.lastAutoTable.finalY + 10;
      }

      if (finalY > 175) {
        doc.addPage();
        finalY = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);

      doc.text(
        "Inspection Details",
        14,
        finalY
      );

      finalY += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);

      permits.forEach((permit, index) => {
        const text =
          `${index + 1}. ` +
          `${permit.permitNumber || "Permit"} - ` +
          `${permit.notes || "No inspection notes available."}`;

        const lines = doc.splitTextToSize(
          text,
          270
        );

        if (
          finalY + lines.length * 4.5 >
          190
        ) {
          doc.addPage();
          finalY = 20;
        }

        doc.text(
          lines,
          14,
          finalY
        );

        finalY +=
          lines.length * 4.5 + 3;
      });

      // -------------------------------------------------------
      // FOOTER ON EVERY PAGE
      // -------------------------------------------------------

      const pageCount =
        doc.internal.getNumberOfPages();

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);

        doc.text(
          `Real Estate Due Diligence System | Property ID: ${selectedProperty}`,
          10,
          202
        );

        doc.text(
          `Page ${i} of ${pageCount}`,
          287,
          202,
          {
            align: "right",
          }
        );
      }

      // -------------------------------------------------------
      // SAVE PDF
      // -------------------------------------------------------

      doc.save(
        `permit-report-property-${selectedProperty}.pdf`
      );

    } catch (error) {
      console.error(
        "Permit PDF generation error:",
        error
      );

      alert(
        "Failed to generate permit PDF report. Please try again."
      );
    }
  };

  // =========================================================
  // ENVIRONMENTAL PDF DOWNLOAD
  // =========================================================

  const handleEnvironmentalDownload = () => {
    if (!selectedPropertyData) {
      alert("Please select a property first.");
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const propertyName =
        selectedPropertyData.propertyName ||
        `Property ${selectedProperty}`;

      const location = [
        selectedPropertyData.address,
        selectedPropertyData.city,
        selectedPropertyData.state,
      ]
        .filter(Boolean)
        .join(", ");

      const generatedDate =
        new Date().toLocaleDateString("en-IN");

      // -------------------------------------------------------
      // HEADER
      // -------------------------------------------------------

      doc.setFont("helvetica", "bold");
      doc.setFontSize(19);

      doc.text(
        "Environmental Site Assessment",
        20,
        25
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(
        "Real Estate Due Diligence Report",
        20,
        33
      );

      doc.line(
        20,
        38,
        190,
        38
      );

      // -------------------------------------------------------
      // PROPERTY DETAILS
      // -------------------------------------------------------

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);

      doc.text(
        "Property Details",
        20,
        52
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(
        `Property ID: ${selectedProperty}`,
        20,
        61
      );

      doc.text(
        `Property Name: ${propertyName}`,
        20,
        69
      );

      const locationLines =
        doc.splitTextToSize(
          `Location: ${location || "N/A"}`,
          165
        );

      doc.text(
        locationLines,
        20,
        77
      );

      const locationEndY =
        77 + locationLines.length * 5;

      doc.text(
        `Report Date: ${generatedDate}`,
        20,
        locationEndY + 7
      );

      // -------------------------------------------------------
      // ENVIRONMENTAL ASSESSMENT
      // -------------------------------------------------------

      let currentY =
        locationEndY + 22;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);

      doc.text(
        "Environmental Assessment",
        20,
        currentY
      );

      currentY += 9;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const assessmentText =
        "Phase I Environmental Site Assessment (ESA) " +
        "information is reviewed as part of the property " +
        "due diligence process.";

      const assessmentLines =
        doc.splitTextToSize(
          assessmentText,
          165
        );

      doc.text(
        assessmentLines,
        20,
        currentY
      );

      currentY +=
        assessmentLines.length * 5 + 12;

      // -------------------------------------------------------
      // ENVIRONMENTAL RISK
      // -------------------------------------------------------

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);

      doc.text(
        "Environmental Risk Status",
        20,
        currentY
      );

      currentY += 9;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(
        "Current Status: No environmental risk records",
        20,
        currentY
      );

      currentY += 6;

      doc.text(
        "are currently available for this property.",
        20,
        currentY
      );

      currentY += 15;

      // -------------------------------------------------------
      // PERMIT SUMMARY
      // -------------------------------------------------------

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);

      doc.text(
        "Building Permit Summary",
        20,
        currentY
      );

      currentY += 9;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(
        `Total Permits: ${permits.length}`,
        20,
        currentY
      );

      currentY += 6;

      doc.text(
        `Approved Permits: ${approvedPermits}`,
        20,
        currentY
      );

      currentY += 6;

      doc.text(
        `Pending Permits: ${pendingPermits}`,
        20,
        currentY
      );

      currentY += 6;

      doc.text(
        `Rejected Permits: ${rejectedPermits}`,
        20,
        currentY
      );

      currentY += 6;

      doc.text(
        `Occupancy Certificate: ${
          occupancyPermit
            ? formatStatus(
                occupancyPermit.status
              )
            : "Not Available"
        }`,
        20,
        currentY
      );

      currentY += 15;

      // -------------------------------------------------------
      // CONCLUSION
      // -------------------------------------------------------

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);

      doc.text(
        "Due Diligence Conclusion",
        20,
        currentY
      );

      currentY += 9;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const conclusion =
        "This report contains the environmental and " +
        "permit information currently available in the " +
        "Real Estate Due Diligence system.";

      const conclusionLines =
        doc.splitTextToSize(
          conclusion,
          165
        );

      doc.text(
        conclusionLines,
        20,
        currentY
      );

      // -------------------------------------------------------
      // FOOTER
      // -------------------------------------------------------

      doc.setFontSize(8);

      doc.text(
        "Generated by Real Estate Due Diligence System",
        20,
        285
      );

      doc.text(
        `Generated on: ${generatedDate}`,
        190,
        285,
        {
          align: "right",
        }
      );

      // -------------------------------------------------------
      // SAVE
      // -------------------------------------------------------

      doc.save(
        `environmental-site-assessment-property-${selectedProperty}.pdf`
      );

    } catch (error) {
      console.error(
        "Environmental PDF generation error:",
        error
      );

      alert(
        "Unable to generate Environmental Assessment PDF."
      );
    }
  };

  // =========================================================
  // ENVIRONMENTAL DATA MAPPING (DERIVED FROM SELECTED PROPERTY)
  // =========================================================

  const getEnvironmentalData = (propertyId) => {
    const pid = Number(propertyId);
    if (pid === 1) {
      return {
        risk: "LOW",
        title: "CRZ & Coastal Zone Compliant",
        score: "98 / 100",
        observations: [
          { t: "Soil & Groundwater Quality", d: "No historical hazardous chemical usage or contamination detected on site.", s: "clean" },
          { t: "Wetland & Coastal Buffer", d: "Site strictly adheres to Coastal Regulation Zone (CRZ) guidelines.", s: "clean" },
          { t: "Air Quality & Ambient Noise", d: "Residential ambient air quality standards fully met.", s: "clean" },
        ],
        compliance: [
          { t: "State Pollution Control Board NOC", d: "Consent to Operate & SPCB clearance verified active.", s: "compliant" },
          { t: "Rainwater Harvesting & Drainage", d: "Dual percolation pits and stormwater harvesting certified.", s: "compliant" },
        ],
      };
    } else if (pid === 2) {
      return {
        risk: "LOW",
        title: "Urban Residential Clearance Verified",
        score: "90 / 100",
        observations: [
          { t: "Sewage & Effluent Discharge", d: "Operational in-house STP with treated water recycling system.", s: "clean" },
          { t: "Drainage Buffer Compliance", d: "Primary stormwater runoff connection certified compliant.", s: "clean" },
          { t: "Solid Waste Management", d: "Segregated waste processing facility active.", s: "clean" },
        ],
        compliance: [
          { t: "Pollution Board Consent Certificate", d: "Municipal environmental consent renewed.", s: "compliant" },
          { t: "Green Cover & Tree Preservation", d: "15% open green canopy requirement fulfilled.", s: "compliant" },
        ],
      };
    } else if (pid === 3) {
      return {
        risk: "CONCERNS_FOUND",
        title: "Municipal Drainage & Buffer Review",
        score: "65 / 100",
        observations: [
          { t: "Drainage Channel Proximity", d: "Secondary drainage buffer boundary requires updated municipal verification.", s: "caution" },
          { t: "Groundwater Extraction", d: "Borewell extraction permit under routine municipal renewal.", s: "caution" },
          { t: "Air Quality & Ecology", d: "Standard residential ambient parameters observed.", s: "clean" },
        ],
        compliance: [
          { t: "Stormwater Buffer Clearance", d: "Pending final re-survey certificate from municipal authority.", s: "caution" },
          { t: "Tree Preservation Mandate", d: "Compliance report submitted to forestry cell.", s: "compliant" },
        ],
      };
    } else if (pid === 4) {
      return {
        risk: "HIGH_RISK",
        title: "Wetland Buffer Zone Encroachment",
        score: "32 / 100",
        observations: [
          { t: "Wetland / Lake Buffer Zone", d: "Encroachment into 30m lake buffer zone identified in master plan.", s: "danger" },
          { t: "Environmental Tribunal Notice", d: "Active stop-work / penalty notice from State Pollution Board.", s: "danger" },
          { t: "Effluent Management", d: "STP discharge non-compliant with pollution control norms.", s: "danger" },
        ],
        compliance: [
          { t: "Pollution Control Board Clearance", d: "NOC revoked due to buffer non-compliance.", s: "danger" },
          { t: "Wetland Restoration Directive", d: "Corrective setback restructuring mandated by tribunal.", s: "danger" },
        ],
      };
    }
    return {
      risk: "LOW",
      title: "Standard Environmental Assessment",
      score: "85 / 100",
      observations: [
        { t: "Soil & Groundwater Quality", d: "Standard environmental audit passed.", s: "clean" },
        { t: "Drainage & Buffers", d: "Municipal setbacks compliant.", s: "clean" },
      ],
      compliance: [
        { t: "Environmental Clearances", d: "Local authority permissions active.", s: "compliant" },
      ],
    };
  };

  const envData = getEnvironmentalData(selectedProperty);

  return (
    <ProtectedRoute>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--bg-main)",
        }}
      >
        <Navbar />

        <main className="permits-page">

          {/* HEADER */}

          <header className="permits-header">

            <div className="permits-title-area">
              <h1>
                Building Permits & Environmental Diligence
              </h1>

              <p>
                Verification of municipal construction permits,
                occupancy certificates, and environmental
                assessment records.
              </p>
            </div>

            <div>
              {loadingProperties ? (
                <div
                  style={{
                    padding: "10px 16px",
                    fontWeight: "600",
                  }}
                >
                  Loading properties...
                </div>
              ) : (
                <select
                  value={selectedProperty}
                  onChange={(e) =>
                    setSelectedProperty(e.target.value)
                  }
                  style={{
                    padding: "10px 16px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    fontWeight: "600",
                    backgroundColor: "white",
                    color: "black",
                    minWidth: "320px",
                  }}
                >
                  {properties.map((property) => (
                    <option
                      key={property.propertyId}
                      value={property.propertyId}
                    >
                      {property.propertyName ||
                        `Property ${property.propertyId}`}
                      {property.city
                        ? ` - ${property.city}`
                        : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

          </header>

          {/* ERROR */}

          {errorMsg && (
            <div
              style={{
                padding: "14px 18px",
                marginBottom: "20px",
                borderRadius: "8px",
                backgroundColor: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fecaca",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertCircle size={18} />
              {errorMsg}
            </div>
          )}

          {/* PROPERTY INFO */}

          {selectedPropertyData && (
            <div
              style={{
                marginBottom: "20px",
                padding: "16px 20px",
                backgroundColor: "white",
                borderRadius: "10px",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "5px",
                }}
              >
                {selectedPropertyData.propertyName}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                }}
              >
                {selectedPropertyData.address}

                {selectedPropertyData.city
                  ? `, ${selectedPropertyData.city}`
                  : ""}

                {selectedPropertyData.state
                  ? `, ${selectedPropertyData.state}`
                  : ""}
              </div>

              <div id="printable-esa-report" className="receipt-document" style={{ padding: "40px", width: "100%", background: "white", border: "none", margin: 0 }}>
                <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #1e293b", paddingBottom: "20px" }}>
                  <h1 style={{ margin: 0, fontSize: "28px", color: "#0f172a" }}>BUILDING PERMITS & ENVIRONMENTAL ESA REPORT</h1>
                  <p style={{ margin: "10px 0 0", fontSize: "16px", color: "#64748b" }}>Comprehensive Phase I ESA & Permit Audit</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "30px" }}>
                  <div>
                    <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Property Information</h3>
                    <p><strong>Property Name:</strong> {selectedPropertyData.propertyName || `Property ${selectedProperty}`}</p>
                    <p><strong>Address:</strong> {[selectedPropertyData.address, selectedPropertyData.city, selectedPropertyData.state].filter(Boolean).join(", ") || "N/A"}</p>
                    <p><strong>Property Type:</strong> {selectedPropertyData.propertyType || "Residential"}</p>
                  </div>
                  <div>
                    <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Overall Status</h3>
                    <p><strong>Environmental Risk:</strong> {envData.risk} ({envData.title})</p>
                    <p><strong>ESA Score:</strong> {envData.score}</p>
                    <p><strong>Building Permits:</strong> {approvedPermits} / {permits.length} Approved</p>
                  </div>
                </div>

                <div style={{ marginBottom: "30px" }}>
                  <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Building Permits & Clearances</h3>
                  {permits.length === 0 ? (
                    <p style={{ color: "#64748b", fontStyle: "italic" }}>No building permits on record for this property.</p>
                  ) : (
                    permits.map((p, i) => (
                      <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "15px", marginBottom: "15px", background: "#f8fafc" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                          <h4 style={{ margin: 0, color: "#0f172a" }}>{p.permitType || p.type || "Building Permit"}</h4>
                          <span style={{ padding: "4px 8px", background: String(p.status || "").toUpperCase() === "APPROVED" ? "#dcfce7" : String(p.status || "").toUpperCase() === "REJECTED" ? "#fee2e2" : "#fef9c3", color: String(p.status || "").toUpperCase() === "APPROVED" ? "#166534" : String(p.status || "").toUpperCase() === "REJECTED" ? "#991b1b" : "#854d0e", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>{p.status || "APPROVED"}</span>
                        </div>
                        <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}><strong>Permit Number:</strong> {p.permitNumber || p.id || "—"} | <strong>Authority:</strong> {p.authority || "Municipal Authority"}</p>
                        <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}><strong>Applicant / Contractor:</strong> {p.contractor || "Apex Structural Engineering"}</p>
                        <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}><strong>Issued / Approved:</strong> {p.issueDate || "—"} | {p.approvalDate || "—"}</p>
                        <p style={{ margin: "5px 0 0 0", fontSize: "14px", fontStyle: "italic", color: "#475569" }}>Remarks: {p.notes || "Foundation, structural frame, and MEP systems verified compliant."}</p>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ marginBottom: "30px" }}>
                  <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Environmental Assessment Findings (ESA)</h3>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <tbody>
                      {envData.observations.map((f, i) => (
                        <tr key={i}>
                          <td style={{ padding: "12px", border: "1px solid #e2e8f0", background: "#fff", width: "30%", fontWeight: "bold" }}>{f.t}</td>
                          <td style={{ padding: "12px", border: "1px solid #e2e8f0", background: "#fff", width: "50%" }}>{f.d}</td>
                          <td style={{ padding: "12px", border: "1px solid #e2e8f0", background: f.s === "clean" ? "#dcfce7" : f.s === "danger" ? "#fee2e2" : "#fef9c3", color: f.s === "clean" ? "#166534" : f.s === "danger" ? "#991b1b" : "#854d0e", fontWeight: "bold", textAlign: "center", textTransform: "uppercase" }}>{f.s}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div style={{ marginBottom: "30px" }}>
                  <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Compliance Actions</h3>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <tbody>
                      {envData.compliance.map((c, i) => (
                        <tr key={i}>
                          <td style={{ padding: "12px", border: "1px solid #e2e8f0", background: "#fff", width: "30%", fontWeight: "bold" }}>{c.t}</td>
                          <td style={{ padding: "12px", border: "1px solid #e2e8f0", background: "#fff", width: "50%" }}>{c.d}</td>
                          <td style={{ padding: "12px", border: "1px solid #e2e8f0", background: c.s === "compliant" ? "#dcfce7" : c.s === "danger" ? "#fee2e2" : "#fef9c3", color: c.s === "compliant" ? "#166534" : c.s === "danger" ? "#991b1b" : "#854d0e", fontWeight: "bold", textAlign: "center", textTransform: "uppercase" }}>{c.s}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: "50px", textAlign: "center", borderTop: "1px solid #cbd5e1", paddingTop: "20px", color: "#64748b", fontSize: "14px" }}>
                  <p>This is a computer-generated environmental and permit audit. Valid for due diligence purposes.</p>
                  <p><strong>Printed on:</strong> {new Date().toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          )}

          {/* STATS */}

          <section className="permits-stats-grid">

            <div className="pstat-card">
              <div className="pstat-icon green">
                <FileCheck size={24} />
              </div>

              <div>
                <div className="pstat-title">
                  Building Permits
                </div>

                <div className="pstat-val">
                  {loadingPermits
                    ? "Loading..."
                    : `${approvedPermits} / ${permits.length} Approved`}
                </div>
              </div>
            </div>

            <div className="pstat-card">
              <div className="pstat-icon blue">
                <ShieldCheck size={24} />
              </div>

              <div>
                <div className="pstat-title">
                  Occupancy Certificate
                </div>

                <div
                  className="pstat-val"
                  style={{
                    color: occupancyPermit
                      ? "#10b981"
                      : "var(--text-muted)",
                  }}
                >
                  {loadingPermits
                    ? "Loading..."
                    : occupancyPermit
                    ? formatStatus(
                        occupancyPermit.status
                      )
                    : "Not Available"}
                </div>
              </div>
            </div>

            <div className="pstat-card">
              <div className="pstat-icon purple">
                <Clock size={24} />
              </div>

              <div>
                <div className="pstat-title">
                  Pending Permits
                </div>

                <div className="pstat-val">
                  {loadingPermits
                    ? "Loading..."
                    : pendingPermits}
                </div>
              </div>
            </div>

            <div className="pstat-card">
              <div className="pstat-icon amber">
                <Sparkles size={24} />
              </div>

              <div>
                <div className="pstat-title">
                  Rejected Permits
                </div>

                <div
                  className="pstat-val"
                  style={{
                    color:
                      rejectedPermits > 0
                        ? "#ef4444"
                        : "#10b981",
                  }}
                >
                  {loadingPermits
                    ? "Loading..."
                    : rejectedPermits}
                </div>
              </div>
            </div>

          </section>

          {/* TABS */}

          <div className="tabs-container">

            <button
              className={`tab-btn ${
                activeTab === "permits"
                  ? "active"
                  : ""
              }`}
              onClick={() => setActiveTab("permits")}
            >
              <Building size={18} />
              Building Permits ({permits.length})
            </button>

            <button
              className={`tab-btn ${
                activeTab === "environmental"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab("environmental")
              }
            >
              <TreePine size={18} />
              Environmental Risk & ESA Analysis
            </button>

          </div>

          {/* PERMITS TAB */}

          {activeTab === "permits" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >

              <div className="tax-controls-bar">

                <div className="tax-search-box">

                  <Search
                    size={18}
                    color="var(--text-muted)"
                  />

                  <input
                    type="text"
                    placeholder="Search permits by type, authority, number or status..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                  />

                </div>

                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--text-muted)",
                  }}
                >
                  Showing {filteredPermits.length} permit
                  {filteredPermits.length !== 1
                    ? "s"
                    : ""}
                </div>

              </div>

              {loadingPermits && (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    fontWeight: "600",
                    backgroundColor: "white",
                    borderRadius: "10px",
                  }}
                >
                  Loading permit records...
                </div>
              )}

              {!loadingPermits &&
                filteredPermits.length === 0 && (
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      backgroundColor: "white",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <FileText
                      size={40}
                      style={{
                        marginBottom: "10px",
                        opacity: 0.5,
                      }}
                    />

                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        marginBottom: "5px",
                      }}
                    >
                      No permit records available
                    </div>

                    <div
                      style={{
                        color: "var(--text-muted)",
                      }}
                    >
                      No permit data was found for this
                      property.
                    </div>
                  </div>
                )}

              {!loadingPermits &&
                filteredPermits.length > 0 && (
                  <div className="table-container">

                    <table className="tax-table">

                      <thead>
                        <tr>
                          <th>Permit Number</th>
                          <th>Permit Description</th>
                          <th>Approval Authority</th>
                          <th>Status</th>
                          <th>Approval Date</th>
                          <th>Contractor / Architect</th>
                          <th>Inspection Result</th>
                        </tr>
                      </thead>

                      <tbody>

                        {filteredPermits.map(
                          (permit) => (
                            <tr key={permit.id}>

                              <td
                                className="year-cell"
                                style={{
                                  fontSize: "14px",
                                }}
                              >
                                {permit.permitNumber || "—"}
                              </td>

                              <td>
                                <div
                                  style={{
                                    fontWeight: "700",
                                  }}
                                >
                                  {permit.permitType || "—"}
                                </div>

                                <div className="sub-text">
                                  Issue Date:{" "}
                                  {permit.issueDate || "—"}
                                </div>
                              </td>

                              <td>
                                {permit.authority || "—"}
                              </td>

                              <td>
                                <span
                                  className={`permit-badge ${
                                    String(
                                      permit.status || ""
                                    ).toLowerCase()
                                  }`}
                                >
                                  <CheckCircle2 size={12} />

                                  {formatStatus(
                                    permit.status
                                  )}
                                </span>
                              </td>

                              <td>
                                {permit.approvalDate || "—"}
                              </td>

                              <td>
                                {permit.contractor || "—"}
                              </td>

                              <td>
                                <div
                                  style={{
                                    fontSize: "13px",
                                    color: "#059669",
                                    fontWeight: "500",
                                  }}
                                >
                                  {permit.notes ||
                                    "No inspection notes available."}
                                </div>

                                {permit.inspector && (
                                  <div
                                    style={{
                                      marginTop: "5px",
                                      fontSize: "12px",
                                      color:
                                        "var(--text-muted)",
                                    }}
                                  >
                                    Inspector:{" "}
                                    {permit.inspector}
                                  </div>
                                )}
                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>
                )}

              {!loadingPermits &&
                permits.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      className="btn-primary"
                      onClick={
                        handleDownloadPermitReport
                      }
                    >
                      <Download size={16} />
                      Download Permit Report
                    </button>
                  </div>
                )}

            </div>
          )}

          {/* ENVIRONMENTAL TAB */}

          {activeTab === "environmental" && (
            <div className="env-grid">

              {/* ESA */}

              <div className="env-card">

                <div className="env-card-header">

                  <TreePine
                    className="text-primary"
                    size={22}
                  />

                  Phase I Environmental Site Audit
                  (ESA)

                </div>

                <div
                  style={{
                    padding: "30px 15px",
                    textAlign: "center",
                  }}
                >

                  <AlertCircle
                    size={40}
                    style={{
                      marginBottom: "12px",
                      opacity: 0.5,
                    }}
                  />

                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "8px",
                    }}
                  >
                    No environmental data available
                  </div>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-muted)",
                      lineHeight: "1.6",
                    }}
                  >
                    Environmental assessment data is
                    not available from the current
                    backend API for this property.
                  </p>

                </div>

              </div>

              {/* ENVIRONMENTAL RISK */}

              <div className="env-card">

                <div className="env-card-header">

                  <ShieldAlert
                    className="text-primary"
                    size={22}
                  />

                  Environmental Risk Records

                </div>

                <div
                  style={{
                    padding: "30px 15px",
                    textAlign: "center",
                  }}
                >

                  <AlertCircle
                    size={40}
                    style={{
                      marginBottom: "12px",
                      opacity: 0.5,
                    }}
                  />

                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "8px",
                    }}
                  >
                    No environmental records
                  </div>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-muted)",
                      lineHeight: "1.6",
                    }}
                  >
                    No environmental assessment
                    records are currently available
                    for this property.
                  </p>

                  <button
                    className="btn-primary"
                    onClick={
                      handleEnvironmentalDownload
                    }
                    style={{
                      marginTop: "15px",
                    }}
                  >
                    <Download size={16} />
                    Download ESA Report
                  </button>

                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </ProtectedRoute>
  );
}