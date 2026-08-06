"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { appConfig } from "@/lib/config";
import {
  contractAddress,
  contractExplorerUrl,
  deploymentReady,
} from "@/lib/deployment";

export function StudioHeader() {
  const pathname = usePathname();

  return (
    <header className="studio-header">
      <Link className="wordmark" href="/" aria-label="SkillProof home">
        <span className="wordmark-mark">SP</span>
        <span>
          <strong>SkillProof</strong>
          <small>PROFESSIONAL PROOF PROTOCOL</small>
        </span>
      </Link>

      <nav className="score-route" aria-label="Primary navigation">
        {appConfig.routes.map((route) => {
          const active =
            route.href === "/"
              ? pathname === "/"
              : pathname.startsWith(route.href);
          return (
            <Link
              key={route.href}
              href={route.href}
              className={active ? "active" : ""}
            >
              <span>{route.index}</span>
              {route.label}
            </Link>
          );
        })}
      </nav>

      <div className="identity-seal">
        <a
          className={`deployment-seal ${deploymentReady ? "live" : "preview"}`}
          href={contractExplorerUrl}
          target="_blank"
          rel="noreferrer"
          title={
            deploymentReady
              ? "Open the deployed contract"
              : "Contract deployment is pending"
          }
        >
          <ShieldCheck size={15} />
          <span>
            {deploymentReady
              ? `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`
              : "PREVIEW"}
          </span>
          <ExternalLink size={12} />
        </a>
        <ConnectButton
          accountStatus={{ smallScreen: "avatar", largeScreen: "address" }}
          chainStatus="icon"
          showBalance={false}
        />
      </div>
    </header>
  );
}
