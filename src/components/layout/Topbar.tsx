"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { courseData } from "@/data/courseData";
import { LogOut, ShieldCheck } from "lucide-react";

export function Topbar() {
  const { title, subtitle, udemy } = courseData;
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <Link href="/" className="topbar-brand group shrink-0" style={{ textDecoration: "none" }}>
        <span className="topbar-chip" aria-hidden="true" />
        <div className="topbar-name">
          {title}
          <small>{subtitle}</small>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {/* Udemy Rating Badge */}
        <div className="topbar-right">
          <span>Instructor on</span>
          <b
            style={{
              color: "rgba(255,255,255,.55)",
              fontSize: ".8rem",
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: ".04em",
            }}
          >
            {udemy.platform}
          </b>
          <b>&nbsp;★ {udemy.rating}</b>
          <span>&nbsp;·&nbsp;{udemy.ratingsCount}</span>
        </div>

        {/* If user is logged in, show user badge & sign out (NO Sign In button when logged out) */}
        {user && (
          <div className="flex items-center gap-2.5">
            <Link
              href={user.isSubscribed ? "/labs" : "/subscription"}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0e1724] border border-[#2fd3e8]/30 hover:border-[#2fd3e8] transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#3ee68f] animate-pulse shrink-0" />
              <span className="text-[0.72rem] font-mono text-white/90 font-medium truncate max-w-[120px]">
                {user.name}
              </span>
              {user.isSubscribed ? (
                <span className="text-[0.58rem] font-mono uppercase px-1.5 py-0.5 rounded bg-[#3ee68f]/20 text-[#3ee68f] border border-[#3ee68f]/40 flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-2.5 h-2.5" /> Pro Lab
                </span>
              ) : (
                <span className="text-[0.58rem] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                  Subscribe
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded text-white/50 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;
