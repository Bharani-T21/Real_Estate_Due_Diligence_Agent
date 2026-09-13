"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  Waves, ShieldCheck, AlertTriangle, CheckCircle2, Info, Droplets,
  CloudRain, ShieldAlert, ArrowUpRight, Download, FileSpreadsheet, Printer, X
} from "lucide-react";
import "./flood-zone.css";

const PROPERTIES = {
  "1": {
    id: "1", name: "Luxury Villa - Anna Nagar, Chennai", zone: "Zone X",
    score: "2/10", riskLevel: "LOW RISK",
    zoneDesc: "Zone X (500-Year Floodplain - Minimal Hazard)",
    desc: "This parcel is located in Zone X, determined to be outside the 100-year flood zone and above the 500-year principal flood level. Mandatory flood insurance coverage is NOT required for mortgage qualification.",
    fema: "FEMA FIRM Panel #33001C0210F",
    bfe: "+14.2 ft", insurance: "Not Required", waterBody: "2.4 km (Cooum River)",
    mitigations: [
      { t: "Plinth & Foundation Elevation", d: "Ground level raised 3.5 ft above road level to prevent flash runoff entry." },
      { t: "Subsurface Stormwater Drainage", d: "Equipped with heavy-capacity storm channels connected to main municipal arterial drains." },
      { t: "Dual Sump & Backflow Valves", d: "Non-return sewage valves installed to prevent backflow during severe rainfall." }
    ],
    timeline: [
      { y: "2023", e: "Cyclone Michaung (380mm Rainfall)", o: "✅ Zero structural flooding. Road cleared within 4 hours." },
      { y: "2015", e: "Chennai Historic Deluge", o: "✅ No water ingress into building premises (Elevated Foundation)." }
    ]
  },
  "2": {
    id: "2", name: "Modern Apartment - Indiranagar, Bangalore", zone: "Zone X",
    score: "3/10", riskLevel: "LOW RISK",
    zoneDesc: "Zone X (Minimal Flood Hazard)",
    desc: "Located on higher elevation in East Bangalore. Not subject to historic lakebed flooding.",
    fema: "BBMP Flood Map #BLR-EAST-44",
    bfe: "+22.5 ft", insurance: "Not Required", waterBody: "1.2 km (Bellandur Lake Buffer)",
    mitigations: [
      { t: "Elevated Basement Ramp", d: "Basement parking ramp is elevated by 2 ft." },
      { t: "Rainwater Harvesting", d: "Mandatory RWH pits active and functional." }
    ],
    timeline: [
      { y: "2022", e: "Bangalore September Floods", o: "✅ Area unaffected due to natural elevation." }
    ]
  },
  "3": {
    id: "3", name: "Independent House - RS Puram, Coimbatore", zone: "Zone AE",
    score: "5/10", riskLevel: "MODERATE RISK",
    zoneDesc: "Zone AE (100-Year Floodplain - Moderate Hazard)",
    desc: "Located near natural drainage basin. Subject to minor inundation during extreme monsoon events. Optional flood insurance recommended.",
    fema: "CBE Flood Map #CBE-WEST-12",
    bfe: "+4.5 ft", insurance: "Recommended", waterBody: "0.5 km (Muthannan Kulam)",
    mitigations: [
      { t: "Boundary Wall Weep Holes", d: "Wall designed to allow water passage, reducing structural stress." }
    ],
    timeline: [
      { y: "2021", e: "Heavy SW Monsoon", o: "⚠️ Street level waterlogging for 6 hours. No indoor damage." }
    ]
  },
  "4": {
    id: "4", name: "Premium Flat - Gachibowli, Hyderabad", zone: "Zone VE",
    score: "9/10", riskLevel: "HIGH RISK",
    zoneDesc: "Zone VE (High Flood Hazard - Coastal/Lake Buffer)",
    desc: "Property is located within the critical full-tank level (FTL) buffer of a major lake. Very high susceptibility to flooding.",
    fema: "GHMC FTL Map #HYD-99",
    bfe: "-1.2 ft (Below FTL)", insurance: "MANDATORY", waterBody: "0.1 km (Osman Sagar Buffer)",
    mitigations: [
      { t: "Sump Pumps", d: "Requires constant pumping during monsoon. High failure risk." }
    ],
    timeline: [
      { y: "2020", e: "Hyderabad Floods", o: "❌ Basement inundated completely. Power cut for 4 days." },
      { y: "2023", e: "July Deluge", o: "❌ Ground floor flooded up to 2 ft." }
    ]
  }
};

