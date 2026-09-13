"use client";

import Navbar from "../../components/Navbar";
import "./contact.css";

export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
      <Navbar />

      <div className="contact-page-container">
        <div className="contact-card-split">
          {/* Left Info Panel */}
          <div className="contact-info-panel">
            <h2>Get In Touch</h2>
            <p className="contact-panel-desc">
              Have questions about our property verification processes or need assistance? Reach out, and our compliance experts will respond within 24 hours.
            </p>

            <div className="contact-details-list">
              <div className="contact-detail-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <h4>Email Us</h4>
                  <p>support@diligenceagent.com</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <span className="contact-icon">📞</span>
                <div>
                  <h4>Call Us</h4>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h4>Headquarters</h4>
                  <p>Coimbatore, Tamil Nadu, India</p>
                </div>
              </div>
            </div>

            <div className="contact-panel-footer">
              <span>🔒 Encrypted Compliance Portal</span>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="contact-form-panel">
            <h3>Send Message</h3>
            <p>Fill out the form below and we will get back to you shortly.</p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="contact-input-wrapper">
                <label>Your Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>

              <div className="contact-input-wrapper">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" required />
              </div>

              <div className="contact-input-wrapper">
                <label>Message</label>
                <textarea rows="4" placeholder="How can we help you?" required></textarea>
              </div>

              <button type="submit" className="contact-send-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

