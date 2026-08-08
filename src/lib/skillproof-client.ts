import { readContract } from "@/lib/genlayer";
import type {
  Assessment,
  Passport,
  PassportEvent,
  ProofBraid,
  ProtocolConfig,
  ScoreChallenge,
  SkillProofBootstrap,
  SkillTrack,
  WorkSample,
} from "@/lib/types";

export const skillProofReads = {
  protocol: () =>
    readContract<ProtocolConfig>("get_protocol_config"),
  bootstrap: () =>
    readContract<SkillProofBootstrap>("get_frontend_bootstrap"),
  passport: (passportId: string) =>
    readContract<Passport>("get_passport", [passportId]),
  passportByOwner: (owner: `0x${string}`) =>
    readContract<Passport>("get_passport_by_owner", [owner]),
  track: (trackId: string) =>
    readContract<SkillTrack>("get_skill_track", [trackId]),
  sample: (sampleId: string) =>
    readContract<WorkSample>("get_work_sample", [sampleId]),
  braid: (trackId: string) =>
    readContract<ProofBraid>("get_proof_braid", [trackId]),
  generation: (generationId: string) =>
    readContract<Assessment>("get_assessment_generation", [generationId]),
  latestAssessment: (trackId: string) =>
    readContract<Assessment>("get_latest_assessment", [trackId]),
  challenge: (challengeId: string) =>
    readContract<ScoreChallenge>("get_score_challenge", [challengeId]),
  ownerTracks: (owner: `0x${string}`, offset = 0, limit = 20) =>
    readContract<SkillTrack[]>("get_owner_tracks", [owner, offset, limit]),
  tracksByState: (state: string, offset = 0, limit = 20) =>
    readContract<SkillTrack[]>("get_tracks_by_state", [state, offset, limit]),
  audit: (trackId: string, offset = 0, limit = 30) =>
    readContract<PassportEvent[]>("get_audit_slice", [trackId, offset, limit]),
};

export type SkillProofWriter = (
  action: string,
  functionName: string,
  args: unknown[],
) => Promise<unknown>;

export function skillProofWrites(write: SkillProofWriter) {
  return {
    configureProtocol: (protocolName: string, scoringCharter: string) =>
      write("Configure scoring charter", "configure_protocol", [
        protocolName,
        scoringCharter,
      ]),
    registerPassport: (
      passportId: string,
      displayName: string,
      profileUrl: string,
    ) =>
      write("Register passport", "register_passport", [
        passportId,
        displayName,
        profileUrl,
      ]),
    updatePassport: (displayName: string, profileUrl: string) =>
      write("Update passport profile", "update_passport_profile", [
        displayName,
        profileUrl,
      ]),
    openTrack: (
      trackId: string,
      skillName: string,
      marketRole: string,
      targetLevel: string,
      standardUrl: string,
      claimStatement: string,
    ) =>
      write("Open skill track", "open_skill_track", [
        trackId,
        skillName,
        marketRole,
        targetLevel,
        standardUrl,
        claimStatement,
      ]),
    weaveSample: (
      trackId: string,
      sampleId: string,
      title: string,
      sourceUrl: string,
      medium: string,
      capability: string,
      authorshipNote: string,
    ) =>
      write("Weave work sample", "weave_work_sample", [
        trackId,
        sampleId,
        title,
        sourceUrl,
        medium,
        capability,
        authorshipNote,
      ]),
    freezeBraid: (trackId: string) =>
      write("Freeze proof braid", "freeze_proof_braid", [trackId]),
    calibrateSkill: (trackId: string) =>
      write("Calibrate skill", "calibrate_skill", [trackId]),
    extendBraid: (trackId: string) =>
      write("Extend proof braid", "extend_proof_braid", [trackId]),
    openChallenge: (
      trackId: string,
      challengeId: string,
      counterUrl: string,
      reason: string,
    ) =>
      write("Open score challenge", "open_score_challenge", [
        trackId,
        challengeId,
        counterUrl,
        reason,
      ]),
    answerChallenge: (
      challengeId: string,
      responseUrl: string,
      responseNote: string,
    ) =>
      write("Answer score challenge", "answer_score_challenge", [
        challengeId,
        responseUrl,
        responseNote,
      ]),
    recalibrateSkill: (trackId: string) =>
      write("Recalibrate skill", "recalibrate_skill", [trackId]),
    publishCredential: (trackId: string) =>
      write("Publish credential", "publish_skill_credential", [trackId]),
    retireCredential: (trackId: string, reason: string) =>
      write("Retire credential", "retire_skill_credential", [trackId, reason]),
  };
}

