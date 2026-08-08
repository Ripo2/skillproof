export type TxStage =
  | "idle"
  | "wallet"
  | "submitted"
  | "finalizing"
  | "finalized"
  | "failed";

export type TxState = {
  stage: TxStage;
  action: string;
  hash?: string;
  error?: string;
};

export type Passport = {
  passport_id: string;
  owner: string;
  display_name: string;
  profile_url: string;
  created_at: number;
  active: boolean;
  track_count: number;
};

export type SkillTrack = {
  track_id: string;
  passport_id: string;
  owner: string;
  skill_name: string;
  market_role: string;
  target_level: string;
  standard_url: string;
  claim_statement: string;
  state: string;
  created_at: number;
  braid_size: number;
  frozen_braid_size: number;
  distinct_sample_count: number;
  capability_count: number;
  generation_count: number;
  latest_generation_id: string;
  open_challenge_id: string;
  published_generation_id: string;
};

export type WorkSample = {
  sample_id: string;
  owner: string;
  title: string;
  source_url: string;
  medium: string;
  authorship_note: string;
  created_at: number;
};

export type BraidLink = {
  edge_id: string;
  track_id: string;
  sample_id: string;
  capability: string;
  sample: WorkSample;
};

export type ProofBraid = {
  track_id: string;
  head: string;
  tail: string;
  link_count: number;
  frozen_link_count: number;
  capabilities: string[];
  links: BraidLink[];
};

export type CapabilityFinding = {
  capability: string;
  finding: "DEMONSTRATED" | "EMERGING" | "UNSUPPORTED";
  score: number;
  reason: string;
};

export type Assessment = {
  generation_id: string;
  track_id: string;
  sequence: number;
  result: "VERIFIED" | "PARTIAL" | "MORE_EVIDENCE_REQUIRED";
  level: string;
  credibility_score: number;
  evidence_coverage: number;
  braid_size: number;
  rubric_digest: string;
  capability_findings: CapabilityFinding[];
  summary: string;
  challenge_id: string;
  assessed_at: number;
};

export type ScoreChallenge = {
  challenge_id: string;
  track_id: string;
  generation_id: string;
  challenger: string;
  counter_url: string;
  reason: string;
  response_url: string;
  response_note: string;
  status: "OPEN" | "ANSWERED" | "RESOLVED";
  created_at: number;
  resolved_generation_id: string;
};

export type PassportEvent = {
  event_id: string;
  track_id: string;
  action: string;
  actor: string;
  detail: string;
  recorded_at: number;
};

export type ProtocolConfig = {
  protocol_name: string;
  scoring_charter: string;
  configured: boolean;
  curator: string;
  metrics: Record<string, number>;
};

export type SkillProofBootstrap = {
  protocol: {
    name: string;
    configured: boolean;
  };
  counts: {
    passports: number;
    tracks: number;
    samples: number;
    generations: number;
    published: number;
    challenges: number;
  };
  recent_tracks: SkillTrack[];
};

export type DataMode = "onchain" | "preview";
