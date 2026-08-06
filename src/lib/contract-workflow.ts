"use client";

import { useMemo, useState } from "react";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { contractAddress } from "@/lib/deployment";
import { useContractWrite } from "@/lib/genlayer";
import { skillProofWrites } from "@/lib/skillproof-client";
import type { Assessment } from "@/lib/types";

const client = createClient({ chain: studionet });

const stations = [
  { name: "identity", label: "Identity seal", index: "A" },
  { name: "track", label: "Skill track", index: "B" },
  { name: "evidence", label: "Work sample", index: "C" },
  { name: "protocol", label: "Scoring charter", index: "D" },
] as const;

export type ProofStation = (typeof stations)[number]["name"];

export function useContractWorkflow(initialStation: ProofStation = "evidence") {
  const [selected, setSelected] = useState<ProofStation>(initialStation);
  const [lastRead, setLastRead] = useState<Assessment | null>(null);
  const [localError, setLocalError] = useState("");
  const transaction = useContractWrite();
  const actions = useMemo(
    () => skillProofWrites(transaction.write),
    [transaction.write],
  );

  async function refreshAssessment(trackId: string) {
    if (!contractAddress) return null;
    setLocalError("");
    try {
      const result = await client.readContract({
        address: contractAddress,
        functionName: "get_latest_assessment",
        args: [trackId],
        jsonSafeReturn: true,
      });
      const assessment = result as unknown as Assessment;
      setLastRead(assessment);
      return assessment;
    } catch (cause) {
      setLocalError(
        cause instanceof Error ? cause.message : "Assessment refresh failed.",
      );
      return null;
    }
  }

  return {
    methods: stations,
    selected,
    choose: setSelected,
    actions,
    transaction,
    lastRead,
    localError,
    refreshAssessment,
  };
}
