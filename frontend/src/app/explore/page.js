"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import {
  ShieldCheck,
  MapPin,
  BadgePercent,
  FileSpreadsheet,
  Eye,
  AlertTriangle,
  Building2,
  RefreshCw,
} from "lucide-react";
import { apiFetch } from "../../lib/api";
import "./explore.css";

const FILTERS = ["All", "APARTMENT", "VILLA", "COMMERCIAL", "RESIDENTIAL"];

const IMAGES = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80",
];

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/api/properties");
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const filtered =
    activeFilter === "All"
      ? properties
      : properties.filter(
          (p) =>
            p.propertyType?.toUpperCase() === activeFilter.toUpperCase()
        );

  const typeLabel = (type) =>
    type
      ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
      : "Property";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-main)",
      }}
    >
      <Navbar />

      <div className="explore-page">
        <header className="explore-header">
          <h1 className="explore-title">Property Dashboard</h1>
          <p className="explore-subtitle">
            Live property listings from the database — click Analyze to run a
            full due diligence check.
          </p>

          {/* Stats bar */}
          {!loading && !error && (
            <div className="explore-stats-bar">
              <div className="explore-stat">
                <Building2 size={16} />
                <span>
                  <strong>{properties.length}</strong> Properties
                </span>
              </div>
              <div className="explore-stat">
                <ShieldCheck size={16} style={{ color: "var(--success)" }} />
                <span>
                  <strong>{properties.length}</strong> Listed
                </span>
              </div>
              <div className="explore-stat">
                <BadgePercent size={16} style={{ color: "var(--accent)" }} />
                <span>Due Diligence Ready</span>
              </div>
            </div>
          )}
        </header>

        {/* Filter Tabs */}
        <div className="explore-filters">
          {FILTERS.map((category) => (
            <button
              key={category}
              className={`filter-tab ${
                activeFilter === category ? "active" : ""
              }`}
              onClick={() => setActiveFilter(category)}
            >
              {category === "All"
                ? "All"
                : typeLabel(category)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="explore-skeleton-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-image" />
                <div className="skeleton-body">
                  <div className="skeleton skeleton-tag" />
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line short" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="explore-error">
            <AlertTriangle size={24} />
            <div>
              <strong>Could not load properties</strong>
              <p>{error}</p>
            </div>
            <button className="retry-btn" onClick={loadProperties}>
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !error && (
          <div className="property-grid">
            {filtered.length === 0 ? (
              <div className="explore-empty">
                <Building2 size={48} style={{ color: "var(--border)" }} />
                <h3>No properties found</h3>
                <p>
                  {activeFilter === "All"
                    ? "No properties exist in the database yet."
                    : `No properties of type "${typeLabel(activeFilter)}" found.`}
                </p>
              </div>
            ) : (
              filtered.map((property, idx) => (
                <div key={property.propertyId} className="property-card">
                  <div className="property-image-wrapper">
                    <img
                      src={IMAGES[idx % IMAGES.length]}
                      alt={property.propertyName || "Property"}
                    />
                    <span className="compliance-badge">
                      <ShieldCheck size={14} />
                      Listed
                    </span>
                  </div>

                  <div className="property-content">
                    <div className="property-type-tag">
                      {typeLabel(property.propertyType) || "Property"}
                    </div>
                    <h2>{property.propertyName || `Property #${property.propertyId}`}</h2>

                    <p className="property-loc">
                      <MapPin size={16} />
                      {[property.address, property.city, property.state]
                        .filter(Boolean)
                        .join(", ") || "Location not specified"}
                    </p>

                    <div className="property-stats">
                      <div className="stat-pill">
                        <FileSpreadsheet size={14} />
                        <span>ZIP: {property.zipCode || "—"}</span>
                      </div>
                      <div className="stat-pill">
                        <BadgePercent size={14} />
                        <span>Due Diligence Ready</span>
                      </div>
                    </div>

                    <div className="explore-card-footer">
                      <div className="price-box">
                        <span
                          className="property-id-tag"
                          style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}
                        >
                          ID #{property.propertyId}
                        </span>
                      </div>

                      <Link
                        href={`/properties/${property.propertyId}`}
                        className="view-btn"
                      >
                        <Eye size={16} />
                        Analyze
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
