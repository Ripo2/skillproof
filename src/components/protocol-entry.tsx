"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Braces,
  FileStack,
  Fingerprint,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { ProofBraidCanvas } from "@/components/proof-braid-canvas";
import { useProtocolConfig, useSkillProofBootstrap } from "@/hooks/use-skillproof";
import {
  previewAssessment,
  previewBraid,
  previewTrack,
} from "@/lib/preview-data";

export function ProtocolEntry() {
  const bootstrap = useSkillProofBootstrap();
  const protocol = useProtocolConfig();

  return (
    <main
      className="entry-page"
      data-landing="skillproof-proof-braid-entry"
      data-palette="colorhunt-signal-coral-mineral-blue-chartreuse"
    >
      <section className="entry-stage">
        <div className="entry-copy">
          <span className="eyebrow">DECENTRALIZED PROFESSIONAL PROOF</span>
          <h1>
            Skill
            <br />
            Proof
          </h1>
          <p>
            Turn public work into a durable credibility record. GenLayer
            validators inspect attributable evidence against a cited market
            standard, then settle a score that can be challenged and
            recalibrated.
          </p>
          <div className="entry-actions">
            <Link href="./proofroom/">
              Build a proof braid <ArrowUpRight size={17} />
            </Link>
            <Link href="./passport/" className="secondary">
              Inspect a passport
            </Link>
          </div>
          <div className="entry-provenance">
            <ShieldCheck size={17} />
            <span>
              <strong>
                {bootstrap.dataMode === "onchain"
                  ? "LIVE STUDIONET DATA"
                  : "INTERFACE PREVIEW"}
              </strong>
              <small>
                {bootstrap.dataMode === "onchain"
                  ? "Reads resolve from the deployed SkillProof contract."
                  : "Demonstration records are labeled and are not claimed on-chain."}
              </small>
            </span>
          </div>
        </div>

        <div className="entry-braid">
          <div className="entry-braid-label">
            <span>LIVE INTERACTION MODEL</span>
            <strong>Proof braid / {previewTrack.track_id}</strong>
          </div>
          <ProofBraidCanvas
            braid={previewBraid}
            activeSampleId={previewBraid.links[0].sample_id}
            frozen
          />
          <div className="entry-braid-key">
            {previewBraid.capabilities.map((capability, index) => (
              <span key={capability}>
                <i>{String(index + 1).padStart(2, "0")}</i>
                {capability.replaceAll("-", " ")}
              </span>
            ))}
          </div>
        </div>

        <aside className="entry-score">
          <span className="score-caption">CALIBRATED CREDIBILITY</span>
          <div className="entry-score-number">
            <strong>{previewAssessment.credibility_score}</strong>
            <span>/100</span>
          </div>
          <div className="entry-level">
            <BadgeCheck size={21} />
            <span>
              <strong>{previewAssessment.level}</strong>
              <small>{previewAssessment.result}</small>
            </span>
          </div>
          <div className="score-ticks" aria-label="Credibility scale">
            {Array.from({ length: 10 }, (_, index) => (
              <i
                key={index}
                className={
                  index < Math.round(previewAssessment.credibility_score / 10)
                    ? "filled"
                    : ""
                }
              />
            ))}
          </div>
          <p>{previewAssessment.summary}</p>
          <Link href="./passport/">
            Open assessment transcript <ArrowUpRight size={15} />
          </Link>
        </aside>
      </section>

      <section className="protocol-metrics">
        <div>
          <span>PASSPORTS</span>
          <strong>{bootstrap.data.counts.passports}</strong>
        </div>
        <div>
          <span>WORK SAMPLES</span>
          <strong>{bootstrap.data.counts.samples}</strong>
        </div>
        <div>
          <span>ASSESSMENTS</span>
          <strong>{bootstrap.data.counts.generations}</strong>
        </div>
        <div>
          <span>PUBLISHED</span>
          <strong>{bootstrap.data.counts.published}</strong>
        </div>
        <div className="metric-source">
          <Braces size={18} />
          <span>
            {bootstrap.dataMode === "onchain" ? "ONCHAIN INDEX" : "PREVIEW INDEX"}
          </span>
        </div>
      </section>

      <section className="proof-method">
        <div className="method-intro">
          <span className="eyebrow">ONE CLAIM / MANY ATTRIBUTABLE SOURCES</span>
          <h2>The score follows the evidence.</h2>
          <p>
            A credential is not issued from a resume line. It emerges from
            public work, capability links, a market standard, independent
            validator reasoning, and a challengeable assessment history.
          </p>
        </div>
        <div className="method-sequence">
          <article>
            <span>01</span>
            <Fingerprint />
            <h3>Seal an identity</h3>
            <p>One wallet owns one non-transferable professional passport.</p>
          </article>
          <article>
            <span>02</span>
            <FileStack />
            <h3>Weave the work</h3>
            <p>Connect repositories, portfolios, videos, and articles to capabilities.</p>
          </article>
          <article>
            <span>03</span>
            <Scale />
            <h3>Calibrate the claim</h3>
            <p>Validators compare the frozen braid with the cited market standard.</p>
          </article>
          <article>
            <span>04</span>
            <BadgeCheck />
            <h3>Publish the generation</h3>
            <p>Keep every score, challenge, response, and recalibration addressable.</p>
          </article>
        </div>
      </section>

      <section className="charter-band">
        <div>
          <span>VALIDATOR CHARTER</span>
          <h2>{protocol.data.protocol_name}</h2>
        </div>
        <blockquote>{protocol.data.scoring_charter}</blockquote>
        <div className="charter-rule">
          <span>SAFE OUTCOME</span>
          <strong>MORE EVIDENCE REQUIRED</strong>
          <small>Inconclusive work never becomes a publishable credential.</small>
        </div>
      </section>
    </main>
  );
}
