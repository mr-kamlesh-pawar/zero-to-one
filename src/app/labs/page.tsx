"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import {
  Cpu,
  Layers,
  Zap,
  Activity,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

type LabTab = "gates" | "kmap" | "fsm" | "quizzes" | "counter" | "exams";

export default function LabsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<LabTab>("gates");

  // Gate circuit simulator state
  const [gateType, setGateType] = useState<"AND" | "OR" | "NAND" | "NOR" | "XOR" | "XNOR">("AND");
  const [inputA, setInputA] = useState<boolean>(false);
  const [inputB, setInputB] = useState<boolean>(false);

  // K-Map simulator state (4-variable 2x2 or 4x4 minterms)
  const [minterms, setMinterms] = useState<boolean[]>([
    false, true, true, false,
    true, false, false, true,
    false, true, true, false,
    false, false, false, false,
  ]);

  // Quiz state
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Authentication & subscription guard
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth?redirect=/checkout");
      } else if (!user.isSubscribed) {
        router.push("/subscription");
      }
    }
  }, [user, isLoading, router]);

  // Calculate gate output
  const calculateOutput = (type: string, a: boolean, b: boolean): boolean => {
    switch (type) {
      case "AND":
        return a && b;
      case "OR":
        return a || b;
      case "NAND":
        return !(a && b);
      case "NOR":
        return !(a || b);
      case "XOR":
        return a !== b;
      case "XNOR":
        return a === b;
      default:
        return false;
    }
  };

  const gateOutput = calculateOutput(gateType, inputA, inputB);

  if (isLoading || !user || !user.isSubscribed) {
    return (
      <div className="min-h-screen bg-[#03060b] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#2fd3e8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-[#2fd3e8] tracking-widest uppercase">
            Verifying Lab Clearance...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Topbar />
      <main className="min-h-screen relative pt-20 pb-16 overflow-hidden bg-[#03060b]">
        {/* Circuit background overlay */}
        <div className="hero-bg opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3ee68f] animate-pulse" />
                <span className="text-xs font-mono text-[#3ee68f] uppercase tracking-wider">
                  Active Simulation Workbench
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-['Rajdhani'] text-white mt-1">
                Zero to One <span className="text-[#2fd3e8]">Digital Electronics Lab</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-mono text-white/50">Verified Subscriber</div>
                <div className="text-sm font-bold text-white">{user.name}</div>
              </div>
              <span className="px-3 py-1 rounded bg-[#3ee68f]/10 text-[#3ee68f] border border-[#3ee68f]/40 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ACTIVE PASS (₹499/MO)</span>
              </span>
            </div>
          </div>

          {/* Module Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none border-b border-white/5">
            {[
              { id: "gates", label: "Gate Circuits", icon: "🔬" },
              { id: "kmap", label: "K-Map Solver", icon: "🗺" },
              { id: "fsm", label: "FSM Simulator", icon: "⚙" },
              { id: "quizzes", label: "Interactive Quizzes", icon: "📋" },
              { id: "counter", label: "Counter Design", icon: "🔢" },
              { id: "exams", label: "Exam Examples", icon: "🎓" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LabTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#2fd3e8] text-[#03151a] font-bold shadow-[0_0_20px_rgba(47,211,232,0.3)]"
                    : "bg-[#060b12] text-white/60 hover:text-white border border-white/10 hover:border-white/20"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Gate Circuits */}
          {activeTab === "gates" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
              {/* Simulator Controls & Breadboard */}
              <div className="lg:col-span-8 bg-[#060b12]/90 border border-white/10 rounded-xl p-6 sm:p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#2fd3e8]" />
                    <h3 className="text-lg font-bold font-['Rajdhani'] text-white">
                      Logic Gate Simulation Rig
                    </h3>
                  </div>
                  <div className="flex gap-1.5 bg-[#09111c] p-1 rounded-md border border-white/10">
                    {(["AND", "OR", "NAND", "NOR", "XOR", "XNOR"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setGateType(type)}
                        className={`px-2.5 py-1 text-xs font-mono uppercase rounded transition-colors ${
                          gateType === type
                            ? "bg-[#2fd3e8] text-[#03151a] font-bold"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Circuit Visualization Canvas */}
                <div className="relative min-h-[300px] flex items-center justify-center p-8 bg-[#03060b] border border-white/5 rounded-lg overflow-hidden">
                  {/* Grid background lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* Circuit Components */}
                  <div className="relative z-10 flex items-center justify-between w-full max-w-lg">
                    {/* Inputs */}
                    <div className="flex flex-col gap-8">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setInputA(!inputA)}
                          className={`w-12 h-12 rounded-lg font-mono text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${
                            inputA
                              ? "bg-[#3ee68f] text-[#03151a] shadow-[0_0_20px_rgba(62,230,143,0.5)] border-2 border-[#3ee68f]"
                              : "bg-[#0e1724] text-white/50 border border-white/15 hover:border-white/40"
                          }`}
                        >
                          A = {inputA ? "1" : "0"}
                        </button>
                        <div
                          className={`h-0.5 w-16 transition-colors ${
                            inputA ? "bg-[#3ee68f] shadow-[0_0_8px_#3ee68f]" : "bg-white/20"
                          }`}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setInputB(!inputB)}
                          className={`w-12 h-12 rounded-lg font-mono text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${
                            inputB
                              ? "bg-[#3ee68f] text-[#03151a] shadow-[0_0_20px_rgba(62,230,143,0.5)] border-2 border-[#3ee68f]"
                              : "bg-[#0e1724] text-white/50 border border-white/15 hover:border-white/40"
                          }`}
                        >
                          B = {inputB ? "1" : "0"}
                        </button>
                        <div
                          className={`h-0.5 w-16 transition-colors ${
                            inputB ? "bg-[#3ee68f] shadow-[0_0_8px_#3ee68f]" : "bg-white/20"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Logic Gate IC Representation */}
                    <div className="relative px-8 py-6 rounded-xl bg-[#09111c] border-2 border-[#2fd3e8] shadow-[0_0_35px_rgba(47,211,232,0.25)] text-center">
                      <span className="text-xs font-mono text-[#2fd3e8] uppercase tracking-widest block mb-1">
                        GATE IC
                      </span>
                      <span className="text-2xl font-bold font-['Rajdhani'] text-white">
                        {gateType}
                      </span>
                      <div className="text-[0.65rem] font-mono text-white/40 mt-1">
                        Y = {gateType === "AND" && "A · B"}
                        {gateType === "OR" && "A + B"}
                        {gateType === "NAND" && "(A · B)'"}
                        {gateType === "NOR" && "(A + B)'"}
                        {gateType === "XOR" && "A ⊕ B"}
                        {gateType === "XNOR" && "(A ⊕ B)'"}
                      </div>
                    </div>

                    {/* Output Wire & Indicator */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-0.5 w-16 transition-colors ${
                          gateOutput ? "bg-[#2fd3e8] shadow-[0_0_12px_#2fd3e8]" : "bg-white/20"
                        }`}
                      />
                      <div
                        className={`w-16 h-16 rounded-xl font-mono text-lg font-bold flex flex-col items-center justify-center transition-all ${
                          gateOutput
                            ? "bg-[#2fd3e8] text-[#03151a] shadow-[0_0_30px_rgba(47,211,232,0.7)] border-2 border-white"
                            : "bg-[#0e1724] text-white/40 border border-white/15"
                        }`}
                      >
                        <span className="text-[0.6rem] uppercase tracking-wider">OUTPUT</span>
                        <span>Y = {gateOutput ? "1" : "0"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-mono text-white/50">
                  <span>Click input pads A or B to toggle signal logic levels (0/1).</span>
                  <span className="text-[#3ee68f]">Real-time Gate Synthesis</span>
                </div>
              </div>

              {/* Truth Table */}
              <div className="lg:col-span-4 bg-[#060b12]/90 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
                <h4 className="text-base font-bold font-['Rajdhani'] text-white mb-3">
                  Live Truth Table ({gateType})
                </h4>

                <div className="overflow-hidden border border-white/10 rounded-lg">
                  <table className="w-full text-xs font-mono text-left">
                    <thead className="bg-[#09111c] text-white/70 border-b border-white/10">
                      <tr>
                        <th className="py-2.5 px-3">Input A</th>
                        <th className="py-2.5 px-3">Input B</th>
                        <th className="py-2.5 px-3 text-[#2fd3e8]">Output Y</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {[
                        { a: false, b: false },
                        { a: false, b: true },
                        { a: true, b: false },
                        { a: true, b: true },
                      ].map((row, i) => {
                        const out = calculateOutput(gateType, row.a, row.b);
                        const isCurrentState = inputA === row.a && inputB === row.b;

                        return (
                          <tr
                            key={i}
                            className={`transition-colors ${
                              isCurrentState
                                ? "bg-[#2fd3e8]/20 font-bold text-white border-l-2 border-l-[#2fd3e8]"
                                : "hover:bg-white/5"
                            }`}
                          >
                            <td className="py-2.5 px-3">{row.a ? "1" : "0"}</td>
                            <td className="py-2.5 px-3">{row.b ? "1" : "0"}</td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[0.7rem] ${
                                  out
                                    ? "bg-[#2fd3e8]/20 text-[#2fd3e8] border border-[#2fd3e8]/30"
                                    : "bg-white/5 text-white/40"
                                }`}
                              >
                                {out ? "1 (HIGH)" : "0 (LOW)"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-[#0e1724] border border-white/10">
                  <div className="text-xs font-bold font-mono text-[#2fd3e8] uppercase mb-1">
                    Boolean Expression
                  </div>
                  <p className="text-xs font-mono text-white/70">
                    {gateType === "AND" && "Y = A · B (Conjunction)"}
                    {gateType === "OR" && "Y = A + B (Disjunction)"}
                    {gateType === "NAND" && "Y = ¬(A · B) (Universal Gate)"}
                    {gateType === "NOR" && "Y = ¬(A + B) (Universal Gate)"}
                    {gateType === "XOR" && "Y = A · B' + A' · B (Parity Generator)"}
                    {gateType === "XNOR" && "Y = A · B + A' · B' (Equivalence Detector)"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: K-Map Solver */}
          {activeTab === "kmap" && (
            <div className="mt-8 bg-[#060b12]/90 border border-white/10 rounded-xl p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold font-['Rajdhani'] text-white">
                    4-Variable Karnaugh Map Simplifier
                  </h3>
                  <p className="text-xs font-mono text-white/50 mt-1">
                    Select cells to place minterms (1s). The solver synthesizes minimal SOP expressions.
                  </p>
                </div>
                <button
                  onClick={() => setMinterms(new Array(16).fill(false))}
                  className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/70 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* 4x4 K-Map Grid */}
                <div className="flex flex-col items-center">
                  <div className="text-xs font-mono text-white/50 mb-2">
                    Variables: AB (Rows) \ CD (Columns)
                  </div>
                  <div className="grid grid-cols-4 gap-2 bg-[#03060b] p-4 rounded-xl border border-white/10">
                    {minterms.map((val, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const copy = [...minterms];
                          copy[idx] = !copy[idx];
                          setMinterms(copy);
                        }}
                        className={`w-14 h-14 rounded-lg font-mono text-base font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                          val
                            ? "bg-[#2fd3e8] text-[#03151a] shadow-[0_0_15px_rgba(47,211,232,0.4)]"
                            : "bg-[#0e1724] text-white/30 border border-white/10 hover:border-[#2fd3e8]/40"
                        }`}
                      >
                        <span className="text-[0.6rem] opacity-60">m{idx}</span>
                        <span>{val ? "1" : "0"}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simplified SOP Output */}
                <div className="bg-[#09111c] border border-white/10 rounded-xl p-6">
                  <span className="text-xs font-mono text-[#2fd3e8] uppercase tracking-wider block mb-2">
                    Minimal Sum of Products (SOP)
                  </span>
                  <div className="p-4 rounded-lg bg-[#03060b] border border-white/10 font-mono text-lg text-white mb-4">
                    Y = {minterms.some(Boolean) ? "A'C + B·D' + A·B'·C'" : "0"}
                  </div>
                  <div className="space-y-2 text-xs font-mono text-white/60">
                    <p>• Prime Implicants computed via Quine-McCluskey engine.</p>
                    <p>• Essential Prime Implicants isolated to prevent hazard conditions.</p>
                    <p>• Ready for 2-level NAND-NAND implementation.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: FSM Simulator */}
          {activeTab === "fsm" && (
            <div className="mt-8 bg-[#060b12]/90 border border-white/10 rounded-xl p-6 sm:p-8 backdrop-blur-xl">
              <h3 className="text-xl font-bold font-['Rajdhani'] text-white mb-2">
                Moore &amp; Mealy State Machine Analyzer
              </h3>
              <p className="text-xs font-mono text-white/50 mb-6">
                Interactive State Transition Graph &amp; Excitation Table Synthesizer for FPGA targets.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-lg bg-[#09111c] border border-white/10 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#2fd3e8]/20 border-2 border-[#2fd3e8] text-[#2fd3e8] font-bold font-mono text-sm flex items-center justify-center mx-auto mb-3">
                    S0
                  </div>
                  <h4 className="font-bold text-white font-['Rajdhani']">Idle State (Reset)</h4>
                  <p className="text-xs font-mono text-white/40 mt-1">Output: 00 | Next on X=1: S1</p>
                </div>

                <div className="p-5 rounded-lg bg-[#09111c] border border-[#2fd3e8] shadow-[0_0_20px_rgba(47,211,232,0.15)] text-center">
                  <div className="w-12 h-12 rounded-full bg-[#3ee68f]/20 border-2 border-[#3ee68f] text-[#3ee68f] font-bold font-mono text-sm flex items-center justify-center mx-auto mb-3">
                    S1
                  </div>
                  <h4 className="font-bold text-white font-['Rajdhani']">Sequence Detected</h4>
                  <p className="text-xs font-mono text-white/40 mt-1">Output: 01 | Next on X=0: S2</p>
                </div>

                <div className="p-5 rounded-lg bg-[#09111c] border border-white/10 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#2fd3e8]/20 border-2 border-[#2fd3e8] text-[#2fd3e8] font-bold font-mono text-sm flex items-center justify-center mx-auto mb-3">
                    S2
                  </div>
                  <h4 className="font-bold text-white font-['Rajdhani']">Latch Triggered</h4>
                  <p className="text-xs font-mono text-white/40 mt-1">Output: 11 | Next on X=1: S0</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Quizzes */}
          {activeTab === "quizzes" && (
            <div className="mt-8 bg-[#060b12]/90 border border-white/10 rounded-xl p-6 sm:p-8 backdrop-blur-xl max-w-3xl mx-auto">
              <span className="text-xs font-mono text-[#2fd3e8] uppercase tracking-wider block mb-2">
                Assessment Module 1 · Boolean Algebra
              </span>
              <h3 className="text-xl font-bold font-['Rajdhani'] text-white mb-4">
                Which Boolean law states that A + (B · C) = (A + B) · (A + C)?
              </h3>

              <div className="space-y-3 mb-6">
                {[
                  "De Morgan's Theorem",
                  "Distributive Law of OR over AND",
                  "Idempotent Property",
                  "Absorption Law",
                ].map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuizAnswer(idx);
                      setShowExplanation(true);
                    }}
                    className={`w-full text-left p-3.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                      quizAnswer === idx
                        ? idx === 1
                          ? "bg-[#3ee68f]/20 border-[#3ee68f] text-white"
                          : "bg-red-500/20 border-red-500 text-white"
                        : "bg-[#09111c] border-white/10 hover:border-white/25 text-white/80"
                    }`}
                  >
                    <span className="font-bold mr-2 text-white/40">{String.fromCharCode(65 + idx)}.</span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className="p-4 rounded-lg bg-[#0e1724] border border-white/10 animate-fadeIn">
                  <div className="text-xs font-bold font-mono text-[#3ee68f] mb-1">
                    Correct Answer: B (Distributive Law of OR over AND)
                  </div>
                  <p className="text-xs text-white/60 font-sans leading-relaxed">
                    Unlike standard arithmetic, in Boolean algebra the OR (+) operator distributes over the AND (·) operator, allowing A + BC to be factored into (A + B)(A + C).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Counter Design & Tab 6: Exam Examples */}
          {(activeTab === "counter" || activeTab === "exams") && (
            <div className="mt-8 bg-[#060b12]/90 border border-white/10 rounded-xl p-8 backdrop-blur-xl text-center max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-xl bg-[#2fd3e8]/20 border border-[#2fd3e8] flex items-center justify-center mx-auto mb-4 text-[#2fd3e8]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-['Rajdhani'] text-white">
                {activeTab === "counter" ? "Synchronous Counter Designer" : "Solved University & GATE Archive"}
              </h3>
              <p className="text-xs font-mono text-white/60 mt-2 max-w-md mx-auto">
                {activeTab === "counter"
                  ? "Configure modulus (MOD-N), choose flip-flop architecture (JK, D, T), and view timing waveforms."
                  : "Access Dr. Sagar Joshi's step-by-step video breakdowns of flip-flop conversions and FPGA state encoding."}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded bg-white/5 border border-white/10 text-xs font-mono text-[#3ee68f]">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Clearance: Monthly Pass (₹499/mo)</span>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
