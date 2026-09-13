"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import SavedPropertyCard from "../../components/SavedPropertyCard";
import { User, Mail, Phone, MapPin, ShieldCheck, Edit3, LogOut, Heart, Loader2 } from "lucide-react";
import { apiFetch, clearToken, getToken, getUser } from "../../lib/api";
import "./profile.css";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // We can leave some dummy saved properties for UI showcase since that API isn't built yet
  const savedProperties = [
    {
      id: 1,
      title: "Luxury Villa",
      location: "Chennai, TN",
      price: "₹75,00,000",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
    },
    {
      id: 2,
      title: "Modern Apartment",
      location: "Bangalore, KA",
      price: "₹55,00,000",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    },
    {
      id: 3,
      title: "Independent House",
      location: "Coimbatore, TN",
      price: "₹90,00,000",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    },
  ];

  useEffect(() => {
    // Check auth token
    const token = getToken();
    const localUser = getUser();

    if (!token) {
      router.push("/login");
      return;
    }

    if (localUser) {
      setUser(localUser);
    }

    const fetchUser = async () => {
      try {
        const data = await apiFetch("/api/users/me");
        if (data) {
          const merged = { ...localUser, ...data, role: localUser?.role || "Buyer" };
          setUser(merged);
        }
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

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
        <Navbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "var(--primary)" }}>
          <Loader2 size={32} className="spin" style={{ animation: "spin 1s linear infinite" }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
      <Navbar />

      <div className="profile-page">
        <div className="profile-layout">

          {/* Sidebar Panel */}
          <aside className="profile-sidebar">
            <div className="profile-header-card">
              <div className="avatar-wrapper">
                <div className="profile-avatar-placeholder">
                  <User size={48} className="placeholder-user-icon" />
                </div>
                <span className="user-verified-badge">
                  <ShieldCheck size={14} />
                </span>
              </div>

              <h2>{user.name}</h2>
              <p className="role-tag">User</p>
              <span className="profile-status">🛡️ KYC Verified</span>
            </div>

            <div className="profile-actions-menu">
              <button className="profile-menu-btn edit-btn">
                <Edit3 size={16} />
                Edit Profile
              </button>
              <button className="profile-menu-btn logout-btn" onClick={handleLogout}>
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Details Content Panel */}
          <main className="profile-main-content">
            <section className="profile-details-card">
              <h3 className="section-title">Account Details</h3>

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
            </section>

            {/* Saved Listings Grid */}
            <section className="saved-listings-section">
              <div className="saved-listings-header">
                <Heart size={20} className="heart-icon" />
                <h3>Saved Listings ({savedProperties.length})</h3>
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
