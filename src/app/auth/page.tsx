"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import {
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Cpu,
  CheckCircle2,
  LogOut,
  ShieldCheck,
  UserPlus,
  LogIn,
} from "lucide-react";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/checkout";
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const { login, register, user, logout } = useAuth();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (mode === "login") {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || "Login failed");
          setIsLoading(false);
          return;
        }
        setSuccessMsg("Logged in successfully! Redirecting...");
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match. Please verify.");
          setIsLoading(false);
          return;
        }
        const res = await register(name, email, password);
        if (!res.success) {
          setError(res.error || "Registration failed");
          setIsLoading(false);
          return;
        }
        setSuccessMsg("Account created successfully! Redirecting...");
      }

      // Smooth transition to subscription page
      setTimeout(() => {
        router.push(redirectTarget);
      }, 700);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleDemoFill = async () => {
    setEmail("alex@example.com");
    setPassword("password123");
    setError(null);
    setIsLoading(true);
    const res = await login("alex@example.com", "password123");
    if (res.success) {
      setSuccessMsg("Demo account verified! Redirecting to subscription...");
      setTimeout(() => {
        router.push(redirectTarget);
      }, 700);
    } else {
      setIsLoading(false);
      setError(res.error || "Demo login failed");
    }
  };

  return (
    <div className="auth-card-container relative z-10 w-full max-w-md px-4 py-8">
      {/* Decorative Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#0e1724] border border-[#2fd3e8] shadow-[0_0_20px_rgba(47,211,232,0.3)] mb-3">
          <Cpu className="w-6 h-6 text-[#2fd3e8]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-['Rajdhani']">
          Zero to One <span className="text-[#2fd3e8]">Lab Access</span>
        </h1>
        <p className="text-xs font-mono text-white/50 tracking-wider uppercase mt-1">
          {mode === "login" ? "Sign In to Launch Simulators" : "Register New Engineering Account"}
        </p>
      </div>

      {/* Currently logged-in status banner (if user already has an active session) */}
      {user && (
        <div className="mb-4 p-3 rounded-lg bg-[#0e1724] border border-[#2fd3e8]/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-[#3ee68f] shrink-0 animate-pulse" />
            <span className="text-white/80 truncate">
              Signed in: <strong className="text-white">{user.name}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={redirectTarget}
              className="text-[#2fd3e8] hover:underline flex items-center gap-1"
            >
              <span>Continue</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <span className="text-white/20">|</span>
            <button
              type="button"
              onClick={logout}
              className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Switch</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Glassmorphism Card */}
      <div className="auth-card-box bg-[#060b12]/90 backdrop-blur-xl border border-white/10 rounded-xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden">
        {/* Glow accent line in top card border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2fd3e8] to-transparent" />

        {/* Tab Toggle: Sign In vs Register */}
        <div className="auth-tab-group grid grid-cols-2 p-1 bg-[#09111c] border border-white/10 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
              setSuccessMsg(null);
            }}
            className={`auth-tab-btn py-2.5 text-xs font-mono tracking-wider uppercase rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === "login"
                ? "active bg-[#2fd3e8] text-[#03151a] font-bold shadow-[0_0_15px_rgba(47,211,232,0.4)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError(null);
              setSuccessMsg(null);
            }}
            className={`auth-tab-btn py-2.5 text-xs font-mono tracking-wider uppercase rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === "register"
                ? "active bg-[#2fd3e8] text-[#03151a] font-bold shadow-[0_0_15px_rgba(47,211,232,0.4)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-5 p-3 rounded-md bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-red-200 text-xs font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3 rounded-md bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-2.5 text-emerald-200 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4 text-[#3ee68f] shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-[0.7rem] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Jane Smith"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#09111c] border border-white/10 rounded-md text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#2fd3e8] focus:ring-1 focus:ring-[#2fd3e8] transition-colors font-sans"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[0.7rem] font-mono uppercase tracking-wider text-white/70 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@institution.edu"
                className="w-full pl-9 pr-3 py-2.5 bg-[#09111c] border border-white/10 rounded-md text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#2fd3e8] focus:ring-1 focus:ring-[#2fd3e8] transition-colors font-sans"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[0.7rem] font-mono uppercase tracking-wider text-white/70">
                Password
              </label>
              {mode === "register" && (
                <span className="text-[0.65rem] font-mono text-white/40">min 6 chars</span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-[#09111c] border border-white/10 rounded-md text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#2fd3e8] focus:ring-1 focus:ring-[#2fd3e8] transition-colors font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/80 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-[0.7rem] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#09111c] border border-white/10 rounded-md text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#2fd3e8] focus:ring-1 focus:ring-[#2fd3e8] transition-colors font-sans"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-md bg-[#2fd3e8] hover:bg-[#62e3f2] text-[#03151a] font-bold text-xs tracking-wider uppercase font-mono flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(47,211,232,0.35)] transition-all transform active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#03151a] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === "login" ? "Sign In & Enter Lab" : "Create Account & Continue"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Alternate Mode Prompt */}
        <div className="mt-5 text-center">
          {mode === "login" ? (
            <p className="text-xs font-mono text-white/50">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-[#2fd3e8] hover:underline font-bold cursor-pointer"
              >
                Create one now →
              </button>
            </p>
          ) : (
            <p className="text-xs font-mono text-white/50">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-[#2fd3e8] hover:underline font-bold cursor-pointer"
              >
                Sign in here →
              </button>
            </p>
          )}
        </div>

        {/* Demo 1-Click Login Helper */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-2.5">
            <span className="flex items-center gap-1 text-[#62e3f2]">
              <Sparkles className="w-3.5 h-3.5" /> Instant Test Access:
            </span>
            <span className="text-white/40">Mock Local Auth</span>
          </div>

          <button
            type="button"
            onClick={handleDemoFill}
            disabled={isLoading}
            className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#2fd3e8]/40 rounded text-xs font-mono text-white/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#3ee68f]" />
            <span>Use Demo Account (alex@example.com)</span>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs font-mono text-white/40">
        <Link href="/" className="hover:text-[#2fd3e8] transition-colors">
          ← Back to Course Overview
        </Link>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <>
      <Topbar />
      <main className="auth-page-main min-h-screen relative flex items-center justify-center pt-20 pb-12 overflow-hidden bg-[#03060b]">
        {/* Circuit background identical to hero */}
        <div className="hero-bg" />

        <Suspense
          fallback={
            <div className="relative z-10 text-white font-mono text-sm animate-pulse">
              Initializing Secure Gateway...
            </div>
          }
        >
          <AuthForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
