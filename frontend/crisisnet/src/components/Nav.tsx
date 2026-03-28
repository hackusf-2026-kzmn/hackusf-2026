"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlobeLogo } from "@/components/ui/globe-logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-14 bg-white/90 backdrop-blur-xl border-b border-[#d4dbc8]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <GlobeLogo size={20} />
        <span className="font-display font-extrabold text-lg tracking-tight text-[#111d0f]">
          CRISIS-NET
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
                  ? "text-[#16a34a] border-[#16a34a]"
                  : "text-[#52665e] border-transparent hover:text-[#111d0f] hover:border-[#d4dbc8]"
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
        className="font-mono text-[11px] bg-[#16a34a] text-white px-5 py-2 font-medium tracking-widest uppercase hover:shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all duration-200"
      >
        Open Dashboard →
      </Link>
    </nav>
  );
}
