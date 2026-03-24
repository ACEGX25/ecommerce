"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  ShoppingBag, Heart, Package, Star,
  LogOut, Settings, Bell, ChevronRight, TrendingUp, ArrowUpRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const MOCK_ORDERS = [
  { id: "#DG-8821", product: "Wireless Earbuds Pro", date: "Mar 14, 2026", status: "Delivered",  amount: "₹2,499" },
  { id: "#DG-8734", product: "Leather Tote Bag",     date: "Mar 10, 2026", status: "In Transit", amount: "₹3,199" },
  { id: "#DG-8601", product: "Smart Watch Series 5", date: "Mar 02, 2026", status: "Processing", amount: "₹8,999" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Delivered:    { bg: "#dcfce7", text: "#16a34a" },
  "In Transit": { bg: "#fff7ed", text: "#ea580c" },
  Processing:   { bg: "#eff6ff", text: "#2563eb" },
};

const STATS = [
  { icon: ShoppingBag, label: "Total Orders",  value: "24", delta: "+3 this month",  color: "#f97316" },
  { icon: Heart,       label: "Wishlist",       value: "12", delta: "2 on sale",      color: "#ec4899" },
  { icon: Package,     label: "In Transit",     value: "3",  delta: "Est. 2 days",    color: "#6366f1" },
  { icon: Star,        label: "Reviews Given",  value: "18", delta: "4.8 avg rating", color: "#eab308" },
];

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  if (isLoading) return <LoadingSkeleton />;

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: "rgba(250,247,242,0.85)",
          borderColor: "var(--cream-dark)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "var(--brand)", fontFamily: "Syne, sans-serif" }}
            >D</div>
            <span className="text-xl font-bold hidden sm:block" style={{ fontFamily: "Syne, sans-serif", color: "var(--ink)" }}>
              dingly
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors" style={{ color: "var(--ink-muted)" }}>
              <Bell size={18} />
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors" style={{ color: "var(--ink-muted)" }}>
              <Settings size={18} />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "var(--brand)" }}>
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* Greeting */}
          <motion.div variants={fadeUp} className="mb-8">
            <p className="text-sm font-medium" style={{ color: "var(--ink-muted)" }}>{greeting},</p>
            <h1 className="text-4xl font-bold mt-1" style={{ fontFamily: "Syne, sans-serif", color: "var(--ink)" }}>
              {firstName} 👋
            </h1>
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "var(--ink)", color: "#fff" }}
              >
                <span>Admin panel</span>
                <ArrowUpRight size={12} />
              </Link>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-2xl"
                style={{ background: "#fff", border: "1px solid var(--cream-dark)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: stat.color + "18" }}>
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
                <p className="text-2xl font-bold" style={{ fontFamily: "Syne, sans-serif", color: "var(--ink)" }}>{stat.value}</p>
                <p className="text-xs mt-0.5 font-medium" style={{ color: "var(--ink-muted)" }}>{stat.label}</p>
                <p className="text-xs mt-2 flex items-center gap-1" style={{ color: stat.color }}>
                  <TrendingUp size={10} />{stat.delta}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Orders */}
          <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid var(--cream-dark)" }}>
            <div className="px-6 py-5 flex items-center justify-between border-b" style={{ borderColor: "var(--cream-dark)" }}>
              <h2 className="font-bold text-lg" style={{ fontFamily: "Syne, sans-serif", color: "var(--ink)" }}>Recent Orders</h2>
              <Link href="/orders" className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: "var(--brand)" }}>
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--cream-dark)" }}>
              {MOCK_ORDERS.map((order, i) => {
                const sc = STATUS_COLORS[order.status];
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--cream-dark)" }}>
                      <Package size={16} style={{ color: "var(--ink-muted)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--ink)" }}>{order.product}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--ink-muted)" }}>{order.id} · {order.date}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: sc.bg, color: sc.text }}>
                      {order.status}
                    </span>
                    <p className="text-sm font-bold flex-shrink-0" style={{ fontFamily: "Syne, sans-serif", color: "var(--ink)" }}>
                      {order.amount}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Sign out */}
          <motion.div variants={fadeUp} className="mt-8 flex justify-end">
            <motion.button
              onClick={logout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              style={{ background: "var(--cream-dark)", color: "var(--ink-muted)" }}
            >
              <LogOut size={15} /> Sign out
            </motion.button>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
          style={{ background: "var(--brand)", fontFamily: "Syne, sans-serif" }}>D</div>
      </motion.div>
    </div>
  );
}