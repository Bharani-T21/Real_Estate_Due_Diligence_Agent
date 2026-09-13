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
  User,
  LayoutGrid,
  List,
  X
} from "lucide-react";
import { apiFetch } from "../../lib/api";
import "./tax-history.css";

// ─── 4 Properties Dataset ───────────────────────────────────────────────────
const PROPERTIES_LIST = [
  { 
    id: "1", 
    name: "Luxury Villa - 12, Beach Road, ECR, Chennai", 
    idNum: "PRC-CHN-600041",
    owner: "John A. Doe",
    city: "Chennai",
    authority: "Greater Chennai Corp",
    zone: "Zone 08 - Circle 102",
    latestAssessment: "₹75,00,000",
    complianceLabel: "100% Clear",
    complianceColor: "#10b981",
    complianceDesc: "Zero Outstanding Dues",
    records: [
      {
        id: "TX-2024-101",
        year: "2024",
        taxAmount: "₹87,500",
        assessedValue: "₹70,00,000",
        status: "paid",
        owner: "John A. Doe",
        dueDate: "2024-11-30",
        paidDate: "2024-11-10",
        receiptNo: "RCP-2024-CHN-981",
        discountPenalty: "- ₹1,250 (Early Bird Rebate)",
        breakdown: { municipalTax: "₹58,000", educationCess: "₹12,000", waterSewer: "₹11,500", garbageFee: "₹6,000" }
      },
      {
        id: "TX-2023-102",
        year: "2023",
        taxAmount: "₹83,750",
        assessedValue: "₹67,00,000",
        status: "paid",
        owner: "John A. Doe",
        dueDate: "2023-11-30",
        paidDate: "2023-11-05",
        receiptNo: "RCP-2023-CHN-882",
        discountPenalty: "₹0",
        breakdown: { municipalTax: "₹55,000", educationCess: "₹11,500", waterSewer: "₹11,250", garbageFee: "₹6,000" }
      },
      {
        id: "TX-2022-103",
        year: "2022",
        taxAmount: "₹80,000",
        assessedValue: "₹64,00,000",
        status: "paid",
        owner: "Greenfield Holdings LLC",
        dueDate: "2022-11-30",
        paidDate: "2022-11-08",
        receiptNo: "RCP-2022-CHN-773",
        discountPenalty: "₹0",
        breakdown: { municipalTax: "₹53,000", educationCess: "₹11,000", waterSewer: "₹10,500", garbageFee: "₹5,500" }
      }
    ]
  },
  { 
    id: "2", 
    name: "Modern Apartment - 405, Silicon Heights, Bangalore", 
    idNum: "PRC-BLR-560103",
    owner: "Sanjay Kumar",
    city: "Bangalore",
    authority: "BBMP Municipal Office",
    zone: "East Zone - Ward 84",
    latestAssessment: "₹55,00,000",
    complianceLabel: "100% Clear",
    complianceColor: "#10b981",
    complianceDesc: "Zero Outstanding Dues",
    records: [
      {
        id: "TX-2024-201",
        year: "2024",
        taxAmount: "₹62,500",
        assessedValue: "₹50,00,000",
        status: "paid",
        owner: "Sanjay Kumar",
        dueDate: "2024-10-31",
        paidDate: "2024-10-15",
        receiptNo: "RCP-2024-BLR-401",
        discountPenalty: "- ₹1,000 (Online Payment)",
        breakdown: { municipalTax: "₹42,000", educationCess: "₹8,500", waterSewer: "₹7,500", garbageFee: "₹4,500" }
      },
      {
        id: "TX-2023-202",
        year: "2023",
        taxAmount: "₹60,000",
        assessedValue: "₹48,00,000",
        status: "paid",
        owner: "Sanjay Kumar",
        dueDate: "2023-10-31",
        paidDate: "2023-10-12",
        receiptNo: "RCP-2023-BLR-302",
        discountPenalty: "₹0",
        breakdown: { municipalTax: "₹40,000", educationCess: "₹8,000", waterSewer: "₹7,500", garbageFee: "₹4,500" }
      }
    ]
  },
  { 
    id: "3", 
    name: "Independent House - 88, Orchard Layout, Coimbatore", 
    idNum: "PRC-CBE-641018",
    owner: "Rajesh Murthy",
    city: "Coimbatore",
    authority: "Coimbatore Municipal Corp",
    zone: "West Zone - Ward 22",
    latestAssessment: "₹90,00,000",
    complianceLabel: "Under Review",
    complianceColor: "#f59e0b",
    complianceDesc: "Assessment Pending / Delayed",
    records: [
      {
        id: "TX-2024-301",
        year: "2024",
        taxAmount: "₹1,02,500",
        assessedValue: "₹82,00,000",
        status: "pending",
        owner: "Rajesh Murthy",
        dueDate: "2024-12-31",
        paidDate: "Pending Assessment",
        receiptNo: "PENDING-2024-CBE",
        discountPenalty: "₹0 (Pending Resolution)",
        breakdown: { municipalTax: "₹68,000", educationCess: "₹14,000", waterSewer: "₹12,500", garbageFee: "₹8,000" }
      },
      {
        id: "TX-2023-302",
        year: "2023",
        taxAmount: "₹1,00,000",
        assessedValue: "₹80,00,000",
        status: "paid",
        owner: "A. K. Subramaniam",
        dueDate: "2023-12-15",
        paidDate: "2023-12-01",
        receiptNo: "RCP-2023-CBE-114",
        discountPenalty: "₹0",
        breakdown: { municipalTax: "₹66,000", educationCess: "₹13,500", waterSewer: "₹12,500", garbageFee: "₹8,000" }
      }
    ]
  },
  { 
    id: "4", 
    name: "Premium Flat - A-12, Gachibowli Green Fields, Hyderabad", 
    idNum: "PRC-HYD-500032",
    owner: "Mary T. Wilson",
    city: "Hyderabad",
    authority: "GHMC Revenue Office",
    zone: "Serilingampally Circle",
    latestAssessment: "₹68,00,000",
    complianceLabel: "High Risk (Unpaid)",
    complianceColor: "#ef4444",
    complianceDesc: "Multiple Unpaid Tax Liens",
    records: [
      {
        id: "TX-2024-401",
        year: "2024",
        taxAmount: "₹77,500",
        assessedValue: "₹62,00,000",
        status: "overdue",
        owner: "Mary T. Wilson (Disputed)",
        dueDate: "2024-03-31",
        paidDate: "Overdue (Unpaid)",
        receiptNo: "UNPAID-LIEN-2024",
        discountPenalty: "+ ₹7,750 (Late Delinquency Penalty)",
        breakdown: { municipalTax: "₹51,000", educationCess: "₹10,500", waterSewer: "₹9,500", garbageFee: "₹6,500" }
      },
      {
        id: "TX-2023-402",
        year: "2023",
        taxAmount: "₹75,00,0",
        assessedValue: "₹60,00,000",
        status: "overdue",
        owner: "Mary T. Wilson (Disputed)",
        dueDate: "2023-03-31",
        paidDate: "Overdue (Unpaid)",
        receiptNo: "UNPAID-LIEN-2023",
        discountPenalty: "+ ₹7,500 (Late Delinquency Penalty)",
        breakdown: { municipalTax: "₹50,000", educationCess: "₹10,000", waterSewer: "₹9,000", garbageFee: "₹6,000" }
      },
      {
        id: "TX-2022-403",
        year: "2022",
        taxAmount: "₹72,500",
        assessedValue: "₹58,00,000",
        status: "paid",
        owner: "Mary T. Wilson",
        dueDate: "2022-09-30",
        paidDate: "2022-09-30",
        receiptNo: "RCP-2022-HYD-009",
        discountPenalty: "₹0",
        breakdown: { municipalTax: "₹48,000", educationCess: "₹10,000", waterSewer: "₹8,500", garbageFee: "₹6,000" }
      }
    ]
  }
];

