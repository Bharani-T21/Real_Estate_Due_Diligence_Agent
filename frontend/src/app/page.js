"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  FileText,
  Layers,
  Waves,
  TreePine,
  ArrowRight,
  CheckCircle,
  Building2,
  FileCheck,
  Search,
  Zap,
  Check,
  Lock,
  UserCheck
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const pillars = [
    {
      title: "Property Verification",
      icon: <Building2 className="text-primary" size={28} />,
      badge: "Legal & Ownership",
      desc: "Verify title deeds, encumbrance certificates, seller identity, and historical ownership chains with 100% legal confidence.",
      link: "/properties",
      stats: "10,000+ Listings Verified"
    },
    {
      title: "Tax History Audit",
      icon: <FileText className="text-primary" size={28} />,
      badge: "Financial Clearance",
      desc: "Audit 5-year municipal tax assessment logs, payment receipt confirmations, and outstanding penalty dues.",
      link: "/tax-history",
      stats: "100% Tax Clearance Checks"
    },
    {
      title: "Zoning & Land Use",
      icon: <Layers className="text-primary" size={28} />,
      badge: "Municipal Regulations",
      desc: "Inspect municipal zone codes (R-2, Commercial), max height limits, FAR ratios, setbacks, and spatial GIS overlays.",
      link: "/zoning",
      stats: "CMDA & BBMP GIS Data"
    },
    {
      title: "Flood Zone Analysis",
      icon: <Waves className="text-primary" size={28} />,
      badge: "Hydrological Safety",
      desc: "Evaluate FEMA flood plain categories (Zone X vs AE), base elevation height, and 30-year rain event resilience.",
      link: "/flood-zone",
      stats: "FEMA Certified Profiles"
    },
    {
      title: "Permits & Environmental",
      icon: <TreePine className="text-primary" size={28} />,
      badge: "Structural & ESA Audit",
      desc: "Verify building plan approvals, Occupancy Certificates (CC), Phase I ESA soil toxicity, and radon safety audits.",
      link: "/permits-environmental",
      stats: "Phase I ESA Standards"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Enter Property Information",
      desc: "Input property title number, street address, or parcel PIN to fetch instant government records."
    },
    {
      step: "02",
      title: "Automated Data Aggregation",
      desc: "Agent cross-references municipal tax records, GIS zoning maps, flood plains, and environmental databases."
    },
    {
      step: "03",
      title: "AI Due Diligence Radar",
      desc: "Generates real-time risk scores for legal title, tax compliance, setback violations, and flood hazards."
    },
    {
      step: "04",
      title: "Download Certified Report",
      desc: "Export comprehensive PDF due diligence reports accepted by major financial institutions and buyers."
    }
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* HERO SECTION */}
        <Hero />

        {/* FIVE PILLARS FEATURE SHOWCASE SECTION */}
        <section style={{ maxWidth: "1280px", width: "92%", margin: "80px auto", display: "flex", flexDirection: "column", gap: "40px" }}>
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
            <span style={{ background: "var(--primary-light)", color: "var(--primary)", fontWeight: "700", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              360° DUE DILIGENCE AGENT
            </span>
            <h2 style={{ fontSize: "38px", fontWeight: "800", color: "var(--text-main)", marginTop: "12px", letterSpacing: "-0.02em" }}>
              Comprehensive Risk Verification Pillars
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "17px", marginTop: "10px" }}>
              Five specialized due diligence modules designed to eliminate real estate fraud and legal uncertainty.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "32px",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "20px",
                  transition: "var(--transition-smooth)"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {pillar.icon}
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "700", background: "#f1f5f9", color: "var(--text-muted)", padding: "4px 10px", borderRadius: "20px" }}>
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-main)", marginBottom: "10px" }}>
                    {pillar.title}
                  </h3>

                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                    {pillar.desc}
                  </p>
                </div>

                <div style={{ paddingTop: "16px", borderTop: "1px dashed var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "#10b981", fontWeight: "600" }}>
                    {pillar.stats}
                  </span>
                  {isAuthenticated ? (
                    <Link
                      href={pillar.link}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: "700", fontSize: "14px", textDecoration: "none" }}
                    >
                      Inspect <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontWeight: "600", fontSize: "13px", textDecoration: "none", background: "var(--bg-main)", padding: "4px 10px", borderRadius: "12px", border: "1px solid var(--border)" }}
                    >
                      <Lock size={12} /> Login to Access
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", color: "#ffffff", padding: "90px 20px" }}>
          <div style={{ maxWidth: "1280px", width: "92%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "50px" }}>
            <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
              <span style={{ background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc", fontWeight: "700", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", textTransform: "uppercase" }}>
                AUTOMATED WORKFLOW
              </span>
              <h2 style={{ fontSize: "38px", fontWeight: "800", marginTop: "12px", letterSpacing: "-0.02em" }}>
                How Diligence Agent Works
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "17px", marginTop: "10px" }}>
                From raw municipal data to instant legal risk reports in four seamless steps.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "var(--radius-lg)",
                    padding: "32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px"
                  }}
                >
                  <span style={{ fontSize: "36px", fontWeight: "800", color: "#6366f1" }}>
                    {s.step}
                  </span>
                  <h4 style={{ fontSize: "20px", fontWeight: "700" }}>{s.title}</h4>
                  <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.6" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section style={{ maxWidth: "1280px", width: "92%", margin: "80px auto", background: "var(--gradient-primary)", borderRadius: "var(--radius-xl)", padding: "60px 40px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "30px", boxShadow: "var(--shadow-xl)" }}>
          <div style={{ maxWidth: "600px" }}>
            <h2 style={{ fontSize: "34px", fontWeight: "800", marginBottom: "12px" }}>
              Ready to verify your next property investment?
            </h2>
            <p style={{ fontSize: "17px", opacity: 0.9 }}>
              Gain complete visibility into title deeds, tax logs, zoning restrictions, and environmental risks today.
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link
              href="/properties"
              style={{
                padding: "16px 32px",
                background: "#ffffff",
                color: "var(--primary)",
                borderRadius: "var(--radius-md)",
                fontWeight: "800",
                fontSize: "16px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              Explore Properties <ArrowRight size={18} />
            </Link>
            <Link
              href="/register"
              style={{
                padding: "16px 32px",
                background: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "var(--radius-md)",
                fontWeight: "700",
                fontSize: "16px",
                textDecoration: "none"
              }}
            >
              Create Free Account
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ background: "#0f172a", borderTop: "1px solid #1e293b", color: "#94a3b8", padding: "60px 20px 40px 20px" }}>
        <div style={{ maxWidth: "1280px", width: "92%", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "40px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "20px", fontWeight: "800", color: "#fff", marginBottom: "14px" }}>
              <Building2 className="text-primary" size={24} />
              <span>Diligence Agent</span>
            </div>
            <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
              Automated real estate due diligence platform for buyers, legal teams, agents, and financial institutions.
            </p>
          </div>

          <div>
            <h4 style={{ color: "#fff", fontWeight: "700", marginBottom: "16px", fontSize: "16px" }}>Due Diligence Modules</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
              <Link href="/properties" style={{ color: "#cbd5e1", textDecoration: "none" }}>Property Verification</Link>
              <Link href="/tax-history" style={{ color: "#cbd5e1", textDecoration: "none" }}>Tax History Audit</Link>
              <Link href="/zoning" style={{ color: "#cbd5e1", textDecoration: "none" }}>Zoning & Land Use</Link>
              <Link href="/flood-zone" style={{ color: "#cbd5e1", textDecoration: "none" }}>Flood Risk Analysis</Link>
              <Link href="/permits-environmental" style={{ color: "#cbd5e1", textDecoration: "none" }}>Permits & Environmental</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: "#fff", fontWeight: "700", marginBottom: "16px", fontSize: "16px" }}>Account & Dashboard</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
              <Link href="/login" style={{ color: "#cbd5e1", textDecoration: "none" }}>User Login</Link>
              <Link href="/register" style={{ color: "#cbd5e1", textDecoration: "none" }}>Account Registration</Link>
              <Link href="/profile" style={{ color: "#cbd5e1", textDecoration: "none" }}>Profile Dashboard</Link>
              <Link href="/contact" style={{ color: "#cbd5e1", textDecoration: "none" }}>Contact Support</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: "#fff", fontWeight: "700", marginBottom: "16px", fontSize: "16px" }}>Security & Compliance</h4>
            <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#cbd5e1" }}>
              Bank-grade 256-bit encryption. Compliant with municipal land record APIs and ASTM E1527-21 ESA standards.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: "1280px", width: "92%", margin: "0 auto", paddingTop: "24px", borderTop: "1px solid #1e293b", textAlign: "center", fontSize: "13px" }}>
          © {new Date().getFullYear()} Real Estate Due Diligence Agent. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
