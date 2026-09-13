"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  FileCheck, ShieldAlert, CheckCircle2, Clock, AlertCircle, Download,
  Building, TreePine, Search, Check, FileText, ShieldCheck, Sparkles, Printer, X
} from "lucide-react";
import "./permits.css";

const PROPERTIES = {
  "1": {
    id: "1", name: "Luxury Villa - Anna Nagar, Chennai",
    permits: [
      { id: "PER-2023-8810", type: "Building & Structural Plan Approval", authority: "CMDA Chennai Corporation", status: "approved", issueDate: "2023-01-15", approvalDate: "2023-02-28", contractor: "Apex Structural Engineers Pvt Ltd", notes: "Complete structural drawings and load calculation approved." },
      { id: "PER-2023-9204", type: "Electrical Wiring & Load Clearance", authority: "TANGEDCO Electricity Board", status: "approved", issueDate: "2023-03-10", approvalDate: "2023-03-22", contractor: "ElectroTech Solutions", notes: "3-Phase 15kW transformer load connection passed safety test." },
      { id: "PER-2023-9980", type: "Fire Safety NOC", authority: "Tamil Nadu Fire & Rescue Dept", status: "approved", issueDate: "2023-05-12", approvalDate: "2023-05-25", contractor: "SafeGuard Fire Protection", notes: "Fire hydrants, smoke detectors verified." }
    ],
    env: {
      score: "92/100", risk: "LOW", title: "Minimal Environmental Concern",
      esa: "Phase I ESA Completed",
      observations: [
        { t: "Soil Contamination Analysis", s: "clean", d: "Zero heavy metals or toxic pollutants found." },
        { t: "Radon Gas Exposure", s: "clean", d: "Below 0.5 pCi/L threshold." }
      ],
      compliance: [
        { t: "Waste Management Plan", s: "compliant", d: "Integrated organic composting unit." }
      ]
    }
  },
  "2": {
    id: "2", name: "Modern Apartment - Indiranagar, Bangalore",
    permits: [
      { id: "PER-2022-1011", type: "Building & Structural Plan Approval", authority: "BBMP Bangalore", status: "approved", issueDate: "2022-01-15", approvalDate: "2022-03-10", contractor: "L&T Constructions", notes: "High rise structural clearance." },
      { id: "PER-2022-2022", type: "Electrical Clearance", authority: "BESCOM", status: "approved", issueDate: "2022-04-10", approvalDate: "2022-04-20", contractor: "PowerGrid", notes: "Transformer installed." },
      { id: "PER-2022-3033", type: "Sanitary Permit", authority: "BWSSB", status: "approved", issueDate: "2022-05-01", approvalDate: "2022-05-15", contractor: "Aqua Flow", notes: "Sewer connection active." }
    ],
    env: {
      score: "85/100", risk: "LOW", title: "General Compliance",
      esa: "Phase I ESA Completed",
      observations: [
        { t: "Soil Testing", s: "clean", d: "No contaminants detected." }
      ],
      compliance: [
        { t: "Rainwater Harvesting", s: "compliant", d: "Active RWH pits installed." },
        { t: "Solar Water Heating", s: "compliant", d: "Solar panels active." }
      ]
    }
  },
  "3": {
    id: "3", name: "Independent House - RS Puram, Coimbatore",
    permits: [
      { id: "PER-2021-4044", type: "Building Plan Approval", authority: "Coimbatore Municipal Corp", status: "approved", issueDate: "2021-02-10", approvalDate: "2021-03-15", contractor: "Local Builder", notes: "Standard 2-story structure." },
      { id: "PER-2024-5055", type: "Additional Floor Permit", authority: "Coimbatore Municipal Corp", status: "pending", issueDate: "2024-01-10", approvalDate: "-", contractor: "Local Builder", notes: "Awaiting setback clearance." }
    ],
    env: {
      score: "65/100", risk: "MEDIUM", title: "Moderate Concern",
      esa: "Phase I ESA Required",
      observations: [
        { t: "Asbestos Roof Tiles", s: "warning", d: "Old shed has asbestos roofing, needs safe removal." }
      ],
      compliance: [
        { t: "Waste Management", s: "warning", d: "No proper solid waste disposal mechanism." }
      ]
    }
  },
  "4": {
    id: "4", name: "Premium Flat - Gachibowli, Hyderabad",
    permits: [
      { id: "PER-2020-6066", type: "Building Plan Approval", authority: "GHMC", status: "rejected", issueDate: "2020-05-10", approvalDate: "-", contractor: "Unknown", notes: "Plan deviates from Master Plan." },
      { id: "PER-2023-7077", type: "Environmental Clearance", authority: "Pollution Control Board", status: "rejected", issueDate: "2023-01-20", approvalDate: "-", contractor: "Unknown", notes: "Property violates Lake Buffer Zone." }
    ],
    env: {
      score: "30/100", risk: "HIGH", title: "Severe Violations",
      esa: "Phase II ESA Recommended",
      observations: [
        { t: "Wetland Encroachment", s: "danger", d: "Constructed on FTL buffer of lake." },
        { t: "Industrial Dumping", s: "danger", d: "Historical evidence of chemical dumping nearby." }
      ],
      compliance: [
        { t: "Enforcement Action", s: "danger", d: "Stop-work order issued by Municipal Authority." }
      ]
    }
  }
};

