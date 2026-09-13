"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password || !confirmPassword || !role) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (role === "Admin" || role === "ADMINISTRATOR" || role === "ADMIN") {
      setErrorMsg("Registration as Administrator is not allowed.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await register({ name, email, password, role });
      router.push("/profile");
    } catch (err) {
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
      <Navbar />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 20px" }}>
        <div className="container" style={{ margin: 0, width: "100%", maxWidth: "450px" }}>
          <h1>Get Started</h1>
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "14px", marginBottom: "32px", fontWeight: 500 }}>
            Create an account to start verifying properties
          </p>

          {errorMsg && (
            <div style={{ color: "#ef4444", background: "#fef2f2", padding: "10px 14px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", border: "1px solid #fca5a5" }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <Input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                marginBottom: "24px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontSize: "15px",
                background: "var(--bg-card)",
                outline: "none",
                transition: "var(--transition-smooth)"
              }}
              required
            >
              <option value="">Select your role</option>
              <option value="Buyer">Buyer</option>
              <option value="Agent">Real Estate Agent</option>
              <option value="Reviewer">Legal Reviewer</option>
              <option value="Bank">Financial Institution</option>
            </select>

            <Button text={submitting ? "Creating Account..." : "Create Account"} type="submit" disabled={submitting} />
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)", fontWeight: 500 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
