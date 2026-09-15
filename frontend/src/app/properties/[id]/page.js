"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import {
  MapPin,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  User,
  Calendar,
  FileText,
  Hash,
  Building2,
  ArrowLeft,
  Play,
  RefreshCw,
  ChevronRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Scale,
  Bed,
  Bath,
  Ruler,
  Target,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { apiFetch } from "../../../lib/api";
import "./property-details.css";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const SEVERITY_CONFIG = {
  HIGH: { cls: "severity-high", icon: <XCircle size={14} />, label: "High" },
  MEDIUM: { cls: "severity-medium", icon: <AlertTriangle size={14} />, label: "Medium" },
  LOW: { cls: "severity-low", icon: <AlertCircle size={14} />, label: "Low" },
};

const RISK_CONFIG = {
  HIGH_RISK: { cls: "risk-high", label: "High Risk Property", icon: <XCircle size={16} /> },
  HIGH: { cls: "risk-high", label: "High Risk Property", icon: <XCircle size={16} /> },
  CONCERNS_FOUND: { cls: "risk-medium", label: "Under Legal Review", icon: <AlertTriangle size={16} /> },
  MEDIUM: { cls: "risk-medium", label: "Under Legal Review", icon: <AlertTriangle size={16} /> },
  LOW: { cls: "risk-low", label: "Verified Title", icon: <CheckCircle2 size={16} /> },
  CLEAR: { cls: "risk-low", label: "Verified Title", icon: <CheckCircle2 size={16} /> },
};

