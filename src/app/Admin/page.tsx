"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Shield, ToggleLeft, ToggleRight, Search, RefreshCw, ChevronLeft, ChevronRight, ArrowLeft, Activity, UserCheck, UserX } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiGet, apiPatch } from "@/lib/apiClient";
import Link from "next/link";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  is_active: boolean;
  created_at: string;
}

interface Pagination { page: number; totalPages: number; total: number; }
interface StatsData { total: number; active: number; admins: number; newThisMonth: number; }

const ROLE_BADGE: Record<string, { bg: string; text: string }> = {
  admin: { bg: "#fef3c7", text: "#d97706" },
  user:  { bg: "#eff6ff", text: "#3b82f6" },
};

export default function AdminPage() {
  const { logout } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, totalPages: 1, total: 0 });
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | "user" | "admin">("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10", ...(search && { search }), ...(roleFilter && { role: roleFilter }) });
      const data = await apiGet<{ success: boolean; users: UserRow[]; pagination: Pagination }>(`/api/admin/users?${params}`);
      if (data.success) { setUsers(data.users); setPagination(data.pagination); }
    } finally { setIsLoading(false); }
  }, [search, roleFilter]);

  const fetchStats = useCallback(async () => {
    const data = await apiGet<{ success: boolean; stats: StatsData }>("/api/admin/users/stats");
    if (data.success) setStats(data.stats);
  }, []);

  useEffect(() => { fetchUsers(1); fetchStats(); }, [fetchUsers, fetchStats]);

  async function toggleActive(user: UserRow) {
    setUpdating(user.id);
    try {
      const data = await apiPatch<{ success: boolean; user: UserRow }>(`/api/admin/users/${user.id}`, { is_active: !user.is_active });
      if (data.success) setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
    } finally { setUpdating(null); }
  }

  async function toggleRole(user: UserRow) {
    setUpdating(user.id);
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      const data = await apiPatch<{ success: boolean; user: UserRow }>(`/api/admin/users/${user.id}`, { role: newRole });
      if (data.success) setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u));
    } finally { setUpdating(null); }
  }

  return (
    <div className="min-h-screen" style={{ background: "#0f0a00" }}>
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-64 min-h-screen flex-shrink-0 hidden lg:flex flex-col border-r"
          style={{ background: "#0f0a00", borderColor: "#1c1208" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#1c1208" }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: "var(--brand)", fontFamily: "Syne, sans-serif" }}>D</div>
              <div>
                <p className="text-white text-sm font-bold" style={{ fontFamily: "Syne, sans-serif" }}>dingly</p>
                <p className="text-xs" style={{ color: "var(--brand)" }}>Admin Panel</p>
              </div>
            </div>
          </div>

          <nav className="p-4 flex-1">
            {[
              { icon: Users,    label: "Users",     active: true },
              { icon: Activity, label: "Analytics", active: false },
              { icon: Shield,   label: "Security",  active: false },
            ].map((item) => (
              <button key={item.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-colors"
                style={{ background: item.active ? "var(--brand)" : "transparent", color: item.active ? "#fff" : "#6b5a47" }}>
                <item.icon size={16} />{item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t" style={{ borderColor: "#1c1208" }}>
            <Link href="/dashboard" className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: "#6b5a47" }}>
              <ArrowLeft size={14} />Back to dashboard
            </Link>
            <button onClick={logout} className="flex items-center gap-2 text-xs px-3 py-2 mt-1 rounded-lg hover:bg-white/5 transition-colors w-full" style={{ color: "#6b5a47" }}>
              Sign out
            </button>
          </div>
        </motion.aside>

        {/* Main */}
        <main className="flex-1 p-6 lg:p-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>User Management</h1>
            <p className="text-sm mt-1" style={{ color: "#6b5a47" }}>Manage all registered users across Dingly</p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users,     label: "Total Users",    value: stats?.total        ?? 0, color: "#f97316" },
              { icon: UserCheck, label: "Active",          value: stats?.active       ?? 0, color: "#22c55e" },
              { icon: UserX,     label: "Admins",          value: stats?.admins       ?? 0, color: "#a855f7" },
              { icon: Activity,  label: "New This Month",  value: stats?.newThisMonth ?? 0, color: "#38bdf8" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.05 }}
                className="p-5 rounded-2xl" style={{ background: "#1c1208", border: "1px solid #2d1f10" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.color + "20" }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "#6b5a47" }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl overflow-hidden" style={{ background: "#1c1208", border: "1px solid #2d1f10" }}>

            {/* Toolbar */}
            <div className="px-6 py-4 flex flex-col sm:flex-row gap-3 border-b" style={{ borderColor: "#2d1f10" }}>
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b5a47" }} />
                <input type="text" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-[#6b5a47] focus:outline-none"
                  style={{ background: "#0f0a00", border: "1px solid #2d1f10" }} />
              </div>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as "" | "user" | "admin")}
                className="px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ background: "#0f0a00", border: "1px solid #2d1f10", color: "#fff" }}>
                <option value="">All roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
              <button onClick={() => fetchUsers(pagination.page)} className="p-2.5 rounded-xl hover:bg-white/5 transition-colors" style={{ border: "1px solid #2d1f10" }}>
                <RefreshCw size={15} style={{ color: "#6b5a47" }} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #2d1f10" }}>
                    {["User", "Role", "Status", "Joined", "Actions"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold tracking-wide uppercase" style={{ color: "#6b5a47" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {isLoading
                      ? Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>{Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="px-6 py-4">
                            <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
                              className="h-4 rounded" style={{ background: "#2d1f10", width: j === 0 ? "140px" : "80px" }} />
                          </td>
                        ))}</tr>
                      ))
                      : users.map((user) => {
                        const rb = ROLE_BADGE[user.role];
                        return (
                          <motion.tr key={user.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: "#2d1f10" }}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                  style={{ background: "var(--brand)", fontFamily: "Syne, sans-serif" }}>
                                  {user.name[0]?.toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-white">{user.name}</p>
                                  <p className="text-xs" style={{ color: "#6b5a47" }}>{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: rb.bg, color: rb.text }}>{user.role}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                style={{ background: user.is_active ? "#dcfce720" : "#fef2f220", color: user.is_active ? "#22c55e" : "#ef4444" }}>
                                {user.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs" style={{ color: "#6b5a47" }}>
                              {new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleActive(user)} disabled={updating === user.id}
                                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-40"
                                  style={{ color: user.is_active ? "#22c55e" : "#ef4444" }} title={user.is_active ? "Deactivate" : "Activate"}>
                                  {user.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleRole(user)} disabled={updating === user.id}
                                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-40"
                                  style={{ color: "#6b5a47" }} title={`Make ${user.role === "admin" ? "user" : "admin"}`}>
                                  <Shield size={15} />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t" style={{ borderColor: "#2d1f10" }}>
              <p className="text-xs" style={{ color: "#6b5a47" }}>Showing {users.length} of {pagination.total} users</p>
              <div className="flex items-center gap-2">
                <button onClick={() => fetchUsers(pagination.page - 1)} disabled={pagination.page === 1}
                  className="p-2 rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors" style={{ color: "#6b5a47" }}>
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-mono text-white px-2">{pagination.page} / {pagination.totalPages}</span>
                <button onClick={() => fetchUsers(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors" style={{ color: "#6b5a47" }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}