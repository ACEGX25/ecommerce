"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Package, MapPin, CreditCard, LogOut, RefreshCw,
  AlertCircle, ChevronRight, Edit2, CheckCircle2,
  Clock, Activity, ShoppingBag, User,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface UserActivity {
  totalLogins: number;
  lastLogin: string | null;
  accountCreated: string;
}

// ─── Animations ───────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

// ─── Main Page ────────────────────────────────────────────────
export default function ProfilePage() {
  const { user: authUser, logout, isLoading: authLoading } = useAuth();

  const [profile,         setProfile]         = useState<UserProfile | null>(null);
  const [activity,        setActivity]         = useState<UserActivity | null>(null);
  const [profileLoading,  setProfileLoading]   = useState(true);
  const [activityLoading, setActivityLoading]  = useState(true);
  const [profileError,    setProfileError]     = useState<string | null>(null);

  // Edit name state
  const [editingName,  setEditingName]  = useState(false);
  const [nameValue,    setNameValue]    = useState("");
  const [savingName,   setSavingName]   = useState(false);
  const [nameSuccess,  setNameSuccess]  = useState(false);
  const [nameError,    setNameError]    = useState<string | null>(null);

  // ─── Fetch profile from DB ─────────────────────────────────
  async function fetchProfile() {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res  = await apiFetch("/api/user/profile");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`);
      setProfile(data.user);
      setNameValue(data.user.name);
    } catch (e: unknown) {
      setProfileError(e instanceof Error ? e.message : "Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  }

  // ─── Fetch activity from DB ────────────────────────────────
  async function fetchActivity() {
    setActivityLoading(true);
    try {
      const res  = await apiFetch("/api/user/activity");
      const data = await res.json();
      if (res.ok) setActivity(data.activity);
    } catch {
      // non-critical — fail silently
    } finally {
      setActivityLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchActivity();
  }, []);

  // ─── Save name ─────────────────────────────────────────────
  async function saveName() {
    if (!nameValue.trim() || nameValue === profile?.name) {
      setEditingName(false);
      return;
    }
    setSavingName(true);
    setNameError(null);
    try {
      const res  = await apiFetch("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify({ name: nameValue.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Update failed");
      setProfile(data.user);
      setNameSuccess(true);
      setEditingName(false);
      setTimeout(() => setNameSuccess(false), 2000);
    } catch (e: unknown) {
      setNameError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSavingName(false);
    }
  }

  if (authLoading || profileLoading) return <Spinner />;

  const displayUser = profile ?? authUser;
  const initial     = displayUser?.name?.[0]?.toUpperCase() ?? "U";
  const joinedDate  = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  const lastLoginDate = activity?.lastLogin
    ? new Date(activity.lastLogin).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  return (
    <div className="pt-16 min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif", background: "#f5f5f0" }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="border-b px-4 md:px-8 py-6" style={{ borderColor: "#d1d1cc", background: "#f5f5f0" }}>
        <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "#999" }}>My Account</p>
        <h1 className="text-4xl font-black tracking-tight" style={{ color: "#111" }}>PROFILE</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* ── Error ──────────────────────────────────────── */}
          {profileError && (
            <motion.div variants={fadeUp}
              className="mb-6 flex items-center justify-between p-4 border"
              style={{ borderColor: "#111", background: "#fff" }}>
              <div className="flex items-center gap-3">
                <AlertCircle size={14} />
                <span className="text-sm">{profileError}</span>
              </div>
              <button onClick={fetchProfile}
                className="flex items-center gap-1.5 text-xs tracking-widest uppercase font-bold px-3 py-2"
                style={{ background: "#111", color: "#fff" }}>
                <RefreshCw size={11} /> Retry
              </button>
            </motion.div>
          )}

          {/* ── User Card ──────────────────────────────────── */}
          <motion.div variants={fadeUp}
            className="border p-6 mb-0"
            style={{ background: "#fff", borderColor: "#e8e8e3" }}>
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div
                className="w-14 h-14 flex items-center justify-center text-white text-xl font-black flex-shrink-0"
                style={{ background: displayUser?.role === "admin" ? "#111" : "#888" }}
              >
                {initial}
              </div>

              <div className="flex-1 min-w-0">
                {/* Name — editable */}
                {editingName ? (
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditingName(false); }}
                      autoFocus
                      className="text-lg font-black border-b bg-transparent outline-none flex-1"
                      style={{ color: "#111", borderColor: "#111" }}
                    />
                    <button onClick={saveName} disabled={savingName}
                      className="text-xs tracking-widest uppercase font-bold px-3 py-1.5"
                      style={{ background: "#111", color: "#fff" }}>
                      {savingName ? <RefreshCw size={10} className="animate-spin" /> : "Save"}
                    </button>
                    <button onClick={() => { setEditingName(false); setNameValue(profile?.name ?? ""); }}
                      className="text-xs px-2 py-1.5" style={{ color: "#999" }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xl font-black" style={{ color: "#111" }}>
                      {displayUser?.name ?? "—"}
                    </p>
                    <button onClick={() => setEditingName(true)}
                      className="opacity-40 hover:opacity-100 transition-opacity">
                      <Edit2 size={13} style={{ color: "#111" }} />
                    </button>
                    {nameSuccess && <CheckCircle2 size={13} style={{ color: "#16a34a" }} />}
                  </div>
                )}

                {nameError && (
                  <p className="text-xs mb-1" style={{ color: "#dc2626" }}>{nameError}</p>
                )}

                <p className="text-sm" style={{ color: "#999" }}>{displayUser?.email ?? "—"}</p>

                {/* Badges */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-xs tracking-widest uppercase font-bold px-2.5 py-1"
                    style={{ background: displayUser?.role === "admin" ? "#111" : "#f0f0ee", color: displayUser?.role === "admin" ? "#fff" : "#555" }}>
                    {displayUser?.role ?? "user"}
                  </span>
                  {profile?.email_verified && (
                    <span className="text-xs tracking-widest uppercase font-bold px-2.5 py-1 flex items-center gap-1"
                      style={{ background: "#f0f0ee", color: "#555" }}>
                      <CheckCircle2 size={9} /> Verified
                    </span>
                  )}
                  {profile?.is_active === false && (
                    <span className="text-xs tracking-widest uppercase font-bold px-2.5 py-1"
                      style={{ background: "#fef2f2", color: "#dc2626" }}>
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Joined date */}
            <div className="mt-5 pt-5 border-t" style={{ borderColor: "#e8e8e3" }}>
              <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "#bbb" }}>
                Member since <span style={{ color: "#555" }}>{joinedDate}</span>
              </p>
            </div>
          </motion.div>

          {/* ── Activity Stats ─────────────────────────────── */}
          <motion.div variants={fadeUp}
            className="grid grid-cols-3 gap-px border border-t-0"
            style={{ background: "#d1d1cc", borderColor: "#d1d1cc" }}>
            {[
              {
                icon: <Activity size={13} />,
                label: "Total Logins",
                value: activityLoading ? "—" : (activity?.totalLogins?.toString() ?? "0"),
              },
              {
                icon: <Clock size={13} />,
                label: "Last Login",
                value: activityLoading ? "—" : lastLoginDate,
              },
              {
                icon: <ShoppingBag size={13} />,
                label: "Orders",
                value: "—",
              },
            ].map((stat) => (
              <div key={stat.label} className="p-5 flex flex-col gap-2"
                style={{ background: "#fff" }}>
                <div className="flex items-center gap-1.5" style={{ color: "#aaa" }}>
                  {stat.icon}
                  <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "#aaa" }}>{stat.label}</span>
                </div>
                <p className="text-lg font-black" style={{ color: "#111" }}>{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* ── Menu items ─────────────────────────────────── */}
          <motion.div variants={fadeUp} className="border border-t-0" style={{ borderColor: "#e8e8e3" }}>
            <Link href="/orders"
              className="flex items-center gap-4 p-5 border-b hover:bg-gray-50 transition-colors"
              style={{ borderColor: "#e8e8e3" }}>
              <Package size={18} style={{ color: "#aaa" }} />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#111" }}>Order History</p>
                <p className="text-xs mt-0.5" style={{ color: "#999" }}>View past orders and track shipments</p>
              </div>
              <ChevronRight size={15} style={{ color: "#bbb" }} />
            </Link>

            <button className="w-full flex items-center gap-4 p-5 border-b hover:bg-gray-50 transition-colors text-left"
              style={{ borderColor: "#e8e8e3" }}>
              <MapPin size={18} style={{ color: "#aaa" }} />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#111" }}>Addresses</p>
                <p className="text-xs mt-0.5" style={{ color: "#999" }}>Manage delivery addresses</p>
              </div>
              <ChevronRight size={15} style={{ color: "#bbb" }} />
            </button>

            <button className="w-full flex items-center gap-4 p-5 border-b hover:bg-gray-50 transition-colors text-left"
              style={{ borderColor: "#e8e8e3" }}>
              <CreditCard size={18} style={{ color: "#aaa" }} />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#111" }}>Payment Methods</p>
                <p className="text-xs mt-0.5" style={{ color: "#999" }}>Manage saved cards</p>
              </div>
              <ChevronRight size={15} style={{ color: "#bbb" }} />
            </button>

            {/* Admin panel link — only visible to admin */}
            {displayUser?.role === "admin" && (
              <Link href="/admin"
                className="flex items-center gap-4 p-5 border-b hover:bg-gray-50 transition-colors"
                style={{ borderColor: "#e8e8e3" }}>
                <User size={18} style={{ color: "#aaa" }} />
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: "#111" }}>Admin Panel</p>
                  <p className="text-xs mt-0.5" style={{ color: "#999" }}>Manage users, orders and products</p>
                </div>
                <ChevronRight size={15} style={{ color: "#bbb" }} />
              </Link>
            )}

            {/* Sign out */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors text-left">
              <LogOut size={18} style={{ color: "#aaa" }} />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#111" }}>Sign Out</p>
                <p className="text-xs mt-0.5" style={{ color: "#999" }}>Log out of your account</p>
              </div>
            </button>
          </motion.div>

          {/* ── Account ID (subtle) ────────────────────────── */}
          {profile?.id && (
            <motion.div variants={fadeUp} className="mt-6 text-center">
              <p className="text-xs tracking-[0.15em]" style={{ color: "#ccc" }}>
                Account ID: {profile.id}
              </p>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center" style={{ background: "#f5f5f0" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <RefreshCw size={20} style={{ color: "#111" }} />
      </motion.div>
    </div>
  );
}