# SkillProof Contract Specification

## Problem and GenLayer boundary

Professional claims are difficult to trust when repositories, portfolios,
videos, and articles are reviewed without a shared standard or durable
assessment history. Deterministic code owns passport identity, proof topology,
permissions, state transitions, and immutable generations. GenLayer evaluates
the bounded public work against the claimant's cited market standard.

## Actors and permissions

- `protocol_curator`: configures the protocol name and scoring charter.
- `passport_owner`: controls one passport, its skill tracks, and work samples.
- `challenger`: any account other than the track owner may attach one public
  counter-source to an assessment generation.
- `validator`: independently reads public evidence and settles the normalized
  assessment through GenLayer consensus.
- `public_reader`: reads passports, proof braids, generations, challenges, and
  audit events without write authority.

The contract does not issue transferable tokens, move value, or delegate
passport ownership.

## Canonical primitive

The source of truth is a triadic proof braid. Every link joins exactly:

1. one claimant-owned skill track;
2. one attributable public work sample;
3. one normalized capability tag.

The contract stores track, sample, and capability axes in separate edge maps
with explicit head, tail, and successor links. Related identifiers are not
embedded in a generic child array.

## State machine

```text
DRAFT
  -> COLLECTING_PROOF
  -> BRAID_FROZEN
  -> CHALLENGE_WINDOW
  -> CHALLENGED
  -> CHALLENGE_WINDOW
  -> PUBLISHED
  -> RETIRED
```

`MORE_EVIDENCE_REQUIRED` may return `CHALLENGE_WINDOW` to
`COLLECTING_PROOF`. A published generation may be challenged, which clears the
active publication pointer until recalibration. Retirement is irreversible.

## Reasoning inputs and output

Inputs include the frozen proof links, each bounded public work page, the
market-standard page, authorship notes, prior generations, and any challenge
or response sources. Source pages are untrusted and embedded instructions are
ignored.

Normalized output:

```json
{
  "credibility_score": 0,
  "evidence_coverage": 0,
  "rubric_digest": "bounded text",
  "capability_findings": [
    {
      "capability": "normalized-tag",
      "finding": "DEMONSTRATED|EMERGING|UNSUPPORTED",
      "score": 0,
      "reason": "bounded text"
    }
  ],
  "summary": "bounded text"
}
```

The custom validator requires exact result and level agreement, bounded score
and coverage differences, and exact capability findings. Insufficient,
inaccessible, malformed, or inconclusive evidence becomes
`MORE_EVIDENCE_REQUIRED`.

## Recovery and immutability

A non-owner may open a challenge with attributable counter-evidence. The owner
may answer once with a public response source. Recalibration appends a new
generation, resolves the challenge, and preserves the original generation.
Published credentials expose an immutable generation identifier. Retirement
changes the current state but does not erase any prior record.

## Frontend action map

- Identity seal: register and update a passport.
- Skill track composer: open one market-standard claim.
- Evidence ticket composer: weave a public sample into a capability strand.
- Score ribbon: freeze, calibrate, extend, publish, and retire.
- Assessment transcript: inspect the latest immutable generation.
- Counter-evidence channel: challenge, answer, and recalibrate.
- Public passport reader: inspect all indexed reads without a generic method
  registry.

## Negative test matrix

Tests cover curator authority, private or malformed URLs, duplicate passports,
owner restrictions, minimum braid diversity, edge replay, neutral
calibration, publication eligibility, self-challenges, immutable
recalibration, retirement finality, indexed bootstrap reads, and audit order.
