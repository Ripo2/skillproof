# SkillProof Security

- One wallet may register at most one non-transferable passport.
- Every contract write requires an explicitly connected wallet.
- The frontend waits for `TransactionStatus.FINALIZED` and verifies
  `MAJORITY_AGREE` before reporting success.
- Public evidence must use HTTPS and cannot target local, loopback, or private
  network hosts.
- Work sample URLs are replay-protected inside the ownership boundary.
- Fetched pages are untrusted evidence. Validator prompts explicitly ignore
  embedded instructions, popularity claims, and unsupported self-description.
- Invalid, inaccessible, or insufficient evidence resolves to
  `MORE_EVIDENCE_REQUIRED`, which cannot be published.
- A passport owner cannot challenge their own assessment.
- Recalibration appends a generation and never mutates the previous result.
- The browser bundle contains no private key, seed phrase, or wallet secret.
- Preview records are labeled as local interface demonstrations and are never
  represented as blockchain data.
