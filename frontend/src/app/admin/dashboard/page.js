"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import ProtectedRoute from "../../../components/ProtectedRoute";
import "./admin-dashboard.css";
import {
  Users,
  Building2,
  FileText,
  ShieldAlert,
  Clock3,
  Activity,
  FileBarChart,
  UserCog,
  ScrollText,
  Download,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sun,
  Moon,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

const THEME_STORAGE_KEY = "admin-dashboard-theme";

function TimeRangeToggle({ range, onChange }) {
  const options = ["24h", "7d", "30d"];

  return (
    <div className="range-toggle" role="tablist" aria-label="Time range">
      {options.map((option) => (
        <button
          key={option}
          role="tab"
          aria-selected={range === option}
          className={`range-btn ${range === option ? "active" : ""}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function ThemeToggle({ darkMode, onChange }) {
  return (
    <div
      className="theme-toggle-container"
      onClick={() => onChange(!darkMode)}
    >
      <button
        type="button"
        className={`theme-switch ${darkMode ? "dark" : ""}`}
        role="switch"
        aria-checked={darkMode}
        aria-label="Toggle dark mode"
        onClick={(e) => {
          e.stopPropagation();
          onChange(!darkMode);
        }}
      >
        <Moon size={12} className="track-icon moon" />
        <Sun size={12} className="track-icon sun" />
        <span className="theme-switch-thumb">
          {darkMode ? <Sun size={12} /> : <Moon size={12} />}
        </span>
      </button>
      <span className="theme-toggle-label">
        {darkMode ? "Dark Mode" : "Light Mode"}
      </span>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [range, setRange] = useState("7d");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("../../../lib/api").then(({ apiFetch }) => {
      apiFetch("/api/admin/dashboard")
        .then((data) => {
          setDashboardData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    });
  }, []);

  const [darkMode, setDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark") {
      setDarkMode(true);
    } else if (saved === "light") {
      setDarkMode(false);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
    setThemeLoaded(true);
  }, []);

  useEffect(() => {
    if (!themeLoaded) return;
    window.localStorage.setItem(THEME_STORAGE_KEY, darkMode ? "dark" : "light");
  }, [darkMode, themeLoaded]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const kpis = [
    {
      label: "Total Users",
      value: loading ? "..." : String(dashboardData?.totalUsers ?? "—"),
      icon: <Users size={26} />,
      accent: "kpi-blue",
    },
    {
      label: "Properties Analyzed",
      value: loading ? "..." : String(dashboardData?.totalProperties ?? "—"),
      icon: <Building2 size={26} />,
      accent: "kpi-indigo",
    },
    {
      label: "Reports Generated",
      value: loading ? "..." : String(dashboardData?.totalReports ?? "—"),
      icon: <FileText size={26} />,
      accent: "kpi-green",
    },
    {
      label: "High-Risk Properties",
      value: loading
        ? "..."
        : String(dashboardData?.riskDistribution?.HIGH ?? dashboardData?.riskDistribution?.HIGH_RISK ?? "—"),
      icon: <ShieldAlert size={26} />,
      accent: "kpi-red",
    },
    {
      label: "Pending Reviews",
      value: loading ? "..." : String(dashboardData?.reportsByStatus?.IN_PROGRESS ?? "—"),
      icon: <Clock3 size={26} />,
      accent: "kpi-amber",
    },
    {
      label: "System Uptime",
      value: "N/A",
      icon: <Activity size={26} />,
      accent: "kpi-blue",
    },
  ];

  const reportsOverTime = [
    { day: "Mon", reports: 92 },
    { day: "Tue", reports: 118 },
    { day: "Wed", reports: 104 },
    { day: "Thu", reports: 136 },
    { day: "Fri", reports: 152 },
    { day: "Sat", reports: 74 },
    { day: "Sun", reports: 58 },
  ];

  const riskDistribution = [
    { name: "Low Risk", value: 62, color: "#22c55e" },
    { name: "Medium Risk", value: 28, color: "#f59e0b" },
    { name: "High Risk", value: 10, color: "#ef4444" },
  ];

  const userRoles = [
    { role: "Buyer", count: 120 },
    { role: "Agent", count: 68 },
    { role: "Legal Reviewer", count: 25 },
    { role: "Financial Inst.", count: 20 },
    { role: "Administrator", count: 15 },
  ];

  const integrationHealth = [
    { module: "Land Registry", success: 98 },
    { module: "Tax Records", success: 96 },
    { module: "Zoning", success: 94 },
    { module: "Flood Zone (FEMA)", success: 99 },
    { module: "Permits", success: 92 },
    { module: "GIS / Maps", success: 97 },
  ];

  const reportStats = [
    {
      label: "Reports Completed",
      value: loading ? "..." : String(dashboardData?.reportsByStatus?.COMPLETED ?? "—"),
      icon: <FileBarChart size={24} />,
      accent: "kpi-blue",
    },
    {
      label: "Reports In Progress",
      value: loading ? "..." : String(dashboardData?.reportsByStatus?.IN_PROGRESS ?? "—"),
      icon: <FileText size={24} />,
      accent: "kpi-indigo",
    },
    {
      label: "Total Reports",
      value: loading ? "..." : String(dashboardData?.totalReports ?? "—"),
      icon: <Activity size={24} />,
      accent: "kpi-green",
    },
    {
      label: "Failed Reports",
      value: loading ? "..." : String(dashboardData?.reportsByStatus?.FAILED ?? "—"),
      icon: <ShieldAlert size={24} />,
      accent: "kpi-red",
    },
  ];

  const recentActivity = [
    {
      id: "LOG101",
      user: "Admin",
      action: "Approved Due Diligence Report",
      module: "Reports",
      time: "2 min ago",
      status: "Success",
      dateCategory: "today",
    },
    {
      id: "LOG102",
      user: "Priya",
      action: "Flagged High Flood Risk",
      module: "Risk Assessment",
      time: "18 min ago",
      status: "Warning",
      dateCategory: "today",
    },
    {
      id: "LOG103",
      user: "System",
      action: "Land Registry Sync Failed",
      module: "Integrations",
      time: "42 min ago",
      status: "Failed",
      dateCategory: "today",
    },
    {
      id: "LOG104",
      user: "John",
      action: "Generated Comparable Listing Report",
      module: "Comparable Properties",
      time: "1 hr ago",
      status: "Success",
      dateCategory: "today",
    },
    {
      id: "LOG105",
      user: "Admin",
      action: "Updated Role Permissions",
      module: "User Management",
      time: "3 hrs ago",
      status: "Success",
      dateCategory: "today",
    },
  ];

  const handleGenerateReport = () => {
    router.push("/report");
  };

  const handleReportHistory = () => {
    router.push("/report-history");
  };

  const handleManageUsers = () => {
    router.push("/admin/users");
  };

  const handleViewAuditLogs = () => {
    router.push("/audit-logs");
  };

  const handleExportAnalytics = async () => {
    try {
      const { getToken } = await import("../../../lib/api");
      const token = getToken();
      const response = await fetch("/api/admin/analytics/export", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Export failed: ${response.status}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "analytics-export.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed: " + err.message);
    }
  };

  const filteredActivity = useMemo(() => {
    return recentActivity.filter((row) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        term === "" ||
        row.user.toLowerCase().includes(term) ||
        row.action.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "All" || row.status === statusFilter;

      let matchesDate = true;
      if (dateFilter === "Today") {
        matchesDate = row.dateCategory === "today";
      } else if (dateFilter === "Last 7 Days") {
        matchesDate = row.dateCategory === "today" || row.dateCategory === "7d";
      } else if (dateFilter === "Last 30 Days") {
        matchesDate =
          row.dateCategory === "today" ||
          row.dateCategory === "7d" ||
          row.dateCategory === "30d";
      }
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [searchTerm, statusFilter, dateFilter]);

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <Navbar />

      <div className={`dashboard-container${darkMode ? " dark-mode" : ""}`}>
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard &amp; Analytics</h1>
            <p className="dashboard-description">
              Monitor platform-wide activity, property risk distribution, and
              system performance at a glance.
            </p>
          </div>

          <div className="header-controls">
            <TimeRangeToggle range={range} onChange={setRange} />
            <ThemeToggle darkMode={darkMode} onChange={setDarkMode} />
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="quick-actions-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <Link href="/admin/properties/add" className="quick-action-btn qa-blue">
              <Building2 size={22} />
              <span>Add Property</span>
            </Link>

            <button className="quick-action-btn qa-blue" onClick={handleGenerateReport}>
              <FileBarChart size={22} />
              <span>Generate Report</span>
            </button>

            <button className="quick-action-btn qa-indigo" onClick={handleReportHistory}>
              <FileText size={22} />
              <span>Report History</span>
            </button>

            <button className="quick-action-btn qa-indigo" onClick={handleManageUsers}>
              <UserCog size={22} />
              <span>Manage Users</span>
            </button>

            <button className="quick-action-btn qa-amber" onClick={handleViewAuditLogs}>
              <ScrollText size={22} />
              <span>View Audit Logs</span>
            </button>

            <button className="quick-action-btn qa-green" onClick={handleExportAnalytics}>
              <Download size={22} />
              <span>Export Analytics</span>
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="kpi-grid">
          {kpis.map((kpi) => (
            <div key={kpi.label} className={`kpi-card ${kpi.accent}`}>
              <div className="kpi-icon">{kpi.icon}</div>
              <div>
                <h2>{kpi.value}</h2>
                <p>{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* REPORT STATISTICS */}
        <div className="chart-card report-stats-card">
          <h3>Report Statistics</h3>
          <div className="report-stats-grid">
            {reportStats.map((stat) => (
              <div key={stat.label} className={`kpi-card ${stat.accent}`}>
                <div className="kpi-icon">{stat.icon}</div>
                <div>
                  <h2>{stat.value}</h2>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHARTS ROW 1 */}
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Reports Generated (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={reportsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={13} />
                <YAxis stroke="#6b7280" fontSize={13} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #dbe4f0",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="reports"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#2563eb" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Property Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {riskDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #dbe4f0",
                  }}
                />
                <Legend verticalAlign="bottom" height={30} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHARTS ROW 2 */}
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Users by Role</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={userRoles} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis type="number" stroke="#6b7280" fontSize={13} />
                <YAxis
                  dataKey="role"
                  type="category"
                  width={110}
                  stroke="#6b7280"
                  fontSize={13}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #dbe4f0",
                  }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>External Integration Success Rate</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={integrationHealth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis
                  dataKey="module"
                  stroke="#6b7280"
                  fontSize={11}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={13}
                  domain={[80, 100]}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #dbe4f0",
                  }}
                />
                <Bar dataKey="success" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="activity-card">
          <div className="activity-header">
            <h3>Recent Activity</h3>
            <a href="/audit-logs" className="view-all-link">
              View All Logs
            </a>
          </div>

          <div className="activity-filter-bar">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search by user or action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            <select
              className="filter-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>User</th>
                <th>Action</th>
                <th>Module</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivity.length > 0 ? (
                filteredActivity.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.user}</td>
                    <td>{row.action}</td>
                    <td>{row.module}</td>
                    <td>{row.time}</td>
                    <td>
                      <span className={`status ${row.status.toLowerCase()}`}>
                        {row.status === "Success" && (
                          <CheckCircle2 size={13} className="status-icon" />
                        )}
                        {row.status === "Failed" && (
                          <XCircle size={13} className="status-icon" />
                        )}
                        {(row.status === "Pending" ||
                          row.status === "Warning") && (
                          <AlertTriangle size={13} className="status-icon" />
                        )}
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="no-results">
                    No matching activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
