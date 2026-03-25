"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter",  test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter",  test: (p: string) => /[a-z]/.test(p) },
  { label: "One number",            test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_CONFIG = [
  { label: "Too weak", color: "#ef4444" },
  { label: "Weak",     color: "#f97316" },
  { label: "Fair",     color: "#eab308" },
  { label: "Good",     color: "#84cc16" },
  { label: "Strong",   color: "#22c55e" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = useMemo(
    () => PASSWORD_RULES.filter((r) => r.test(password)).length,
    [password]
  );
  const strengthConfig = STRENGTH_CONFIG[Math.min(strength, 4)];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const result = await register(name, email, password, confirmPassword);
      if (result.success) {
        router.push("/");
      } else {
        setError(result.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--cream)" }}>

      {/* Left decorative panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden"
        style={{ background: "var(--ink-soft)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(var(--brand) 1px, transparent 1px),
                              linear-gradient(90deg, var(--brand) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--brand) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 p-12">
          <Logo light />
        </div>

        <div className="relative z-10 p-12 pb-16">
          <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-8">
            Join the community
          </p>
          {[
            "Free shipping on orders over ₹999",
            "Easy 30-day returns",
            "Exclusive member discounts",
            "24/7 customer support",
          ].map((f, i) => (
            <motion.div
              key={f}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-3 mb-4"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--brand)" }}
              >
                <CheckCircle2 size={12} className="text-white" />
              </div>
              <p className="text-white/70 text-sm">{f}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden mb-10">
            <Logo />
          </div>

          <motion.div variants={stagger} initial="hidden" animate="show">

            {/* Heading */}
            <motion.div variants={fadeUp}>
              <h1
                className="text-4xl font-bold tracking-tight"
                style={{ fontFamily: "Syne, sans-serif", color: "var(--ink)" }}
              >
                Create account
              </h1>
              <p className="mt-2 text-sm" style={{ color: "var(--ink-muted)" }}>
                Start your Dingly journey today — it&apos;s free
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl text-sm"
                    style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                  >
                    <AlertCircle size={16} className="flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>
                  Full name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-muted)" }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Mehta"
                    required
                    className="input-base pl-10"
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-muted)" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="input-base pl-10"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-muted)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="input-base pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Strength meter */}
                {password && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <div className="flex gap-1 mb-1.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          className="h-1.5 flex-1 rounded-full"
                          animate={{ backgroundColor: i <= strength ? strengthConfig.color : "#e5e7eb" }}
                          transition={{ duration: 0.3 }}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-medium" style={{ color: strengthConfig.color }}>
                      {strengthConfig.label}
                    </p>
                    <div className="mt-2 space-y-1">
                      {PASSWORD_RULES.map((rule) => (
                        <div
                          key={rule.label}
                          className="flex items-center gap-1.5 text-xs"
                          style={{ color: rule.test(password) ? "var(--success)" : "var(--ink-muted)" }}
                        >
                          <CheckCircle2 size={10} />
                          {rule.label}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>
                  Confirm password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-muted)" }} />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`input-base pl-10 pr-10 ${
                      confirmPassword && confirmPassword !== password ? "error" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-xs mt-1" style={{ color: "var(--error)" }}>
                    Passwords do not match
                  </p>
                )}
              </motion.div>

              {/* Submit */}
              <motion.div variants={fadeUp}>
                <motion.button
                  type="submit"
                  disabled={isLoading || strength < 3}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary shimmer mt-2 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Spinner /> : <><span>Create account</span><ArrowRight size={16} /></>}
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px" style={{ background: "var(--cream-dark)" }} />
              <span className="text-xs" style={{ color: "var(--ink-muted)" }}>Already have an account?</span>
              <div className="flex-1 h-px" style={{ background: "var(--cream-dark)" }} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <Link
                href="/auth/login"
                className="block text-center py-3 px-6 rounded-xl text-sm font-semibold border-2 transition-all duration-200"
                style={{ border: "2px solid var(--cream-dark)", color: "var(--ink-muted)" }}
              >
                Sign in instead
              </Link>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
        style={{ background: "var(--brand)", fontFamily: "Syne, sans-serif" }}
      >D</div>
      <span
        className="text-xl font-bold"
        style={{ fontFamily: "Syne, sans-serif", color: light ? "#fff" : "var(--ink)" }}
      >
        dingly
      </span>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}