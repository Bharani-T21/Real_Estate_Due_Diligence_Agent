"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  Layers, CheckCircle, XCircle, AlertCircle, Building, Ruler,
  ShieldCheck, Compass, MapPin, FileCheck, Maximize2, Printer, X
} from "lucide-react";
import "./zoning.css";

const PROPERTIES = {
  "1": {
    id: "1", title: "Luxury Villa", location: "Anna Nagar, Chennai, TN", code: "RES-R2-A", 
    desc: "R-2 Medium Density Residential Zone",
    allow: "Designated for primary residential use allowing single-family houses, semi-detached villas, duplex apartments, and low-rise multi-family residential structures up to 4 stories (15 meters).",
    auth: "CMDA Chennai Authority", master: "Second Master Plan 2026", parcel: "Block 14 / Survey #204",
    status: "100% Zoning Compliant", statusDesc: "Existing structure and intended usage adhere strictly to municipal set-backs and density parameters.",
    far: "1.75", height: "45 ft", coverage: "60%", minPlot: "2,400",
    frontSetback: "20.0 ft", rearSetback: "15.0 ft", sideLeft: "10.0 ft", sideRight: "10.0 ft",
    overlay1: "Heritage Zone Clearance: Not Required (Clear of heritage sites)",
    overlay2: "Coastal Regulation Zone (CRZ): Outside Restricted CRZ Tier",
    overlay3: "Airport Height Clearance: Approved (Up to 60m height allowed in zone)",
    coord: "13.0827° N, 80.2707° E"
  },
  "2": {
    id: "2", title: "Modern Apartment", location: "Indiranagar, Bangalore, KA", code: "C-1 Commercial Mixed",
    desc: "C-1 Mixed Use Zone",
    allow: "Allows for residential apartments with commercial activities on ground floor. Ideal for retail and high-density residential.",
    auth: "BMRDA Bangalore Authority", master: "Revised Master Plan 2031", parcel: "Sector 3 / Survey #42",
    status: "100% Zoning Compliant", statusDesc: "Fully compliant with commercial-residential mixed-use requirements.",
    far: "2.25", height: "60 ft", coverage: "50%", minPlot: "3,000",
    frontSetback: "25.0 ft", rearSetback: "20.0 ft", sideLeft: "15.0 ft", sideRight: "15.0 ft",
    overlay1: "Traffic Impact Area: Moderate (No restrictions)",
    overlay2: "Lake Buffer Zone: Cleared (> 75m from water body)",
    overlay3: "Airport Height Clearance: Approved",
    coord: "12.9716° N, 77.5946° E"
  },
  "3": {
    id: "3", title: "Independent House", location: "RS Puram, Coimbatore, TN", code: "R-1 Low Density",
    desc: "R-1 Low Density Residential Zone",
    allow: "Strictly for single-family independent houses. No commercial activities allowed.",
    auth: "Coimbatore Local Planning", master: "Master Plan 2025", parcel: "Block A / Survey #18",
    status: "Minor Setback Violation", statusDesc: "Notice issued regarding minor boundary wall encroachment on public right-of-way.",
    far: "1.25", height: "30 ft", coverage: "65%", minPlot: "1,500",
    frontSetback: "15.0 ft", rearSetback: "10.0 ft", sideLeft: "5.0 ft", sideRight: "5.0 ft",
    overlay1: "Heritage Zone: Adjoining Heritage Precinct (Needs NOC for major changes)",
    overlay2: "Hill Area Conservation: N/A",
    overlay3: "Groundwater Recharge Zone: Mandatory Rainwater Harvesting",
    coord: "11.0168° N, 76.9558° E"
  },
  "4": {
    id: "4", title: "Premium Flat", location: "Gachibowli, Hyderabad, TS", code: "HUDA-R3",
    desc: "R-3 High Density Residential Zone",
    allow: "High-rise apartments and group housing schemes.",
    auth: "HMDA Hyderabad Authority", master: "HMDA Master Plan 2031", parcel: "Survey #99/A",
    status: "Buffer Zone Violation", statusDesc: "Property falls inside the high-risk river basin buffer zone and violates municipal construction guidelines.",
    far: "3.00", height: "120 ft", coverage: "40%", minPlot: "5,000",
    frontSetback: "30.0 ft", rearSetback: "25.0 ft", sideLeft: "20.0 ft", sideRight: "20.0 ft",
    overlay1: "Wetland Buffer Encroachment: ACTIVE VIOLATION",
    overlay2: "Fire Safety Buffer: Inadequate turning radius",
    overlay3: "Airport Height Clearance: Conditional Approval",
    coord: "17.4401° N, 78.3489° E"
  }
};

