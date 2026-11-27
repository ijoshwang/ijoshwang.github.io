import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PROFILE } from "@/domain/profile-data";
import { formatLlmsTxt, formatProfileJson } from "@/domain/protocol-export";
import { SITE_URL } from "@/domain/site-config";
import { SiteShell } from "@/features/studio/site-shell";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Josh Wang | AI-Native Product & Systems Engineer",
    template: "%s | Josh Wang",
  },
  description:
    "Full-stack and AI product engineer in Hong Kong with 20+ years of experience shipping TypeScript, Next.js, and Go systems, from 0-to-1 products like WebPilot to StarLab.",
  openGraph: {
    title: "Josh Wang | AI-Native Product & Systems Engineer",
    description:
      "Full-stack and AI product engineer in Hong Kong with 20+ years of experience shipping TypeScript, Next.js, and Go systems, from 0-to-1 products like WebPilot to StarLab, a personal agent OS built on one shared context.",
    url: SITE_URL,
    siteName: "Josh Wang",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const llmsTxt = formatLlmsTxt(PROFILE);
  const profileJson = formatProfileJson(PROFILE);

  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <SiteShell profile={PROFILE} llmsTxt={llmsTxt} profileJson={profileJson}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
