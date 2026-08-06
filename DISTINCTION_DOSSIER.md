# SkillProof Distinction Dossier

Status: contract-first candidate

## Product

- App ID: `11-skillproof`
- Product name: SkillProof
- One-sentence problem: Professional claims are difficult to trust when portfolios, repositories, videos, and articles are reviewed without a shared market standard or durable assessment history.
- Target operator: Independent professionals, job applicants, hiring reviewers, and clients evaluating demonstrated capability.
- Primary domain object: Skill track.
- Secondary domain objects: Passport, work sample, capability strand, assessment generation, score challenge, and published credential.

## Contract Architecture

- Canonical storage primitive: Triadic proof braid.
- Relationship topology: Every braid link joins exactly one skill track, one public work sample, and one capability tag; append-only assessment generations settle over the frozen braid.
- Canonical source of truth: `braid_track_links`, `braid_sample_links`, `braid_capability_links`, `track_braid_heads`, and immutable generation slots.
- State machine: `DRAFT -> COLLECTING_PROOF -> BRAID_FROZEN -> CALIBRATING -> SCORED_OR_UNPROVEN -> CHALLENGE_WINDOW -> CHALLENGED -> RECALIBRATING -> PUBLISHED -> RETIRED`.
- Roles and permissions: A passport owner controls their skill tracks and samples. Any other account may open one attributable score challenge with a public counter-source. Validators independently assess evidence through GenLayer consensus. Public readers have no write authority.
- Consensus question: Do the frozen public work samples substantively demonstrate the claimed capability against the cited market standard, and what bounded credibility score and level are supported?
- Trusted evidence: Onchain ownership, timestamps, frozen braid links, prior assessment generations, and explicit state transitions.
- Untrusted evidence: Portfolio pages, repositories, videos, articles, benchmark pages, authorship notes, market standards, and challenge pages. Embedded instructions are ignored.
- Neutral fallback: `MORE_EVIDENCE_REQUIRED` with no publishable credential.
- Challenge or recovery path: A non-owner may attach attributable counter-evidence during the challenge window. The claimant may attach one response source. Recalibration appends a new immutable generation and preserves the prior result.
- Immutable final record: Every assessment generation, challenge, response, score, level, rubric digest, and publication decision remains addressable after supersession or retirement.

## Public API Vocabulary

Domain writes:

- `register_passport`
- `open_skill_track`
- `weave_work_sample`
- `freeze_proof_braid`
- `calibrate_skill`
- `open_score_challenge`
- `answer_score_challenge`
- `recalibrate_skill`
- `publish_skill_credential`
- `retire_skill_credential`

Domain reads:

- `get_passport`
- `get_skill_track`
- `get_work_sample`
- `get_proof_braid`
- `get_assessment_generation`
- `get_latest_assessment`
- `get_score_challenge`
- `get_owner_tracks`
- `get_tracks_by_state`
- `get_frontend_bootstrap`
- `get_audit_slice`

## Critical Invariants

- One account has at most one passport.
- A work sample URL must be public HTTPS and cannot be replayed inside the same track.
- Every braid link binds one track, one sample, and one normalized capability.
- A frozen braid cannot accept additional samples.
- Calibration is impossible without a market-standard URL and at least two work samples across two capability tags.
- Validators must agree on result and level; numeric scores may differ only within a bounded tolerance.
- A neutral generation cannot be published as a credential.
- The claimant cannot challenge their own score.
- Recalibration appends a generation and never mutates the prior assessment.
- A published credential is non-transferable and retirement is irreversible.

## Frontend Direction

- Frontend information architecture: Public product entry, applicant proof room, and recruiter-facing passport viewer.
- Primary interaction model: Assemble a horizontal evidence reel, then weave each work sample into capability strands before freezing the braid.
- Product species: Professional evidence audition studio.
- Skeleton: Proof-stage triptych.
- Composition: Capability ruler, central evidence reel, and assessment transcript.
- Navigation: Compact top identity strip plus route switcher embedded in the score ribbon.
- Typography family: Geometric grotesk paired with a technical monospace.
- Color system: High-contrast off-white, graphite, signal coral, mineral blue, and chartreuse accents; no palette from the first ten apps is reused.
- Motion system: Evidence links tighten into the frozen braid; reduced-motion mode uses instant state changes.
- Mobile model: Evidence reel becomes a vertical sample queue, the capability ruler becomes a horizontal segmented control, and the transcript follows the active sample.
- Planned routes:
  - `/`: Product entry and current protocol provenance.
  - `/proofroom`: Build, freeze, calibrate, challenge, and publish a skill track.
  - `/passport`: Inspect published skill credentials and assessment generations.

## Nearest Catalog Comparison

### TenderTrace

Similarity: Both compare public evidence with an external standard.

Structural difference: TenderTrace settles requirement cells in a sparse procurement matrix for one sealed bid. SkillProof stores triadic claim-sample-capability links and appends score generations to a claimant-owned professional passport. It produces a bounded credibility profile, not eligibility.

### ReproLab

Similarity: Both inspect public work artifacts and preserve review history.

Structural difference: ReproLab is an ordinal protocol/run matrix whose conclusion concerns reproducibility. SkillProof weaves heterogeneous portfolio artifacts into capability strands and issues a reusable, non-transferable credential generation.

### Labelwise

Similarity: Both use relationships between a primary record and evidence-bearing child records.

Structural difference: Labelwise is a formula-ingredient-allergen bipartite graph with conflict correction. SkillProof requires triadic hyperedges and settles over an immutable assessment-generation series with public score challenges.

SkillProof cannot be implemented as a feature of these products because its ownership boundary is a professional passport, its canonical primitive is a proof braid, and its settlement effect is a reusable skill credential.

## Resources

- Selected for consideration: PixiJS for a code-native proof braid map, Motion for restrained state transitions, Lucide for tool icons, RainbowKit for explicit wallet actions, and the user-provided design resource catalog for art-direction comparison.
- Rejected: Three.js and React Three Fiber because 3D does not improve evidence inspection; D3 because it is already prominent in Frostline and RecallDesk; Konva because Labelwise already owns the canvas-sheet treatment; generated imagery because the user prohibited generated images for these apps.
