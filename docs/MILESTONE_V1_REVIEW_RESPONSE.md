# Milestone v1: source comparison and review provenance

Prepared 2026-11-21 for the steward request on GrantOracle v1 · Independent Evidence Audits.

## What is established, and what remains missing

The exact candidate baseline is [`b843cb9bfebb88bdb241b975825d79abb6244076`](https://github.com/amzar1st/GrantOracle/tree/b843cb9bfebb88bdb241b975825d79abb6244076). The exact milestone implementation is [`b99d6b199e60badc1806912d403e972b1ee22cdc`](https://github.com/amzar1st/GrantOracle/tree/b99d6b199e60badc1806912d403e972b1ee22cdc). [The immutable comparison](https://github.com/amzar1st/GrantOracle/compare/b843cb9bfebb88bdb241b975825d79abb6244076...b99d6b199e60badc1806912d403e972b1ee22cdc) contains one commit, five changed files, 201 additions and one deletion. The baseline is the implementation commit's direct parent and the current PR #1 base.

**The accepted Project now has an evidence-linked immutable source anchor:** the original submission text supplied by the owner on 2026-11-21 lists CI run [40512733538](https://github.com/amzar1st/GrantOracle/actions/runs/40512733538), which GitHub independently identifies as source commit [`c1775c8fc516053d1d544fdc5b18c7ce7bd455f9`](https://github.com/amzar1st/GrantOracle/tree/c1775c8fc516053d1d544fdc5b18c7ce7bd455f9). That commit's frontend source is byte-identical to the candidate baseline. This is stronger than inferring the baseline from dates or today's branch tip.

**Remaining distinction:** the supplied acceptance record does not explicitly state that the steward inspected the entire repository at `b843cb9bfebb88bdb241b975825d79abb6244076`. The original file evidence URL uses `main`, a mutable branch. The CI commit is pinned by a submitted evidence item, while the exact source version the steward viewed remains unconfirmed. This packet does not claim acceptance of novelty or materiality.

## Accepted Project record supplied by the owner

The owner provided the following portal text on 2026-11-21; the portal page URL/full record ID was not provided, so its acceptance metadata is owner-supplied rather than independently retrieved:

| Field | Supplied value |
| --- | --- |
| Contribution | Builder → Projects → GrantOracle |
| Status | Accepted |
| Submitted / reviewed / last updated | October 30, 2026 |
| Award | 280 points |
| Partial record ID | bbc1b4ed… (incomplete; not a full identifier) |
| Staff response | Your project is accepted, thank you for contributing. |

The five original evidence links were:

1. [Recipient transfer](https://explorer-studio.genlayer.com/tx/0x4a498128019f5c4045981f5cfcf1ce708bfa1f62136850e4ca7c6e5a7854285d)
2. [Contract deployment](https://explorer-studio.genlayer.com/tx/0x1edc039af42866c5f2ee449be43ac3988e2c4625afa8a4c81606484c13845e23)
3. [CI run 40512733538](https://github.com/amzar1st/GrantOracle/actions/runs/40512733538)
4. [Original evidence document using mutable main](https://github.com/amzar1st/GrantOracle/blob/main/docs/EVIDENCE.md)
5. [Repository root](https://github.com/amzar1st/GrantOracle)

The accepted description covers the original escrow, validator retrieval/hash checks, criterion assessment, challenge/rebuttal, payment/refund and frontend functionality. Those capabilities overlap the milestone's foundation and are excluded from the incremental claim below.

## Comparison anchored to the submitted CI evidence

The [GitHub run metadata](https://api.github.com/repos/amzar1st/GrantOracle/actions/runs/40512733538) was checked on 2026-11-21: `head_sha=c1775c8fc516053d1d544fdc5b18c7ce7bd455f9`, `status=completed`, `conclusion=success`, created 2026-10-27T13:31:13Z.

| Comparison | Result |
| --- | --- |
| [Submitted CI source → candidate baseline](https://github.com/amzar1st/GrantOracle/compare/c1775c8fc516053d1d544fdc5b18c7ce7bd455f9...b843cb9bfebb88bdb241b975825d79abb6244076) | One commit; five documentation/evidence files, +85/-8; no frontend or contract changes |
| [Submitted CI source → fixed milestone head](https://github.com/amzar1st/GrantOracle/compare/c1775c8fc516053d1d544fdc5b18c7ce7bd455f9...b99d6b199e60badc1806912d403e972b1ee22cdc) | Two commits; ten files, +286/-9; includes the five historical documentation/evidence updates plus the five milestone files |
| [Candidate baseline → fixed milestone head](https://github.com/amzar1st/GrantOracle/compare/b843cb9bfebb88bdb241b975825d79abb6244076...b99d6b199e60badc1806912d403e972b1ee22cdc) | One commit; five milestone files, +201/-1 |

The historical documentation/evidence updates are docs/EVIDENCE.md, docs/SUBMISSION.md, docs/evidence/browser-flow.json, docs/evidence/browser-handoff.jpg and docs/evidence/ci-result.json. They are explicitly separated from the milestone implementation; this packet does not claim them as new milestone work.

The identical frontend blobs at the CI commit and candidate baseline provide an exact frontend source comparison from the original submitted CI evidence to the milestone. They do not, by themselves, establish which full repository snapshot the steward viewed. The steward can cross-check the original portal record's CI link directly.

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

The supplied accepted record now identifies an original submitted CI evidence item, which pins the tested source and establishes exact frontend equivalence. Attach the original portal record or its URL alongside this packet so the steward can verify that link. To establish the exact complete repository snapshot reviewed (rather than the submitted CI frontend state), request confirmation of the steward's retained snapshot or supply historical deployment provenance. If it identifies another commit, compare that exact state to the fixed milestone head instead.

A new tag, this packet, an owner statement made today, or a screenshot without source provenance cannot retrospectively prove the reviewed version. If no historical binding can be recovered, disclose that and ask whether the steward can supply the source snapshot from the original review. No acceptance or deadline extension is implied.
