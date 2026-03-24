"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  LogOut, Settings, Bell, RefreshCw, CheckCircle2, Truck,
  Clock, XCircle, Package, AlertCircle, Users, ShoppingBag,
  Plus, X, ChevronRight, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const API = "http://localhost:4000";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Order        { id: number; user_id: number; total_amount: string; status: string; shipping_address: string; created_at: string; }
interface SummaryItem  { status: string; count: number; }
interface User         { id: number; name: string; email: string; role: string; is_active: boolean; created_at: string; }
interface Product      { id: number; name: string; description: string; price: string; stock: number; category: string; size: string; color: string; image_url: string; }
interface ProductForm  { name: string; description: string; price: string; stock: string; category: string; size: string; color: string; image_url: string; }

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const slideIn: Variants = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as any } },
  exit:   { opacity: 0, x: 40, transition: { duration: 0.25 } },
};
const overlayV: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1,  transition: { duration: 0.2 } },
  exit:   { opacity: 0,  transition: { duration: 0.2 } },
};

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS: Record<string, { icon: React.ElementType; label: string; bar: string; badge: string; badgeText: string }> = {
  delivered: { icon: CheckCircle2, label: "Delivered",  bar: "#111", badge: "#111",    badgeText: "#fff" },
  shipped:   { icon: Truck,        label: "Shipped",    bar: "#555", badge: "#555",    badgeText: "#fff" },
  confirmed: { icon: Package,      label: "Confirmed",  bar: "#888", badge: "#e8e8e3", badgeText: "#333" },
  pending:   { icon: Clock,        label: "Pending",    bar: "#aaa", badge: "#f5f5f0", badgeText: "#555" },
  cancelled: { icon: XCircle,      label: "Cancelled",  bar: "#ccc", badge: "#fafafa", badgeText: "#999" },
};

const DONUT_COLORS = ["#111", "#444", "#777", "#aaa", "#ddd"];

// ─── Donut chart ──────────────────────────────────────────────────────────────

