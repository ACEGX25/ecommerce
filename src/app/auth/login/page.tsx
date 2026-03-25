"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        router.push(from);
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
        style={{ background: "var(--ink)" }}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, var(--brand) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #fb923c 0%, transparent 70%)" }}
        />

        <div className="relative z-10 p-12">
          <Logo light />
        </div>

        <div className="relative z-10 p-12 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-6">
              What customers say
            </p>
            <blockquote className="text-white text-2xl leading-relaxed" style={{ fontFamily: "Syne, sans-serif" }}>
              &ldquo;Dingly made online shopping feel{" "}
              <span style={{ color: "var(--brand)" }}>personal again.</span>&rdquo;
            </blockquote>
            <p className="mt-4 text-white/50 text-sm">— Priya S., Mumbai</p>
          </motion.div>

          <div className="flex gap-8 mt-12">
            {[
              { n: "50K+", label: "Happy customers" },
              { n: "4.9★", label: "Average rating" },
              { n: "99%",  label: "On-time delivery" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <p className="text-2xl font-bold" style={{ fontFamily: "Syne, sans-serif", color: "var(--brand)" }}>{s.n}</p>
                <p className="text-white/40 text-xs mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden mb-10"><Logo /></div>

          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp}>
              <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: "Syne, sans-serif", color: "var(--ink)" }}>
                Welcome back
              </h1>
              <p className="mt-2 text-sm" style={{ color: "var(--ink-muted)" }}>
                Sign in to your Dingly account
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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

              {/* Email */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-muted)" }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" required className="input-base pl-10" />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-muted)" }} />
                  <input type={showPassword ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                    className="input-base pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div variants={fadeUp}>
                <motion.button type="submit" disabled={isLoading}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="btn-primary shimmer mt-2 flex items-center justify-center gap-2">
                  {isLoading ? <Spinner /> : <><span>Sign in</span><ArrowRight size={16} /></>}
                </motion.button>
              </motion.div>
            </form>

            <motion.div variants={fadeUp} className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px" style={{ background: "var(--cream-dark)" }} />
              <span className="text-xs" style={{ color: "var(--ink-muted)" }}>Don&apos;t have an account?</span>
              <div className="flex-1 h-px" style={{ background: "var(--cream-dark)" }} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <Link href="/auth/register"
                className="block text-center py-3 px-6 rounded-xl text-sm font-semibold border-2 transition-all duration-200"
                style={{ border: "2px solid var(--cream-dark)", color: "var(--ink-muted)" }}>
                Create a free account
              </Link>
            </motion.div>

            <motion.p variants={fadeUp} className="text-center text-xs mt-6 font-mono" style={{ color: "var(--ink-muted)" }}>
              Admin? Use <span style={{ color: "var(--brand)" }}>admin@dingly.com</span>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
        style={{ background: "var(--brand)", fontFamily: "Syne, sans-serif" }}>D</div>
      <span className="text-xl font-bold" style={{ fontFamily: "Syne, sans-serif", color: light ? "#fff" : "var(--ink)" }}>
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