import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrisisNet — Multi-Agent Disaster Response",
  description:
    "Five specialized AI agents coordinate in real-time to triage incidents, allocate resources, and route responders via Google ADK.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0b0b0b] antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
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
