"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import "./add-property.css";

export default function AddPropertyPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "Residential",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/properties",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Only ADMIN can add properties.");
        }

        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }

        throw new Error("Failed to add property.");
      }

      const data = await response.json();

      console.log("Property added:", data);

      setMessage("Property added successfully!");

      setFormData({
        propertyName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        propertyType: "Residential",
      });

    } catch (error) {
      console.error("Add property error:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <Navbar />

      <div className="add-property-page">

        <div className="add-property-card">

          <h1>Add New Property</h1>

          <p>
            Add a property to the Real Estate Due Diligence platform.
          </p>

          <form onSubmit={handleSubmit}>

            <label>Property Name</label>
            <input
              type="text"
              name="propertyName"
              placeholder="Enter property name"
              value={formData.propertyName}
              onChange={handleChange}
              required
            />

            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <label>City</label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <label>State</label>
            <input
              type="text"
              name="state"
              placeholder="Enter state"
              value={formData.state}
              onChange={handleChange}
              required
            />

            <label>Pincode</label>
            <input
              type="text"
              name="zipCode"
              placeholder="Enter pincode"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />

            <label>Property Type</label>

            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Land">Land</option>
            </select>

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Adding Property..." : "Add Property"}
            </button>

          </form>

          {message && (
            <div className="property-message">
              {message}
            </div>
          )}

        </div>

      </div>
    </ProtectedRoute>
  );
}