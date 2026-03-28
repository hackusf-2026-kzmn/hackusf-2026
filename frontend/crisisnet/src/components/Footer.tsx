"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#262626] px-10 py-8 flex justify-between items-center font-mono text-[10px] text-[#555] tracking-wider">
      <span>© 2026 CRISISNET · HACKUSF</span>
      <div className="flex gap-6">
        <Link href="/" className="hover:text-white transition-colors">
          HOME
        </Link>
        <Link href="/about" className="hover:text-white transition-colors">
          ABOUT
        </Link>
        <Link href="/dashboard" className="hover:text-white transition-colors">
          DASHBOARD
        </Link>
      </div>
      <span>GOOGLE ADK · GEMINI · SNOWFLAKE</span>
    </footer>
  );
}