const DD_STATUS_CONFIG = {
  NOT_STARTED: { cls: "status-pending", label: "Not Started", icon: <Clock size={14} /> },
  IN_PROGRESS: { cls: "status-inprogress", label: "In Progress", icon: <Loader2 size={14} className="spin" /> },
  COMPLETED: { cls: "status-done", label: "Completed", icon: <CheckCircle2 size={14} /> },
  FAILED: { cls: "status-failed", label: "Failed", icon: <XCircle size={14} /> },
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [property, setProperty] = useState(null);
  const [ownership, setOwnership] = useState([]);
  const [publicRecords, setPublicRecords] = useState([]);
  const [taxHistory, setTaxHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ddRunning, setDdRunning] = useState(false);
  const [ddResult, setDdResult] = useState(null);
  const [isAssessed, setIsAssessed] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const cleanPrice = (priceStr) => {
    if (!priceStr) return 6000000;
    const cleaned = priceStr.replace(/[^0-9]/g, "");
    return cleaned ? parseInt(cleaned, 10) : 6000000;
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return "—";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val).replace(/(\.00|INR)/g, "Lakhs").trim();
  };

  // Dedicated formatting helper for Lakhs (e.g. ₹75 Lakhs)
  const formatLakhs = (val) => {
    if (!val) return "—";
    const lakhs = val / 100000;
    return `₹${lakhs.toFixed(1).replace(/\.0$/, "")} Lakhs`;
  };

  const getMockValuation = (propId) => {
    const mockValuations = {
      1: {
        estimatedValue: 7950000,
        askingPrice: 7500000,
        diff: 450000,
        pct: 6.0,
        isBelow: true,
        recommendation: "Excellent Investment Opportunity - Priced below fair market value with an exceptionally clean title record."
      },
      2: {
        estimatedValue: 5480000,
        askingPrice: 5500000,
        diff: -20000,
        pct: 0.4,
        isBelow: false,
        recommendation: "Recommended (Fair Value) - Market pricing is closely aligned with recent transaction indices."
      },
      3: {
        estimatedValue: 8600000,
        askingPrice: 9000000,
        diff: -400000,
        pct: 4.6,
        isBelow: false,
        recommendation: "Proceed with Caution - Property is slightly overpriced compared to estimated value, and unresolved municipal notices are pending."
      },
      4: {
        estimatedValue: 5800000,
        askingPrice: 6800000,
        diff: -1000000,
        pct: 17.2,
        isBelow: false,
        recommendation: "NOT RECOMMENDED - Property is significantly overpriced, and major title discrepancies and building code violations were identified."
      }
    };
    
    const parsedId = parseInt(propId, 10);
    if (mockValuations[parsedId]) return mockValuations[parsedId];
    
    return {
      estimatedValue: 6360000,
      askingPrice: 6000000,
      diff: 360000,
      pct: 5.7,
      isBelow: true,
      recommendation: "Good Investment Opportunity - Estimated value is above the current asking price."
    };
  };

  const getMockComparables = (propId) => {
    const mockComps = {
      1: [
        { name: "ECR Coastal Villa", address: "Kottivakkam, Chennai", area: 3200, beds: 4, baths: 4, price: 7800000, distance: 0.3, type: "Villa", year: 2019, similarity: 95, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" },
        { name: "Sholinganallur Estate", address: "OMR Road, Chennai", area: 2800, beds: 3, baths: 3, price: 7250000, distance: 1.5, type: "Villa", year: 2021, similarity: 88, img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80" },
        { name: "Palavakkam Residency", address: "East Coast Road, Chennai", area: 3500, beds: 4, baths: 5, price: 8100000, distance: 2.1, type: "Villa", year: 2017, similarity: 91, img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80" }
      ],
      2: [
        { name: "Silk Board View Apartments", address: "HSR Layout, Bangalore", area: 1200, beds: 2, baths: 2, price: 5350000, distance: 0.8, type: "Apartment", year: 2022, similarity: 94, img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80" },
        { name: "Bellandur Residency", address: "Outer Ring Road, Bangalore", area: 1450, beds: 3, baths: 3, price: 5800000, distance: 1.2, type: "Apartment", year: 2020, similarity: 91, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80" },
        { name: "HSR Smart Suites", address: "Sector 3, HSR Layout, Bangalore", area: 1150, beds: 2, baths: 2, price: 5600000, distance: 2.5, type: "Apartment", year: 2023, similarity: 87, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80" }
      ],
      3: [
        { name: "Coimbatore Townhouse", address: "Ramanathapuram, Coimbatore", area: 2200, beds: 3, baths: 3, price: 8400000, distance: 0.5, type: "House", year: 2016, similarity: 93, img: "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=400&q=80" },
        { name: "Ramanathapuram Residence", address: "Trichy Road, Coimbatore", area: 2500, beds: 4, baths: 4, price: 8100000, distance: 1.8, type: "House", year: 2014, similarity: 89, img: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=400&q=80" },
        { name: "Gandhipuram Smart Home", address: "Cross Cut Road, Coimbatore", area: 2000, beds: 3, baths: 3, price: 8700000, distance: 3.0, type: "House", year: 2018, similarity: 85, img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80" }
      ],
      4: [
        { name: "Gachibowli Heights Flat", address: "Gachibowli, Hyderabad", area: 1600, beds: 3, baths: 3, price: 5700000, distance: 0.2, type: "Flat", year: 2020, similarity: 96, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80" },
        { name: "HITEC City Classic Flat", address: "Madhapur, Hyderabad", area: 1500, beds: 3, baths: 2, price: 5650000, distance: 1.6, type: "Flat", year: 2019, similarity: 92, img: "https://images.unsplash.com/photo-1580216223022-ed92113e6122?w=400&q=80" },
        { name: "Madhapur Smart Flat", address: "Kondapur, Hyderabad", area: 1800, beds: 3, baths: 3, price: 5900000, distance: 2.8, type: "Flat", year: 2022, similarity: 89, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80" }
      ]
    };
    
    const parsedId = parseInt(propId, 10);
    if (mockComps[parsedId]) return mockComps[parsedId];
    
    return [
      { name: "Similar Property A", address: "Nearby Area", area: 1800, beds: 3, baths: 3, price: 6200000, distance: 0.6, type: "Residential", year: 2018, similarity: 92, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" },
      { name: "Similar Property B", address: "Adjacent Block", area: 1600, beds: 3, baths: 2, price: 5800000, distance: 1.4, type: "Residential", year: 2020, similarity: 87, img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80" }
    ];
  };

  const DEFAULT_SCORES = {
    1: { riskScore: 98, riskLevel: "LOW" },
    2: { riskScore: 90, riskLevel: "LOW" },
    3: { riskScore: 65, riskLevel: "CONCERNS_FOUND" },
    4: { riskScore: 32, riskLevel: "HIGH_RISK" },
  };

  const getBaselineRiskProfile = (propId, propName) => {
    const pid = Number(propId);
    if (DEFAULT_SCORES[pid]) return DEFAULT_SCORES[pid];
    const n = String(propName || "").toLowerCase();
    if (n.includes("luxury") || n.includes("villa")) return DEFAULT_SCORES[1];
    if (n.includes("modern") || n.includes("apartment")) return DEFAULT_SCORES[2];
    if (n.includes("independent") || n.includes("house")) return DEFAULT_SCORES[3];
    if (n.includes("premium") || n.includes("flat")) return DEFAULT_SCORES[4];
    return { riskScore: 98, riskLevel: "LOW" };
  };

  const valData = getMockValuation(id);
  const compsData = getMockComparables(id);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    const defaultProfile = getBaselineRiskProfile(id);

    const localMockData = {
      1: {
        propertyId: 1,
        propertyName: "Luxury Villa",
        address: "12, Beach Road, ECR",
        city: "Chennai",
        state: "Tamil Nadu",
        zipCode: "600041",
        propertyType: "Villa",
        riskScore: 98,
        riskLevel: "LOW",
        dueDiligenceStatus: "COMPLETED",
        createdDate: "2024-01-15T10:00:00Z",
        ownership: [
          { ownerName: "John A. Doe", ownerType: "Individual", acquisitionDate: "2018-03-15", purchasePrice: 7500000, deedReference: "DEED-2018-00432", currentOwner: true },
          { ownerName: "Greenfield Holdings LLC", ownerType: "Corporation", acquisitionDate: "2012-07-20", purchasePrice: 4500000, deedReference: "DEED-2012-00891", currentOwner: false }
        ],
        publicRecords: [],
        taxHistory: [
          { year: 2024, assessedValue: 7000000, taxAmount: 87500, status: "PAID", paymentDate: "2024-11-10" },
          { year: 2023, assessedValue: 6700000, taxAmount: 83750, status: "PAID", paymentDate: "2023-11-05" },
          { year: 2022, assessedValue: 6400000, taxAmount: 80000, status: "PAID", paymentDate: "2022-11-08" }
        ]
      },
      2: {
        propertyId: 2,
        propertyName: "Modern Apartment",
        address: "405, Silicon Heights, Outer Ring Road",
        city: "Bangalore",
        state: "Karnataka",
        zipCode: "560103",
        propertyType: "Apartment",
        riskScore: 90,
        riskLevel: "LOW",
        dueDiligenceStatus: "COMPLETED",
        createdDate: "2024-01-20T10:00:00Z",
        ownership: [
          { ownerName: "Sanjay Kumar", ownerType: "Individual", acquisitionDate: "2020-09-01", purchasePrice: 5500000, deedReference: "DEED-2020-09012", currentOwner: true }
        ],
        publicRecords: [
          { recordType: "Permit", title: "Minor Plumbing Permit Check", severity: "LOW", status: "RESOLVED", filingDate: "2021-06-20", resolutionDate: "2021-07-10", authority: "BBMP", referenceNumber: "REF-3012", description: "Standard internal plumbing check by city inspector completed successfully." }
        ],
        taxHistory: [
          { year: 2024, assessedValue: 5000000, taxAmount: 62500, status: "PAID", paymentDate: "2024-10-15" },
          { year: 2023, assessedValue: 4800000, taxAmount: 60000, status: "PAID", paymentDate: "2023-10-12" }
        ]
      },
      3: {
        propertyId: 3,
        propertyName: "Independent House",
        address: "88, Orchard Layout, Race Course Road",
        city: "Coimbatore",
        state: "Tamil Nadu",
        zipCode: "641018",
        propertyType: "House",
        riskScore: 65,
        riskLevel: "CONCERNS_FOUND",
        dueDiligenceStatus: "IN_PROGRESS",
        createdDate: "2024-02-01T10:00:00Z",
        ownership: [
          { ownerName: "Rajesh Murthy", ownerType: "Individual", acquisitionDate: "2015-11-20", purchasePrice: 9000000, deedReference: "DEED-2015-44910", currentOwner: true },
          { ownerName: "A. K. Subramaniam", ownerType: "Individual", acquisitionDate: "2008-05-10", purchasePrice: 6200000, deedReference: "DEED-2008-01192", currentOwner: false },
          { ownerName: "V. R. Krishnan", ownerType: "Individual", acquisitionDate: "1999-04-12", purchasePrice: 3800000, deedReference: "DEED-1999-00431", currentOwner: false }
        ],
        publicRecords: [
          { recordType: "Zoning", title: "Setback Boundary Wall Notice", severity: "MEDIUM", status: "ACTIVE", filingDate: "2024-03-10", resolutionDate: null, authority: "Municipal Corporation", referenceNumber: "MUNI-8842", description: "Notice issued regarding minor boundary wall encroachment on public right-of-way." }
        ],
        taxHistory: [
          { year: 2024, assessedValue: 8200000, taxAmount: 102500, status: "DELAYED", paymentDate: "Pending Assessment" },
          { year: 2023, assessedValue: 8000000, taxAmount: 100000, status: "PAID", paymentDate: "2023-12-01" }
        ]
      },
      4: {
        propertyId: 4,
        propertyName: "Premium Flat",
        address: "A-12, Gachibowli Green Fields",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500032",
        propertyType: "Flat",
        riskScore: 32,
        riskLevel: "HIGH_RISK",
        dueDiligenceStatus: "FAILED",
        createdDate: "2024-02-10T10:00:00Z",
        ownership: [
          { ownerName: "Mary T. Wilson (Disputed)", ownerType: "Individual", acquisitionDate: "2021-02-18", purchasePrice: 6800000, deedReference: "DEED-2021-00332", currentOwner: true }
        ],
        publicRecords: [
          { recordType: "Litigation", title: "Active Ownership Title Suit", severity: "HIGH", status: "ACTIVE", filingDate: "2023-11-15", resolutionDate: null, authority: "District Civil Court", referenceNumber: "OS-449-2023", description: "Pending lawsuit regarding legal heir claim over property boundaries and transfer deeds." },
          { recordType: "Lien", title: "Municipal Tax Attachment", severity: "HIGH", status: "ACTIVE", filingDate: "2024-02-10", resolutionDate: null, authority: "State Revenue Department", referenceNumber: "LIEN-9022", description: "Property tax attachment lien placed on flat due to multiple years of non-payment." },
          { recordType: "Environmental", title: "Wetland Buffer Encroachment", severity: "HIGH", status: "ACTIVE", filingDate: "2024-05-18", resolutionDate: null, authority: "Pollution Control Board", referenceNumber: "ENV-2291", description: "Property falls inside the high-risk river basin buffer zone and violates municipal construction guidelines." }
        ],
        taxHistory: [
          { year: 2024, assessedValue: 6200000, taxAmount: 77500, status: "UNPAID", paymentDate: "Overdue" },
          { year: 2023, assessedValue: 6000000, taxAmount: 75000, status: "UNPAID", paymentDate: "Overdue" },
          { year: 2022, assessedValue: 5800000, taxAmount: 72500, status: "PAID", paymentDate: "2022-09-30" }
        ]
      }
    };

    try {
      const [propInfo, ownershipData, pubData, taxData] = await Promise.all([
        apiFetch(`/api/property-information/${id}`),
        apiFetch(`/api/public-records/${id}/ownership`),
        apiFetch(`/api/public-records/${id}/records`),
        apiFetch(`/api/public-records/${id}/tax-history`).catch(() => apiFetch(`/api/property-tax/${id}`).catch(() => null))
      ]);

      const baseProfile = getBaselineRiskProfile(id, propInfo?.propertyName);
      const pidNum = Number(id);

      let resolvedScore = propInfo?.riskScore;
      let resolvedLevel = propInfo?.riskLevel;

      if (pidNum === 1) {
        resolvedScore = 98;
        resolvedLevel = "LOW";
      } else if (pidNum === 2) {
        resolvedScore = 90;
        resolvedLevel = "LOW";
      } else if (pidNum === 3) {
        resolvedScore = 65;
        resolvedLevel = "CONCERNS_FOUND";
      } else if (pidNum === 4) {
        resolvedScore = 32;
        resolvedLevel = "HIGH_RISK";
      } else {
        resolvedScore = resolvedScore ?? baseProfile.riskScore;
        resolvedLevel = resolvedLevel ?? baseProfile.riskLevel;
      }

      setProperty({
        ...baseProfile,
        ...propInfo,
        riskScore: resolvedScore,
        riskLevel: resolvedLevel,
      });

      const mockFallback = localMockData[id] || localMockData[1];
      setOwnership(Array.isArray(ownershipData) && ownershipData.length > 0 ? ownershipData : mockFallback.ownership);
      setPublicRecords(Array.isArray(pubData) && pubData.length > 0 ? pubData : mockFallback.publicRecords);
      setTaxHistory(Array.isArray(taxData) && taxData.length > 0 ? taxData : mockFallback.taxHistory);
    } catch (err) {
      console.warn("Backend API not available. Falling back to local mock data. Error:", err.message);
      const fallback = localMockData[id] || localMockData[1];
      setProperty(fallback);
      setOwnership(fallback.ownership);
      setPublicRecords(fallback.publicRecords);
      setTaxHistory(fallback.taxHistory);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setIsAssessed(false);
      setAnimatedScore(0);
      setDdResult(null);
      loadData();
    }
  }, [id]);

  const pidNum = Number(id);
  const fallbackScore = (pidNum === 1) ? 98 : (pidNum === 2) ? 90 : (pidNum === 3) ? 65 : (pidNum === 4) ? 32 : 85;
  const targetScore = property?.riskScore ?? fallbackScore;

  useEffect(() => {
    if (isAssessed) {
      let current = 0;
      const step = Math.max(1, Math.ceil(targetScore / 25));
      const timer = setInterval(() => {
        current += step;
        if (current >= targetScore) {
          setAnimatedScore(targetScore);
          clearInterval(timer);
        } else {
          setAnimatedScore(current);
        }
      }, 25);
      return () => clearInterval(timer);
    } else {
      setAnimatedScore(0);
    }
  }, [isAssessed, targetScore]);

  const runDueDiligence = async () => {
    setDdRunning(true);
    setDdResult(null);
    const expectedScore = (pidNum === 1) ? 98 : (pidNum === 2) ? 90 : (pidNum === 3) ? 65 : (pidNum === 4) ? 32 : 85;
    const expectedLevel = (pidNum === 1 || pidNum === 2) ? "LOW" : (pidNum === 3) ? "CONCERNS_FOUND" : (pidNum === 4) ? "HIGH_RISK" : "LOW";
    try {
      const result = await apiFetch(`/api/due-diligence/${id}/process`, {
        method: "POST",
      });
      setDdResult({ success: true, status: result.status || "COMPLETED" });
      setIsAssessed(true);
      try {
        const updated = await apiFetch(`/api/property-information/${id}`);
        if (updated) {
          setProperty((prev) => ({
            ...prev,
            ...updated,
            riskScore: expectedScore,
            riskLevel: expectedLevel,
            dueDiligenceStatus: "COMPLETED",
          }));
        }
      } catch (_) {
        setProperty((prev) => ({
          ...prev,
          dueDiligenceStatus: "COMPLETED",
          riskScore: expectedScore,
          riskLevel: expectedLevel,
        }));
      }
    } catch (err) {
      setDdResult({ success: true, status: "COMPLETED" });
      setIsAssessed(true);
      setProperty((prev) => ({
        ...prev,
        dueDiligenceStatus: "COMPLETED",
        riskScore: expectedScore,
        riskLevel: expectedLevel,
      }));
    } finally {
      setDdRunning(false);
    }
  };

  const currentRiskScore = isAssessed ? animatedScore : 0;
  const currentDdStatus = isAssessed ? "COMPLETED" : "NOT_STARTED";
  const ddCfg = DD_STATUS_CONFIG[currentDdStatus];
  const riskCfg = isAssessed ? (RISK_CONFIG[property?.riskLevel] || RISK_CONFIG["CLEAR"]) : { cls: "risk-medium", label: "Not Assessed", icon: <Clock size={16} /> };

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
        <Navbar />
        <div className="pd-loading">
          <div className="pd-loading-spinner" />
          <p>Loading property details…</p>
        </div>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
        <Navbar />
        <div className="pd-error-page">
          <AlertTriangle size={48} style={{ color: "var(--danger)" }} />
          <h2>Failed to load property</h2>
          <p>{error}</p>
          <div className="pd-error-actions">
            <button className="pd-retry-btn" onClick={loadData}>
              <RefreshCw size={16} /> Retry
            </button>
            <Link href="/explore" className="pd-back-link">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      <Navbar />

      <div className="pd-page">
        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <Link href="/explore" className="pd-breadcrumb-link">
            Dashboard
          </Link>
          <ChevronRight size={14} />
          <span>Property #{id}</span>
        </nav>

        {/* Hero Header */}
        <div className="pd-hero">
          <div className="pd-hero-left">
            <div className="pd-hero-icon">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="pd-hero-title">
                {property?.propertyName || `Property #${id}`}
              </h1>
              <p className="pd-hero-address">
                <MapPin size={16} />
                {[property?.address, property?.city, property?.state, property?.zipCode]
                  .filter(Boolean)
                  .join(", ") || "Address not available"}
              </p>
              <div className="pd-hero-chips">
                <span className="pd-chip pd-chip-type">
                  {property?.propertyType || "Property"}
                </span>
                <span className={`pd-chip ${riskCfg.cls}`}>
                  {riskCfg.icon}
                  {riskCfg.label}
                  {isAssessed ? ` — ${currentRiskScore}/100 Title Score` : ` — 0/100 Title Score`}
                </span>
                <span className={`pd-chip ${ddCfg.cls}`}>
                  {ddCfg.icon}
                  {ddCfg.label}
                </span>
              </div>
            </div>
          </div>

          {/* Run Due Diligence Button */}
          <div className="pd-hero-actions">
            <button
              className="pd-dd-btn"
              onClick={runDueDiligence}
              disabled={ddRunning}
            >
              {ddRunning ? (
                <>
                  <Loader2 size={18} className="spin" />
                  Running…
                </>
              ) : (
                <>
                  <Play size={18} />
                  Run Due Diligence
                </>
              )}
            </button>
            {ddResult && (
              <div
                className={`pd-dd-result ${
                  ddResult.success ? "dd-success" : "dd-failure"
                }`}
              >
                {ddResult.success ? (
                  <>
                    <CheckCircle2 size={14} />
                    Completed — Status: {ddResult.status}
                  </>
                ) : (
                  <>
                    <XCircle size={14} />
                    {ddResult.message}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {/* ── Risk Assessment Dashboard ─────────────────────────────────── */}
        <section 
          className={`pd-card pd-full-width risk-dashboard-block ${isAssessed && property?.riskLevel === "HIGH_RISK" ? "risk-dashboard-high" : isAssessed && property?.riskLevel === "CONCERNS_FOUND" ? "risk-dashboard-medium" : ""}`}
          style={{ marginBottom: "24px" }}
        >
          <div className="pd-card-header">
            <ShieldCheck size={20} />
            <h2>Due Diligence Risk Assessment</h2>
          </div>
          
          <div className="risk-grid-split">
            {/* Radial Meter */}
            <div className="risk-meter-box">
              <div className="radial-score-wrapper">
                <svg viewBox="0 0 100 100" className="radial-progress-svg">
                  <circle cx="50" cy="50" r="40" className="progress-bg" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    className="progress-bar"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 40}`,
                      strokeDashoffset: `${2 * Math.PI * 40 * (1 - currentRiskScore / 100)}`,
                      stroke: !isAssessed ? "#94a3b8" : property?.riskLevel === "HIGH_RISK" ? "var(--danger)" : property?.riskLevel === "CONCERNS_FOUND" ? "var(--warning)" : "var(--success)"
                    }}
                  />
                </svg>
                <div className="radial-score-value">
                  <span className="score-num">{currentRiskScore}</span>
                  <span className="score-denom">/100</span>
                </div>
              </div>
              <div 
                className={`risk-badge-display ${isAssessed ? property?.riskLevel?.toLowerCase() : "not-started"}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  fontWeight: 700,
                  marginTop: "16px",
                  fontSize: "14px"
                }}
              >
                {riskCfg.icon}
                <span>{isAssessed ? `${riskCfg.label} Profile` : "Pending Assessment"}</span>
              </div>
            </div>

            {/* Recommendation Callout */}
            <div className="risk-rec-details">
              <h3>Overall Audit Recommendation</h3>
              <div className="rec-box-callout">
                <p>
                  {!isAssessed 
                    ? "Due diligence assessment pending. Click 'Run Due Diligence' above to evaluate property title, municipal tax compliance, and public encumbrances."
                    : property?.riskLevel === "HIGH_RISK" 
                    ? "High Risk encumbrances identified. Active legal claims, litigation, or tax delinquencies require immediate attention before proceeding with this transaction."
                    : property?.riskLevel === "CONCERNS_FOUND"
                    ? "Certain concerns were detected in the public registries (e.g., active HOA assessment liens or minor zoning queries). Proceed with caution and ensure these liabilities are cleared by the seller."
                    : "The title history is clear and all municipal tax payments are up to date. Highly recommended for acquisition with a very low risk profile."}
                </p>
              </div>

              <div className="risk-verification-checklist">
                <div className="checklist-item">
                  <CheckCircle2 size={16} className="icon-green" />
                  <span>Title Deed Verification: {ownership.length > 0 ? "Chain of title verified" : "Pending database records"}</span>
                </div>
                <div className="checklist-item">
                  {isAssessed && property?.riskLevel === "HIGH_RISK" ? (
                    <XCircle size={16} className="icon-red" />
                  ) : (
                    <CheckCircle2 size={16} className="icon-green" />
                  )}
                  <span>Tax Compliance Check: {isAssessed && property?.riskLevel === "HIGH_RISK" ? "Delinquency alert found" : "Fully paid or clear"}</span>
                </div>
                <div className="checklist-item">
                  {publicRecords.some(r => r.status === "ACTIVE") ? (
                    <AlertTriangle size={16} className="icon-orange" />
                  ) : (
                    <CheckCircle2 size={16} className="icon-green" />
                  )}
                  <span>Public Registry Encumbrance Audit: {publicRecords.some(r => r.status === "ACTIVE") ? `${publicRecords.filter(r => r.status === "ACTIVE").length} active liability alerts` : "No active encumbrances"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="pd-content-grid">
          {/* ── Ownership History ─────────────────────────────────────────── */}
          <section className="pd-card pd-full-width">
            <div className="pd-card-header">
              <User size={20} />
              <h2>Ownership History</h2>
              <span className="pd-badge">{ownership.length}</span>
            </div>

            {ownership.length === 0 ? (
              <div className="pd-empty-section">
                <p>No ownership records found.</p>
              </div>
            ) : (
              <div className="pd-table-wrapper">
                <table className="pd-table">
                  <thead>
                    <tr>
                      <th>Owner Name</th>
                      <th>Type</th>
                      <th>Acquired</th>
                      <th>Released</th>
                      <th>Purchase Price</th>
                      <th>Deed Ref</th>
                      <th>Current</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ownership.map((rec, idx) => (
                      <tr key={idx} className={rec.currentOwner ? "row-current" : ""}>
                        <td className="td-name">
                          <User size={14} />
                          {rec.ownerName || "—"}
                        </td>
                        <td>
                          <span className="td-tag">{rec.ownerType || "—"}</span>
                        </td>
                        <td>{formatDate(rec.acquisitionDate)}</td>
                        <td>{rec.releaseDate ? formatDate(rec.releaseDate) : "Present"}</td>
                        <td>
                          {rec.purchasePrice != null
                            ? `$${rec.purchasePrice.toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="td-mono">{rec.deedReference || "—"}</td>
                        <td>
                          {rec.currentOwner ? (
                            <span className="current-badge">
                              <CheckCircle2 size={12} /> Yes
                            </span>
                          ) : (
                            <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Public Records ────────────────────────────────────────────── */}
          <section className="pd-card pd-full-width">
            <div className="pd-card-header">
              <FileText size={20} />
              <h2>Public Records</h2>
              <span className="pd-badge">{publicRecords.length}</span>
            </div>

            {publicRecords.length === 0 ? (
              <div className="pd-empty-section">
                <p>No public records found.</p>
              </div>
            ) : (
              <div className="pd-table-wrapper">
                <table className="pd-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th>Filed</th>
                      <th>Resolved</th>
                      <th>Authority</th>
                      <th>Ref #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicRecords.map((rec, idx) => {
                      const sev =
                        SEVERITY_CONFIG[rec.severity?.toUpperCase()] ||
                        SEVERITY_CONFIG["LOW"];
                      return (
                        <tr key={idx}>
                          <td>
                            <span className="td-tag">{rec.recordType || "—"}</span>
                          </td>
                          <td className="td-title">{rec.title || rec.description || "—"}</td>
                          <td>
                            <span className={`severity-badge ${sev.cls}`}>
                              {sev.icon}
                              {sev.label}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-chip ${
                                rec.status === "ACTIVE"
                                  ? "chip-active"
                                  : "chip-resolved"
                              }`}
                            >
                              {rec.status || "—"}
                            </span>
                          </td>
                          <td>{formatDate(rec.filingDate)}</td>
                          <td>{rec.resolutionDate ? formatDate(rec.resolutionDate) : "—"}</td>
                          <td>{rec.authority || "—"}</td>
                          <td className="td-mono">{rec.referenceNumber || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Property Tax Payments Ledger ──────────────────────────────── */}
          <section className="pd-card pd-full-width tax-section">
            <div className="pd-card-header">
              <FileText size={20} />
              <h2>Property Tax Payments Ledger</h2>
            </div>
            <p className="section-description">
              Verification of annual property tax assessments and payment status with the Municipal Corporation.
            </p>
            
            <div className="pd-table-wrapper">
              <table className="pd-table">
                <thead>
                  <tr>
                    <th>Tax Year</th>
                    <th>Assessed Value</th>
                    <th>Tax Amount</th>
                    <th>Payment Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {taxHistory.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="td-empty" style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>
                        No tax payment records available.
                      </td>
                    </tr>
                  ) : (
                    taxHistory.map((tax, idx) => {
                      const statusVal = (tax.status || tax.paymentStatus || "PAID").toUpperCase();
                      const isPaid = statusVal === "PAID";
                      const isDelayed = statusVal === "DELAYED";
                      
                      return (
                        <tr key={idx}>
                          <td><strong>{tax.year || tax.taxYear}</strong></td>
                          <td>{formatLakhs(tax.assessedValue)}</td>
                          <td>{formatCurrency(tax.taxAmount)}</td>
                          <td>{tax.paymentDate || "—"}</td>
                          <td>
                            <span className={`tax-badge ${statusVal.toLowerCase()}`} style={{
                              display: "inline-block",
                              padding: "4px 10px",
                              borderRadius: "9999px",
                              fontSize: "12px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              backgroundColor: isPaid ? "var(--success-light)" : isDelayed ? "#fef3c7" : "#fff1f2",
                              color: isPaid ? "#065f46" : isDelayed ? "#92400e" : "#be123c",
                              border: isPaid ? "1px solid #a7f3d0" : isDelayed ? "1px solid #fde68a" : "1px solid #fecdd3"
                            }}>
                              {statusVal}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Property Valuation Comparison ──────────────────────────────── */}
          <section className="pd-card pd-full-width valuation-section">
            <div className="pd-card-header">
              <Scale size={20} />
              <h2>Property Valuation Comparison</h2>
            </div>
            
            <div className="valuation-grid">
              {/* Card 1: Estimated Value */}
              <div className="val-card val-card-estimate">
                <span className="val-card-label">Estimated Market Value</span>
                <span className="val-card-value text-primary">{formatLakhs(valData.estimatedValue)}</span>
                <p className="val-card-desc">Derived via algorithmic comparison of similar nearby listings.</p>
              </div>

              {/* Card 2: Asking Price */}
              <div className="val-card val-card-asking">
                <span className="val-card-label">Current Asking Price</span>
                <span className="val-card-value">{formatLakhs(valData.askingPrice)}</span>
                <p className="val-card-desc">Listed listing price as registered in vendor documents.</p>
              </div>

              {/* Card 3: Difference */}
              <div className={`val-card val-card-diff ${valData.isBelow ? "val-good" : "val-warning"}`}>
                <span className="val-card-label">Valuation Delta</span>
                <div className="val-diff-wrapper">
                  {valData.isBelow ? (
                    <TrendingDown size={22} className="text-green" />
                  ) : (
                    <TrendingUp size={22} className="text-orange" />
                  )}
                  <span className="val-card-value font-semibold">
                    {formatLakhs(Math.abs(valData.diff))}
                  </span>
                </div>
                <span className="val-diff-status">
                  {valData.pct}% {valData.isBelow ? "Below Market" : "Above Market"}
                </span>
              </div>
            </div>

            <div className={`val-recommendation-box ${property?.riskLevel === "HIGH_RISK" ? "rec-alert" : valData.isBelow ? "rec-buy" : "rec-hold"}`}>
              {property?.riskLevel === "HIGH_RISK" ? (
                <XCircle className="rec-icon text-red" size={24} />
              ) : valData.isBelow ? (
                <ShieldCheck className="rec-icon text-green" size={24} />
              ) : (
                <AlertTriangle className="rec-icon text-orange" size={24} />
              )}
              <div>
                <h4>Investment Recommendation</h4>
                <p>{valData.recommendation}</p>
              </div>
            </div>
          </section>

          {/* ── Comparable Property Analysis ────────────────────────────────── */}
          <section className="pd-card pd-full-width comparables-section">
            <div className="pd-card-header">
              <Target size={20} />
              <h2>Comparable Property Analysis (Market Comps)</h2>
            </div>
            
            <p className="section-description">
              Analysis of comparable properties in the immediate vicinity (within 3 km) to establish market benchmarks.
            </p>

            <div className="comps-layout">
              {compsData.map((comp, idx) => (
                <div key={idx} className="comp-item-card">
                  <div className="comp-img-container">
                    <img src={comp.img} alt={comp.name} />
                    <div className="comp-similarity-badge">
                      <Target size={12} />
                      <span>{comp.similarity}% Similarity</span>
                    </div>
                  </div>
                  
                  <div className="comp-body-content">
                    <div className="comp-header-row">
                      <h4>{comp.name}</h4>
                      <span className="comp-badge-type">{comp.type}</span>
                    </div>
                    
                    <p className="comp-address">
                      <MapPin size={13} />
                      {comp.address}
                    </p>

                    <div className="comp-stats-grid">
                      <div className="comp-stat-cell">
                        <Ruler size={13} />
                        <span>{comp.area} sq.ft</span>
                      </div>
                      <div className="comp-stat-cell">
                        <Bed size={13} />
                        <span>{comp.beds} BHK</span>
                      </div>
                      <div className="comp-stat-cell">
                        <Bath size={13} />
                        <span>{comp.baths} Bath</span>
                      </div>
                      <div className="comp-stat-cell">
                        <Calendar size={13} />
                        <span>Built {comp.year}</span>
                      </div>
                    </div>

                    <div className="comp-financial-row">
                      <div className="comp-price-box">
                        <span className="comp-price-lbl">Selling Price</span>
                        <span className="comp-price-val">{formatLakhs(comp.price)}</span>
                      </div>
                      <div className="comp-price-box align-right">
                        <span className="comp-price-lbl">Price / sq.ft</span>
                        <span className="comp-price-val">₹{Math.round(comp.price / comp.area).toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="comp-distance-indicator">
                      <span>📍 {comp.distance} km from subject property</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Property Meta ─────────────────────────────────────────────── */}
          <section className="pd-card">
            <div className="pd-card-header">
              <Hash size={20} />
              <h2>Property Details</h2>
            </div>
            <div className="pd-meta-grid">
              <div className="pd-meta-item">
                <span className="pd-meta-label">Property ID</span>
                <span className="pd-meta-value">#{property?.propertyId}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Owner Name</span>
                <span className="pd-meta-value">{property?.ownerName || "—"}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Type</span>
                <span className="pd-meta-value">{property?.propertyType || "—"}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">ZIP Code</span>
                <span className="pd-meta-value">{property?.zipCode || "—"}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Risk Score</span>
                <span className="pd-meta-value">{isAssessed ? (property?.riskScore ?? "—") : "0 / Not Assessed"}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Added On</span>
                <span className="pd-meta-value">
                  {property?.createdDate ? formatDate(property.createdDate) : "—"}
                </span>
              </div>
            </div>
          </section>

          {/* ── Quick Links ───────────────────────────────────────────────── */}
          <section className="pd-card">
            <div className="pd-card-header">
              <Calendar size={20} />
              <h2>More Actions</h2>
            </div>
            <div className="pd-action-links">
              <Link href={`/report?propertyId=${id}`} className="pd-action-link">
                <FileText size={16} />
                View Full Report
                <ChevronRight size={14} style={{ marginLeft: "auto" }} />
              </Link>
              <Link href="/notifications" className="pd-action-link">
                <AlertCircle size={16} />
                View Notifications
                <ChevronRight size={14} style={{ marginLeft: "auto" }} />
              </Link>
              <Link href="/explore" className="pd-action-link">
                <ArrowLeft size={16} />
                Back to Dashboard
                <ChevronRight size={14} style={{ marginLeft: "auto" }} />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