function DonutChart({ summary, total }: { summary: SummaryItem[]; total: number }) {
  if (!total) return null;
  const toRad = (d: number) => (d * Math.PI) / 180;
  let cum = -90;
  const cx = 80, cy = 80, R = 64, ri = 38;

  const slices = summary.map((s, i) => {
    const angle = (s.count / total) * 360;
    const start = cum; cum += angle;
    const end = cum;
    const large = angle > 180 ? 1 : 0;
    const x1o = cx + R  * Math.cos(toRad(start)), y1o = cy + R  * Math.sin(toRad(start));
    const x2o = cx + R  * Math.cos(toRad(end)),   y2o = cy + R  * Math.sin(toRad(end));
    const x1i = cx + ri * Math.cos(toRad(end)),   y1i = cy + ri * Math.sin(toRad(end));
    const x2i = cx + ri * Math.cos(toRad(start)), y2i = cy + ri * Math.sin(toRad(start));
    const d = `M${x1o} ${y1o}A${R} ${R} 0 ${large} 1 ${x2o} ${y2o}L${x1i} ${y1i}A${ri} ${ri} 0 ${large} 0 ${x2i} ${y2i}Z`;
    return { d, color: DONUT_COLORS[i % DONUT_COLORS.length], ...s };
  });

  return (
    <div className="flex items-center gap-8">
      <svg width="160" height="160" viewBox="0 0 160 160" className="flex-shrink-0">
        {slices.map((s, i) => (
          <motion.path key={s.status} d={s.d} fill={s.color}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }} />
        ))}
        <text x="80" y="76"  textAnchor="middle" fontSize="18" fontWeight="800" fill="#111" fontFamily="'DM Sans',sans-serif">{total}</text>
        <text x="80" y="90"  textAnchor="middle" fontSize="8"  fill="#aaa"      fontFamily="sans-serif" letterSpacing="1.5">ORDERS</text>
      </svg>
      <div className="flex flex-col gap-2.5 flex-1">
        {slices.map((s) => (
          <div key={s.status} className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="text-xs tracking-widest uppercase flex-1" style={{ color: "#777", fontFamily: "'DM Sans',sans-serif" }}>
              {STATUS[s.status.toLowerCase()]?.label ?? s.status}
            </span>
            <span className="text-sm font-black tabular-nums" style={{ color: "#111" }}>{s.count}</span>
            <span className="text-xs w-8 text-right" style={{ color: "#bbb" }}>{Math.round((s.count / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide-over panel ─────────────────────────────────────────────────────────

function SlidePanel({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div variants={overlayV} initial="hidden" animate="show" exit="exit"
            className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.35)" }}
            onClick={onClose} />
          <motion.div variants={slideIn} initial="hidden" animate="show" exit="exit"
            className="fixed right-0 top-0 h-full z-50 flex flex-col"
            style={{ width: "min(520px, 100vw)", background: "#fff", borderLeft: "1px solid #e8e8e3" }}>
            {/* header */}
            <div className="flex items-center justify-between px-8 py-6 border-b" style={{ borderColor: "#e8e8e3" }}>
              <span className="text-xs tracking-[0.3em] uppercase font-bold" style={{ color: "#111" }}>{title}</span>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors" style={{ color: "#555" }}>
                <X size={16} />
              </button>
            </div>
            {/* body */}
            <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Add Product Form ─────────────────────────────────────────────────────────

const EMPTY_FORM: ProductForm = { name: "", description: "", price: "", stock: "", category: "", size: "", color: "", image_url: "" };

function AddProductForm({ onSuccess }: { onSuccess: () => void }) {
  const [form,    setForm]    = useState<ProductForm>(EMPTY_FORM);
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof ProductForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit() {
    if (!form.name || !form.price || !form.stock || !form.category) {
      setErr("Name, price, stock and category are required."); return;
    }
    setSaving(true); setErr(null);
    try {
      const res = await fetch(`${API}/api/products`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? `HTTP ${res.status}`); }
      setSuccess(true); setForm(EMPTY_FORM);
      setTimeout(() => { setSuccess(false); onSuccess(); }, 1500);
    } catch (e: any) { setErr(e.message); }
    finally { setSaving(false); }
  }

  const inputCls = "w-full border-b py-3 text-sm bg-transparent outline-none transition-colors focus:border-black placeholder:text-gray-300";
  const inputStyle = { borderColor: "#d1d1cc", color: "#111", fontFamily: "'DM Sans',sans-serif" };

  return (
    <div className="flex flex-col gap-6">
      {success && (
        <div className="flex items-center gap-2 p-4" style={{ background: "#111", color: "#fff" }}>
          <CheckCircle2 size={14} />
          <span className="text-xs tracking-widest uppercase">Product added successfully</span>
        </div>
      )}
      {err && (
        <div className="flex items-center gap-2 p-4 border" style={{ borderColor: "#111", color: "#111" }}>
          <AlertCircle size={14} />
          <span className="text-xs">{err}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Name */}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase block mb-1" style={{ color: "#aaa" }}>Product Name *</label>
          <input value={form.name} onChange={set("name")} placeholder="e.g. Men Classic Crew-Neck Tee"
            className={inputCls} style={inputStyle} />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase block mb-1" style={{ color: "#aaa" }}>Description</label>
          <textarea value={form.description} onChange={set("description")} rows={3}
            placeholder="Short product description..."
            className={inputCls + " resize-none"} style={inputStyle} />
        </div>

        {/* Price + Stock */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs tracking-[0.2em] uppercase block mb-1" style={{ color: "#aaa" }}>Price (₹) *</label>
            <input type="number" value={form.price} onChange={set("price")} placeholder="999"
              className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="text-xs tracking-[0.2em] uppercase block mb-1" style={{ color: "#aaa" }}>Stock *</label>
            <input type="number" value={form.stock} onChange={set("stock")} placeholder="100"
              className={inputCls} style={inputStyle} />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase block mb-1" style={{ color: "#aaa" }}>Category *</label>
          <div className="relative">
            <select value={form.category} onChange={set("category")}
              className={inputCls + " appearance-none pr-8"} style={inputStyle}>
              <option value="">Select category</option>
              {["Men > T-Shirts","Men > Shirts","Men > Trousers","Men > Jeans","Men > Jackets",
                "Women > Tops","Women > Dresses","Women > Trousers","Women > Jeans","Women > Jackets",
                "Accessories","Kids"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#aaa" }} />
          </div>
        </div>

        {/* Size + Color */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs tracking-[0.2em] uppercase block mb-1" style={{ color: "#aaa" }}>Size</label>
            <div className="relative">
              <select value={form.size} onChange={set("size")}
                className={inputCls + " appearance-none pr-8"} style={inputStyle}>
                <option value="">Select size</option>
                {["XS","S","M","L","XL","XXL","28","30","32","34","36"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#aaa" }} />
            </div>
          </div>
          <div>
            <label className="text-xs tracking-[0.2em] uppercase block mb-1" style={{ color: "#aaa" }}>Color</label>
            <input value={form.color} onChange={set("color")} placeholder="e.g. Navy Blue"
              className={inputCls} style={inputStyle} />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase block mb-1" style={{ color: "#aaa" }}>Image URL</label>
          <input value={form.image_url} onChange={set("image_url")} placeholder="https://..."
            className={inputCls} style={inputStyle} />
        </div>
      </div>

      {/* Submit */}
      <motion.button onClick={handleSubmit} disabled={saving}
        whileHover={{ scale: saving ? 1 : 1.01 }} whileTap={{ scale: 0.98 }}
        className="w-full py-4 text-xs tracking-[0.3em] uppercase font-black transition-colors flex items-center justify-center gap-2"
        style={{ background: saving ? "#aaa" : "#111", color: "#fff", cursor: saving ? "not-allowed" : "pointer" }}>
        {saving ? <><RefreshCw size={13} className="animate-spin" /> Saving...</> : <><Plus size={13} /> Add Product</>}
      </motion.button>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

type Panel = null | "users" | "products" | "addProduct";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();

  const [orders,   setOrders]   = useState<Order[]>([]);
  const [summary,  setSummary]  = useState<SummaryItem[]>([]);
  const [users,    setUsers]    = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [ordersLoading,   setOrdersLoading]   = useState(true);
  const [usersLoading,    setUsersLoading]     = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  const [ordersError,   setOrdersError]   = useState<string | null>(null);
  const [usersError,    setUsersError]    = useState<string | null>(null);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [panel, setPanel] = useState<Panel>(null);

  // Fetch orders + summary on mount
  async function fetchOrders() {
    setOrdersLoading(true); setOrdersError(null);
    try {
      const [oRes, sRes] = await Promise.all([
        fetch(`${API}/api/orders`,         { credentials: "include" }),
        fetch(`${API}/api/orders/summary`, { credentials: "include" }),
      ]);
      if (!oRes.ok) throw new Error(`Orders: HTTP ${oRes.status}`);
      if (!sRes.ok) throw new Error(`Summary: HTTP ${sRes.status}`);
      const [od, sd] = await Promise.all([oRes.json(), sRes.json()]);
      setOrders(od); setSummary(sd);
    } catch (e: any) { setOrdersError(e.message); }
    finally { setOrdersLoading(false); }
  }

  async function fetchUsers() {
    setUsersLoading(true); setUsersError(null);
    try {
      const res = await fetch(`${API}/api/users`, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setUsers(await res.json());
    } catch (e: any) { setUsersError(e.message); }
    finally { setUsersLoading(false); }
  }

  async function fetchProducts() {
    setProductsLoading(true); setProductsError(null);
    try {
      const res = await fetch(`${API}/api/products`, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setProducts(await res.json());
    } catch (e: any) { setProductsError(e.message); }
    finally { setProductsLoading(false); }
  }

  useEffect(() => { fetchOrders(); }, []);

  function openPanel(p: Panel) {
    setPanel(p);
    if (p === "users"    && users.length    === 0) fetchUsers();
    if (p === "products" && products.length === 0) fetchProducts();
  }

  if (isLoading) return <Spinner />;

  const total        = summary.reduce((a, s) => a + s.count, 0);
  const totalRevenue = orders.reduce((a, o) => a + parseFloat(o.total_amount), 0);
  const firstName    = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen" style={{ background: "#f5f5f0", fontFamily: "'DM Sans',sans-serif" }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b"
        style={{ background: "rgba(245,245,240,0.94)", backdropFilter: "blur(16px)", borderColor: "#d1d1cc" }}>
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
          <span className="text-base font-black tracking-[0.25em] uppercase" style={{ color: "#111" }}>DINGLY</span>
          <div className="flex items-center gap-1">
            <NavBtn icon={<Bell size={16} />} />
            <NavBtn icon={<Settings size={16} />} />
            <button onClick={logout}
              className="ml-2 flex items-center gap-1.5 text-xs tracking-widest uppercase font-bold px-4 py-2 border transition-colors hover:bg-black hover:text-white"
              style={{ borderColor: "#111", color: "#111" }}>
              <LogOut size={12} /> Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-14">
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* ── HERO ─────────────────────────────────────────── */}
          <motion.div variants={fadeUp} className="mb-12 pb-10 border-b" style={{ borderColor: "#d1d1cc" }}>
            <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#999" }}>Admin · Dashboard</p>
            <h1 className="text-5xl font-black tracking-tight" style={{ color: "#111" }}>Hello, {firstName}.</h1>

            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <QuickBtn
                icon={<Users size={13} />}
                label="View Users"
                onClick={() => openPanel("users")}
              />
              <QuickBtn
                icon={<ShoppingBag size={13} />}
                label="View Inventory"
                onClick={() => openPanel("products")}
              />
              <QuickBtn
                icon={<Plus size={13} />}
                label="Add Product"
                onClick={() => openPanel("addProduct")}
                filled
              />
            </div>
          </motion.div>

          {/* ── ERROR ─────────────────────────────────────────── */}
          {ordersError && (
            <motion.div variants={fadeUp} className="mb-8 flex items-center justify-between p-5 border"
              style={{ borderColor: "#111", background: "#fff" }}>
              <div className="flex items-center gap-3">
                <AlertCircle size={15} />
                <span className="text-sm">{ordersError}</span>
              </div>
              <RetryBtn onClick={fetchOrders} />
            </motion.div>
          )}

          {ordersLoading ? <SkeletonGrid /> : !ordersError && (
            <>
              {/* ── KPI STRIP ─────────────────────────────────── */}
              <motion.div variants={fadeUp}
                className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-10"
                style={{ background: "#d1d1cc", border: "1px solid #d1d1cc" }}>
                {[
                  { label: "Total Orders",  value: total.toString() },
                  { label: "Revenue",       value: `₹${totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` },
                  { label: "Pending",       value: (summary.find(s => s.status === "pending")?.count    ?? 0).toString() },
                  { label: "Cancelled",     value: (summary.find(s => s.status === "cancelled")?.count  ?? 0).toString() },
                ].map((k) => (
                  <motion.div key={k.label} whileHover={{ background: "#111" }}
                    className="p-7 flex flex-col gap-2 transition-colors group cursor-default"
                    style={{ background: "#f5f5f0" }}>
                    <p className="text-xs tracking-[0.25em] uppercase group-hover:text-white/60 transition-colors" style={{ color: "#999" }}>{k.label}</p>
                    <p className="text-3xl font-black group-hover:text-white transition-colors" style={{ color: "#111" }}>{k.value}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* ── STATUS + DONUT ────────────────────────────── */}
              <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                {/* Bars */}
                <div className="p-8 border" style={{ background: "#fff", borderColor: "#e8e8e3" }}>
                  <p className="text-xs tracking-[0.3em] uppercase mb-7" style={{ color: "#999" }}>Status Breakdown</p>
                  <div className="flex flex-col gap-5">
                    {summary.map((s, i) => {
                      const cfg = STATUS[s.status.toLowerCase()];
                      const Icon = cfg?.icon ?? Package;
                      const pct = total ? (s.count / total) * 100 : 0;
                      return (
                        <div key={s.status}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon size={12} style={{ color: "#777" }} />
                              <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: "#555" }}>
                                {cfg?.label ?? s.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs" style={{ color: "#bbb" }}>{pct.toFixed(0)}%</span>
                              <span className="text-base font-black tabular-nums" style={{ color: "#111" }}>{s.count}</span>
                            </div>
                          </div>
                          <div className="h-1" style={{ background: "#ebebeb" }}>
                            <motion.div className="h-full" style={{ background: cfg?.bar ?? "#111" }}
                              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 + i * 0.06 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Donut */}
                <div className="p-8 border" style={{ background: "#fff", borderColor: "#e8e8e3" }}>
                  <p className="text-xs tracking-[0.3em] uppercase mb-7" style={{ color: "#999" }}>Distribution</p>
                  <DonutChart summary={summary} total={total} />
                </div>
              </motion.div>

              {/* ── ORDERS TABLE ──────────────────────────────── */}
              <motion.div variants={fadeUp} className="border" style={{ background: "#fff", borderColor: "#e8e8e3" }}>
                <div className="px-8 py-5 border-b flex items-center justify-between" style={{ borderColor: "#e8e8e3", background: "#f5f5f0" }}>
                  <span className="text-xs tracking-[0.3em] uppercase font-bold" style={{ color: "#111" }}>Recent Orders</span>
                  <span className="text-xs" style={{ color: "#aaa" }}>{orders.length} records</span>
                </div>

                {/* header row */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-8 py-3 border-b" style={{ borderColor: "#e8e8e3", background: "#fafafa" }}>
                  {[["ID","col-span-1"],["USER","col-span-1"],["AMOUNT","col-span-2"],["STATUS","col-span-2"],["ADDRESS","col-span-4"],["DATE","col-span-2"]].map(([h,c]) => (
                    <span key={h} className={`${c} text-xs tracking-[0.2em] uppercase font-semibold`} style={{ color: "#bbb" }}>{h}</span>
                  ))}
                </div>

                {orders.length === 0 ? (
                  <div className="py-16 text-center">
                    <Package size={24} className="mx-auto mb-3 opacity-20" />
                    <p className="text-xs tracking-widest uppercase" style={{ color: "#bbb" }}>No orders</p>
                  </div>
                ) : (
                  orders.map((o, i) => {
                    const s = o.status.toLowerCase();
                    const cfg = STATUS[s];
                    const Icon = cfg?.icon ?? Package;
                    return (
                      <motion.div key={o.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 + i * 0.025 }}
                        className="grid grid-cols-12 gap-4 px-8 py-4 border-b items-center hover:bg-gray-50/60 transition-colors"
                        style={{ borderColor: "#f0f0ee" }}>
                        <span className="col-span-1 text-sm font-black" style={{ color: "#111" }}>#{o.id}</span>
                        <span className="col-span-1 text-xs" style={{ color: "#999" }}>U{o.user_id}</span>
                        <span className="col-span-2 text-sm font-black" style={{ color: "#111" }}>
                          ₹{parseFloat(o.total_amount).toLocaleString("en-IN")}
                        </span>
                        <div className="col-span-2">
                          <span className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase font-bold px-2.5 py-1"
                            style={{ background: cfg?.badge ?? "#eee", color: cfg?.badgeText ?? "#333" }}>
                            <Icon size={9} />{cfg?.label ?? o.status}
                          </span>
                        </div>
                        <span className="col-span-4 text-xs truncate" style={{ color: "#999" }} title={o.shipping_address}>{o.shipping_address}</span>
                        <span className="col-span-2 text-xs" style={{ color: "#bbb" }}>
                          {new Date(o.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </motion.div>
                    );
                  })
                )}
                <div className="px-8 py-4" style={{ background: "#f5f5f0" }}>
                  <p className="text-xs tracking-widest uppercase" style={{ color: "#bbb" }}>Showing {orders.length} order{orders.length !== 1 ? "s" : ""}</p>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </main>

      {/* ── USERS PANEL ───────────────────────────────────────── */}
      <SlidePanel open={panel === "users"} onClose={() => setPanel(null)} title={`Users · ${users.length}`}>
        {usersLoading ? (
          <div className="flex flex-col gap-3">{[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse" style={{ background: "#f0f0ee" }} />
          ))}</div>
        ) : usersError ? (
          <div className="flex items-center gap-2 p-4 border" style={{ borderColor: "#111" }}>
            <AlertCircle size={14} /><span className="text-xs">{usersError}</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {users.map((u, i) => (
              <motion.div key={u.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 p-4 border" style={{ borderColor: "#e8e8e3" }}>
                {/* avatar */}
                <div className="w-10 h-10 flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                  style={{ background: u.role === "admin" ? "#111" : "#888" }}>
                  {u.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: "#111" }}>{u.name}</p>
                  <p className="text-xs truncate" style={{ color: "#999" }}>{u.email}</p>
                </div>
                <span className="text-xs tracking-widest uppercase font-bold px-2.5 py-1 flex-shrink-0"
                  style={{ background: u.role === "admin" ? "#111" : "#f0f0ee", color: u.role === "admin" ? "#fff" : "#555" }}>
                  {u.role}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </SlidePanel>

      {/* ── PRODUCTS PANEL ────────────────────────────────────── */}
      <SlidePanel open={panel === "products"} onClose={() => setPanel(null)} title={`Inventory · ${products.length} items`}>
        <div className="flex justify-end mb-4">
          <button onClick={() => setPanel("addProduct")}
            className="flex items-center gap-1.5 text-xs tracking-widest uppercase font-bold px-4 py-2"
            style={{ background: "#111", color: "#fff" }}>
            <Plus size={11} /> Add Product
          </button>
        </div>
        {productsLoading ? (
          <div className="flex flex-col gap-3">{[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse" style={{ background: "#f0f0ee" }} />
          ))}</div>
        ) : productsError ? (
          <div className="p-4 border flex items-center gap-2" style={{ borderColor: "#111" }}>
            <AlertCircle size={14} /><span className="text-xs">{productsError}</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {products.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex gap-4 p-4 border" style={{ borderColor: "#e8e8e3" }}>
                {/* color swatch */}
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border" style={{ borderColor: "#e8e8e3", background: "#f5f5f0" }}>
                  <Package size={14} style={{ color: "#aaa" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold leading-tight" style={{ color: "#111" }}>{p.name}</p>
                    <span className="text-sm font-black flex-shrink-0" style={{ color: "#111" }}>₹{parseFloat(p.price).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "#aaa" }}>{p.category}{p.size ? ` · ${p.size}` : ""}{p.color ? ` · ${p.color}` : ""}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs" style={{ color: p.stock < 20 ? "#dc2626" : "#666" }}>
                      Stock: <strong>{p.stock}</strong>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </SlidePanel>

      {/* ── ADD PRODUCT PANEL ─────────────────────────────────── */}
      <SlidePanel open={panel === "addProduct"} onClose={() => setPanel(null)} title="Add New Product">
        <AddProductForm onSuccess={() => { fetchProducts(); }} />
      </SlidePanel>
    </div>
  );
}

// ─── Micro components ─────────────────────────────────────────────────────────

function NavBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-9 h-9 flex items-center justify-center hover:bg-black/5 transition-colors" style={{ color: "#777" }}>
      {icon}
    </button>
  );
}

function QuickBtn({ icon, label, onClick, filled }: { icon: React.ReactNode; label: string; onClick: () => void; filled?: boolean }) {
  return (
    <motion.button onClick={onClick} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-bold px-5 py-3 border transition-colors"
      style={filled
        ? { background: "#111", color: "#fff", borderColor: "#111" }
        : { background: "transparent", color: "#111", borderColor: "#111" }}>
      {icon}{label}<ChevronRight size={11} />
    </motion.button>
  );
}

function RetryBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 text-xs tracking-widest uppercase font-bold px-3 py-2"
      style={{ background: "#111", color: "#fff" }}>
      <RefreshCw size={11} /> Retry
    </button>
  );
}

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5f5f0" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <RefreshCw size={20} style={{ color: "#111" }} />
      </motion.div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-px" style={{ background: "#d1d1cc" }}>
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 animate-pulse" style={{ background: "#e8e8e3" }} />)}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="h-56 animate-pulse" style={{ background: "#e8e8e3" }} />
        <div className="h-56 animate-pulse" style={{ background: "#e8e8e3" }} />
      </div>
      <div className="h-80 animate-pulse" style={{ background: "#e8e8e3" }} />
    </div>
  );
}