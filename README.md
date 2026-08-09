# SkillProof

> A professional claim should be backed by inspectable work, not only a line on
> a resume.

SkillProof is a GenLayer application for decentralized professional skill
verification. A professional weaves public repositories, portfolios, videos,
design work, and articles into capability strands. Validators compare the
frozen proof braid with a cited market standard and settle an on-chain
credibility score, level, and evidence-coverage record.

## What Makes It Different

The contract does not store a generic case with evidence IDs. Its canonical
primitive is a **triadic proof braid**: every link binds one skill track, one
public work sample, and one capability. Assessments are immutable generations.
A public challenge can trigger a new generation without rewriting the prior
score.

## Product Surfaces

- `/` exposes the protocol provenance and the actual proof interaction model.
- `/proofroom` assembles evidence, freezes the braid, calibrates the skill,
  handles challenges, and publishes a credential.
- `/passport` gives hiring reviewers and clients a public credential reader.

There is no standalone contract page, filler route, or generic method table.
All 26 public methods are integrated into the product workflow.

## Credibility Lifecycle

```text
Passport
  -> Skill track
  -> Work sample + capability links
  -> Frozen proof braid
  -> GenLayer calibration
  -> Challenge window
  -> Published credential or more evidence required
  -> Optional challenge and immutable recalibration
  -> Retirement
```

`MORE_EVIDENCE_REQUIRED` is the conservative fallback. It cannot be published
as a credential.

## Local Development

```powershell
npm install
npm run dev
```

The local app uses port `4408`.

Verification:

```powershell
npm run typecheck
npm test
npm run test:studionet
npm run build
```

Install the GenLayer direct-test dependencies in your Python environment, then run from the project folder:

```powershell
python -m pip install pytest genlayer-test
python -m pytest tests\direct -q
```

## Deployment Status

The contract has passed GenVM lint, 16 direct tests, the architecture audit,
the intelligent-contract source gate, and three live Studionet integration
tests. It is deployed, configured, and connected to the frontend. A dedicated
encrypted protocol wallet owns the deployment; no private key or wallet
password is stored in this repository or shipped to the browser.

**Network:** GenLayer Studionet  
**Chain ID:** `61999`  
**Contract:** `0xe1A1f1695B804b16b9B5154F9f0E73FDB20E73f6`  
**Protocol wallet:** `0xb5be8fA2916Ff4c8C0FC9c6bcF253Ac82C830889`  
**Deployment transaction:** `0xa3c15763b571a9cf7c3c63171f329e920ccc3593624637ecb12235be3722675b`  
**Configuration transaction:** `0x12214c8928fba8311510b7752ada0a76bfb4895c3827eead7b3c8864bca40397`  
**Smoke-test transaction:** `0xfdf361ab1f4caf8ba49c0fb1f3572f8ca913b4bd686bf786108465039d3adb4a`  
**Smoke-test record:** `skillproof-studionet`  
**Public methods:** `26`  
**Current stage:** `deployed`
