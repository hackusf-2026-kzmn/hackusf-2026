import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crisis-Net: Multi-Agent Real-Time Response",
  description:
    "Five specialized AI agents coordinate in real-time to triage incidents, allocate resources, and route responders via Google ADK.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f5f7f3] antialiased overflow-x-hidden">
        {/* Portrait-mode blocker for mobile — forces landscape */}
        <div className="portrait-blocker">
          <div className="flex flex-col items-center gap-4 text-center px-8">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[#16a34a]">
              <rect x="8" y="14" width="32" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M22 24L28 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 28L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 24L8 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M4 24L8 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M44 20L44 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M44 24L40 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M44 24L40 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="font-mono text-[13px] text-[#111d0f] tracking-wider uppercase">Rotate your device</div>
            <div className="font-mono text-[11px] text-[#6b7869] leading-relaxed">
              Crisis-Net dashboard requires landscape orientation for optimal situational awareness.
            </div>
          </div>
        </div>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