export default function PermitsEnvironmentalPage() {
  const [activeTab, setActiveTab] = useState("permits");
  const [selectedProperty, setSelectedProperty] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [showReport, setShowReport] = useState(false);

  const activeProp = PROPERTIES[selectedProperty];

  const filteredPermits = activeProp.permits.filter(p => p.type.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
        <Navbar />

        <main className="permits-page no-print">
          <header className="permits-header">
            <div className="permits-title-area">
              <h1>Permits & Environmental Safety Audit</h1>
              <p>Municipal building permits verification and Phase I Environmental Site Assessment (ESA).</p>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <select
                style={{ padding: "10px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", fontWeight: "600" }}
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
              >
                {Object.values(PROPERTIES).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </header>

          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === "permits" ? "active" : ""}`}
              onClick={() => setActiveTab("permits")}
            >
              <Building size={16} /> Building Permits & Licenses
            </button>
            <button
              className={`tab-btn ${activeTab === "environmental" ? "active" : ""}`}
              onClick={() => setActiveTab("environmental")}
            >
              <TreePine size={16} /> Environmental Due Diligence
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "permits" && (
              <div className="permits-tab-container">
                <div className="search-bar-row">
                  <div className="search-input-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search permits (e.g. Electrical, Building)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="permits-grid">
                  {filteredPermits.map((p) => (
                    <div key={p.id} className="permit-card">
                      <div className="permit-card-header">
                        <span className={`permit-status ${p.status}`}>
                          {p.status === "approved" && <CheckCircle2 size={12} />}
                          {p.status === "pending" && <Clock size={12} />}
                          {p.status === "rejected" && <AlertCircle size={12} />}
                          {p.status.toUpperCase()}
                        </span>
                        <span className="permit-id">{p.id}</span>
                      </div>
                      <div className="permit-card-body">
                        <h3>{p.type}</h3>
                        <p className="authority"><Building size={14} /> {p.authority}</p>
                        <div className="permit-dates">
                          <span><strong>Filed:</strong> {p.issueDate}</span>
                          <span><strong>Decision:</strong> {p.approvalDate}</span>
                        </div>
                        <p className="contractor"><strong>Applicant/Contractor:</strong> {p.contractor}</p>
                      </div>
                      <div className="permit-card-footer">
                        <FileCheck size={14} className="text-primary" />
                        <span className="permit-notes">{p.notes}</span>
                      </div>
                    </div>
                  ))}
                  {filteredPermits.length === 0 && (
                    <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>
                      No permits found.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "environmental" && (
              <div className="environmental-tab-container">
                <div className="esa-banner">
                  <div className="esa-score-box">
                    <div className="esa-score-circle">
                      <span className="score-val">{activeProp.env.score}</span>
                      <span className="score-lbl">ESA SCORE</span>
                    </div>
                  </div>
                  <div className="esa-banner-content">
                    <h2>{activeProp.env.title}</h2>
                    <p>Comprehensive {activeProp.env.esa} evaluating soil, air, water, and structural safety liabilities.</p>
                    <button
                      className="btn-outline-white"
                      style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", cursor: "pointer" }}
                      onClick={() => setShowReport(true)}
                    >
                      <Printer size={16} /> Print Full ESA Audit Report
                    </button>
                  </div>
                </div>

                <div className="env-grid">
                  <div className="env-section-card">
                    <div className="env-section-header">
                      <ShieldAlert className="text-primary" size={20} />
                      <h3>Site Contamination & Toxics</h3>
                    </div>
                    <div className="env-item-list">
                      {activeProp.env.observations.map((o, i) => (
                        <div key={i} className={`env-item ${o.s}`}>
                          <div className="env-item-icon">
                            {o.s === "clean" ? <Check size={16} /> : <AlertCircle size={16} />}
                          </div>
                          <div>
                            <div className="env-item-title">{o.t}</div>
                            <div className="env-item-desc">{o.d}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="env-section-card">
                    <div className="env-section-header">
                      <Sparkles className="text-primary" size={20} />
                      <h3>Sustainability & Compliance</h3>
                    </div>
                    <div className="env-item-list">
                      {activeProp.env.compliance.map((o, i) => (
                        <div key={i} className={`env-item ${o.s}`}>
                          <div className="env-item-icon">
                            {o.s === "compliant" ? <Check size={16} /> : <AlertCircle size={16} />}
                          </div>
                          <div>
                            <div className="env-item-title">{o.t}</div>
                            <div className="env-item-desc">{o.d}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {showReport && (
          <div className="receipt-modal-backdrop" onClick={() => setShowReport(false)}>
            <div className="receipt-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="receipt-modal-actions no-print">
                <button className="receipt-print-btn" onClick={() => window.print()}>
                  <Printer size={16} /> Print / Save as PDF
                </button>
                <button className="receipt-close-btn" onClick={() => setShowReport(false)}>
                  <X size={16} /> Close
                </button>
              </div>

              <div id="printable-esa-report" className="receipt-document" style={{ padding: "40px", width: "100%", background: "white", border: "none", margin: 0 }}>
                <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #1e293b", paddingBottom: "20px" }}>
                  <h1 style={{ margin: 0, fontSize: "28px", color: "#0f172a" }}>BUILDING PERMITS & ENVIRONMENTAL ESA REPORT</h1>
                  <p style={{ margin: "10px 0 0", fontSize: "16px", color: "#64748b" }}>Comprehensive Phase I ESA & Permit Audit</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "30px" }}>
                  <div>
                    <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Property Information</h3>
                    <p><strong>Property Name:</strong> {activeProp.name}</p>
                  </div>
                  <div>
                    <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Overall Status</h3>
                    <p><strong>Environmental Risk:</strong> {activeProp.env.risk} ({activeProp.env.title})</p>
                    <p><strong>ESA Score:</strong> {activeProp.env.score}</p>
                  </div>
                </div>

                <div style={{ marginBottom: "30px" }}>
                  <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Building Permits & Clearances</h3>
                  {activeProp.permits.map((p, i) => (
                    <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "15px", marginBottom: "15px", background: "#f8fafc" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <h4 style={{ margin: 0, color: "#0f172a" }}>{p.type}</h4>
                        <span style={{ padding: "4px 8px", background: p.status === "approved" ? "#dcfce7" : p.status === "rejected" ? "#fee2e2" : "#fef9c3", color: p.status === "approved" ? "#166534" : p.status === "rejected" ? "#991b1b" : "#854d0e", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>{p.status}</span>
                      </div>
                      <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}><strong>ID:</strong> {p.id} | <strong>Authority:</strong> {p.authority}</p>
                      <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}><strong>Applicant/Contractor:</strong> {p.contractor}</p>
                      <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}><strong>Filed:</strong> {p.issueDate} | <strong>Decision:</strong> {p.approvalDate}</p>
                      <p style={{ margin: "5px 0 0 0", fontSize: "14px", fontStyle: "italic", color: "#475569" }}>Remarks: {p.notes}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: "30px" }}>
                  <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Environmental Assessment Findings (ESA)</h3>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <tbody>
                      {activeProp.env.observations.map((f, i) => (
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
                      {activeProp.env.compliance.map((c, i) => (
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
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
