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
          "http://localhost:8080/api/properties",
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
          `http://localhost:8080/api/flood-zone/${selectedProperty}`,
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

  // ============================
  // DOWNLOAD REPORT
  // ============================
  const handleDownload = () => {
    if (!floodData) {
      alert("Flood data is not available for download.");
      return;
    }

    const selectedPropertyInfo = properties.find(
      (property) =>
        String(property.propertyId) ===
        String(selectedProperty)
    );

    const report = {
      propertyId: floodData.propertyId,
      propertyName:
        selectedPropertyInfo?.propertyName || "Property",
      address: selectedPropertyInfo?.address || "",
      city: selectedPropertyInfo?.city || "",
      state: selectedPropertyInfo?.state || "",
      floodZone: floodData.zone,
      baseFloodElevation:
        floodData.baseFloodElevation,
      insuranceRequired:
        floodData.insuranceRequired,
      nearestWaterBody:
        floodData.nearestWaterBody,
      distanceToWaterBody:
        floodData.distanceToWaterBody,
      femaPanel: floodData.femaPanel,
    };

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      `flood-zone-report-property-${floodData.propertyId}.json`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
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
          {!loading && floodData && (
            <>

              {/* Overview Banner */}
              <section className="risk-banner">

                <div className="risk-meter-box">

                  <div className="meter-circle">

                    <span className="meter-score">
                      {floodData.insuranceRequired
                        ? "7/10"
                        : "2/10"}
                    </span>

                    <span className="meter-max">
                      {floodData.insuranceRequired
                        ? "HIGH RISK"
                        : "LOW RISK"}
                    </span>

                  </div>

                  <div className="risk-level-badge">

                    <ShieldCheck size={16} />

                    {floodData.insuranceRequired
                      ? "Flood Risk Detected"
                      : "Minimal Flood Risk"}

                  </div>

                </div>

                <div className="risk-details-content">

                  <div className="zone-cat-header">

                    <span className="zone-tag-lg">
                      FLOOD {floodData.zone}
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
                      {floodData.femaPanel}
                    </span>

                  </div>

                  <h2>
                    {floodData.zone} Flood Risk
                    Assessment
                  </h2>

                  <p>
                    This property is classified
                    under{" "}
                    <strong>
                      {floodData.zone}
                    </strong>
                    . The base flood elevation is{" "}
                    <strong>
                      {floodData.baseFloodElevation} ft
                    </strong>
                    . The nearest water body is{" "}
                    <strong>
                      {floodData.nearestWaterBody}
                    </strong>{" "}
                    at a distance of{" "}
                    <strong>
                      {floodData.distanceToWaterBody} km
                    </strong>
                    .
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
                      color: "#2563eb",
                    }}
                  >
                    {floodData.zone}
                  </span>

                  <span className="metric-desc-sm">
                    Flood Risk Classification
                  </span>

                </div>

                <div className="risk-metric-card">

                  <span className="metric-label-sm">
                    Base Flood Elevation (BFE)
                  </span>

                  <span className="metric-val-main">
                    +{floodData.baseFloodElevation} ft
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
                        floodData.insuranceRequired
                          ? "#ef4444"
                          : "#10b981",
                    }}
                  >
                    {floodData.insuranceRequired
                      ? "Required"
                      : "Not Required"}
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
                    {floodData.distanceToWaterBody} km
                  </span>

                  <span className="metric-desc-sm">
                    {floodData.nearestWaterBody}
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
                          {floodData.zone}{" "}
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
                          {floodData.baseFloodElevation}{" "}
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
                          {floodData.nearestWaterBody}{" "}
                          is{" "}
                          {floodData.distanceToWaterBody}{" "}
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
                          {floodData.insuranceRequired
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
          )}

        </main>

      </div>
    </ProtectedRoute>
  );
}