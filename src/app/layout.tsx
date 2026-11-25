import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PROFILE } from "@/domain/profile-data";
import { formatLlmsTxt, formatProfileJson } from "@/domain/protocol-export";
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
  metadataBase: new URL("https://ijoshwang.github.io"),
  title: {
    default: "Josh Wang | AI-Native Product & Systems Engineer",
    template: "%s | Josh Wang",
  },
  description:
    "AI product and full-stack engineer in Hong Kong building StarLab so multiple agents share and maintain one living context.",
  openGraph: {
    title: "Josh Wang | AI-Native Product & Systems Engineer",
    description:
      "Building AI products and shared-memory agent systems. Creator of StarLab and 0-to-1 engineer behind WebPilot.",
    url: "https://ijoshwang.github.io",
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