export default function FloodZonePage() {
  const [selectedProperty, setSelectedProperty] = useState("1");
  const [showCertificate, setShowCertificate] = useState(false);

  const activeProp = PROPERTIES[selectedProperty];

  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
        <Navbar />

        <main className="flood-page no-print">
          <header className="flood-header">
            <div className="flood-title-area">
              <h1>Flood Risk & Hydrological Assessment</h1>
              <p>FEMA & Municipal hydrological risk analysis, flood plain zoning, and property elevation safety profile.</p>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <select
                style={{ padding: "10px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", fontWeight: "600" }}
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
              >
                {Object.values(PROPERTIES).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.zone})
                  </option>
                ))}
              </select>
            </div>
          </header>

          <section className="risk-banner">
            <div className="risk-meter-box">
              <div className="meter-circle">
                <span className="meter-score">{activeProp.score}</span>
                <span className="meter-max">{activeProp.riskLevel}</span>
              </div>
              <div className="risk-level-badge">
                {activeProp.riskLevel === "HIGH RISK" ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                {activeProp.zone}
              </div>
            </div>

            <div className="risk-details-content">
              <div className="zone-cat-header">
                <span className="zone-tag-lg">FLOOD {activeProp.zone}</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>
                  {activeProp.fema}
                </span>
              </div>

              <h2>{activeProp.zoneDesc}</h2>
              <p>{activeProp.desc}</p>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  className="btn-primary"
                  style={{ width: "auto", padding: "10px 20px", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
                  onClick={() => setShowCertificate(true)}
                >
                  <Printer size={16} /> Print Flood Certificate
                </button>
              </div>
            </div>
          </section>

          <section className="risk-metrics-grid">
            <div className="risk-metric-card">
              <span className="metric-label-sm">Flood Zone Classification</span>
              <span className="metric-val-main" style={{ color: "#2563eb" }}>{activeProp.zone}</span>
              <span className="metric-desc-sm">Hazard Area</span>
            </div>
            <div className="risk-metric-card">
              <span className="metric-label-sm">Base Flood Elevation (BFE)</span>
              <span className="metric-val-main">{activeProp.bfe}</span>
              <span className="metric-desc-sm">Above Mean Sea Level</span>
            </div>
            <div className="risk-metric-card">
              <span className="metric-label-sm">Mandatory Insurance</span>
              <span className="metric-val-main" style={{ color: activeProp.insurance === "MANDATORY" ? "red" : "#10b981" }}>{activeProp.insurance}</span>
              <span className="metric-desc-sm">Coverage requirement</span>
            </div>
            <div className="risk-metric-card">
              <span className="metric-label-sm">Nearest Water Body</span>
              <span className="metric-val-main">{activeProp.waterBody}</span>
              <span className="metric-desc-sm">Buffer distance</span>
            </div>
          </section>

          <section className="safety-grid">
            <div className="safety-card">
              <div className="safety-card-title">
                <ShieldCheck className="text-primary" size={22} />
                Property Resilience & Mitigation
              </div>
              <div className="mitigation-list">
                {activeProp.mitigations.map((m, i) => (
                  <div key={i} className="mitigation-item">
                    <CheckCircle2 className="mitigation-icon" size={18} />
                    <div>
                      <div className="mitigation-title">{m.t}</div>
                      <div className="mitigation-sub">{m.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="safety-card">
              <div className="safety-card-title">
                <CloudRain className="text-primary" size={22} />
                Historical Heavy Rainfall Impact Log
              </div>
              <div className="timeline-list">
                {activeProp.timeline.map((t, i) => (
                  <div key={i} className="timeline-item">
                    <span className="timeline-year">{t.y}</span>
                    <div className="timeline-info">
                      <div className="timeline-event-name">{t.e}</div>
                      <div className="timeline-outcome">{t.o}</div>
                    </div>
                  </div>
                ))}
              </div>
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

              <div id="printable-flood-certificate" className="receipt-document" style={{ padding: "40px", width: "100%", background: "white", border: "none", margin: 0 }}>
                  <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #1e293b", paddingBottom: "20px" }}>
                    <h1 style={{ margin: 0, fontSize: "28px", color: "#0f172a" }}>HYDROLOGICAL & FLOOD RISK CERTIFICATE</h1>
                    <p style={{ margin: "10px 0 0", fontSize: "16px", color: "#64748b" }}>FEMA & Municipal Flood Plain Zoning Audit</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "30px" }}>
                    <div>
                      <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Property Information</h3>
                      <p><strong>Property:</strong> {activeProp.name}</p>
                      <p><strong>Parcel ID:</strong> {activeProp.id}-FZ-2024</p>
                    </div>
                    <div>
                      <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Flood Classification</h3>
                      <p><strong>FEMA Zone:</strong> {activeProp.zone}</p>
                      <p><strong>Risk Level:</strong> {activeProp.riskLevel}</p>
                      <p><strong>Insurance Requirement:</strong> {activeProp.insurance}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: "30px" }}>
                    <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Flood Metrics & Findings</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", width: "50%" }}><strong>Base Flood Elevation (BFE):</strong></td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>{activeProp.bfe}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}><strong>FEMA Map Reference:</strong></td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>{activeProp.fema}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}><strong>Historical Flooding Records:</strong></td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>{activeProp.timeline.length} Events Recorded</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div style={{ marginBottom: "30px" }}>
                    <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Mitigation & Requirements</h3>
                    <p style={{ lineHeight: "1.6", background: "#f1f5f9", padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      {activeProp.mitigations.map((m, i) => (
                        <span key={i}><strong>{m.t}:</strong> {m.d}<br/></span>
                      ))}
                    </p>
                  </div>

                  <div style={{ marginTop: "50px", textAlign: "center", borderTop: "1px solid #cbd5e1", paddingTop: "20px", color: "#64748b", fontSize: "14px" }}>
                    <p>This is a computer-generated hydrological audit. Valid for due diligence purposes.</p>
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
