"use client";

import { useState, type FormEvent } from "react";
import {
  BadgeCheck,
  CircleUserRound,
  ExternalLink,
  FileSearch,
  Fingerprint,
  History,
  Link2,
  Search,
  ShieldAlert,
} from "lucide-react";
import { ProofBraidCanvas } from "@/components/proof-braid-canvas";
import { deploymentReady } from "@/lib/deployment";
import {
  previewAssessment,
  previewBraid,
  previewChallenge,
  previewPassport,
  previewSamples,
  previewTrack,
} from "@/lib/preview-data";
import { skillProofReads } from "@/lib/skillproof-client";
import type {
  Assessment,
  Passport,
  ProofBraid,
  ScoreChallenge,
  SkillTrack,
  WorkSample,
} from "@/lib/types";

type SearchMode =
  | "passport"
  | "owner"
  | "track"
  | "generation"
  | "challenge"
  | "sample"
  | "state";

type ExplorerResult = {
  passport?: Passport;
  tracks?: SkillTrack[];
  track?: SkillTrack;
  braid?: ProofBraid;
  assessment?: Assessment;
  challenge?: ScoreChallenge;
  sample?: WorkSample;
};

const modes: { id: SearchMode; label: string }[] = [
  { id: "passport", label: "Passport" },
  { id: "owner", label: "Wallet" },
  { id: "track", label: "Skill track" },
  { id: "generation", label: "Generation" },
  { id: "challenge", label: "Challenge" },
  { id: "sample", label: "Work sample" },
  { id: "state", label: "State index" },
];

const previewResult: ExplorerResult = {
  passport: previewPassport,
  tracks: [previewTrack],
  track: previewTrack,
  braid: previewBraid,
  assessment: previewAssessment,
};

