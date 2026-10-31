"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { courseData } from "@/data/courseData";

export function Footer() {
  const router = useRouter();
  const { user } = useAuth();
  const { footer } = courseData;

  const handleEnterLab = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user?.isSubscribed) {
      router.push("/labs");
    } else {
      router.push("/subscription");
    }
  };

  return (
    <footer>
      <span>
        © {footer.copyrightYear} Zero to One —{" "}
        <a href="/lab" onClick={handleEnterLab} className="hover:underline cursor-pointer">
          Enter Lab
        </a>
      </span>
      <span>
        Published by{" "}
        <strong style={{ color: "rgba(255,255,255,.4)" }}>
          {footer.authorName}
        </strong>
      </span>
    </footer>
  );
}

export default Footer;
