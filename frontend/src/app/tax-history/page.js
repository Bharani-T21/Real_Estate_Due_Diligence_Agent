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
} from "lucide-react";
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
        const data = await apiFetch(`/api/property-tax-history/property/${selectedProperty}`);
        setTaxRecords(Array.isArray(data) ? data : []);
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
      statusFilter === "all" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPaid = taxRecords
    .filter((record) => String(record.paymentStatus).toLowerCase() === "paid")
    .reduce((total, record) => total + Number(record.taxAmount || 0), 0);

  const paidCount = taxRecords.filter(
    (record) => String(record.paymentStatus).toLowerCase() === "paid"
  ).length;

  const pendingCount = taxRecords.filter(
    (record) => String(record.paymentStatus).toLowerCase() === "pending"
  ).length;

  const overdueCount = taxRecords.filter(
    (record) => String(record.paymentStatus).toLowerCase() === "overdue"
  ).length;

  const complianceClear =
    taxRecords.length > 0 && pendingCount === 0 && overdueCount === 0;

  const downloadReceipt = (record) => {
    const propertyName =
      record.property?.propertyName ||
      selectedPropertyData?.propertyName ||
      "Property";

    const receiptContent = `
PROPERTY TAX HISTORY
================================

Property Name : ${propertyName}
Property ID   : ${record.property?.propertyId || selectedProperty}

Tax History ID : ${record.taxHistoryId}
Tax Year       : ${record.taxYear}
Tax Amount     : ₹${Number(record.taxAmount || 0).toLocaleString("en-IN")}
Payment Status : ${record.paymentStatus}

This is a generated property tax history record.
`;

    const blob = new Blob([receiptContent], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tax-History-${record.taxHistoryId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
                          <td>{record.taxHistoryId}</td>
                          <td className="amount-cell">
                            ₹{Number(record.taxAmount || 0).toLocaleString("en-IN")}
                          </td>
                          <td>
                            <span className={`tax-badge ${status}`}>
                              {status === "paid" && <CheckCircle2 size={12} />}
                              {status === "pending" && <Clock size={12} />}
                              {status === "overdue" && <AlertTriangle size={12} />}
                              {record.paymentStatus}
                            </span>
                          </td>
                          <td>{record.property?.propertyName || selectedPropertyData?.propertyName}</td>
                          <td>
                            <button
                              onClick={() => downloadReceipt(record)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                border: "1px solid #cbd5e1",
                                background: "white",
                                cursor: "pointer",
                              }}
                            >
                              <Printer size={14} /> Receipt
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