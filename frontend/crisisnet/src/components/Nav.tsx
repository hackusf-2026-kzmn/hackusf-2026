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
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 h-[70px] bg-white/90 backdrop-blur-xl border-b border-[#d4dbc8]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <GlobeLogo size={25} />
        <span className="font-display font-extrabold text-xl tracking-tight text-[#111d0f]">
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
              className={`font-mono text-[13px] tracking-wide uppercase px-6 py-2.5 border transition-all duration-200 ${
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

      {/* CTA CHANGE LATER*/}
      <Link
        href="https://devpost.com/software/stroke-shield?"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[13px] bg-[#16a34a] text-white px-6 py-2.5 font-medium tracking-widest uppercase hover:shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all duration-200"
      >
        DEVPOST →
      </Link>
    </nav>
  );
}