export function PassportExplorer() {
  const [mode, setMode] = useState<SearchMode>("passport");
  const [query, setQuery] = useState(previewPassport.passport_id);
  const [result, setResult] = useState<ExplorerResult>(previewResult);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function search(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!deploymentReady) {
      if (mode === "challenge") {
        setResult({ challenge: previewChallenge });
      } else if (mode === "sample") {
        setResult({ sample: previewSamples[0] });
      } else if (mode === "generation") {
        setResult({ assessment: previewAssessment, track: previewTrack });
      } else {
        setResult(previewResult);
      }
      return;
    }
    setBusy(true);
    try {
      if (mode === "passport") {
        const passport = await skillProofReads.passport(query.trim());
        const tracks = await skillProofReads.ownerTracks(
          passport.owner as `0x${string}`,
        );
        setResult({ passport, tracks });
      } else if (mode === "owner") {
        const owner = query.trim() as `0x${string}`;
        const [passport, tracks] = await Promise.all([
          skillProofReads.passportByOwner(owner),
          skillProofReads.ownerTracks(owner),
        ]);
        setResult({ passport, tracks });
      } else if (mode === "track") {
        const trackId = query.trim();
        const [track, braid, assessment] = await Promise.all([
          skillProofReads.track(trackId),
          skillProofReads.braid(trackId),
          skillProofReads.latestAssessment(trackId),
        ]);
        setResult({ track, braid, assessment });
      } else if (mode === "generation") {
        setResult({
          assessment: await skillProofReads.generation(query.trim()),
        });
      } else if (mode === "challenge") {
        setResult({ challenge: await skillProofReads.challenge(query.trim()) });
      } else if (mode === "sample") {
        setResult({ sample: await skillProofReads.sample(query.trim()) });
      } else {
        setResult({
          tracks: await skillProofReads.tracksByState(query.trim().toUpperCase()),
        });
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Public lookup failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="passport-page">
      <section className="passport-heading">
        <div>
          <span className="eyebrow">PUBLIC CREDENTIAL READER</span>
          <h1>Read the work behind the score.</h1>
          <p>
            Look up a passport, skill track, assessment generation, challenge,
            or source record. Every result keeps its evidence path visible.
          </p>
        </div>
        <div className="passport-principle">
          <Fingerprint size={22} />
          <span>
            <strong>NON-TRANSFERABLE</strong>
            <small>Credentials remain bound to the passport owner.</small>
          </span>
        </div>
      </section>

      <section className="public-lookup">
        <div className="lookup-modes" aria-label="Lookup type">
          {modes.map((item) => (
            <button
              type="button"
              key={item.id}
              className={mode === item.id ? "active" : ""}
              onClick={() => {
                setMode(item.id);
                if (item.id === "state") setQuery("PUBLISHED");
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <form onSubmit={search}>
          <FileSearch size={21} />
          <label>
            <span>{modes.find((item) => item.id === mode)?.label} identifier</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                mode === "owner"
                  ? "0x..."
                  : mode === "state"
                    ? "PUBLISHED"
                    : "Enter an exact public identifier"
              }
            />
          </label>
          <button type="submit" disabled={busy}>
            <Search size={18} />
            {busy ? "Reading..." : "Read record"}
          </button>
        </form>
        {!deploymentReady && (
          <div className="passport-preview-note">
            INTERFACE PREVIEW / THESE DEMONSTRATION RECORDS ARE NOT CLAIMED ON-CHAIN
          </div>
        )}
        {error && <div className="lookup-error">{error}</div>}
      </section>

      <section className="passport-sheet">
        <div className="passport-identity-column">
          <span className="sheet-index">A / HOLDER</span>
          <div className="passport-avatar">
            <CircleUserRound />
            <span>{result.passport?.display_name.slice(0, 2).toUpperCase() ?? "SP"}</span>
          </div>
          <h2>{result.passport?.display_name ?? "Public passport"}</h2>
          <code>{result.passport?.passport_id ?? "No passport loaded"}</code>
          {result.passport && (
            <>
              <a href={result.passport.profile_url} target="_blank" rel="noreferrer">
                Public profile <ExternalLink size={14} />
              </a>
              <div className="owner-stamp">
                <span>OWNER</span>
                <strong>{result.passport.owner}</strong>
              </div>
              <div className="passport-count">
                <strong>{result.passport.track_count}</strong>
                <span>SKILL TRACKS</span>
              </div>
            </>
          )}
        </div>

        <div className="passport-proof-column">
          <div className="sheet-column-title">
            <span>B / EVIDENCE MAP</span>
            <strong>{result.track?.skill_name ?? "Select a skill track"}</strong>
          </div>
          {result.braid ? (
            <>
              <ProofBraidCanvas
                braid={result.braid}
                activeSampleId={result.braid.links[0]?.sample_id}
                frozen={result.track?.frozen_braid_size !== 0}
              />
              <div className="public-source-list">
                {[...new Map(result.braid.links.map((link) => [link.sample_id, link.sample])).values()].map(
                  (sample, index) => (
                    <a
                      key={sample.sample_id}
                      href={sample.source_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{sample.title}</strong>
                      <small>{sample.medium}</small>
                      <ExternalLink size={14} />
                    </a>
                  ),
                )}
              </div>
            </>
          ) : result.sample ? (
            <article className="standalone-source">
              <Link2 size={25} />
              <span>PUBLIC WORK SAMPLE</span>
              <h3>{result.sample.title}</h3>
              <p>{result.sample.authorship_note}</p>
              <a href={result.sample.source_url} target="_blank" rel="noreferrer">
                Inspect source <ExternalLink size={14} />
              </a>
            </article>
          ) : (
            <div className="passport-empty">No evidence map loaded.</div>
          )}
        </div>

        <aside className="passport-verdict-column">
          <span className="sheet-index">C / CREDENTIAL</span>
          {result.assessment ? (
            <>
              <div className="credential-score">
                <strong>{result.assessment.credibility_score}</strong>
                <span>/100</span>
              </div>
              <div className="credential-verdict">
                <BadgeCheck size={21} />
                <span>
                  <strong>{result.assessment.level}</strong>
                  <small>{result.assessment.result.replaceAll("_", " ")}</small>
                </span>
              </div>
              <p>{result.assessment.summary}</p>
              <div className="credential-coverage">
                <span>
                  EVIDENCE COVERAGE
                  <strong>{result.assessment.evidence_coverage}%</strong>
                </span>
                <i>
                  <b
                    style={{
                      width: `${result.assessment.evidence_coverage}%`,
                    }}
                  />
                </i>
              </div>
              <div className="credential-generation">
                <History size={15} />
                <span>
                  <strong>{result.assessment.generation_id}</strong>
                  IMMUTABLE GENERATION
                </span>
              </div>
            </>
          ) : result.challenge ? (
            <article className="challenge-record">
              <ShieldAlert size={25} />
              <span>SCORE CHALLENGE / {result.challenge.status}</span>
              <h3>{result.challenge.challenge_id}</h3>
              <p>{result.challenge.reason}</p>
              <a href={result.challenge.counter_url} target="_blank" rel="noreferrer">
                Counter-source <ExternalLink size={14} />
              </a>
            </article>
          ) : (
            <div className="passport-empty">No credential loaded.</div>
          )}
        </aside>
      </section>

      {result.tracks && (
        <section className="passport-track-index">
          <div className="sheet-column-title">
            <span>D / PASSPORT INDEX</span>
            <strong>{result.tracks.length} public tracks</strong>
          </div>
          <div className="track-index-rows">
            {result.tracks.map((track) => (
              <button
                type="button"
                key={track.track_id}
                onClick={() => {
                  setMode("track");
                  setQuery(track.track_id);
                }}
              >
                <span>{track.state}</span>
                <strong>{track.skill_name}</strong>
                <small>{track.market_role}</small>
                <b>{track.target_level}</b>
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