export default function TaxHistoryPage() {
  const [selectedPropertyId, setSelectedPropertyId] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [receiptToPrint, setReceiptToPrint] = useState(null);

  // Active property dataset
  const activeProperty = PROPERTIES_LIST.find((p) => p.id === selectedPropertyId) || PROPERTIES_LIST[0];
  const taxRecords = activeProperty.records;

  // Filtering records
  const filteredRecords = taxRecords.filter((rec) => {
    const matchesSearch =
      rec.year.includes(searchTerm) ||
      rec.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || rec.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPaid = taxRecords
    .filter((r) => r.status === "paid")
    .reduce((acc, r) => acc + parseInt(r.taxAmount.replace(/[^0-9]/g, "")), 0);

  const handlePrintReceipt = (rec) => {
    setReceiptToPrint(rec);
  };

  const triggerBrowserPrint = () => {
    window.print();
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
        <Navbar />

        <main className="tax-page no-print">
          {/* Header section */}
          <header className="tax-header">
            <div className="tax-header-info">
              <h1>Property Tax History</h1>
              <p>Complete historical property assessment records, payment confirmations, and tax compliance due diligence.</p>
            </div>

            <div className="property-selector-box">
              <Building2 size={20} className="text-primary" />
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
              >
                {PROPERTIES_LIST.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.idNum})
                  </option>
                ))}
              </select>
            </div>
          </header>

          {/* Stats Grid */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper blue">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Cumulative Tax Paid</div>
                <div className="stat-value">₹{totalPaid.toLocaleString("en-IN")}</div>
                <div className="stat-desc">{taxRecords.length} Years Recorded</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper green">
                <CheckCircle2 size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Tax Compliance Status</div>
                <div className="stat-value" style={{ color: activeProperty.complianceColor }}>
                  {activeProperty.complianceLabel}
                </div>
                <div className="stat-desc">{activeProperty.complianceDesc}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper amber">
                <Calendar size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Latest Assessment Value</div>
                <div className="stat-value">{activeProperty.latestAssessment}</div>
                <div className="stat-desc">FY 2024 - 2025</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper purple">
                <FileText size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Municipal Assessment Authority</div>
                <div className="stat-value" style={{ fontSize: "17px" }}>{activeProperty.authority}</div>
                <div className="stat-desc">{activeProperty.zone}</div>
              </div>
            </div>
          </section>

          {/* Controls Bar */}
          <div className="tax-controls-bar">
            <div className="tax-search-box">
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search by year, owner or receipt #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Filter size={16} color="var(--text-muted)" />
                <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>Status:</span>
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
                  title="Table View"
                >
                  <List size={16} /> Table
                </button>
                <button
                  className={`toggle-btn ${viewMode === "cards" ? "active" : ""}`}
                  onClick={() => setViewMode("cards")}
                  title="Card View"
                >
                  <LayoutGrid size={16} /> Cards
                </button>
              </div>
            </div>
          </div>

          {/* Table View */}
          {viewMode === "table" ? (
            <div className="table-container">
              {filteredRecords.length > 0 ? (
                <table className="tax-table">
                  <thead>
                    <tr>
                      <th>Tax Year</th>
                      <th>Assessment Value</th>
                      <th>Annual Tax Amount</th>
                      <th>Payment Status</th>
                      <th>Property Owner</th>
                      <th>Receipt Ref</th>
                      <th>Paid Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((rec) => (
                      <tr key={rec.id}>
                        <td className="year-cell">FY {rec.year}</td>
                        <td>{rec.assessedValue}</td>
                        <td className="amount-cell">{rec.taxAmount}</td>
                        <td>
                          <span className={`tax-badge ${rec.status}`}>
                            {rec.status === "paid" && <CheckCircle2 size={12} />}
                            {rec.status === "pending" && <Clock size={12} />}
                            {rec.status === "overdue" && <AlertTriangle size={12} />}
                            {rec.status}
                          </span>
                        </td>
                        <td className="owner-cell">
                          <div>{rec.owner}</div>
                          <div className="sub-text">Assessed Registered Owner</div>
                        </td>
                        <td>
                          <span style={{ fontFamily: "monospace", fontWeight: "600" }}>{rec.receiptNo}</span>
                        </td>
                        <td>
                          <div>{rec.paidDate}</div>
                          <div className="sub-text">Due: {rec.dueDate}</div>
                        </td>
                        <td>
                          <button
                            className="action-btn-sm print-action-btn"
                            onClick={() => handlePrintReceipt(rec)}
                          >
                            <Printer size={14} style={{ marginRight: "4px" }} />
                            Print Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-records">
                  <h3>No tax records matching criteria</h3>
                  <p>Try adjusting your search query or filter options.</p>
                </div>
              )}
            </div>
          ) : (
            /* Cards View */
            <div className="cards-grid">
              {filteredRecords.map((rec) => (
                <div key={rec.id} className="tax-card">
                  <div className="card-top">
                    <span className="card-year">FY {rec.year}</span>
                    <span className={`tax-badge ${rec.status}`}>
                      {rec.status === "paid" && <CheckCircle2 size={12} />}
                      {rec.status === "pending" && <Clock size={12} />}
                      {rec.status === "overdue" && <AlertTriangle size={12} />}
                      {rec.status}
                    </span>
                  </div>

                  <div className="card-body">
                    <div>
                      <div className="card-label">Tax Amount Paid / Due</div>
                      <div className="card-amount-large">{rec.taxAmount}</div>
                    </div>

                    <div className="card-row">
                      <span className="card-label">Assessed Property Value</span>
                      <span className="card-val">{rec.assessedValue}</span>
                    </div>

                    <div className="card-row">
                      <span className="card-label">Recorded Owner</span>
                      <span className="card-val">{rec.owner}</span>
                    </div>

                    <div className="card-row">
                      <span className="card-label">Receipt Number</span>
                      <span className="card-val" style={{ fontFamily: "monospace" }}>{rec.receiptNo}</span>
                    </div>

                    <div className="card-row">
                      <span className="card-label">Payment Date</span>
                      <span className="card-val">{rec.paidDate}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Rebate/Adjustments: {rec.discountPenalty}
                    </span>
                    <button
                      className="action-btn-sm print-action-btn"
                      onClick={() => handlePrintReceipt(rec)}
                    >
                      <Printer size={14} style={{ marginRight: "4px" }} />
                      Print Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Printable Receipt Modal Overlay */}
        {receiptToPrint && (
          <div className="receipt-modal-backdrop" onClick={() => setReceiptToPrint(null)}>
            <div className="receipt-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="receipt-modal-actions no-print">
                <button className="receipt-print-btn" onClick={triggerBrowserPrint}>
                  <Printer size={16} /> Print / Save as PDF
                </button>
                <button className="receipt-close-btn" onClick={() => setReceiptToPrint(null)}>
                  <X size={16} /> Close
                </button>
              </div>

              <div id="printable-tax-receipt" className="receipt-document" style={{ padding: "40px", width: "100%", background: "white", border: "none", margin: 0 }}>
                  <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #1e293b", paddingBottom: "20px" }}>
                    <h1 style={{ margin: 0, fontSize: "28px", color: "#0f172a" }}>OFFICIAL PROPERTY TAX RECEIPT</h1>
                    <p style={{ margin: "10px 0 0", fontSize: "16px", color: "#64748b" }}>{activeProperty.authority} - {activeProperty.zone}</p>
                  </div>
  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "30px" }}>
                    <div>
                      <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Property Information</h3>
                      <p><strong>Property Name:</strong> {activeProperty.name}</p>
                      <p><strong>Survey / Parcel ID:</strong> {activeProperty.idNum}</p>
                      <p><strong>City & State:</strong> {activeProperty.city}</p>
                    </div>
                    <div>
                      <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Transaction Details</h3>
                      <p><strong>Billed To:</strong> {receiptToPrint.owner}</p>
                      <p><strong>Receipt Number:</strong> {receiptToPrint.receiptNo || "N/A"}</p>
                      <p><strong>Tax Year:</strong> {receiptToPrint.year}</p>
                      <p><strong>Assessed Value:</strong> {receiptToPrint.assessedValue}</p>
                    </div>
                  </div>
  
                  <div style={{ marginBottom: "30px" }}>
                    <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#334155" }}>Payment Breakdown</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                      <thead>
                        <tr>
                          <th style={{ padding: "12px", border: "1px solid #e2e8f0", background: "#f8fafc", textAlign: "left" }}>Description</th>
                          <th style={{ padding: "12px", border: "1px solid #e2e8f0", background: "#f8fafc", textAlign: "right" }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>Total Annual Tax</td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", textAlign: "right" }}>{receiptToPrint.taxAmount}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>Payment Status</td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", textAlign: "right", color: receiptToPrint.status === "paid" ? "#166534" : "#991b1b", fontWeight: "bold", textTransform: "uppercase" }}>{receiptToPrint.status}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>Date</td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", textAlign: "right" }}>{receiptToPrint.paidDate || receiptToPrint.dueDate}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
  
                  <div style={{ marginTop: "50px", textAlign: "center", borderTop: "1px solid #cbd5e1", paddingTop: "20px", color: "#64748b", fontSize: "14px" }}>
                    <p>This is a computer-generated tax receipt. Valid for due diligence purposes.</p>
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
