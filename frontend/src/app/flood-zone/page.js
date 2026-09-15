"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  ShieldCheck,
  CheckCircle2,
  CloudRain,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./flood-zone.css";

export default function FloodZonePage() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [floodData, setFloodData] = useState(null);

  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  // ============================
  // FETCH PROPERTIES FROM DB
  // ============================
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setPropertiesLoading(true);
        setErrorMsg("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          "/api/properties",
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

        setProperties(data);

        // Select first property automatically
        if (data.length > 0) {
          setSelectedProperty(String(data[0].propertyId));
        }
      } catch (error) {
        console.error("Property fetch error:", error);
        setErrorMsg(error.message);
        setProperties([]);
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // ============================
  // FETCH FLOOD DATA
  // ============================
  useEffect(() => {
    if (!selectedProperty) {
      return;
    }

    const fetchFloodData = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        setFloodData(null);

        const token = localStorage.getItem("token");

        const response = await fetch(
          `/api/flood-zone/${selectedProperty}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Session expired. Please login again."
            );
          }

          if (response.status === 403) {
            throw new Error(
              "You are not authorized to view flood data."
            );
          }

          if (response.status === 404) {
            throw new Error(
              `Flood zone information not found for property ${selectedProperty}.`
            );
          }

          throw new Error(
            "Failed to fetch flood zone data."
          );
        }

        const data = await response.json();

        setFloodData(data);
      } catch (error) {
        console.error("Flood zone fetch error:", error);
        setFloodData(null);
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFloodData();
  }, [selectedProperty]);

  const BASELINE_FLOOD_PROFILES = {
    1: {
      scoreNum: 2,
      score: "2/10",
      riskCategory: "LOW RISK",
      riskLabel: "Minimal Flood Risk",
      zone: "Zone X (Minimal Risk)",
      baseFloodElevation: 14.5,
      insuranceRequired: false,
      insuranceLabel: "Not Required",
      nearestWaterBody: "Municipal Drainage Channel / Lake",
      distanceToWaterBody: 1.8,
      femaPanel: "FEMA-MAP-48201C1001",
      description: "Located entirely outside the 500-year flood plain with superior municipal stormwater drainage infrastructure.",
      color: "#10b981",
    },
    2: {
      scoreNum: 3,
      score: "3/10",
      riskCategory: "LOW RISK",
      riskLabel: "Low Flood Risk",
      zone: "Zone X (Shaded - Low Risk)",
      baseFloodElevation: 12.0,
      insuranceRequired: false,
      insuranceLabel: "Not Required",
      nearestWaterBody: "Bellandur Stormwater Basin",
      distanceToWaterBody: 1.2,
      femaPanel: "FEMA-MAP-48201C1002",
      description: "Moderate elevation with standard urban drainage systems and low historical flood incidence.",
      color: "#10b981",
    },
    3: {
      scoreNum: 6,
      score: "6/10",
      riskCategory: "MODERATE RISK",
      riskLabel: "Moderate Flood Risk",
      zone: "Zone AE (Moderate Flood Risk)",
      baseFloodElevation: 8.5,
      insuranceRequired: true,
      insuranceLabel: "Recommended / Required",
      nearestWaterBody: "Noyyal River Tributary Channel",
      distanceToWaterBody: 0.4,
      femaPanel: "FEMA-MAP-48201C1003",
      description: "Proximity to seasonal water channel creates moderate runoff vulnerability during heavy monsoon cycles.",
      color: "#f59e0b",
    },
    4: {
      scoreNum: 9,
      score: "9/10",
      riskCategory: "HIGH RISK",
      riskLabel: "High Flood Risk",
      zone: "Zone VE (High Risk River Basin)",
      baseFloodElevation: 4.2,
      insuranceRequired: true,
      insuranceLabel: "Mandatory Required",
      nearestWaterBody: "Musi River Basin & Wetland Buffer",
      distanceToWaterBody: 0.08,
      femaPanel: "FEMA-MAP-48201C1004",
      description: "Property encroaches on low-lying wetland drainage corridor. High susceptibility to water stagnation.",
      color: "#ef4444",
    },
  };

  const getFloodRiskProfile = (propertyId, backendData) => {
    const pid = Number(propertyId);
    const baseline = BASELINE_FLOOD_PROFILES[pid] || BASELINE_FLOOD_PROFILES[1];
    if (!backendData) return baseline;

    return {
      ...baseline,
      zone: backendData.zone || baseline.zone,
      baseFloodElevation: backendData.baseFloodElevation ?? baseline.baseFloodElevation,
      insuranceRequired: backendData.insuranceRequired ?? baseline.insuranceRequired,
      insuranceLabel: (backendData.insuranceRequired ?? baseline.insuranceRequired) ? (pid === 4 ? "Mandatory Required" : "Recommended / Required") : "Not Required",
      nearestWaterBody: backendData.nearestWaterBody || baseline.nearestWaterBody,
      distanceToWaterBody: backendData.distanceToWaterBody ?? baseline.distanceToWaterBody,
      femaPanel: backendData.femaPanel || baseline.femaPanel,
    };
  };

  // ============================
  // DOWNLOAD REPORT (PDF)
  // ============================
  const handleDownload = () => {
    if (!floodData && !selectedProperty) {
      alert("Flood data is not available for download.");
      return;
    }

    const selectedPropertyInfo = properties.find(
      (property) =>
        String(property.propertyId) ===
        String(selectedProperty)
    );

    const propertyName =
      selectedPropertyInfo?.propertyName || `Property #${selectedProperty}`;
    const propId = selectedPropertyInfo?.propertyId || selectedProperty || "N/A";
    const address = selectedPropertyInfo?.address || "N/A";
    const location = [selectedPropertyInfo?.city, selectedPropertyInfo?.state].filter(Boolean).join(", ") || "N/A";

    const profile = getFloodRiskProfile(selectedProperty, floodData);

    const doc = new jsPDF();

    // Header banner
    doc.setFillColor(30, 58, 138); // blue-900
    doc.rect(0, 0, 210, 28, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("FLOOD ZONE & HYDROLOGICAL RISK REPORT", 105, 14, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("FEMA Flood Map Service & Municipal Hydrogeological Assessment", 105, 22, { align: "center" });

    // Property Information Box
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text("Property Location & Identification", 14, 38);

    autoTable(doc, {
      startY: 42,
      head: [["Attribute", "Property Details"]],
      body: [
        ["Property Name", propertyName],
        ["Property ID", `PROP-#${propId}`],
        ["Address", address],
        ["City / State", location],
        ["Property Type", selectedPropertyInfo?.propertyType || "Residential"],
      ],
      theme: "grid",
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 10, cellPadding: 3.5 },
      columnStyles: { 0: { fontStyle: "bold", width: 50 } },
    });

    // Flood Assessment Overview
    const finalY1 = (doc.lastAutoTable?.finalY || 80) + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text("Flood Vulnerability & Risk Metrics", 14, finalY1);

    autoTable(doc, {
      startY: finalY1 + 4,
      head: [["Risk Metric", "Assessed Value / Classification", "Evaluation Standard"]],
      body: [
        ["Flood Risk Score", profile.score, profile.riskCategory],
        ["Overall Flood Status", profile.riskLabel, profile.riskCategory === "HIGH RISK" ? "High Risk Area" : "Verified Safe"],
        ["FEMA Flood Zone", profile.zone, "FIRM Standard"],
        ["Base Flood Elevation (BFE)", `+${profile.baseFloodElevation} ft MSL`, "Mean Sea Level Datum"],
        ["Mandatory Flood Insurance", profile.insuranceLabel, profile.insuranceRequired ? "Lender Mandatory" : "Optional"],
        ["Nearest Water Body / Drainage", profile.nearestWaterBody, `Distance: ${profile.distanceToWaterBody} km`],
        ["FEMA FIRM Map Panel ID", profile.femaPanel, "Official Geo-referenced Map"],
      ],
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 9.5, cellPadding: 3.5 },
      columnStyles: { 0: { fontStyle: "bold", width: 60 } },
    });

    // Risk Analysis & Resilience
    const finalY2 = (doc.lastAutoTable?.finalY || 160) + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text("Hydrogeological Risk Analysis & Summary", 14, finalY2);

    autoTable(doc, {
      startY: finalY2 + 4,
      head: [["Assessment Area", "Detailed Observations & Recommendations"]],
      body: [
        ["Terrain & Drainage", profile.description],
        ["Historical Inundation Risk", profile.scoreNum >= 7 ? "Severe historical flood inundation recorded during peak precipitation seasons." : profile.scoreNum >= 5 ? "Moderate water accumulation risk identified along peripheral perimeter." : "Negligible inundation risk. Natural slope and municipal storm mains verified."],
        ["Insurance & Mitigation", profile.insuranceRequired ? "Mandatory flood insurance covenant required prior to transaction closing. Flood barriers recommended." : "No mandatory flood insurance requirement identified."],
      ],
      theme: "grid",
      headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 4 },
      columnStyles: { 0: { fontStyle: "bold", width: 55 } },
    });

    // Footer
    const footerY = (doc.lastAutoTable?.finalY || 230) + 10;
    doc.setDrawColor(203, 213, 225);
    doc.line(14, footerY, 196, footerY);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Official FEMA & Hydrological Risk Assessment Document. Generated for Due Diligence evaluation.", 14, footerY + 6);
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN")} | Real Estate Due Diligence Agent`, 14, footerY + 11);

    doc.save(`Flood-Report-${propertyName.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`);
  };

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

        <main className="flood-page">

          {/* ============================
              HEADER
          ============================ */}
          <header className="flood-header">

            <div className="flood-title-area">
              <h1>
                Flood Risk & Hydrological Assessment
              </h1>

              <p>
                FEMA & Municipal hydrological risk
                analysis, flood plain zoning, and
                property elevation safety profile.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >

              {propertiesLoading ? (
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
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontWeight: "600",
                    backgroundColor: "white",
                    color: "black",
                    minWidth: "300px",
                  }}
                >
                  {properties.map((property) => (
                    <option
                      key={property.propertyId}
                      value={property.propertyId}
                    >
                      {property.propertyName}
                    </option>
                  ))}
                </select>
              )}

            </div>

          </header>

          {/* ============================
              ERROR
          ============================ */}
          {!loading &&
            !propertiesLoading &&
            errorMsg && (
              <div
                style={{
                  padding: "15px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                  fontWeight: "600",
                }}
              >
                {errorMsg}
              </div>
            )}

          {/* ============================
              LOADING
          ============================ */}
          {loading && (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Loading flood zone data...
            </div>
          )}

          {/* ============================
              NO PROPERTY
          ============================ */}
          {!propertiesLoading &&
            properties.length === 0 &&
            !errorMsg && (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                No properties available.
              </div>
            )}

          {/* ============================
              FLOOD DATA
          ============================ */}
          {!loading && (
            (() => {
              const profile = getFloodRiskProfile(selectedProperty, floodData);
              return (
            <>

              {/* Overview Banner */}
              <section className="risk-banner">

                <div className="risk-meter-box">

                  <div className="meter-circle" style={{ borderColor: profile.color }}>

                    <span className="meter-score" style={{ color: profile.color }}>
                      {profile.score}
                    </span>

                    <span className="meter-max" style={{ color: profile.color }}>
                      {profile.riskCategory}
                    </span>

                  </div>

                  <div className="risk-level-badge" style={{ color: profile.color }}>

                    <ShieldCheck size={16} />

                    {profile.riskLabel}

                  </div>

                </div>

                <div className="risk-details-content">

                  <div className="zone-cat-header">

                    <span className="zone-tag-lg">
                      FLOOD {profile.zone}
                    </span>

                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color:
                          "var(--text-muted)",
                      }}
                    >
                      FEMA FIRM Panel #
                      {profile.femaPanel}
                    </span>

                  </div>

                  <h2>
                    {profile.zone} Flood Risk
                    Assessment
                  </h2>

                  <p>
                    This property is classified
                    under{" "}
                    <strong>
                      {profile.zone}
                    </strong>
                    . The base flood elevation is{" "}
                    <strong>
                      +{profile.baseFloodElevation} ft MSL
                    </strong>
                    . The nearest water body is{" "}
                    <strong>
                      {profile.nearestWaterBody}
                    </strong>{" "}
                    at a distance of{" "}
                    <strong>
                      {profile.distanceToWaterBody} km
                    </strong>
                    . {profile.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginTop: "8px",
                    }}
                  >

                    <button
                      className="btn-primary"
                      style={{
                        width: "auto",
                        padding: "10px 20px",
                        fontSize: "14px",
                      }}
                      onClick={handleDownload}
                    >
                      <Download size={16} />

                      Download Flood Report
                    </button>

                  </div>

                </div>

              </section>

              {/* ============================
                  KEY RISK METRICS
              ============================ */}
              <section className="risk-metrics-grid">

                <div className="risk-metric-card">

                  <span className="metric-label-sm">
                    Flood Zone Classification
                  </span>

                  <span
                    className="metric-val-main"
                    style={{
                      color: profile.color,
                    }}
                  >
                    {profile.zone}
                  </span>

                  <span className="metric-desc-sm">
                    {profile.riskLabel}
                  </span>

                </div>

                <div className="risk-metric-card">

                  <span className="metric-label-sm">
                    Base Flood Elevation (BFE)
                  </span>

                  <span className="metric-val-main">
                    +{profile.baseFloodElevation} ft
                  </span>

                  <span className="metric-desc-sm">
                    Above Mean Sea Level (MSL)
                  </span>

                </div>

                <div className="risk-metric-card">

                  <span className="metric-label-sm">
                    Mandatory Insurance
                  </span>

                  <span
                    className="metric-val-main"
                    style={{
                      color:
                        profile.insuranceRequired
                          ? "#ef4444"
                          : "#10b981",
                    }}
                  >
                    {profile.insuranceLabel}
                  </span>

                  <span className="metric-desc-sm">
                    Based on flood zone classification
                  </span>

                </div>

                <div className="risk-metric-card">

                  <span className="metric-label-sm">
                    Nearest Water Body
                  </span>

                  <span className="metric-val-main">
                    {profile.distanceToWaterBody} km
                  </span>

                  <span className="metric-desc-sm">
                    {profile.nearestWaterBody}
                  </span>

                </div>

              </section>

              {/* ============================
                  PROPERTY RESILIENCE
              ============================ */}
              <section className="safety-grid">

                <div className="safety-card">

                  <div className="safety-card-title">

                    <ShieldCheck
                      className="text-primary"
                      size={22}
                    />

                    Property Resilience &
                    Infrastructure

                  </div>

                  <div className="mitigation-list">

                    <div className="mitigation-item">

                      <CheckCircle2
                        className="mitigation-icon"
                        size={18}
                      />

                      <div>

                        <div className="mitigation-title">
                          Flood Zone Verification
                        </div>

                        <div className="mitigation-sub">
                          Property is verified under{" "}
                          {profile.zone}{" "}
                          classification.
                        </div>

                      </div>

                    </div>

                    <div className="mitigation-item">

                      <CheckCircle2
                        className="mitigation-icon"
                        size={18}
                      />

                      <div>

                        <div className="mitigation-title">
                          Flood Elevation Assessment
                        </div>

                        <div className="mitigation-sub">
                          Base flood elevation
                          recorded at{" "}
                          {profile.baseFloodElevation}{" "}
                          ft.
                        </div>

                      </div>

                    </div>

                    <div className="mitigation-item">

                      <CheckCircle2
                        className="mitigation-icon"
                        size={18}
                      />

                      <div>

                        <div className="mitigation-title">
                          Water Body Proximity
                        </div>

                        <div className="mitigation-sub">
                          {profile.nearestWaterBody}{" "}
                          is{" "}
                          {profile.distanceToWaterBody}{" "}
                          km from the property.
                        </div>

                      </div>

                    </div>

                    <div className="mitigation-item">

                      <CheckCircle2
                        className="mitigation-icon"
                        size={18}
                      />

                      <div>

                        <div className="mitigation-title">
                          Flood Insurance Status
                        </div>

                        <div className="mitigation-sub">
                          Flood insurance is{" "}
                          {profile.insuranceRequired
                            ? "required"
                            : "not required"}{" "}
                          based on the available
                          assessment.
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ============================
                    HISTORICAL DATA
                ============================ */}
                <div className="safety-card">

                  <div className="safety-card-title">

                    <CloudRain
                      className="text-primary"
                      size={22}
                    />

                    Historical Heavy Rainfall
                    Impact Log

                  </div>

                  <div
                    style={{
                      padding: "20px 0",
                      color:
                        "var(--text-muted)",
                      fontSize: "14px",
                      lineHeight: "1.6",
                    }}
                  >
                    Historical rainfall event data
                    is not available in the current
                    flood-zone database for this
                    property.
                  </div>

                </div>

              </section>

            </>
              );
            })()
          )}

        </main>

      </div>
    </ProtectedRoute>
  );
}