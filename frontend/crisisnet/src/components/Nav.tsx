"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-14 bg-[#0b0b0b]/85 backdrop-blur-xl border-b border-[#262626]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-2 h-2 bg-[#c8ff00] rotate-45 group-hover:rotate-[135deg] transition-transform duration-300" />
        <span className="font-display font-extrabold text-lg tracking-tight">
          CRISISNET
        </span>
      </Link>

      {/* Links */}
      <div className="flex">
        {links.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`font-mono text-xs tracking-wide uppercase px-5 py-2 border transition-all duration-200 ${
                isActive
                  ? "text-[#c8ff00] border-[#c8ff00]"
                  : "text-[#888] border-transparent hover:text-white hover:border-[#262626]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <Link
        href="/dashboard"
        className="font-mono text-[11px] bg-[#c8ff00] text-[#0b0b0b] px-5 py-2 font-medium tracking-widest uppercase hover:shadow-[0_0_20px_rgba(200,255,0,0.3)] transition-all duration-200"
      >
        Open Dashboard →
      </Link>
    </nav>
  );
}
