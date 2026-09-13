"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || null;
    }
    return null;
  });

  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (_) {}
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) return;

      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (err) {
        console.warn("User detail fetch error:", err);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      if (!data || !data.token) {
        throw new Error("Invalid email or password");
      }
      const authToken = data.token;
      setToken(authToken);
      localStorage.setItem("token", authToken);

      let userInfo = {
        email,
        name: email.split("@")[0],
        role: "BUYER",
      };

      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          userInfo = await response.json();
        }
      } catch (_) {}

      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));

      return {
        success: true,
        data,
        user: userInfo,
      };
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const register = async (userData) => {
    let sanitizedRole = userData.role || "BUYER";
    if (sanitizedRole.toUpperCase().includes("ADMIN")) {
      sanitizedRole = "BUYER";
    }
    await authApi.register({ ...userData, role: sanitizedRole });
    return await login(userData.email, userData.password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
