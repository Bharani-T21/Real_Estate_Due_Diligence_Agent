"use client";

import { useState, useEffect } from "react";
import { propertyApi, dueDiligenceApi } from "../../services/api";

export default function DueDiligenceReport() {
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await propertyApi.getAll();
        if (data) setProperties(data);
      } catch (err) {
        console.error("Failed to load properties:", err);
      }
    };
    fetchProperties();
  }, []);

  const handleProcessDueDiligence = async () => {
    if (!selectedPropertyId) return;
    setLoading(true);
    try {
      const data = await dueDiligenceApi.processDueDiligence(selectedPropertyId);
      setReport(data);
    } catch (err) {
      console.error("Failed to process due diligence:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!report || !report.propertyId) return;
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:8080/api/due-diligence/${report.propertyId}/export/pdf`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Failed to export PDF");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `due-diligence-${report.propertyId}.pdf`;
      a.click();
    } catch (err) {
      console.error("PDF Export error:", err);
    }
  };

  const handleExportExcel = async () => {
    if (!report || !report.propertyId) return;
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:8080/api/due-diligence/${report.propertyId}/export/excel`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Failed to export Excel");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `due-diligence-${report.propertyId}.xlsx`;
      a.click();
    } catch (err) {
      console.error("Excel Export error:", err);
    }
  };

  return (
    <div
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#4338CA",
            marginBottom: "30px",
          }}
        >
          Due Diligence Report
        </h1>

        {/* Property Selector */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
          <select 
            value={selectedPropertyId} 
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "300px" }}
          >
            <option value="">-- Select a Property --</option>
            {properties.map((p) => (
              <option key={p.id || p.propertyId} value={p.id || p.propertyId}>
                {p.title || p.name || p.address || p.id || p.propertyId}
              </option>
            ))}
          </select>
          <button 
            onClick={handleProcessDueDiligence} 
            disabled={!selectedPropertyId || loading}
            style={{
              padding: "10px 20px",
              background: "#4338CA",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: (!selectedPropertyId || loading) ? "not-allowed" : "pointer",
              opacity: (!selectedPropertyId || loading) ? 0.7 : 1
            }}
          >
            {loading ? "Processing..." : "Run Due Diligence"}
          </button>
        </div>

        {report && (
          <>
            {/* Property Details */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2>🏠 Property Information</h2>
              <p><b>Property ID:</b> {report.propertyId}</p>
              <p><b>Owner:</b> {report.owner}</p>
              <p><b>Address:</b> {report.address}</p>
              <p><b>Area:</b> {report.area}</p>
            </div>

            {/* Risk Assessment */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2>⚠️ Risk Assessment</h2>
              <p>✔ Legal Status : {report.legalStatus}</p>
              <p>✔ Flood Risk : {report.floodRisk}</p>
              <p>✔ Financial Risk : {report.financialRisk}</p>
            </div>

            {/* Comparable Properties */}
            {report.comparableProperties && report.comparableProperties.length > 0 && (
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h2>📊 Comparable Properties</h2>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "15px",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#4338CA", color: "white" }}>
                      <th style={{ padding: "10px" }}>Property ID</th>
                      <th>Location</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.comparableProperties.map((property) => (
                      <tr key={property.id || Math.random()}>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                          {property.id || property.propertyId}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                          {property.location || property.address}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                          {property.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Market Value */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2>💰 Estimated Market Value</h2>
              <h1 style={{ color: "#4338CA" }}>
                {report.estimatedValue}
              </h1>
            </div>

            {/* Recommendation */}
            <div
              style={{
                background: "#E8F5E9",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "30px",
              }}
            >
              <h2>✅ Recommendation</h2>
              <p>{report.recommendation}</p>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleExportPDF}
                style={{
                  background: "#4338CA",
                  color: "white",
                  padding: "15px 30px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Download PDF
              </button>
              <button
                onClick={handleExportExcel}
                style={{
                  background: "#4338CA",
                  color: "white",
                  padding: "15px 30px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Download Excel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
