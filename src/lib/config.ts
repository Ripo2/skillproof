export const appConfig = {
  projectId: "11-skillproof",
  name: "SkillProof",
  network: "GenLayer Studionet",
  chainId: 61999,
  routes: [
    { href: "/", label: "Entry", index: "01" },
    { href: "/proofroom", label: "Proof room", index: "02" },
    { href: "/passport", label: "Passport", index: "03" },
  ],
  levels: ["ENTRY", "INTERMEDIATE", "ADVANCED", "EXPERT"],
  media: ["GITHUB", "PORTFOLIO", "VIDEO", "ARTICLE", "DESIGN", "OTHER"],
  states: [
    "DRAFT",
    "COLLECTING_PROOF",
    "BRAID_FROZEN",
    "CHALLENGE_WINDOW",
    "CHALLENGED",
    "PUBLISHED",
    "RETIRED",
  ],
} as const;

export const defaultCharter =
  "Assess observable work quality, complexity, consistency, authorship signals, and alignment with the cited market standard. Popularity and self-description must never substitute for attributable evidence.";
