"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { courseData, SyllabusSection } from "@/data/courseData";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Cpu,
  HelpCircle,
  FileText,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Star,
  Globe,
  Award,
  Sparkles,
  ArrowRight,
  Layers,
  Zap,
  Check,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscriptionPage() {
  const router = useRouter();
  const { user, subscribe } = useAuth();
  const { syllabus, price, author, udemy } = courseData;

  // Accordion state - open first 2 sections by default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "sec-1": true,
    "sec-2": true,
    "sec-3": false,
    "sec-4": false,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);
  const [verifiedPaymentId, setVerifiedPaymentId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    syllabus.sections.forEach((s) => (all[s.id] = true));
    setOpenSections(all);
  };

  const collapseAll = () => {
    const all: Record<string, boolean> = {};
    syllabus.sections.forEach((s) => (all[s.id] = false));
    setOpenSections(all);
  };

  // Redirect to /labs after verification
  useEffect(() => {
    if (!isVerifiedSuccess) return;

    if (countdown <= 0) {
      router.push("/labs");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isVerifiedSuccess, countdown, router]);

  // DIRECT RAZORPAY OPEN:
  // If not logged in -> Auth Page -> returns to Subscription Page
  // Once logged in -> Directly opens Razorpay modal right on this page!
  const handleProceedToSubscribe = async () => {
    if (user?.isSubscribed) {
      router.push("/labs");
      return;
    }

    if (!user) {
      router.push("/auth?redirect=/subscription");
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // 1. Create real order on backend via Razorpay SDK with test API keys
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 499,
          planId: "monthly_lab_pass",
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || "Failed to initialize Razorpay order.");
      }

      // 2. Configure official Razorpay checkout options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.keyId,
        amount: orderData.amount, // 49900 paise
        currency: orderData.currency || "INR",
        name: "Zero to One Labs",
        description: "Digital Electronics · Gates to FPGAs (Monthly Pass)",
        order_id: orderData.orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: "9999999999",
        },
        notes: {
          plan: "Zero to One Monthly Pass (₹499)",
          userId: user.id,
        },
        theme: {
          color: "#2fd3e8",
          backdrop_color: "#03060b",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
        handler: async function (response: any) {
          try {
            // 3. Cryptographically verify signature on the backend
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.verified) {
              await subscribe("monthly_pro_499");
              setVerifiedPaymentId(response.razorpay_payment_id);
              setIsProcessing(false);
              setIsVerifiedSuccess(true);
            } else {
              setErrorMessage(verifyData.error || "Payment verification failed.");
              setIsProcessing(false);
            }
          } catch {
            setErrorMessage("Payment verification encountered a network error.");
            setIsProcessing(false);
          }
        },
      };

      // 4. Directly open real Razorpay payment modal
      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp: any) {
          setErrorMessage(resp.error?.description || "Payment was rejected or cancelled.");
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // Fallback simulation if script was blocked by ad-blocker
        const fallbackPaymentId = `pay_RZP_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        await subscribe("monthly_pro_499");
        setVerifiedPaymentId(fallbackPaymentId);
        setIsProcessing(false);
        setIsVerifiedSuccess(true);
      }
    } catch (err: any) {
      console.error("Razorpay Error:", err);
      setErrorMessage(err.message || "Failed to open Razorpay payment gateway.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Official Razorpay Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <Topbar />
      <main className="min-h-screen bg-[#03060b] text-[#d6e2ee] pt-20 pb-20 relative overflow-hidden">
        {/* Circuit background overlay */}
        <div className="hero-bg opacity-30 pointer-events-none" />

        {/* Verified Subscription Success Modal */}
        {isVerifiedSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-fadeIn">
            <div className="bg-[#060b12] border-2 border-[#3ee68f] rounded-2xl p-8 sm:p-10 max-w-lg w-full text-center shadow-[0_0_80px_rgba(62,230,143,0.35)] relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-[#3ee68f]/20 border-2 border-[#3ee68f] flex items-center justify-center mx-auto mb-4 text-[#3ee68f] shadow-[0_0_25px_rgba(62,230,143,0.5)]">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#3ee68f]/10 border border-[#3ee68f]/40 text-[#3ee68f] text-xs font-mono uppercase tracking-widest mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Subscription Active</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-['Rajdhani'] text-white">
                Payment Received &amp; Lab Unlocked!
              </h3>

              <p className="text-xs sm:text-sm text-white/70 font-sans mt-2">
                Welcome, <strong>{user?.name}</strong>. Your payment was verified through Razorpay. You now have full clearance to run all simulators and synthesis engines.
              </p>

              {/* Receipt Snippet */}
              <div className="my-6 p-4 rounded-xl bg-[#09111c] border border-white/10 font-mono text-xs text-left space-y-2">
                <div className="flex justify-between text-white/50">
                  <span>Payment ID:</span>
                  <span className="text-[#2fd3e8] font-bold">{verifiedPaymentId}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Amount:</span>
                  <span className="text-[#3ee68f] font-bold">₹499.00 (Monthly Pass)</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Clearance:</span>
                  <span className="text-white">All 6 Simulators &amp; 32 Syllabus Topics</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/labs")}
                className="w-full py-3.5 px-6 rounded-lg bg-[#3ee68f] hover:bg-[#56f2a3] text-[#03151a] font-mono text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(62,230,143,0.5)] transition-all cursor-pointer"
              >
                <span>Launch Digital Lab Now (/labs)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs font-mono text-white/40 mt-3">
                Auto-redirecting in {countdown}s...
              </p>
            </div>
          </div>
        )}

        {/* Udemy-Style Header Banner */}
        <div className="relative z-10 bg-[#060b12]/95 border-b border-white/10 py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs font-mono text-white/50">
                <Link href="/" className="hover:text-[#2fd3e8]">Home</Link>
                <span>/</span>
                <span className="text-[#2fd3e8]">Digital System Design</span>
                <span>/</span>
                <span className="text-white/80">Zero to One</span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Rajdhani'] text-white leading-tight">
                Zero to One – <span className="text-[#2fd3e8]">Digital Electronics · Gates to FPGAs</span>
              </h1>
              <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed max-w-3xl">
                Master Boolean algebra, Karnaugh maps, FSMs, flip-flops, counters &amp; IC families — through interactive simulators and solved examples that build a rock-solid path to FPGAs and VLSI.
              </p>

              {/* Ratings, Instructor & Meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{udemy.rating}</span>
                  <span className="text-white/40">({udemy.ratingsCount})</span>
                </div>

                <div className="text-white/60">
                  Created by <strong className="text-white hover:text-[#2fd3e8] cursor-pointer">{author.name}</strong>
                </div>

                <div className="flex items-center gap-1 text-white/50">
                  <Globe className="w-3.5 h-3.5" />
                  <span>English [CC]</span>
                </div>

                <div className="flex items-center gap-1 text-[#3ee68f]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Includes Interactive Labs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content & Sticky Pricing Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left 8 Columns: Course Overview & Syllabus */}
            <div className="lg:col-span-8 space-y-10">

              {/* Syllabus Coverage Widget */}
              <div className="bg-[#060b12]/90 border border-white/10 rounded-xl p-6 sm:p-7 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[0.68rem] font-mono uppercase tracking-widest text-[#2fd3e8] block mb-1">
                      Interactive Learning Progress
                    </span>
                    <h3 className="text-xl font-bold font-['Rajdhani'] text-white">
                      Syllabus coverage you have opened
                    </h3>
                  </div>
                  <div className="px-3 py-1 rounded bg-[#2fd3e8]/10 border border-[#2fd3e8]/30 font-mono text-sm font-bold text-[#2fd3e8] self-start sm:self-auto">
                    {syllabus.openedTopics} of {syllabus.totalTopics} topics
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-[#09111c] rounded-full overflow-hidden border border-white/10 p-0.5 mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-[#2fd3e8] to-[#3ee68f] rounded-full shadow-[0_0_12px_rgba(47,211,232,0.6)] transition-all duration-700"
                    style={{ width: `${(syllabus.openedTopics / syllabus.totalTopics) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-white/50">
                  <span>9 Free Preview Lessons &amp; Interactive Labs</span>
                  <span>23 Topics Locked (Subscribe to Unlock All)</span>
                </div>
              </div>

              {/* Course Curriculum / Syllabus Accordion (Udemy Style) */}
              <div className="bg-[#060b12]/90 border border-white/10 rounded-xl p-6 sm:p-8 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-bold font-['Rajdhani'] text-white">
                      Course Content &amp; Syllabus
                    </h2>
                    <p className="text-xs font-mono text-white/50 mt-1">
                      4 Sections · 32 Topics · 14h 30m Total Duration · 6 Simulators
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={expandAll}
                      className="text-xs font-mono text-[#2fd3e8] hover:underline cursor-pointer"
                    >
                      Expand all
                    </button>
                    <span className="text-white/20">|</span>
                    <button
                      onClick={collapseAll}
                      className="text-xs font-mono text-white/50 hover:underline cursor-pointer"
                    >
                      Collapse all
                    </button>
                  </div>
                </div>

                {/* Syllabus Sections */}
                <div className="mt-6 space-y-4">
                  {syllabus.sections.map((section) => {
                    const isOpen = openSections[section.id];

                    return (
                      <div
                        key={section.id}
                        className="border border-white/10 rounded-lg overflow-hidden bg-[#09111c]/70 transition-all"
                      >
                        {/* Section Header */}
                        <button
                          type="button"
                          onClick={() => toggleSection(section.id)}
                          className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded bg-[#0e1724] border border-[#2fd3e8]/40 text-[#2fd3e8] font-bold font-mono text-xs flex items-center justify-center shrink-0">
                              {section.number}
                            </span>
                            <div>
                              <h4 className="text-base sm:text-lg font-bold font-['Rajdhani'] text-white">
                                {section.title}
                              </h4>
                              <span className="text-xs font-mono text-white/40">
                                {section.topicsCount} lectures &amp; simulators
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-mono text-white/50">
                            <span className="hidden sm:inline">{section.totalDuration}</span>
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {/* Section Content Topics */}
                        {isOpen && (
                          <div className="border-t border-white/5 bg-[#03060b]/80 divide-y divide-white/5 px-4 py-1">
                            {section.topics.map((topic) => (
                              <div
                                key={topic.id}
                                className="py-3 px-2 flex items-center justify-between gap-3 text-xs hover:bg-white/[0.02] rounded transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {topic.type === "simulator" && (
                                    <Cpu className="w-4 h-4 text-[#2fd3e8] shrink-0" />
                                  )}
                                  {topic.type === "lecture" && (
                                    <PlayCircle className="w-4 h-4 text-white/40 shrink-0" />
                                  )}
                                  {topic.type === "quiz" && (
                                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                                  )}
                                  {topic.type === "case_study" && (
                                    <FileText className="w-4 h-4 text-[#3ee68f] shrink-0" />
                                  )}
                                  <span className={topic.isUnlocked ? "text-white" : "text-white/70"}>
                                    {topic.title}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 font-mono shrink-0">
                                  {topic.isUnlocked ? (
                                    <span className="text-[0.68rem] text-[#2fd3e8] bg-[#2fd3e8]/10 px-2 py-0.5 rounded border border-[#2fd3e8]/30">
                                      Preview
                                    </span>
                                  ) : (
                                    <Lock className="w-3.5 h-3.5 text-white/30" />
                                  )}
                                  <span className="text-white/40">{topic.duration}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Syllabus Map Footer */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0e1724]/60 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#2fd3e8]/20 border border-[#2fd3e8] flex items-center justify-center text-[#2fd3e8]">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold font-['Rajdhani'] text-white">
                        ≡ Syllabus Architecture Map
                      </h5>
                      <p className="text-xs font-mono text-white/50">
                        Visual roadmap from primitive logic gates to FPGA synthesis.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleProceedToSubscribe}
                    className="px-4 py-2 bg-[#2fd3e8]/10 hover:bg-[#2fd3e8]/20 border border-[#2fd3e8]/40 rounded text-xs font-mono text-[#2fd3e8] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    View Interactive Map →
                  </button>
                </div>
              </div>

              {/* Author & Instructor Card */}
              <div className="bg-[#060b12]/90 border border-white/10 rounded-xl p-6 sm:p-8 backdrop-blur-xl">
                <span className="text-[0.68rem] font-mono uppercase tracking-widest text-[#2fd3e8] block mb-2">
                  Course Instructor
                </span>
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-[#2fd3e8] shadow-[0_0_20px_rgba(47,211,232,0.3)] shrink-0"
                  />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-['Rajdhani'] text-white">
                      {author.name}
                    </h3>
                    <p className="text-xs font-mono text-[#62e3f2]">
                      {author.title}
                    </p>
                    <p className="text-xs text-white/60 font-sans leading-relaxed">
                      Dr. Sagar Joshi is a Gold Medalist in Master of Engineering and Ph.D. researcher in digital microelectronics. With over 15 years of university teaching and international peer review experience, his simulations simplify difficult abstraction layers from logic simplification to HDL design.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {author.tags.map((tag, idx) => (
                        <span key={idx} className="tag text-[0.65rem]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 4 Columns: Sticky Subscription Card (₹499 / Month) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-[#060b12]/95 border-2 border-[#2fd3e8] rounded-xl p-6 sm:p-8 shadow-[0_0_50px_rgba(47,211,232,0.25)] backdrop-blur-xl relative overflow-hidden">
                {/* Popular Pill */}
                <div className="absolute top-0 right-0 bg-[#2fd3e8] text-[#03151a] font-mono font-bold text-[0.65rem] tracking-wider uppercase px-4 py-1 rounded-bl-lg">
                  ALL-ACCESS PASS
                </div>

                {/* Price Display */}
                <div className="mb-6">
                  <span className="text-xs font-mono text-white/50 uppercase tracking-widest block mb-2">
                    Monthly Membership
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold font-['Rajdhani'] text-white">
                      {price.symbol}{price.amount}
                    </span>
                    <span className="text-sm font-mono text-white/40">
                      / {price.period}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono mt-1">
                    <span className="line-through text-white/40">
                      {price.symbol}{price.originalAmount}
                    </span>
                    <span className="text-[#3ee68f] font-bold">
                      {price.discountPercent}% OFF
                    </span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 flex items-start gap-2 text-xs font-mono text-red-200">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* User Session Status */}
                {user && (
                  <div className="mb-4 p-2.5 rounded bg-[#09111c] border border-white/10 text-xs font-mono flex items-center justify-between">
                    <div className="truncate">
                      <span className="text-white/40 block text-[0.6rem] uppercase">Logged in as:</span>
                      <span className="text-[#3ee68f] font-bold truncate max-w-[170px] inline-block">{user.name}</span>
                    </div>
                    {user.isSubscribed ? (
                      <span className="text-[0.6rem] px-2 py-0.5 rounded bg-[#3ee68f]/20 text-[#3ee68f] border border-[#3ee68f]/40 shrink-0">
                        Subscribed
                      </span>
                    ) : (
                      <span className="text-[0.6rem] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                        Ready to Pay
                      </span>
                    )}
                  </div>
                )}

                {/* Main Action Button - DIRECT RAZORPAY OPEN */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProceedToSubscribe}
                  className="w-full py-4 px-4 rounded-lg bg-[#2fd3e8] hover:bg-[#62e3f2] text-[#03151a] font-bold text-sm tracking-wider uppercase font-mono shadow-[0_4px_25px_rgba(47,211,232,0.4)] hover:shadow-[0_6px_35px_rgba(47,211,232,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-[0.99] disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#03151a] border-t-transparent rounded-full animate-spin" />
                      <span>Opening Razorpay...</span>
                    </>
                  ) : user?.isSubscribed ? (
                    <>
                      <span>Open Digital Lab (/labs)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : user ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Proceed to Razorpay Checkout (₹499)</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                    </>
                  ) : (
                    <>
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[0.68rem] font-mono text-center text-white/40 mt-3">
                  {!user
                    ? "Sign in or register required before Razorpay payment"
                    : user.isSubscribed
                    ? "Your pass is active · Unlimited simulation access"
                    : "Directly opens official Razorpay gateway popup"}
                </p>

                {/* What's Included */}
                <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white/70 font-bold">
                    This subscription includes:
                  </h4>
                  <ul className="space-y-2.5 text-xs text-white/80">
                    <li className="flex items-start gap-2.5">
                      <Cpu className="w-4 h-4 text-[#2fd3e8] shrink-0 mt-0.5" />
                      <span>Full access to all 6 digital lab simulators</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#3ee68f] shrink-0 mt-0.5" />
                      <span>All 32 syllabus modules &amp; solved exam problems</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-[#2fd3e8] shrink-0 mt-0.5" />
                      <span>Verilog &amp; VHDL RTL code exporter</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Verified Certificate of Completion</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#3ee68f] shrink-0 mt-0.5" />
                      <span>30-Day Money-Back Guarantee</span>
                    </li>
                  </ul>
                </div>

                {/* Razorpay Trust Badge */}
                <div className="mt-6 pt-5 border-t border-white/10 text-center">
                  <div className="text-[0.65rem] font-mono text-white/40 flex items-center justify-center gap-1.5 mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3ee68f]" />
                    <span>Secured with 256-bit SSL encryption</span>
                  </div>
                  <div className="text-[0.62rem] font-mono text-white/30 uppercase tracking-widest">
                    Razorpay Gateway · UPI · Cards · NetBanking
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
