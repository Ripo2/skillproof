import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(".");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const contract = read("contracts/SkillProof.py");
const proofRoom = read("src/components/proof-room.tsx");
const passport = read("src/components/passport-explorer.tsx");
const entry = read("src/components/protocol-entry.tsx");
const braid = read("src/components/proof-braid-canvas.tsx");
const actions = read("src/components/domain-contract-actions.tsx");
const client = read("src/lib/genlayer.ts");
const integration = read("src/lib/skillproof-client.ts");
const surface = read("src/lib/contract-surface.ts");
const css = read("src/app/globals.css");

const methods = [
  "configure_protocol",
  "register_passport",
  "update_passport_profile",
  "open_skill_track",
  "weave_work_sample",
  "freeze_proof_braid",
  "calibrate_skill",
  "extend_proof_braid",
  "open_score_challenge",
  "answer_score_challenge",
  "recalibrate_skill",
  "publish_skill_credential",
  "retire_skill_credential",
  "get_protocol_config",
  "get_passport",
  "get_passport_by_owner",
  "get_skill_track",
  "get_work_sample",
  "get_proof_braid",
  "get_assessment_generation",
  "get_latest_assessment",
  "get_score_challenge",
  "get_owner_tracks",
  "get_tracks_by_state",
  "get_frontend_bootstrap",
  "get_audit_slice",
];

test("contract implements the triadic proof braid and immutable generations", () => {
  for (const marker of [
    "braid_track_links",
    "braid_sample_links",
    "braid_capability_links",
    "track_braid_heads",
    "track_braid_tails",
    "assessment_generations",
  ]) {
    assert.match(contract, new RegExp(marker));
  }
  assert.match(contract, /gl\.nondet\.web\.render/);
  assert.match(contract, /gl\.nondet\.exec_prompt/);
  assert.match(contract, /run_nondet_unsafe/);
});

test("all public contract methods are mapped into domain integration", () => {
  for (const method of methods) {
    assert.match(contract, new RegExp(`def ${method}\\(`));
    assert.match(surface, new RegExp(`name: "${method}"`));
    assert.match(integration, new RegExp(`"${method}"`));
  }
});

test("frontend is a distinct proof audition studio", () => {
  for (const marker of [
    "proof-stage-triptych",
    "capability-ruler",
    "evidence-reel",
    "assessment-transcript",
    "proof-braid-action-dock",
  ]) {
    assert.match(`${proofRoom}\n${actions}\n${css}`, new RegExp(marker));
  }
  assert.match(braid, /from "pixi\.js"/);
  assert.match(braid, /PIXEL-RENDERED WITH PIXIJS/);
  assert.match(entry, /DECENTRALIZED PROFESSIONAL PROOF/);
  assert.match(passport, /PUBLIC CREDENTIAL READER/);
});

test("routes and controls avoid the rejected universal shell", () => {
  const source = [proofRoom, passport, entry, braid, css, integration].join("\n");
  assert.doesNotMatch(source, /["']\/contract["']/);
  assert.doesNotMatch(source, /\?mode=/);
  assert.doesNotMatch(source, /ContractSurface|flow\.filtered\.map/);
  assert.doesNotMatch(css, /linear-gradient|radial-gradient/);
});

test("writes verify GenLayer finality and preview provenance is explicit", () => {
  assert.match(client, /TransactionStatus\.FINALIZED/);
  assert.match(client, /MAJORITY_AGREE/);
  assert.match(`${entry}\n${proofRoom}\n${passport}`, /INTERFACE PREVIEW/);
  assert.doesNotMatch(
    [contract, client, integration].join("\n"),
    /privateKey|mnemonic|seedPhrase/,
  );
});
