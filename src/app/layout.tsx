import type { Metadata } from "next";
import "@rainbow-me/rainbowkit/styles.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { Providers } from "@/app/providers";
import { StudioHeader } from "@/components/studio-header";

export const metadata: Metadata = {
  title: "SkillProof | Evidence-backed professional credibility",
  description:
    "Weave attributable work into a GenLayer-calibrated professional skill credential.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <StudioHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
