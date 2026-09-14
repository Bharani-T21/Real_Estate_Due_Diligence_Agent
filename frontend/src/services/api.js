// Use empty string so requests go through Next.js server-side proxy (next.config.mjs rewrites)
// This works in both development (dev server proxies to localhost:8080) and production (proxies to BACKEND_URL)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Helper to fetch data with optional Bearer JWT auth token from localStorage
 */
async function request(endpoint, options = {}) {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Always use absolute backend URL to avoid Next.js rewrite proxy stripping the Authorization header
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (_) {
      // Ignore JSON parse errors on non-JSON error responses
    }
    throw new Error(errorMessage);
  }

  // If status is 204 No Content
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const authApi = {
  login: async (email, password) => {
    try {
      return await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      if (err.message.includes("401") || err.message.includes("403")) {
        throw new Error("Invalid email or password. Please check your credentials.");
      }
      throw err;
    }
  },
  register: async (userData) => {
    try {
      // Call standard registration endpoint
      const registerResponse = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role || "BUYER",
        }),
      });
      // After successful registration, log in to obtain JWT token
      const loginResponse = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: userData.email, password: userData.password }),
      });
      return { ...registerResponse, token: loginResponse?.token };
    } catch (err) {
      console.warn("Backend registration fallback:", err.message);
      throw err;
    }
  },
};

export const userApi = {
  getAll: async () => {
    try {
      return await request("/api/users");
    } catch (_) {
      return [];
    }
  },
  getById: async (id) => {
    return request(`/api/users/${id}`);
  },
  delete: async (id) => {
    return request(`/api/users/${id}`, { method: "DELETE" });
  },
};

export const propertyApi = {
  getAll: async () => {
    try {
      return await request("/api/properties");
    } catch (_) {
      return null;
    }
  },
  getById: async (id) => {
    try {
      return await request(`/api/properties/${id}`);
    } catch (_) {
      return null;
    }
  },
  create: async (propertyData) => {
    return request("/api/properties", {
      method: "POST",
      body: JSON.stringify(propertyData),
    });
  },
  update: async (id, propertyData) => {
    return request(`/api/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(propertyData),
    });
  },
  delete: async (id) => {
    return request(`/api/properties/${id}`, {
      method: "DELETE",
    });
  },
  searchByCity: async (city) => {
    try {
      return await request(`/api/properties/search/city/${encodeURIComponent(city)}`);
    } catch (_) {
      return null;
    }
  },
  searchByState: async (state) => {
    try {
      return await request(`/api/properties/search/state/${encodeURIComponent(state)}`);
    } catch (_) {
      return null;
    }
  },
  searchByPincode: async (pincode) => {
    try {
      return await request(`/api/properties/search/pincode/${encodeURIComponent(pincode)}`);
    } catch (_) {
      return null;
    }
  },
  searchByType: async (type) => {
    try {
      return await request(`/api/properties/search/type/${encodeURIComponent(type)}`);
    } catch (_) {
      return null;
    }
  },
};

export const dueDiligenceApi = {
  getPropertyInformation: async (propertyId) => {
    return request(`/api/property-information/${propertyId}`);
  },
  processDueDiligence: async (propertyId) => {
    return request(`/api/due-diligence/${propertyId}/process`, {
      method: "POST",
    });
  },
  getAllReports: async () => {
    return request("/api/due-diligence/reports");
  },
  getAdminAnalytics: async () => {
    return request("/api/due-diligence/admin/analytics");
  },
};