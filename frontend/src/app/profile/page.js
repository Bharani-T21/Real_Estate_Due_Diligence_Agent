"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import SavedPropertyCard from "../../components/SavedPropertyCard";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit3,
  LogOut,
  Heart,
  Loader2,
  Save,
  X,
} from "lucide-react";
import { apiFetch, clearToken, getToken } from "../../lib/api";
import "./profile.css";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
  });

  // Saved properties
  const savedProperties = [
    {
      id: 1,
      title: "Luxury Villa",
      location: "Chennai, TN",
      price: "₹75,00,000",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
    },
    {
      id: 2,
      title: "Modern Apartment",
      location: "Bangalore, KA",
      price: "₹55,00,000",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    },
    {
      id: 3,
      title: "Independent House",
      location: "Coimbatore, TN",
      price: "₹90,00,000",
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    },
  ];

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    if (localUser) {
      setUser(localUser);
    }

    const fetchUser = async () => {
      try {
        const data = await apiFetch("/api/users/me");

        setUser(data);

        setEditData({
          name: data.name || "",
          email: data.email || "",
        });
      } catch (err) {
        console.warn("Could not fetch backend profile, using local session profile:", err.message);
        if (!localUser) {
          clearToken();
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  // Open edit mode
  const handleEdit = () => {
    setEditData({
      name: user.name || "",
      email: user.email || "",
    });

    setIsEditing(true);
  };

  // Save changes - frontend update
  const handleSave = () => {
    setUser({
      ...user,
      name: editData.name,
      email: editData.email,
    });

    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData({
      name: user.name || "",
      email: user.email || "",
    });

    setIsEditing(false);
  };

  if (loading || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--bg-main)",
        }}
      >
        <Navbar />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            color: "var(--primary)",
          }}
        >
          <Loader2
            size={32}
            style={{
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      </div>
    );
  }

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

      <div className="profile-page">
        <div className="profile-layout">

          {/* ================= SIDEBAR ================= */}
          <aside className="profile-sidebar">
            <div className="profile-header-card">
              <div className="avatar-wrapper">
                <div className="profile-avatar-placeholder">
                  <User
                    size={48}
                    className="placeholder-user-icon"
                  />
                </div>

                <span className="user-verified-badge">
                  <ShieldCheck size={14} />
                </span>
              </div>

              <h2>{user.name}</h2>

              <p className="role-tag">User</p>

              <span className="profile-status">
                🛡️ KYC Verified
              </span>
            </div>

            <div className="profile-actions-menu">

              {/* ONLY ONE EDIT BUTTON */}
              <button
                className="profile-menu-btn edit-btn"
                onClick={handleEdit}
              >
                <Edit3 size={16} />
                Edit Profile
              </button>

              {/* LOGOUT BUTTON */}
              <button
                className="profile-menu-btn logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Sign Out
              </button>

            </div>
          </aside>

          {/* ================= MAIN CONTENT ================= */}
          <main className="profile-main-content">

            {/* ================= ACCOUNT DETAILS ================= */}
            <section className="profile-details-card">

              <h3 className="section-title">
                Account Details
              </h3>

              {!isEditing ? (

                /* ---------- NORMAL VIEW ---------- */
                <div className="details-grid">

                  <div className="profile-detail-box">
                    <div className="detail-header">
                      <User size={16} />
                      <span>Full Name</span>
                    </div>

                    <p>{user.name}</p>
                  </div>

                  <div className="profile-detail-box">
                    <div className="detail-header">
                      <Mail size={16} />
                      <span>Email Address</span>
                    </div>

                    <p>{user.email}</p>
                  </div>

                  <div className="profile-detail-box">
                    <div className="detail-header">
                      <Phone size={16} />
                      <span>Mobile Number</span>
                    </div>

                    <p>Not provided</p>
                  </div>

                  <div className="profile-detail-box">
                    <div className="detail-header">
                      <MapPin size={16} />
                      <span>Primary Location</span>
                    </div>

                    <p>Not provided</p>
                  </div>

                </div>

              ) : (

                /* ---------- EDIT VIEW ---------- */
                <div className="edit-profile-form">

                  <div className="form-group">
                    <label>
                      <User size={16} />
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Mail size={16} />
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="edit-form-actions">

                    <button
                      type="button"
                      className="save-profile-btn"
                      onClick={handleSave}
                    >
                      <Save size={16} />
                      Save Changes
                    </button>

                    <button
                      type="button"
                      className="cancel-profile-btn"
                      onClick={handleCancel}
                    >
                      <X size={16} />
                      Cancel
                    </button>

                  </div>

                </div>
              )}

            </section>

            {/* ================= SAVED LISTINGS ================= */}
            <section className="saved-listings-section">

              <div className="saved-listings-header">
                <Heart
                  size={20}
                  className="heart-icon"
                />

                <h3>
                  Saved Listings ({savedProperties.length})
                </h3>
              </div>

              <div className="saved-properties-grid">
                {savedProperties.map((property) => (
                  <SavedPropertyCard
                    key={property.id}
                    image={property.image}
                    title={property.title}
                    location={property.location}
                    price={property.price}
                  />
                ))}
              </div>

            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
