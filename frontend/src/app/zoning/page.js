"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  Ruler,
  ShieldCheck,
  Compass,
  FileCheck,
  Maximize2,
  Loader2
} from "lucide-react";
import "./zoning.css";

export default function ZoningPage() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [zoningData, setZoningData] = useState(null);

  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingZoning, setLoadingZoning] = useState(false);
  const [error, setError] = useState("");

  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // --------------------------------------------------
  // Get JWT token
  // --------------------------------------------------
  const getToken = () => {
    if (typeof window === "undefined") return null;

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("jwt")
    );
  };

  // --------------------------------------------------
  // Fetch all properties
  // --------------------------------------------------
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoadingProperties(true);
        setError("");

        const token = getToken();

        const headers = {
          "Content-Type": "application/json"
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
          "http://localhost:8080/api/properties",
          {
            method: "GET",
            headers
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch properties. Status: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Properties from backend:", data);

        setProperties(data);

        if (data.length > 0) {
          setSelectedProperty(String(data[0].propertyId));
        }
      } catch (error) {
        console.error("Property fetch error:", error);
        setError("Unable to load properties.");
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, []);

  // --------------------------------------------------
  // Fetch zoning whenever property changes
  // --------------------------------------------------
  useEffect(() => {
    if (!selectedProperty) {
      setZoningData(null);
      return;
    }

    const fetchZoning = async () => {
      try {
        setLoadingZoning(true);
        setError("");

        const token = getToken();

        const headers = {
          "Content-Type": "application/json"
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
          `http://localhost:8080/api/zoning/${selectedProperty}`,
          {
            method: "GET",
            headers
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch zoning. Status: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Actual zoning data:", data);

        setZoningData(data);
      } catch (error) {
        console.error("Zoning fetch error:", error);
        setZoningData(null);
        setError(
          "Zoning information is not available for this property."
        );
      } finally {
        setLoadingZoning(false);
      }
    };

    fetchZoning();
  }, [selectedProperty]);

  // --------------------------------------------------
  // Download actual zoning certificate
  // --------------------------------------------------
  const downloadCertificate = () => {
    if (!zoningData) return;

    const certificateContent = `
ZONING CLASSIFICATION CERTIFICATE

Property ID: ${zoningData.propertyId ?? "N/A"}
Property: ${zoningData.propertyName ?? "N/A"}

Address: ${zoningData.address ?? "N/A"}
City: ${zoningData.city ?? "N/A"}
State: ${zoningData.state ?? "N/A"}

Zoning Category: ${zoningData.zoningCategory ?? "N/A"}
Zoning Class: ${zoningData.zoningClass ?? "N/A"}

Planning Authority: ${zoningData.planningAuthority ?? "N/A"}
Master Plan: ${zoningData.masterPlan ?? "N/A"}
Parcel Identifier: ${zoningData.parcelIdentifier ?? "N/A"}

Compliance Status: ${zoningData.complianceStatus ?? "N/A"}

Max FAR: ${zoningData.maxFar ?? "N/A"}
Max Height: ${zoningData.maxHeight ?? "N/A"}
Ground Coverage: ${zoningData.groundCoverage ?? "N/A"}
Minimum Plot Area: ${zoningData.minPlotArea ?? "N/A"}

Front Setback: ${zoningData.frontSetback ?? "N/A"}
Rear Setback: ${zoningData.rearSetback ?? "N/A"}
Left Setback: ${zoningData.leftSetback ?? "N/A"}
Right Setback: ${zoningData.rightSetback ?? "N/A"}

Permitted Usage:
${zoningData.permittedUsage ?? "N/A"}

Restricted Usage:
${zoningData.restrictedUsage ?? "N/A"}

Special Regulations:
${zoningData.specialRegulations ?? "N/A"}
`;

    const blob = new Blob([certificateContent], {
      type: "text/plain"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Zoning-Certificate-${zoningData.propertyName || "Property"}.txt`;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------
  // Loading properties
  // --------------------------------------------------
  if (loadingProperties) {
    return (
      <ProtectedRoute>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--bg-main)"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "600"
            }}
          >
            <Loader2 size={22} className="animate-spin" />
            Loading properties...
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--bg-main)"
        }}
      >
        <Navbar />

        <main className="zoning-page">

          {/* ==================================================
              HEADER
          ================================================== */}
          <header className="zoning-header">

            <div className="zoning-title-area">
              <h1>Property Zoning & Land Use Dashboard</h1>

              <p>
                Comprehensive analysis of municipal zoning classifications,
                land usage permits, and building density limits.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center"
              }}
            >

              <div className="zoning-badge-header">
                <ShieldCheck size={18} />
                Zoning Information
              </div>

              <select
                style={{
                  padding: "10px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  fontWeight: "600"
                }}
                value={selectedProperty}
                onChange={(e) =>
                  setSelectedProperty(e.target.value)
                }
              >
                <option value="">
                  Select Property
                </option>

                {properties.map((property) => (
                  <option
                    key={property.propertyId}
                    value={property.propertyId}
                  >
                    {property.propertyName || `Property ${property.propertyId}`}
                  </option>
                ))}
              </select>

            </div>
          </header>


          {/* ==================================================
              ERROR
          ================================================== */}
          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "14px 18px",
                borderRadius: "10px",
                background: "#fee2e2",
                color: "#991b1b",
                border: "1px solid #fecaca",
                fontWeight: "600"
              }}
            >
              {error}
            </div>
          )}


          {/* ==================================================
              LOADING ZONING
          ================================================== */}
          {loadingZoning && (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                fontWeight: "600"
              }}
            >
              <Loader2
                size={25}
                className="animate-spin"
                style={{
                  margin: "0 auto 10px"
                }}
              />

              Loading zoning information...
            </div>
          )}


          {/* ==================================================
              ZONING CONTENT
          ================================================== */}
          {!loadingZoning && zoningData && (
            <>

              {/* ==================================================
                  TOP BANNER
              ================================================== */}
              <section className="zoning-banner-card">

                <div className="zoning-main-info">

                  <span className="zone-code-tag">
                    ZONING CATEGORY:{" "}
                    {zoningData.zoningCategory ?? "N/A"}
                  </span>

                  <h2>
                    {zoningData.zoningClass ?? "N/A"}
                  </h2>

                  <p>
                    {zoningData.specialRegulations ??
                      "Zoning information retrieved from the property record."}
                  </p>


                  {/* Property information */}
                  <div
                    className="banner-meta-list"
                    style={{
                      marginBottom: "18px"
                    }}
                  >

                    <div className="banner-meta-item">
                      <span className="meta-label">
                        Property
                      </span>

                      <span className="meta-val">
                        {zoningData.propertyName ?? "N/A"}
                      </span>
                    </div>

                    <div className="banner-meta-item">
                      <span className="meta-label">
                        Address
                      </span>

                      <span className="meta-val">
                        {zoningData.address ?? "N/A"}
                      </span>
                    </div>

                    <div className="banner-meta-item">
                      <span className="meta-label">
                        Location
                      </span>

                      <span className="meta-val">
                        {[
                          zoningData.city,
                          zoningData.state
                        ]
                          .filter(Boolean)
                          .join(", ") || "N/A"}
                      </span>
                    </div>

                  </div>


                  {/* Planning information */}
                  <div className="banner-meta-list">

                    <div className="banner-meta-item">
                      <span className="meta-label">
                        Planning Authority
                      </span>

                      <span className="meta-val">
                        {zoningData.planningAuthority ?? "N/A"}
                      </span>
                    </div>

                    <div className="banner-meta-item">
                      <span className="meta-label">
                        Master Plan Revision
                      </span>

                      <span className="meta-val">
                        {zoningData.masterPlan ?? "N/A"}
                      </span>
                    </div>

                    <div className="banner-meta-item">
                      <span className="meta-label">
                        Parcel Identifier
                      </span>

                      <span className="meta-val">
                        {zoningData.parcelIdentifier ?? "N/A"}
                      </span>
                    </div>

                  </div>

                </div>


                {/* ==================================================
                    COMPLIANCE
                ================================================== */}
                <div className="banner-status-box">

                  <div className="compliance-status-tag">

                    <CheckCircle size={20} />

                    {zoningData.complianceStatus ?? "N/A"}

                  </div>

                  <p
                    style={{
                      fontSize: "13px",
                      color: "#cbd5e1"
                    }}
                  >
                    Zoning compliance information retrieved from
                    the property record.
                  </p>

                  <button
                    style={{
                      marginTop: "8px",
                      padding: "8px 16px",
                      fontSize: "13px",
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "#fff",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer"
                    }}
                    onClick={downloadCertificate}
                  >
                    Download Certificate
                  </button>

                </div>

              </section>


              {/* ==================================================
                  METRICS
              ================================================== */}
              <section className="metrics-row">

                <div className="metric-card">
                  <span className="metric-title">
                    Max Permissible FAR
                  </span>

                  <span className="metric-value-huge">
                    {zoningData.maxFar ?? "N/A"}
                  </span>

                  <span className="metric-sub">
                    Floor Area Ratio Allowed
                  </span>
                </div>


                <div className="metric-card">
                  <span className="metric-title">
                    Max Height Limit
                  </span>

                  <span className="metric-value-huge">
                    {zoningData.maxHeight ?? "N/A"}
                  </span>

                  <span className="metric-sub">
                    Maximum permitted height
                  </span>
                </div>


                <div className="metric-card">
                  <span className="metric-title">
                    Max Ground Coverage
                  </span>

                  <span className="metric-value-huge">
                    {zoningData.groundCoverage ?? "N/A"}
                  </span>

                  <span className="metric-sub">
                    Maximum ground coverage
                  </span>
                </div>


                <div className="metric-card">
                  <span className="metric-title">
                    Min Plot Area Required
                  </span>

                  <span className="metric-value-huge">
                    {zoningData.minPlotArea ?? "N/A"}
                  </span>

                  <span className="metric-sub">
                    Minimum required plot area
                  </span>
                </div>

              </section>


              {/* ==================================================
                  TWO COLUMN DETAILS
              ================================================== */}
              <div className="dashboard-grid">


                {/* PERMITTED / RESTRICTED */}
                <div className="dashboard-card">

                  <div className="card-heading">
                    <Building
                      className="text-primary"
                      size={22}
                    />

                    Permitted & Restricted Usage Rules
                  </div>


                  <div className="usage-list">

                    <div className="usage-item permitted">

                      <CheckCircle
                        className="usage-icon"
                        size={18}
                      />

                      <div>
                        <div className="usage-title">
                          Permitted Usage
                        </div>

                        <div className="usage-desc">
                          {zoningData.permittedUsage ?? "N/A"}
                        </div>
                      </div>

                    </div>


                    <div className="usage-item prohibited">

                      <XCircle
                        className="usage-icon"
                        size={18}
                      />

                      <div>
                        <div className="usage-title">
                          Restricted Usage
                        </div>

                        <div className="usage-desc">
                          {zoningData.restrictedUsage ?? "N/A"}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>


                {/* SETBACK */}
                <div className="dashboard-card">

                  <div className="card-heading">
                    <Ruler
                      className="text-primary"
                      size={22}
                    />

                    Mandatory Setback Requirements
                  </div>


                  <div className="setback-grid">

                    <div className="setback-box">
                      <span className="setback-label">
                        Front Setback
                      </span>

                      <span className="setback-value">
                        {zoningData.frontSetback ?? "N/A"}
                      </span>

                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)"
                        }}
                      >
                        Road facing setback
                      </span>
                    </div>


                    <div className="setback-box">
                      <span className="setback-label">
                        Rear Boundary Setback
                      </span>

                      <span className="setback-value">
                        {zoningData.rearSetback ?? "N/A"}
                      </span>

                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)"
                        }}
                      >
                        Rear boundary clearance
                      </span>
                    </div>


                    <div className="setback-box">
                      <span className="setback-label">
                        Left Setback
                      </span>

                      <span className="setback-value">
                        {zoningData.leftSetback ?? "N/A"}
                      </span>

                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)"
                        }}
                      >
                        Left side clearance
                      </span>
                    </div>


                    <div className="setback-box">
                      <span className="setback-label">
                        Right Setback
                      </span>

                      <span className="setback-value">
                        {zoningData.rightSetback ?? "N/A"}
                      </span>

                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)"
                        }}
                      >
                        Right side clearance
                      </span>
                    </div>

                  </div>


                  {/* SPECIAL REGULATIONS */}
                  <div
                    style={{
                      background: "var(--bg-main)",
                      padding: "16px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      marginTop: "18px"
                    }}
                  >

                    <div
                      style={{
                        fontWeight: "700",
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <FileCheck
                        size={16}
                        className="text-primary"
                      />

                      Special Regulations
                    </div>

                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        lineHeight: "1.6"
                      }}
                    >
                      {zoningData.specialRegulations ??
                        "No special regulations available."}
                    </div>

                  </div>

                </div>

              </div>


              {/* ==================================================
                  GIS MAP
              ================================================== */}
              <section className="map-simulation-container">

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >

                    <Compass
                      size={22}
                      className="text-primary"
                    />

                    <div>

                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "700"
                        }}
                      >
                        Spatial GIS Zoning Boundary
                      </h3>

                      <span
                        style={{
                          fontSize: "13px",
                          color: "#94a3b8"
                        }}
                      >
                        Parcel:{" "}
                        {zoningData.parcelIdentifier ?? "N/A"}
                      </span>

                    </div>

                  </div>


                  <button
                    style={{
                      width: "auto",
                      padding: "8px 16px",
                      background: "#334155",
                      color: "#fff",
                      fontSize: "13px",
                      border: "1px solid #475569",
                      cursor: "pointer"
                    }}
                    onClick={() =>
                      setIsMapExpanded(!isMapExpanded)
                    }
                  >

                    <Maximize2
                      size={14}
                      style={{
                        marginRight: "6px"
                      }}
                    />

                    {isMapExpanded
                      ? "Collapse GIS Map"
                      : "Expand GIS Map"}

                  </button>

                </div>


                <div
                  className="simulated-map-view"
                  style={{
                    position: "relative",
                    minHeight: isMapExpanded
                      ? "500px"
                      : "275px",
                    transition: "all 0.3s ease"
                  }}
                >

                  <div
                    style={{
                      position: "absolute",
                      width: "310px",
                      height: "220px",
                      border: "3px dashed #f59e0b",
                      left: "50%",
                      top: "50%",
                      transform:
                        "translate(-50%, -50%)",
                      borderRadius: "10px"
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      width: "260px",
                      height: "170px",
                      border: "3px solid #6366f1",
                      left: "50%",
                      top: "50%",
                      transform:
                        "translate(-50%, -50%)",
                      borderRadius: "8px"
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      width: "180px",
                      height: "110px",
                      border: "3px solid #10b981",
                      left: "50%",
                      top: "50%",
                      transform:
                        "translate(-50%, -50%)",
                      borderRadius: "5px"
                    }}
                  />

                  <div className="zone-plot-overlay">
                    {zoningData.parcelIdentifier ??
                      "Property Parcel"}
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8"
                    }}
                  >
                    Zoning boundary visualization
                  </div>

                </div>


                <div className="map-legend">

                  <div className="legend-item">
                    <span
                      className="legend-dot"
                      style={{
                        background: "#6366f1"
                      }}
                    />

                    Property Parcel Boundary
                  </div>

                  <div className="legend-item">
                    <span
                      className="legend-dot"
                      style={{
                        background: "#10b981"
                      }}
                    />

                    Approved Building Footprint
                  </div>

                  <div className="legend-item">
                    <span
                      className="legend-dot"
                      style={{
                        background: "#f59e0b"
                      }}
                    />

                    Setback Line Clearance
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