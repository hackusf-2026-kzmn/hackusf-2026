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
