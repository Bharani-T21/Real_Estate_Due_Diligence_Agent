"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { Search, MapPin, ShieldCheck, HelpCircle } from "lucide-react";
import "./properties.css";

import ProtectedRoute from "../../components/ProtectedRoute";

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const properties = [
    {
      id: 1,
      title: "Luxury Villa",
      location: "Chennai, Tamil Nadu",
      price: "₹75,00,000",
      status: "Verified Title",
      
      riskLevel: "LOW",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
    },
    {
      id: 2,
      title: "Modern Apartment",
      location: "Bangalore, Karnataka",
      price: "₹55,00,000",
      status: "Verified Title",
      
      riskLevel: "LOW",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    },
    {
      id: 3,
      title: "Independent House",
      location: "Coimbatore, Tamil Nadu",
      price: "₹90,00,000",
      status: "Under Legal Review",
      
      riskLevel: "CONCERNS_FOUND",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    },
    {
      id: 4,
      title: "Premium Flat",
      location: "Hyderabad, Telangana",
      price: "₹68,00,000",
      status: "High Risk Property",
      
      riskLevel: "HIGH_RISK",
      image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&q=80",
    },
  ];

  const filteredProperties = properties.filter((property) =>
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
        <Navbar />

        <div className="properties-page">
          <header className="properties-header">
            <h1>Available Properties</h1>
            <p className="properties-subtitle">
              Explore premium verified listings backed by exhaustive AI and legal due diligence reports.
            </p>
          </header>

          <div className="properties-search-section">
            <div className="search-bar-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search by location (e.g. Chennai, Bangalore)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className="property-grid">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <div key={property.id} className="property-card">
                  <div className="property-image-container">
                    <img src={property.image} alt={property.title} />

                    {/* Status Badge */}
                    <span className={`status-badge ${property.riskLevel === "HIGH_RISK" ? "high-risk" : property.riskLevel === "CONCERNS_FOUND" ? "under-review" : "verified"}`}>
                      {property.riskLevel === "HIGH_RISK" ? (
                        <>
                          <HelpCircle size={14} />
                          High Risk Property
                        </>
                      ) : property.riskLevel === "CONCERNS_FOUND" ? (
                        <>
                          <HelpCircle size={14} />
                          Under Legal Review
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={14} />
                          Verified Title
                        </>
                      )}
                    </span>
                  </div>

                  <div className="property-content">
                    <div className="property-header-row">
                      <h3>{property.title}</h3>
                    </div>

                    <div className="property-location">
                      <MapPin size={16} />
                      <span>{property.location}</span>
                    </div>

                    <div className="property-footer-row">
                      <div className="price-container">
                        <span className="price-label">ESTIMATED PRICE</span>
                        <span className="price-amount">{property.price}</span>
                      </div>

                      <Link href={`/properties/${property.id}`} className="details-btn" style={{ textDecoration: "none" }}>
                        Verify Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <h3>No properties found</h3>
                <p>Try searching for a different location or check back later.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

