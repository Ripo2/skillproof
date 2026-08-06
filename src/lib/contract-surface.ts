export type ContractParam = {
  name: string;
  type: "string" | "int" | "bool" | "address";
};

export type ContractMethod = {
  name: string;
  kind: "read" | "write";
  params: readonly ContractParam[];
  returns: string;
};

export const contractSurfaceIdentity = {
  layout: "braid",
  composition: "proof-braid-action-dock",
  title: "Evidence audition controls",
  readLabel: "Public proof reads",
  writeLabel: "Passport actions",
} as const;

export const contractMethods = [
  {
    name: "get_assessment_generation",
    kind: "read",
    params: [{ name: "generation_id", type: "string" }],
    returns: "dict",
  },
  {
    name: "get_audit_slice",
    kind: "read",
    params: [
      { name: "track_id", type: "string" },
      { name: "offset", type: "int" },
      { name: "limit", type: "int" },
    ],
    returns: "array",
  },
  {
    name: "get_frontend_bootstrap",
    kind: "read",
    params: [],
    returns: "dict",
  },
  {
    name: "get_latest_assessment",
    kind: "read",
    params: [{ name: "track_id", type: "string" }],
    returns: "dict",
  },
  {
    name: "get_owner_tracks",
    kind: "read",
    params: [
      { name: "owner", type: "address" },
      { name: "offset", type: "int" },
      { name: "limit", type: "int" },
    ],
    returns: "array",
  },
  {
    name: "get_passport",
    kind: "read",
    params: [{ name: "passport_id", type: "string" }],
    returns: "dict",
  },
  {
    name: "get_passport_by_owner",
    kind: "read",
    params: [{ name: "owner", type: "address" }],
    returns: "dict",
  },
  {
    name: "get_proof_braid",
    kind: "read",
    params: [{ name: "track_id", type: "string" }],
    returns: "dict",
  },
  {
    name: "get_protocol_config",
    kind: "read",
    params: [],
    returns: "dict",
  },
  {
    name: "get_score_challenge",
    kind: "read",
    params: [{ name: "challenge_id", type: "string" }],
    returns: "dict",
  },
  {
    name: "get_skill_track",
    kind: "read",
    params: [{ name: "track_id", type: "string" }],
    returns: "dict",
  },
  {
    name: "get_tracks_by_state",
    kind: "read",
    params: [
      { name: "state", type: "string" },
      { name: "offset", type: "int" },
      { name: "limit", type: "int" },
    ],
    returns: "array",
  },
  {
    name: "get_work_sample",
    kind: "read",
    params: [{ name: "sample_id", type: "string" }],
    returns: "dict",
  },
  {
    name: "answer_score_challenge",
    kind: "write",
    params: [
      { name: "challenge_id", type: "string" },
      { name: "response_url", type: "string" },
      { name: "response_note", type: "string" },
    ],
    returns: "null",
  },
  {
    name: "calibrate_skill",
    kind: "write",
    params: [{ name: "track_id", type: "string" }],
    returns: "null",
  },
  {
    name: "configure_protocol",
    kind: "write",
    params: [
      { name: "protocol_name", type: "string" },
      { name: "scoring_charter", type: "string" },
    ],
    returns: "null",
  },
  {
    name: "extend_proof_braid",
    kind: "write",
    params: [{ name: "track_id", type: "string" }],
    returns: "null",
  },
  {
    name: "freeze_proof_braid",
    kind: "write",
    params: [{ name: "track_id", type: "string" }],
    returns: "null",
  },
  {
    name: "open_score_challenge",
    kind: "write",
    params: [
      { name: "track_id", type: "string" },
      { name: "challenge_id", type: "string" },
      { name: "counter_url", type: "string" },
      { name: "reason", type: "string" },
    ],
    returns: "null",
  },
  {
    name: "open_skill_track",
    kind: "write",
    params: [
      { name: "track_id", type: "string" },
      { name: "skill_name", type: "string" },
      { name: "market_role", type: "string" },
      { name: "target_level", type: "string" },
      { name: "standard_url", type: "string" },
      { name: "claim_statement", type: "string" },
    ],
    returns: "null",
  },
  {
    name: "publish_skill_credential",
    kind: "write",
    params: [{ name: "track_id", type: "string" }],
    returns: "null",
  },
  {
    name: "recalibrate_skill",
    kind: "write",
    params: [{ name: "track_id", type: "string" }],
    returns: "null",
  },
  {
    name: "register_passport",
    kind: "write",
    params: [
      { name: "passport_id", type: "string" },
      { name: "display_name", type: "string" },
      { name: "profile_url", type: "string" },
    ],
    returns: "null",
  },
  {
    name: "retire_skill_credential",
    kind: "write",
    params: [
      { name: "track_id", type: "string" },
      { name: "reason", type: "string" },
    ],
    returns: "null",
  },
  {
    name: "update_passport_profile",
    kind: "write",
    params: [
      { name: "display_name", type: "string" },
      { name: "profile_url", type: "string" },
    ],
    returns: "null",
  },
  {
    name: "weave_work_sample",
    kind: "write",
    params: [
      { name: "track_id", type: "string" },
      { name: "sample_id", type: "string" },
      { name: "title", type: "string" },
      { name: "source_url", type: "string" },
      { name: "medium", type: "string" },
      { name: "capability", type: "string" },
      { name: "authorship_note", type: "string" },
    ],
    returns: "null",
  },
] as const satisfies readonly ContractMethod[];