export default function ZoningPage() {
  const [selectedProperty, setSelectedProperty] = useState("1");
  const [showCertificate, setShowCertificate] = useState(false);

  const activeProp = PROPERTIES[selectedProperty];

  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
        <Navbar />

        <main className="zoning-page no-print">
          <header className="zoning-header">
            <div className="zoning-title-area">
              <h1>Property Zoning & Land Use Dashboard</h1>
              <p>Comprehensive analysis of municipal zoning classifications, land usage permits, and building density limits.</p>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div className="zoning-badge-header">
                <ShieldCheck size={18} />
                CMDA Verified Zoning
              </div>
              <select
                style={{ padding: "10px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", fontWeight: "600" }}
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
              >
                {Object.values(PROPERTIES).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} - {p.code}
                  </option>
                ))}
              </select>
            </div>
          </header>

          <section className="zoning-banner-card">
            <div className="zoning-main-info">
              <span className="zone-code-tag">ZONING CATEGORY: {activeProp.code}</span>
              <h2>{activeProp.desc}</h2>
              <p>{activeProp.allow}</p>

              <div className="banner-meta-list">
                <div className="banner-meta-item">
                  <span className="meta-label">Planning Authority</span>
                  <span className="meta-val">{activeProp.auth}</span>
                </div>
                <div className="banner-meta-item">
                  <span className="meta-label">Master Plan</span>
                  <span className="meta-val">{activeProp.master}</span>
                </div>
                <div className="banner-meta-item">
                  <span className="meta-label">Parcel Identifier</span>
                  <span className="meta-val">{activeProp.parcel}</span>
                </div>
              </div>
            </div>

            <div className="banner-status-box">
              <div className="compliance-status-tag">
                {activeProp.status.includes("Violation") ? <XCircle size={20} /> : <CheckCircle size={20} />}
                {activeProp.status}
              </div>
              <p style={{ fontSize: "13px", color: "#cbd5e1" }}>
                {activeProp.statusDesc}
              </p>
              <button
                style={{
                  marginTop: "8px", padding: "8px 16px", fontSize: "13px",
                  background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff", borderRadius: "var(--radius-md)", cursor: "pointer", display: "flex", gap: "6px", alignItems: "center"
                }}
                onClick={() => setShowCertificate(true)}
              >
                <Printer size={14} /> Print Certificate
              </button>
            </div>
          </section>

          <section className="metrics-row">
            <div className="metric-card">
              <span className="metric-title">Max Permissible FAR</span>
              <span className="metric-value-huge">{activeProp.far}</span>
              <span className="metric-sub">Floor Area Ratio Allowed</span>
            </div>
            <div className="metric-card">
              <span className="metric-title">Max Height Limit</span>
              <span className="metric-value-huge">{activeProp.height}</span>
              <span className="metric-sub">Maximum building height</span>
            </div>
            <div className="metric-card">
              <span className="metric-title">Max Ground Coverage</span>
              <span className="metric-value-huge">{activeProp.coverage}</span>
              <span className="metric-sub">Max Builtup Area of Plot</span>
            </div>
            <div className="metric-card">
              <span className="metric-title">Min Plot Area Required</span>
              <span className="metric-value-huge">{activeProp.minPlot}</span>
              <span className="metric-sub">Sq. Ft. minimum plot size</span>
            </div>
          </section>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-heading">
                <Building className="text-primary" size={22} />
                Permitted & Restricted Usage Rules
              </div>
              <div className="usage-list">
                <div className="usage-item permitted">
                  <CheckCircle className="usage-icon" size={18} />
                  <div>
                    <div className="usage-title">Primary Usage</div>
                    <div className="usage-desc">{activeProp.allow}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-heading">
                <Ruler className="text-primary" size={22} />
                Mandatory Setback Requirements
              </div>
              <div className="setback-grid">
                <div className="setback-box">
                  <span className="setback-label">Front Setback</span>
                  <span className="setback-value">{activeProp.frontSetback}</span>
                </div>
                <div className="setback-box">
                  <span className="setback-label">Rear Setback</span>
                  <span className="setback-value">{activeProp.rearSetback}</span>
                </div>
                <div className="setback-box">
                  <span className="setback-label">Side (Left)</span>
                  <span className="setback-value">{activeProp.sideLeft}</span>
                </div>
                <div className="setback-box">
                  <span className="setback-label">Side (Right)</span>
                  <span className="setback-value">{activeProp.sideRight}</span>
                </div>
              </div>

              <div style={{ background: "var(--bg-main)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", marginTop: "16px" }}>
                <div style={{ fontWeight: "700", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileCheck size={16} className="text-primary" />
                  Overlay District Regulations
                </div>
                <ul style={{ paddingLeft: "20px", fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li>{activeProp.overlay1}</li>
                  <li>{activeProp.overlay2}</li>
                  <li>{activeProp.overlay3}</li>
                </ul>
              </div>
            </div>
          </div>

          <section className="map-simulation-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Compass size={22} className="text-primary" />
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Spatial GIS Zoning Boundary</h3>
                  <span style={{ fontSize: "13px", color: "#94a3b8" }}>{activeProp.parcel} - {activeProp.location}</span>
                </div>
              </div>
            </div>

            <div className="simulated-map-view">
              <div className="zone-plot-overlay">
                Plot ({activeProp.code})
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>📍 Coordinates: {activeProp.coord}</div>
            </div>
          </section>
        </main>

        {showCertificate && (
          <div className="receipt-modal-backdrop" onClick={() => setShowCertificate(false)}>
            <div className="receipt-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="receipt-modal-actions no-print">
                <button className="receipt-print-btn" onClick={() => window.print()}>
                  <Printer size={16} /> Print / Save as PDF
                </button>
                <button className="receipt-close-btn" onClick={() => setShowCertificate(false)}>
                  <X size={16} /> Close
                </button>
              </div>

              <div id="printable-zoning-certificate" className="receipt-document" style={{ padding: "40px", width: "100%", background: "white", border: "none", margin: 0 }}>
                  <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #1e293b", paddingBottom: "20px" }}>
                    <h1 style={{ margin: 0, fontSize: "28px", color: "#0f172a" }}>OFFICIAL ZONING & LAND USE CERTIFICATE</h1>
                    <p style={{ margin: "10px 0 0", fontSize: "16px", color: "#64748b" }}>{activeProp.auth} - {activeProp.master}</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "30px" }}>
                    <div>
                      <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Property Information</h3>
                      <p><strong>Property:</strong> {activeProp.title}</p>
                      <p><strong>Location:</strong> {activeProp.location}</p>
                      <p><strong>Parcel ID:</strong> {activeProp.parcel}</p>
                      <p><strong>Coordinates:</strong> {activeProp.coord}</p>
                    </div>
                    <div>
                      <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Zoning Classification</h3>
                      <p><strong>Zone Code:</strong> {activeProp.code}</p>
                      <p><strong>Description:</strong> {activeProp.desc}</p>
                      <p><strong>Compliance Status:</strong> {activeProp.status}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: "30px" }}>
                    <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Dimensional Standards & Limits</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", width: "25%" }}><strong>Max FAR:</strong></td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", width: "25%" }}>{activeProp.far}</td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", width: "25%" }}><strong>Max Height:</strong></td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", width: "25%" }}>{activeProp.height}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}><strong>Max Coverage:</strong></td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>{activeProp.coverage}</td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}><strong>Min Plot Size:</strong></td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>{activeProp.minPlot} sq.ft.</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}><strong>Front Setback:</strong></td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>{activeProp.frontSetback}</td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}><strong>Rear Setback:</strong></td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>{activeProp.rearSetback}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}><strong>Side Left:</strong></td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>{activeProp.sideLeft}</td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}><strong>Side Right:</strong></td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>{activeProp.sideRight}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div style={{ marginBottom: "30px" }}>
                    <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Overlay Zones & Special Conditions</h3>
                    <ul style={{ margin: "10px 0 0", paddingLeft: "20px", color: "#334155", lineHeight: "1.6" }}>
                      <li>{activeProp.overlay1}</li>
                      <li>{activeProp.overlay2}</li>
                      <li>{activeProp.overlay3}</li>
                    </ul>
                  </div>

                  <div style={{ marginTop: "50px", textAlign: "center", borderTop: "1px solid #cbd5e1", paddingTop: "20px", color: "#64748b", fontSize: "14px" }}>
                    <p>This is a computer-generated zoning audit. Valid for due diligence purposes.</p>
                    <p><strong>Printed on:</strong> {new Date().toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
