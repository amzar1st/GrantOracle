# Milestone v1: source comparison and review provenance

Prepared 2026-11-21 for the steward request on GrantOracle v1 · Independent Evidence Audits.

## What is established, and what remains missing

The exact candidate baseline is [`b843cb9bfebb88bdb241b975825d79abb6244076`](https://github.com/amzar1st/GrantOracle/tree/b843cb9bfebb88bdb241b975825d79abb6244076). The exact milestone implementation is [`b99d6b199e60badc1806912d403e972b1ee22cdc`](https://github.com/amzar1st/GrantOracle/tree/b99d6b199e60badc1806912d403e972b1ee22cdc). [The immutable comparison](https://github.com/amzar1st/GrantOracle/compare/b843cb9bfebb88bdb241b975825d79abb6244076...b99d6b199e60badc1806912d403e972b1ee22cdc) contains one commit, five changed files, 201 additions and one deletion. The baseline is the implementation commit's direct parent and the current PR #1 base.

**The original Project's reviewed source state is not established by the available evidence.** No original submission attachment, steward review record, or historical deployment provenance binding that review to this commit was found. A parent relationship, a commit date, today's branch tip, CI, and a newly created document cannot supply that missing binding. This packet supplies a reproducible comparison against the candidate, not an assertion that it was reviewed or that novelty/materiality has been accepted.

## Immutable source and historical evidence

| Item | Commit-pinned evidence | What it establishes |
| --- | --- | --- |
| Candidate baseline source | [Complete tree](https://github.com/amzar1st/GrantOracle/tree/b843cb9bfebb88bdb241b975825d79abb6244076) · [source archive](https://github.com/amzar1st/GrantOracle/archive/b843cb9bfebb88bdb241b975825d79abb6244076.zip) | Exact recoverable source bytes; not review identity |
| Original project submission instructions | [docs/SUBMISSION.md](https://github.com/amzar1st/GrantOracle/blob/b843cb9bfebb88bdb241b975825d79abb6244076/docs/SUBMISSION.md) | Historical proposed description and links; source link uses the repository root, not an immutable review pin |
| Original frontend | [web/app.js](https://github.com/amzar1st/GrantOracle/blob/b843cb9bfebb88bdb241b975825d79abb6244076/web/app.js) | Existing read path, source display and pre-submission hasher |
| Original execution evidence | [docs/EVIDENCE.md](https://github.com/amzar1st/GrantOracle/blob/b843cb9bfebb88bdb241b975825d79abb6244076/docs/EVIDENCE.md) | Pre-existing demonstrations; these are not new milestone transactions |
| Original CI record | [ci-result.json](https://github.com/amzar1st/GrantOracle/blob/b843cb9bfebb88bdb241b975825d79abb6244076/docs/evidence/ci-result.json) · [run 40512733538](https://github.com/amzar1st/GrantOracle/actions/runs/40512733538) | Successful CI at c1775c8fc516053d1d544fdc5b18c7ce7bd455f9 |
| Milestone implementation | [commit](https://github.com/amzar1st/GrantOracle/commit/b99d6b199e60badc1806912d403e972b1ee22cdc) · [documentation](https://github.com/amzar1st/GrantOracle/blob/b99d6b199e60badc1806912d403e972b1ee22cdc/docs/MILESTONE_V1.md) | Exact implementation under assessment |
| Milestone CI | [run 41798040417](https://github.com/amzar1st/GrantOracle/actions/runs/41798040417) | GitHub reports successful CI for the milestone head |

The baseline commit changes only docs/EVIDENCE.md, docs/SUBMISSION.md, docs/evidence/browser-flow.json, docs/evidence/browser-handoff.jpg and docs/evidence/ci-result.json relative to c1775c8fc516053d1d544fdc5b18c7ce7bd455f9. Git blob identities for web/**, public/**, index.html, package.json, package-lock.json and vite.config.js are identical at those two commits. That establishes frontend source equivalence to the earlier tested commit; it does not prove which deployment or commit the steward reviewed.

## Before/after and overlap

| Capability | Candidate baseline | Milestone head | Assessment scope |
| --- | --- | --- | --- |
| Validator retrieval and hash checks | Already implemented in the contract | Unchanged | Existing Project functionality |
| Local exact-byte SHA-256 helper | Hash & append file already present for preparing evidence | Still present | Existing Project functionality |
| Finalized grant browsing | Wallet-free reads and raw record inspection already present | Reused | Existing Project functionality |
| Validator-recorded source fingerprints | Expected/retrieved hashes already displayed | Still displayed | Existing Project functionality |
| Independent audit of recorded evidence | No dedicated audit action | Run audit re-fetches commitments across submission, challenge and rebuttal; per-file match/error results | Incremental frontend functionality |
| Downloadable audit report | No dedicated JSON audit export | Grant snapshot, deployment identifiers, read mode, timestamp and file results exported | Incremental frontend functionality |
| Settlement, disputes and escrow | Already implemented | No changes | No new contract/consensus/settlement claim |

A concrete change: an unsigned reviewer can open grant #7, audit all three recorded stages, see the submission mismatch alongside two matches, and export the observations without preparing a new evidence submission. This is an independent browser observation, not a new consensus verdict or settlement receipt. The core hash operation already existed. Materiality is for the steward to assess after resolving the reviewed baseline.

## Exact implementation diff

| Path | Status | Added | Removed | Purpose |
| --- | --- | ---: | ---: | --- |
| [docs/MILESTONE_V1.md](https://github.com/amzar1st/GrantOracle/blob/b99d6b199e60badc1806912d403e972b1ee22cdc/docs/MILESTONE_V1.md) | added | 16 | 0 | Reproduction and limits |
| [tests/evidence-audit.test.mjs](https://github.com/amzar1st/GrantOracle/blob/b99d6b199e60badc1806912d403e972b1ee22cdc/tests/evidence-audit.test.mjs) | added | 61 | 0 | Four audit tests |
| [web/app.js](https://github.com/amzar1st/GrantOracle/blob/b99d6b199e60badc1806912d403e972b1ee22cdc/web/app.js) | modified | 50 | 1 | Audit action, results and JSON download |
| [web/evidence-audit.js](https://github.com/amzar1st/GrantOracle/blob/b99d6b199e60badc1806912d403e972b1ee22cdc/web/evidence-audit.js) | added | 69 | 0 | Commit validation, bounded retrieval, exact-byte hash and report |
| [web/style.css](https://github.com/amzar1st/GrantOracle/blob/b99d6b199e60badc1806912d403e972b1ee22cdc/web/style.css) | modified | 5 | 0 | Audit panel styling |

All other tracked file blobs are unchanged, including contracts/grant_oracle.py, web/deployment.json, web/lifecycle.js, package.json, package-lock.json and the original evidence archive. [The machine-readable manifest](evidence/milestone-v1-source-comparison.json) lists every file blob in both states. Git blob SHA-1 identities must not be confused with the evidence checker's raw-byte SHA-256 hashes.

## Reproduce the comparison

```sh
git clone https://github.com/amzar1st/GrantOracle.git
cd GrantOracle
git fetch origin b843cb9bfebb88bdb241b975825d79abb6244076 b99d6b199e60badc1806912d403e972b1ee22cdc
git rev-parse b99d6b199e60badc1806912d403e972b1ee22cdc^
git diff --stat b843cb9bfebb88bdb241b975825d79abb6244076 b99d6b199e60badc1806912d403e972b1ee22cdc
git diff b843cb9bfebb88bdb241b975825d79abb6244076 b99d6b199e60badc1806912d403e972b1ee22cdc -- contracts/grant_oracle.py web/deployment.json package.json package-lock.json
git diff b843cb9bfebb88bdb241b975825d79abb6244076 b99d6b199e60badc1806912d403e972b1ee22cdc -- web/app.js web/evidence-audit.js tests/evidence-audit.test.mjs web/style.css docs/MILESTONE_V1.md
git checkout --detach b99d6b199e60badc1806912d403e972b1ee22cdc
npm ci
npm test
npm run build
```

Expected parent: b843cb9bfebb88bdb241b975825d79abb6244076. Expected stat: five files, 201 insertions, one deletion. The contract/deployment/dependency diff is empty.

On 2026-11-21 the two frontend test files and imported local modules were retrieved from the pinned head and run with Node v24.22.3: **20 tests passed, zero failed**. This was a frontend test rerun; the build and Python tests were not rerun in this investigation. GitHub's existing CI runs separately report success.

For the archived example, read scenarios[id="7"].final in [live-scenarios.json](https://github.com/amzar1st/GrantOracle/blob/b99d6b199e60badc1806912d403e972b1ee22cdc/docs/evidence/live-scenarios.json). Its submission commits 64 zeroes; challenge and rebuttal commit fb29b7b407438554a54a59c95f726bc1deda3403303a4340aeb8cb1facc8b28a, all for the same payment_gate.py at 4bb1a32ce516a5205e5f474258923868d16d9c0d. The archive already includes validator observations of one mismatch and two valid hashes. This is historical evidence and a reproduction input; this investigation makes no fresh live-chain verification claim. StudioNet can reset.

## Evidence needed to complete the steward request

Provide the original linked Project page URL and its review/submission record or attachment that pins the source commit, or a historical deployed-version record with source provenance tied to that reviewed project. If it identifies another commit, compare that exact state to the fixed milestone head instead.

A new tag, this packet, an owner statement made today, or a screenshot without source provenance cannot retrospectively prove the reviewed version. If no historical binding can be recovered, disclose that and ask whether the steward can supply the source snapshot from the original review. No acceptance or deadline extension is implied.
