"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#d4dbc8] px-6 md:px-10 py-6 md:py-8 flex flex-col md:flex-row gap-4 justify-between items-center font-mono text-[10px] text-[#6b7869] tracking-wider">
      <span>2026 CRISIS-NET · HACKUSF</span>
      <div className="flex gap-6">
        <Link href="/" className="hover:text-[#111d0f] transition-colors">
          HOME
        </Link>
        <Link href="/about" className="hidden md:inline hover:text-[#111d0f] transition-colors">
          ABOUT
        </Link>
        <Link href="/dashboard" className="hover:text-[#111d0f] transition-colors">
          DASHBOARD
        </Link>
      </div>
      <span className="hidden md:inline">GOOGLE ADK · NWS + FEMA · SQLITE</span>
    </footer>
  );
}
