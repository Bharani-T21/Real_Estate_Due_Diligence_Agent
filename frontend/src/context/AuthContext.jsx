"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to restore user session from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      if (data && data.token) {
        const authToken = data.token;
        setToken(authToken);
        localStorage.setItem("token", authToken);

        let userInfo = {
          email,
          name: email.split("@")[0],
          role: "BUYER",
        };

        try {
          const res = await fetch("/api/users/me", {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          if (res.ok) {
            const profile = await res.json();
            userInfo = {
              userId: profile.userId,
              email: profile.email,
              name: profile.name || userInfo.name,
              role: profile.role || "BUYER",
            };
          }
        } catch (_) {}

        setUser(userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));
        return { success: true, data };
      }
    } catch (err) {
      console.warn("Backend auth error:", err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    let sanitizedRole = userData.role || "BUYER";
    if (sanitizedRole.toUpperCase().includes("ADMIN")) {
      sanitizedRole = "BUYER";
    }

    // Register returns UserResponseDTO which does not have token, so we auto login after register
    await authApi.register({ ...userData, role: sanitizedRole });

    // Auto login after registration to get JWT
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
