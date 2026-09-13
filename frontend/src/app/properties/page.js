"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  MapPin,
  ShieldCheck,
  Home,
  Building2,
  MapPinned,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import "./properties.css";

export default function PropertiesPage() {
  const { user } = useAuth();

  const isAdmin = user?.role?.roleName === "ADMIN";

  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "Residential",
  });

  // ===========================
  // FETCH PROPERTIES
  // ===========================

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        "http://localhost:8080/api/properties",
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Session expired. Please login again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "You are not authorized to view properties."
          );
        }

        throw new Error(
          `Failed to load properties. Status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid property data received from backend."
        );
      }

      setProperties(data);
    } catch (error) {
      console.error("Property fetch error:", error);
      setErrorMsg(
        error.message || "Failed to load properties."
      );
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ===========================
  // FORM HANDLERS
  // ===========================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingProperty(null);

    setFormData({
      propertyName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      propertyType: "Residential",
    });

    setShowForm(true);
  };

  const openEditForm = (property) => {
    setEditingProperty(property);

    setFormData({
      propertyName: property.propertyName || "",
      address: property.address || "",
      city: property.city || "",
      state: property.state || "",
      zipCode: property.zipCode || "",
      propertyType: property.propertyType || "Residential",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  // ===========================
  // ADD / UPDATE PROPERTY
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const url = editingProperty
        ? `http://localhost:8080/api/properties/${editingProperty.propertyId}`
        : "http://localhost:8080/api/properties";

      const method = editingProperty ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText ||
            `Failed to ${
              editingProperty ? "update" : "add"
            } property`
        );
      }

      alert(
        editingProperty
          ? "Property updated successfully!"
          : "Property added successfully!"
      );

      closeForm();

      await fetchProperties();
    } catch (error) {
      console.error("Save property error:", error);

      alert(
        error.message ||
          "Something went wrong while saving property."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===========================
  // DELETE PROPERTY
  // ===========================

  const handleDelete = async (propertyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete property. Status: ${response.status}`
        );
      }

      alert("Property deleted successfully!");

      await fetchProperties();
    } catch (error) {
      console.error("Delete property error:", error);

      alert(
        error.message ||
          "Failed to delete property."
      );
    }
  };

  // ===========================
  // SEARCH
  // ===========================

  const filteredProperties = properties.filter(
    (property) => {
      const search = searchTerm
        .toLowerCase()
        .trim();

      return (
        property.propertyName
          ?.toLowerCase()
          .includes(search) ||
        property.city
          ?.toLowerCase()
          .includes(search) ||
        property.state
          ?.toLowerCase()
          .includes(search) ||
        property.address
          ?.toLowerCase()
          .includes(search) ||
        property.zipCode
          ?.toLowerCase()
          .includes(search) ||
        property.propertyType
          ?.toLowerCase()
          .includes(search)
      );
    }
  );

  // ===========================
  // IMAGES
  // ===========================

  const propertyImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
  ];

  const getPropertyImage = (property, index) => {
    return propertyImages[
      index % propertyImages.length
    ];
  };

  const getPropertyIcon = (propertyType) => {
    const type =
      propertyType?.toLowerCase() || "";

    if (
      type.includes("apartment") ||
      type.includes("flat")
    ) {
      return <Building2 size={16} />;
    }

    if (
      type.includes("villa") ||
      type.includes("house") ||
      type.includes("residential")
    ) {
      return <Home size={16} />;
    }

    return <MapPinned size={16} />;
  };

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

        <div className="properties-page">

          {/* HEADER */}

          <header className="properties-header">

            <div>
              <h1>
                {isAdmin
                  ? "Property Management"
                  : "Available Properties"}
              </h1>

              <p className="properties-subtitle">
                {isAdmin
                  ? "Manage properties available for real estate due diligence."
                  : "Explore verified properties backed by comprehensive AI and legal due diligence analysis."}
              </p>
            </div>

            {/* ADMIN ADD BUTTON */}

            {isAdmin && (
              <button
                className="admin-add-property-btn"
                onClick={openAddForm}
              >
                <Plus size={18} />
                Add Property
              </button>
            )}

          </header>

          {/* SEARCH */}

          <div className="properties-search-section">

            <div className="search-bar-wrapper">

              <Search
                className="search-icon"
                size={20}
              />

              <input
                type="text"
                placeholder="Search by property, city, state, type..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="no-results">
              <h3>Loading properties...</h3>
              <p>
                Please wait while properties are
                loaded from the backend.
              </p>
            </div>
          )}

          {/* ERROR */}

          {!loading && errorMsg && (
            <div className="no-results">
              <h3>Unable to load properties</h3>
              <p>{errorMsg}</p>
            </div>
          )}

          {/* PROPERTY GRID */}

          {!loading && !errorMsg && (
            <>
              {filteredProperties.length > 0 ? (

                <div className="property-grid">

                  {filteredProperties.map(
                    (property, index) => (

                      <div
                        key={property.propertyId}
                        className="property-card"
                      >

                        {/* IMAGE */}

                        <div className="property-image-container">

                          <img
                            src={getPropertyImage(
                              property,
                              index
                            )}
                            alt={
                              property.propertyName ||
                              "Property"
                            }
                          />

                          <span className="status-badge verified">
                            <ShieldCheck size={14} />
                            Verified Property
                          </span>

                        </div>

                        {/* CONTENT */}

                        <div className="property-content">

                          <div className="property-header-row">

                            <h3>
                              {property.propertyName ||
                                "Property"}
                            </h3>

                            <span className="due-diligence-score score-low-risk">
                              #{property.propertyId}
                            </span>

                          </div>

                          {/* LOCATION */}

                          <div className="property-location">

                            <MapPin size={16} />

                            <span>
                              {property.city ||
                                "N/A"}
                              ,{" "}
                              {property.state ||
                                "N/A"}
                            </span>

                          </div>

                          {/* ADDRESS */}

                          <div
                            style={{
                              marginTop: "10px",
                              fontSize: "14px",
                              color:
                                "var(--text-muted)",
                              lineHeight: "1.5",
                            }}
                          >
                            {property.address ||
                              "Address not available"}
                          </div>

                          {/* PROPERTY TYPE */}

                          <div
                            style={{
                              display: "flex",
                              alignItems:
                                "center",
                              gap: "7px",
                              marginTop: "12px",
                              fontSize: "14px",
                              fontWeight: "600",
                            }}
                          >
                            {getPropertyIcon(
                              property.propertyType
                            )}

                            <span>
                              {property.propertyType ||
                                "Property"}
                            </span>
                          </div>

                          {/* FOOTER */}

                          <div className="property-footer-row">

                            <div className="price-container">

                              <span className="price-label">
                                PIN CODE
                              </span>

                              <span className="price-amount">
                                {property.zipCode ||
                                  "N/A"}
                              </span>

                            </div>

                            <Link
                              href={`/properties/${property.propertyId}`}
                              className="details-btn"
                              style={{
                                textDecoration:
                                  "none",
                              }}
                            >
                              Verify Details
                            </Link>

                          </div>

                          {/* ADMIN ACTIONS */}

                          {isAdmin && (
                            <div className="admin-property-actions">

                              <button
                                type="button"
                                className="edit-property-btn"
                                onClick={() =>
                                  openEditForm(
                                    property
                                  )
                                }
                              >
                                <Pencil size={15} />
                                Edit
                              </button>

                              <button
                                type="button"
                                className="delete-property-btn"
                                onClick={() =>
                                  handleDelete(
                                    property.propertyId
                                  )
                                }
                              >
                                <Trash2 size={15} />
                                Delete
                              </button>

                            </div>
                          )}

                        </div>

                      </div>
                    )
                  )}

                </div>

              ) : (

                <div className="no-results">

                  <h3>
                    No properties found
                  </h3>

                  <p>
                    Try searching for a different
                    property, city or location.
                  </p>

                </div>

              )}
            </>
          )}

        </div>

        {/* ===========================
            ADD / EDIT MODAL
        =========================== */}

        {showForm && isAdmin && (
          <div className="property-modal-overlay">

            <div className="property-modal">

              <div className="property-modal-header">

                <div>
                  <h2>
                    {editingProperty
                      ? "Edit Property"
                      : "Add New Property"}
                  </h2>

                  <p>
                    Enter the property details
                    below.
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={closeForm}
                >
                  <X size={20} />
                </button>

              </div>

              <form
                onSubmit={handleSubmit}
                className="property-form"
              >

                <div className="form-group">
                  <label>
                    Property Name
                  </label>

                  <input
                    type="text"
                    name="propertyName"
                    value={
                      formData.propertyName
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />
                </div>

                <div className="form-row">

                  <div className="form-group">
                    <label>City</label>

                    <input
                      type="text"
                      name="city"
                      value={
                        formData.city
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>

                    <input
                      type="text"
                      name="state"
                      value={
                        formData.state
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />
                  </div>

                </div>

                <div className="form-row">

                  <div className="form-group">
                    <label>
                      Pin Code
                    </label>

                    <input
                      type="text"
                      name="zipCode"
                      value={
                        formData.zipCode
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Property Type
                    </label>

                    <select
                      name="propertyType"
                      value={
                        formData.propertyType
                      }
                      onChange={
                        handleInputChange
                      }
                    >
                      <option value="Residential">
                        Residential
                      </option>

                      <option value="Commercial">
                        Commercial
                      </option>

                      <option value="Apartment">
                        Apartment
                      </option>

                      <option value="Villa">
                        Villa
                      </option>

                      <option value="Land">
                        Land
                      </option>
                    </select>
                  </div>

                </div>

                <div className="property-form-actions">

                  <button
                    type="button"
                    className="cancel-property-btn"
                    onClick={closeForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-property-btn"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingProperty
                      ? "Update Property"
                      : "Add Property"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}

