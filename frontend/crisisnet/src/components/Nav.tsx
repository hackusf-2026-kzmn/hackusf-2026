"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlobeLogo } from "@/components/ui/globe-logo";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

const links = [
  { href: "/", label: "Home", hideOnMobile: false },
  { href: "/about", label: "About", hideOnMobile: true },
  { href: "/dashboard", label: "Dashboard", hideOnMobile: false },
];

export function Nav() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 h-[70px] bg-white/90 backdrop-blur-xl border-b border-[#d4dbc8] ${isDashboard ? "hidden lg:flex" : ""}`}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 md:gap-3 group">
        <GlobeLogo size={25} />
        <span className="font-display font-extrabold text-lg md:text-xl tracking-tight text-[#111d0f]">
          CRISIS-NET
        </span>
      </Link>

      {/* Links — hidden on small mobile */}
      <div className="hidden sm:flex">
        {links.map(({ href, label, hideOnMobile }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`font-mono text-[12px] md:text-[13px] tracking-wide uppercase px-3 md:px-6 py-2.5 border transition-all duration-200 ${
                isActive
                  ? "text-[#16a34a] border-[#16a34a]"
                  : "text-[#52665e] border-transparent hover:text-[#111d0f] hover:border-[#d4dbc8]"
              } ${hideOnMobile ? "hidden md:block" : ""}`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Language toggle + CTA */}
      <div className="flex items-center gap-3 md:gap-4">
        <LanguageToggle />
      <Link
        href="https://devpost.com/software/stroke-shield?"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[11px] md:text-[13px] bg-[#16a34a] text-white px-4 md:px-6 py-2 md:py-2.5 font-medium tracking-widest uppercase hover:shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all duration-200"
      >
        DEVPOST →
      </Link>
      </div>
    </nav>
  );
}
