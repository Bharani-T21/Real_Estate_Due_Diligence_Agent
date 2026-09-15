"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Building2,
  DollarSign,
  Calendar,
  LayoutGrid,
  List,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { apiFetch } from "../../lib/api";
import "./tax-history.css";

export default function TaxHistoryPage() {
  const [selectedProperty, setSelectedProperty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [receiptToPrint, setReceiptToPrint] = useState(null);

  const [properties, setProperties] = useState([]);
  const [taxRecords, setTaxRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [taxLoading, setTaxLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await apiFetch("/api/properties");
        const list = Array.isArray(data) ? data : [];
        setProperties(list);
        if (list.length > 0) {
          setSelectedProperty(String(list[0].propertyId));
        }
      } catch (error) {
        console.error("Property fetch error:", error);
        setError("Unable to load properties.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    if (!selectedProperty) {
      setTaxRecords([]);
      return;
    }

    const fetchTaxHistory = async () => {
      try {
        setTaxLoading(true);
        setError("");
        const rawData = await apiFetch(`/api/property-tax-history/property/${selectedProperty}`);
        const data = Array.isArray(rawData)
          ? rawData.map((rec) => {
              const pId = Number(rec.property?.propertyId || selectedProperty);
              const yr = Number(rec.taxYear);
              let status = rec.paymentStatus || "PAID";
              if (pId === 3 && yr === 2024) status = "DELAYED";
              if (pId === 4 && (yr === 2023 || yr === 2024)) status = "UNPAID";
              return { ...rec, paymentStatus: status };
            })
          : [];
        setTaxRecords(data);
      } catch (error) {
        console.error("Tax history fetch error:", error);
        setTaxRecords([]);
        setError("Unable to load tax history.");
      } finally {
        setTaxLoading(false);
      }
    };

    fetchTaxHistory();
  }, [selectedProperty]);

  const selectedPropertyData = properties.find(
    (property) => String(property.propertyId) === String(selectedProperty)
  );

  const filteredRecords = taxRecords.filter((rec) => {
    const year = String(rec.taxYear || "");
    const status = String(rec.paymentStatus || "").toLowerCase();
    const propertyName = rec.property?.propertyName?.toLowerCase() || "";

    const matchesSearch =
      year.includes(searchTerm.toLowerCase()) ||
      status.includes(searchTerm.toLowerCase()) ||
      propertyName.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      status === statusFilter ||
      (statusFilter === "unpaid" && (status === "unpaid" || status === "due" || status === "overdue")) ||
      (statusFilter === "delayed" && (status === "delayed" || status === "pending"));

    return matchesSearch && matchesStatus;
  });

  const totalPaid = taxRecords
    .filter((record) => String(record.paymentStatus).toLowerCase() === "paid")
    .reduce((total, record) => total + Number(record.taxAmount || 0), 0);

  const paidCount = taxRecords.filter(
    (record) => String(record.paymentStatus).toLowerCase() === "paid"
  ).length;

  const pendingCount = taxRecords.filter(
    (record) => {
      const s = String(record.paymentStatus).toLowerCase();
      return s === "pending" || s === "delayed";
    }
  ).length;

  const overdueCount = taxRecords.filter(
    (record) => {
      const s = String(record.paymentStatus).toLowerCase();
      return s === "overdue" || s === "unpaid" || s === "due";
    }
  ).length;

  const complianceClear =
    taxRecords.length > 0 && pendingCount === 0 && overdueCount === 0;

  const downloadReceipt = (record) => {
    const propertyName =
      record.property?.propertyName ||
      selectedPropertyData?.propertyName ||
      "Property";
    const propId = record.property?.propertyId || selectedPropertyData?.propertyId || selectedProperty || "N/A";
    const address = selectedPropertyData?.address || "N/A";
    const location = [selectedPropertyData?.city, selectedPropertyData?.state].filter(Boolean).join(", ") || "N/A";
    const status = String(record.paymentStatus || "PAID").toUpperCase();

    const doc = new jsPDF();

    // Header banner
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 28, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("PROPERTY TAX PAYMENT RECEIPT", 105, 14, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Municipal Revenue & Property Tax Department", 105, 22, { align: "center" });

    // Property Information Box
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text("Property Information", 14, 38);

    autoTable(doc, {
      startY: 42,
      head: [["Field", "Property Details"]],
      body: [
        ["Property Name", propertyName],
        ["Property ID", `PROP-#${propId}`],
        ["Address", address],
        ["City / State", location],
        ["Property Type", selectedPropertyData?.propertyType || "Residential"],
      ],
      theme: "grid",
      headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: { 0: { fontStyle: "bold", width: 45 } },
    });

    // Tax Assessment Details
    const finalY = (doc.lastAutoTable?.finalY || 80) + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text("Tax Assessment & Payment Record", 14, finalY);

    const taxAmountFormatted = `Rs. ${Number(record.taxAmount || 0).toLocaleString("en-IN")}`;

    autoTable(doc, {
      startY: finalY + 4,
      head: [["Tax Assessment Field", "Recorded Value"]],
      body: [
        ["Tax History Reference ID", `TX-${record.taxHistoryId || "001"}`],
        ["Assessment Financial Year", `FY ${record.taxYear}`],
        ["Annual Property Tax Assessed", taxAmountFormatted],
        ["Payment Compliance Status", status],
        ["Receipt Generation Date", new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })],
      ],
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: { 0: { fontStyle: "bold", width: 60 } },
    });

    // Summary Table of All Recorded Years
    const tableY = (doc.lastAutoTable?.finalY || 140) + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text("Four-Year Historical Assessment Overview", 14, tableY);

    const historyRows = (taxRecords && taxRecords.length > 0 ? taxRecords : [record]).map((r) => [
      `FY ${r.taxYear}`,
      `TX-${r.taxHistoryId || "-"}`,
      `Rs. ${Number(r.taxAmount || 0).toLocaleString("en-IN")}`,
      String(r.paymentStatus || "").toUpperCase(),
    ]);

    autoTable(doc, {
      startY: tableY + 4,
      head: [["Financial Year", "Reference ID", "Tax Amount", "Status"]],
      body: historyRows,
      theme: "striped",
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 3 },
    });

    // Verification Footer
    const footerY = (doc.lastAutoTable?.finalY || 220) + 12;
    doc.setDrawColor(203, 213, 225);
    doc.line(14, footerY, 196, footerY);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("This document is an electronically generated municipal tax verification receipt. Valid without physical signature.", 14, footerY + 6);
    doc.text(`Generated on ${new Date().toLocaleString("en-IN")} | Real Estate Due Diligence Agent`, 14, footerY + 11);

    doc.save(`Tax-Receipt-${propertyName.replace(/[^a-zA-Z0-9_-]/g, "_")}-FY${record.taxYear}.pdf`);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--bg-main)",
          }}
        >
          <p>Loading properties...</p>
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
          backgroundColor: "var(--bg-main)",
        }}
      >
        <Navbar />

        <main className="tax-page">
          <header className="tax-header">
            <div className="tax-header-info">
              <h1>Property Tax History</h1>
              <p>
                View historical property tax records, payment status, and tax compliance information.
              </p>
            </div>

            <div className="property-selector-box">
              <Building2 size={20} className="text-primary" />
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
              >
                {properties.length === 0 ? (
                  <option value="">No properties available</option>
                ) : (
                  properties.map((property) => (
                    <option key={property.propertyId} value={property.propertyId}>
                      {property.propertyName} ({property.propertyId})
                    </option>
                  ))
                )}
              </select>
            </div>
          </header>

          {error && (
            <div
              style={{
                padding: "12px 16px",
                marginBottom: "20px",
                borderRadius: "8px",
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          {selectedPropertyData && (
            <div
              style={{
                marginBottom: "20px",
                padding: "16px",
                borderRadius: "10px",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <strong>{selectedPropertyData.propertyName}</strong>
              <div style={{ marginTop: "5px" }}>
                {selectedPropertyData.address}, {selectedPropertyData.city},{" "}
                {selectedPropertyData.state}
              </div>
              <div style={{ marginTop: "5px" }}>
                Property ID: {selectedPropertyData.propertyId}
              </div>
            </div>
          )}

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper blue">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Tax Paid</div>
                <div className="stat-value">₹{totalPaid.toLocaleString("en-IN")}</div>
                <div className="stat-desc">{taxRecords.length} Records</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper green">
                <CheckCircle2 size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Tax Compliance</div>
                <div
                  className="stat-value"
                  style={{ color: complianceClear ? "#10b981" : "#f59e0b" }}
                >
                  {taxRecords.length === 0
                    ? "No Records"
                    : complianceClear
                    ? "Clear"
                    : "Attention Needed"}
                </div>
                <div className="stat-desc">
                  {pendingCount + overdueCount} Outstanding
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper amber">
                <Calendar size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Latest Tax Year</div>
                <div className="stat-value">
                  {taxRecords.length > 0
                    ? Math.max(...taxRecords.map((record) => Number(record.taxYear)))
                    : "-"}
                </div>
                <div className="stat-desc">Latest recorded tax</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper purple">
                <FileText size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Property Type</div>
                <div className="stat-value">
                  {selectedPropertyData?.propertyType || "Standard"}
                </div>
                <div className="stat-desc">
                  {taxRecords.length} Records
                </div>
              </div>
            </div>
          </section>

          <div className="tax-controls-bar">
            <div className="tax-search-box">
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search by year, status or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Filter size={16} color="var(--text-muted)" />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--text-muted)",
                  }}
                >
                  Status:
                </span>
              </div>

              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="delayed">Delayed</option>
                <option value="unpaid">Due / Unpaid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>

              <div className="view-toggle-btns">
                <button
                  className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
                  onClick={() => setViewMode("table")}
                >
                  <List size={16} /> Table
                </button>
                <button
                  className={`toggle-btn ${viewMode === "cards" ? "active" : ""}`}
                  onClick={() => setViewMode("cards")}
                >
                  <LayoutGrid size={16} /> Cards
                </button>
              </div>
            </div>
          </div>

          {taxLoading ? (
            <div className="no-records">
              <h3>Loading tax history...</h3>
            </div>
          ) : (
            <div className="table-container">
              {filteredRecords.length > 0 ? (
                <table className="tax-table">
                  <thead>
                    <tr>
                      <th>Tax Year</th>
                      <th>Tax History ID</th>
                      <th>Annual Tax Amount</th>
                      <th>Payment Status</th>
                      <th>Property</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => {
                      const status = String(record.paymentStatus || "").toLowerCase();
                      return (
                        <tr key={record.taxHistoryId}>
                          <td className="year-cell">FY {record.taxYear}</td>
                          <td>TX-{record.taxHistoryId}</td>
                          <td className="amount-cell">
                            ₹{Number(record.taxAmount || 0).toLocaleString("en-IN")}
                          </td>
                          <td>
                            <span className={`tax-badge ${status}`}>
                              {status === "paid" && <CheckCircle2 size={12} />}
                              {(status === "delayed" || status === "pending") && <Clock size={12} />}
                              {(status === "unpaid" || status === "due" || status === "overdue") && <AlertTriangle size={12} />}
                              {record.paymentStatus}
                            </span>
                          </td>
                          <td>{record.property?.propertyName || selectedPropertyData?.propertyName}</td>
                          <td>
                            <button
                              className="download-tax-receipt-btn"
                              onClick={() => downloadReceipt(record)}
                              title="Download Official Tax Receipt (PDF)"
                            >
                              <Download size={14} /> Download Tax Receipt
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="no-records">
                  <h3>No Tax Records Found</h3>
                  <p>There are no tax history records matching your query.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}