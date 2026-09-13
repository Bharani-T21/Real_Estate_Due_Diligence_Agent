"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useAuth } from "../../../context/AuthContext";
import { apiFetch } from "../../../lib/api";
import {
  Users,
  Search,
  Trash2,
  RefreshCw,
  UserCircle,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import "./manage-users.css";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch("/api/users");
      const userList = Array.isArray(data) ? data : [];
      setUsers(userList);
      setFilteredUsers(userList);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.message || "Unable to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredUsers(users);
      return;
    }
    const filtered = users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDelete = async (userId, userName) => {
    if (userId === currentUser?.userId) {
      alert("You cannot delete your own admin account.");
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName || "this user"}?`
    );
    if (!confirmed) return;

    try {
      await apiFetch(`/api/users/${userId}`, { method: "DELETE" });
      setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
      alert("User deleted successfully.");
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user: " + err.message);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <Navbar />

      <main className="manage-users-page">
        <div className="manage-users-header">
          <div>
            <h1>
              <Users size={30} />
              Manage Users
            </h1>
            <p>View and manage registered users in the system.</p>
          </div>

          <button
            className="refresh-users-btn"
            onClick={fetchUsers}
            disabled={loading}
          >
            <RefreshCw size={17} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* USER SUMMARY */}
        <div className="users-summary">
          <div className="summary-card">
            <div className="summary-icon">
              <Users size={22} />
            </div>
            <div>
              <span>Total Users</span>
              <strong>{users.length}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span>Administrators</span>
              <strong>
                {
                  users.filter(
                    (user) => user.role?.toUpperCase() === "ADMIN"
                  ).length
                }
              </strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <UserCircle size={22} />
            </div>
            <div>
              <span>Regular Users</span>
              <strong>
                {
                  users.filter(
                    (user) => user.role?.toUpperCase() !== "ADMIN"
                  ).length
                }
              </strong>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="users-toolbar">
          <div className="users-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="users-error">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* USERS TABLE */}
        <div className="users-table-card">
          {loading ? (
            <div className="users-loading">
              <RefreshCw size={22} className="spin" />
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="users-empty">
              <Users size={42} />
              <h3>No users found</h3>
              <p>
                {searchTerm
                  ? "No users match your search."
                  : "There are no registered users."}
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.userId}>
                      <td>#{user.userId}</td>
                      <td>
                        <div className="user-name-cell">
                          <div className="user-avatar">
                            <UserCircle size={20} />
                          </div>
                          <span>{user.name || "Unknown User"}</span>
                        </div>
                      </td>
                      <td>{user.email || "—"}</td>
                      <td>
                        <span
                          className={`role-badge ${
                            user.role?.toUpperCase() === "ADMIN"
                              ? "admin"
                              : "user"
                          }`}
                        >
                          {user.role || "USER"}
                        </span>
                      </td>
                      <td>
                        {user.role?.toUpperCase() !== "ADMIN" ? (
                          <button
                            className="delete-user-btn"
                            onClick={() => handleDelete(user.userId, user.name)}
                            title="Delete User"
                          >
                            <Trash2 size={17} />
                          </button>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>
                            Protected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
