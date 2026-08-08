"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { deploymentReady } from "@/lib/deployment";
import { protocolQueryKey } from "@/lib/genlayer";
import {
  previewAssessment,
  previewBootstrap,
  previewBraid,
  previewEvents,
  previewPassport,
  previewProtocol,
  previewTrack,
} from "@/lib/preview-data";
import { skillProofReads } from "@/lib/skillproof-client";
import type {
  Assessment,
  Passport,
  PassportEvent,
  ProofBraid,
  ProtocolConfig,
  SkillProofBootstrap,
  SkillTrack,
} from "@/lib/types";

export function useSkillProofBootstrap() {
  const query = useQuery({
    queryKey: protocolQueryKey,
    queryFn: skillProofReads.bootstrap,
    enabled: deploymentReady,
  });
  return {
    ...query,
    data: (query.data ?? previewBootstrap) as SkillProofBootstrap,
    dataMode: deploymentReady ? ("onchain" as const) : ("preview" as const),
  };
}

export function useProtocolConfig() {
  const query = useQuery({
    queryKey: ["11-skillproof", "protocol"],
    queryFn: skillProofReads.protocol,
    enabled: deploymentReady,
  });
  return {
    ...query,
    data: (query.data ?? previewProtocol) as ProtocolConfig,
  };
}

export function useOwnerPassport() {
  const { address } = useAccount();
  const query = useQuery({
    queryKey: ["11-skillproof", "passport", address],
    queryFn: () => skillProofReads.passportByOwner(address!),
    enabled: deploymentReady && Boolean(address),
  });
  return {
    ...query,
    data: (query.data ??
      (!deploymentReady ? previewPassport : undefined)) as Passport | undefined,
  };
}

export function useProofWorkspace(trackId: string) {
  const preview = !deploymentReady || trackId === previewTrack.track_id;
  const query = useQuery({
    queryKey: ["11-skillproof", "workspace", trackId],
    queryFn: async () => {
      const [track, braid, assessment, audit] = await Promise.all([
        skillProofReads.track(trackId),
        skillProofReads.braid(trackId),
        skillProofReads.latestAssessment(trackId),
        skillProofReads.audit(trackId),
      ]);
      return { track, braid, assessment, audit };
    },
    enabled: deploymentReady && Boolean(trackId),
  });
  const fallback: {
    track: SkillTrack;
    braid: ProofBraid;
    assessment: Assessment;
    audit: PassportEvent[];
  } | undefined = preview
    ? {
        track: previewTrack,
        braid: previewBraid,
        assessment: previewAssessment,
        audit: previewEvents,
      }
    : undefined;
  return {
    ...query,
    data: query.data ?? fallback,
    dataMode: deploymentReady ? ("onchain" as const) : ("preview" as const),
  };
}
