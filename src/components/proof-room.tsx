"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  Archive,
  ArrowRight,
  BadgeCheck,
  CircleDotDashed,
  ExternalLink,
  FileCheck2,
  Gauge,
  Link2,
  LockKeyhole,
  MessageSquareWarning,
  RefreshCw,
  ScanSearch,
  Sparkles,
  UnlockKeyhole,
} from "lucide-react";
import { DomainContractActions } from "@/components/domain-contract-actions";
import { ProofBraidCanvas } from "@/components/proof-braid-canvas";
import { TransactionNote } from "@/components/transaction-note";
import { useContractWorkflow } from "@/lib/contract-workflow";
import { deploymentReady } from "@/lib/deployment";
import { previewTrack } from "@/lib/preview-data";
import { useProofWorkspace } from "@/hooks/use-skillproof";
import type { WorkSample } from "@/lib/types";

function formatDate(timestamp: number) {
  if (!timestamp) return "Not recorded";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(timestamp * 1000));
}

function findingTone(finding: string) {
  if (finding === "DEMONSTRATED") return "demonstrated";
  if (finding === "EMERGING") return "emerging";
  return "unsupported";
}

export function ProofRoom() {
  const [trackQuery, setTrackQuery] = useState(previewTrack.track_id);
  const [activeTrackId, setActiveTrackId] = useState(previewTrack.track_id);
  const workspace = useProofWorkspace(activeTrackId);
  const flow = useContractWorkflow();
  const data = workspace.data;
  const [activeSampleId, setActiveSampleId] = useState(
    data?.braid.links[0]?.sample_id ?? "",
  );
  const [challengeMode, setChallengeMode] = useState<"open" | "answer">("open");
  const [challengeId, setChallengeId] = useState("");
  const [counterUrl, setCounterUrl] = useState("");
  const [challengeReason, setChallengeReason] = useState("");
  const [responseUrl, setResponseUrl] = useState("");
  const [responseNote, setResponseNote] = useState("");
  const [retirementReason, setRetirementReason] = useState("");

  const activeSample = useMemo<WorkSample | undefined>(
    () =>
      data?.braid.links.find((link) => link.sample_id === activeSampleId)?.sample ??
      data?.braid.links[0]?.sample,
    [activeSampleId, data],
  );

  if (!data) {
    return (
      <main className="proof-room-page">
        <div className="workspace-loading">
          <CircleDotDashed className="spin" />
          <strong>Loading the proof workspace</strong>
        </div>
      </main>
    );
  }

  const { track, braid, assessment, audit } = data;
  const frozen = track.frozen_braid_size > 0;

  function runAction(action: () => Promise<unknown>) {
    void action().catch(() => undefined);
  }

  async function openChallenge(event: FormEvent) {
    event.preventDefault();
    try {
      await flow.actions.openChallenge(
        track.track_id,
        challengeId,
        counterUrl,
        challengeReason,
      );
    } catch {
      // Transaction state renders the actionable error beside this form.
    }
  }

  async function answerChallenge(event: FormEvent) {
    event.preventDefault();
    try {
      await flow.actions.answerChallenge(
        challengeId || track.open_challenge_id,
        responseUrl,
        responseNote,
      );
    } catch {
      // Transaction state renders the actionable error beside this form.
    }
  }

  return (
    <main className="proof-room-page">
      <section className="proofroom-intro">
        <div>
          <span className="eyebrow">EVIDENCE AUDITION / ACTIVE WORKSPACE</span>
          <h1>Proof room</h1>
          <p>
            Bind attributable work to capabilities, freeze the braid, then ask
            GenLayer validators to calibrate the claim against a public market
            standard.
          </p>
        </div>
        <form
          className="track-loader"
          onSubmit={(event) => {
            event.preventDefault();
            setActiveTrackId(trackQuery.trim());
          }}
        >
          <label>
            <span>TRACK ID</span>
            <input
              value={trackQuery}
              onChange={(event) => setTrackQuery(event.target.value)}
              placeholder="product-systems"
            />
          </label>
          <button type="submit" title="Load skill track">
            <ScanSearch size={18} />
          </button>
        </form>
      </section>

      <section className="score-ribbon">
        <div className="ribbon-identity">
          <span>ACTIVE CLAIM</span>
          <strong>{track.skill_name}</strong>
          <small>{track.market_role}</small>
        </div>
        <div className="ribbon-state">
          <span>PROTOCOL STATE</span>
          <strong>{track.state.replaceAll("_", " ")}</strong>
          <small>
            {track.braid_size} links / {track.capability_count} capabilities
          </small>
        </div>
        <div className="ribbon-score">
          <span>CREDIBILITY</span>
          <strong>{assessment?.credibility_score ?? "--"}</strong>
          <small>{assessment?.level ?? track.target_level}</small>
        </div>
        <div className="ribbon-actions">
          <button
            type="button"
            onClick={() =>
              runAction(() => flow.actions.freezeBraid(track.track_id))
            }
            title="Freeze proof braid"
          >
            <LockKeyhole size={17} />
            Freeze
          </button>
          <button
            type="button"
            onClick={() =>
              runAction(() => flow.actions.calibrateSkill(track.track_id))
            }
            title="Run skill calibration"
          >
            <Sparkles size={17} />
            Calibrate
          </button>
          <button
            type="button"
            onClick={() =>
              runAction(() => flow.actions.publishCredential(track.track_id))
            }
            className="primary"
            title="Publish credential"
          >
            <BadgeCheck size={17} />
            Publish
          </button>
        </div>
      </section>

      {!deploymentReady && (
        <div className="provenance-banner">
          <span>INTERFACE PREVIEW</span>
          The records below are a clearly marked local demonstration. No
          SkillProof deployment or on-chain record is being claimed.
        </div>
      )}

      <section className="proof-stage-triptych">
        <aside className="capability-ruler">
          <div className="panel-heading">
            <span>01 / CAPABILITY RULER</span>
            <strong>{braid.capabilities.length} strands</strong>
          </div>
          <div className="ruler-scale">
            {[100, 80, 60, 40, 20, 0].map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>
          <div className="capability-findings">
            {(assessment?.capability_findings ?? []).map((finding, index) => (
              <button
                type="button"
                key={finding.capability}
                className={findingTone(finding.finding)}
                onClick={() => {
                  const link = braid.links.find(
                    (item) => item.capability === finding.capability,
                  );
                  if (link) setActiveSampleId(link.sample_id);
                }}
              >
                <span className="capability-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="capability-name">
                  {finding.capability.replaceAll("-", " ")}
                  <small>{finding.finding}</small>
                </span>
                <strong>{finding.score}</strong>
              </button>
            ))}
          </div>
          <a
            href={track.standard_url}
            target="_blank"
            rel="noreferrer"
            className="standard-link"
          >
            <FileCheck2 size={16} />
            <span>
              MARKET STANDARD
              <small>Open cited rubric</small>
            </span>
            <ExternalLink size={14} />
          </a>
        </aside>

        <section className="evidence-reel">
          <div className="panel-heading">
            <span>02 / PROOF BRAID</span>
            <strong>{frozen ? "FROZEN" : "OPEN WEAVE"}</strong>
          </div>
          <ProofBraidCanvas
            braid={braid}
            activeSampleId={activeSample?.sample_id}
            frozen={frozen}
            onSelectSample={setActiveSampleId}
          />
          <div className="sample-reel" aria-label="Work samples">
            {[...new Map(braid.links.map((link) => [link.sample_id, link.sample])).values()].map(
              (sample, index) => (
                <button
                  type="button"
                  key={sample.sample_id}
                  className={
                    sample.sample_id === activeSample?.sample_id ? "active" : ""
                  }
                  onClick={() => setActiveSampleId(sample.sample_id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{sample.title}</strong>
                  <small>{sample.medium}</small>
                </button>
              ),
            )}
          </div>
          {activeSample && (
            <article className="sample-inspector">
              <div>
                <span>SELECTED WORK SAMPLE</span>
                <h2>{activeSample.title}</h2>
              </div>
              <p>{activeSample.authorship_note}</p>
              <a href={activeSample.source_url} target="_blank" rel="noreferrer">
                Inspect public proof <ExternalLink size={14} />
              </a>
            </article>
          )}
        </section>

        <aside className="assessment-transcript">
          <div className="panel-heading">
            <span>03 / ASSESSMENT TRANSCRIPT</span>
            <strong>{assessment?.generation_id ?? "UNASSESSED"}</strong>
          </div>
          <div className="score-aperture">
            <div
              className="score-dial"
              style={
                {
                  "--score": `${assessment?.credibility_score ?? 0}%`,
                } as React.CSSProperties
              }
            >
              <span>{assessment?.credibility_score ?? "--"}</span>
              <small>/ 100</small>
            </div>
            <div>
              <span>VALIDATOR RESULT</span>
              <strong>{assessment?.result.replaceAll("_", " ") ?? "NOT RUN"}</strong>
              <small>
                {assessment?.evidence_coverage ?? 0}% evidence coverage
              </small>
            </div>
          </div>
          <div className="transcript-copy">
            <span>CALIBRATION NOTE</span>
            <p>{assessment?.summary ?? "Freeze a proof braid to begin calibration."}</p>
          </div>
          <div className="transcript-copy rubric">
            <span>RUBRIC DIGEST</span>
            <p>{assessment?.rubric_digest ?? track.claim_statement}</p>
          </div>
          <div className="generation-meta">
            <span>GENERATION {assessment?.sequence ?? 0}</span>
            <span>{formatDate(assessment?.assessed_at ?? 0)}</span>
            <span>{assessment?.braid_size ?? 0} LINKS READ</span>
          </div>
          <div className="transcript-commands">
            <button
              type="button"
              onClick={() =>
                runAction(() => flow.actions.extendBraid(track.track_id))
              }
            >
              <UnlockKeyhole size={16} />
              Extend evidence
            </button>
            <button
              type="button"
              onClick={() =>
                runAction(() => flow.actions.recalibrateSkill(track.track_id))
              }
            >
              <RefreshCw size={16} />
              Recalibrate
            </button>
          </div>
        </aside>
      </section>

      <section className="challenge-and-history">
        <div className="challenge-desk">
          <div className="section-title-row">
            <div>
              <span>COUNTER-EVIDENCE CHANNEL</span>
              <h2>Challenge the score, not the person.</h2>
            </div>
            <div className="mini-segment">
              <button
                type="button"
                className={challengeMode === "open" ? "active" : ""}
                onClick={() => setChallengeMode("open")}
              >
                Open challenge
              </button>
              <button
                type="button"
                className={challengeMode === "answer" ? "active" : ""}
                onClick={() => setChallengeMode("answer")}
              >
                Owner response
              </button>
            </div>
          </div>

          {challengeMode === "open" ? (
            <form className="challenge-form" onSubmit={openChallenge}>
              <label>
                <span>Challenge ID</span>
                <input
                  value={challengeId}
                  onChange={(event) => setChallengeId(event.target.value)}
                  placeholder="review-12"
                  required
                />
              </label>
              <label>
                <span>Counter-source</span>
                <input
                  type="url"
                  value={counterUrl}
                  onChange={(event) => setCounterUrl(event.target.value)}
                  placeholder="https://..."
                  required
                />
              </label>
              <label className="wide">
                <span>Evidence-based reason</span>
                <textarea
                  value={challengeReason}
                  onChange={(event) => setChallengeReason(event.target.value)}
                  placeholder="Explain what the assessment missed and point to the public source."
                  rows={3}
                  required
                />
              </label>
              <button type="submit">
                <MessageSquareWarning size={17} />
                Submit counter-evidence
              </button>
            </form>
          ) : (
            <form className="challenge-form" onSubmit={answerChallenge}>
              <label>
                <span>Challenge ID</span>
                <input
                  value={challengeId}
                  onChange={(event) => setChallengeId(event.target.value)}
                  placeholder={track.open_challenge_id || "review-12"}
                  required
                />
              </label>
              <label>
                <span>Response source</span>
                <input
                  type="url"
                  value={responseUrl}
                  onChange={(event) => setResponseUrl(event.target.value)}
                  placeholder="https://..."
                  required
                />
              </label>
              <label className="wide">
                <span>Owner response</span>
                <textarea
                  value={responseNote}
                  onChange={(event) => setResponseNote(event.target.value)}
                  placeholder="Clarify authorship with attributable evidence."
                  rows={3}
                  required
                />
              </label>
              <button type="submit">
                <ArrowRight size={17} />
                Answer challenge
              </button>
            </form>
          )}
          <TransactionNote state={flow.transaction.state} />
        </div>

        <aside className="audit-tape">
          <div className="panel-heading">
            <span>IMMUTABLE EVENT TAPE</span>
            <strong>{audit.length} shown</strong>
          </div>
          <ol>
            {audit.map((event) => (
              <li key={event.event_id}>
                <span>{event.event_id}</span>
                <div>
                  <strong>{event.action.replaceAll("_", " ")}</strong>
                  <small>{event.detail}</small>
                </div>
                <time>{formatDate(event.recorded_at)}</time>
              </li>
            ))}
          </ol>
          <div className="retire-strip">
            <label>
              <span>RETIREMENT REASON</span>
              <input
                value={retirementReason}
                onChange={(event) => setRetirementReason(event.target.value)}
                placeholder="Credential superseded by a new track"
              />
            </label>
            <button
              type="button"
              title="Retire published credential"
              onClick={() =>
                runAction(() =>
                  flow.actions.retireCredential(
                    track.track_id,
                    retirementReason,
                  ),
                )
              }
            >
              <Archive size={16} />
            </button>
          </div>
        </aside>
      </section>

      <DomainContractActions trackId={track.track_id} />

      <footer className="proofroom-footer">
        <span>
          <Gauge size={15} /> TARGET: {track.target_level}
        </span>
        <span>
          <Link2 size={15} /> {track.distinct_sample_count} DISTINCT SOURCES
        </span>
        <span>
          <BadgeCheck size={15} /> {track.published_generation_id || "NOT PUBLISHED"}
        </span>
      </footer>
    </main>
  );
}
