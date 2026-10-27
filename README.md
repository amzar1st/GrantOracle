# GrantOracle

**Evidence before payment.** GrantOracle helps grant funders and recipients agree on what completion means, independently verify deliverables, and authorize milestone payments only after evidence-based consensus and a dispute window.

[Open the public DApp](https://grantoracle.tinymule33.chatgpt.site/) · [Deployed contract](https://explorer-studio.genlayer.com/address/0xfC94797c8b1AA6d31023fE0C30ED60320F80Ca64) · [Deployment transaction](https://explorer-studio.genlayer.com/transactions/0x1edc039af42866c5f2ee449be43ac3988e2c4625afa8a4c81606484c13845e23)

![GrantOracle public website](docs/evidence/public-website.jpg)

## The trust problem

A team's progress report is not independent evidence that a funded deliverable exists. GrantOracle turns a grant milestone into an immutable acceptance rubric, a consented funding agreement, an evidence record both parties can inspect, and a consensus-controlled payment authorization.

GenLayer is central to settlement: validators independently retrieve the committed source files, verify their bytes, reason about each criterion, and compare results. A funder cannot simply approve its preferred answer or veto an unfavorable completed milestone. The website calls the deployed contract directly; it does not generate a local AI verdict or call a trusted adjudication server.

## What is implemented

- One reusable GenLayer Intelligent Contract supporting separate grants/milestones with immutable terms and recipient acceptance.
- Actual native-GEN deposits, reservation accounting, beneficiary-only withdrawal and refund messages on StudioNet.
- Commit-pinned files from the agreed GitHub repository, mandatory SHA-256 verification, bounded inputs and independent retrieval by validators.
- Per-criterion SUPPORTED / CONTRADICTED / UNKNOWN assessment, exact quotation checks and a separate semantic audit.
- Deterministic VERIFIED / PARTIALLY_COMPLETED / REJECTED / INCONCLUSIVE aggregation. Only VERIFIED can authorize the recipient's full payment.
- Custom equivalence comparing independently derived criterion outcomes and all source fingerprints, without requiring identical prose.
- One challenge round with counter-evidence, an opposing-party rebuttal window and a second independent review. Hard expiry recovers stalled grants.
- Domain-separated decision and authorization hashes; one-shot transfers; no administrator override.
- A public responsive frontend with grant creation, acceptance, exact funding, local evidence hashing, submission, review, challenges, rebuttals, finalization, expiry, withdrawals, source inspection and resumable transaction tracking.
- Studio built-in-account deployment and funding evidence. External browser signers are temporary SDK accounts, explicitly separate from Studio. No MetaMask is required.

## Verified demonstrations

The completed automated live suite uses full consensus, real web retrieval and real AI calls. All 25 parent transactions finalized, including the expected duplicate-withdrawal rollback. It demonstrated:

| Record | Initial outcome | Follow-up | Settlement |
| --- | --- | --- | --- |
| #5 | PARTIALLY_COMPLETED | One implemented feature, one unsupported feature | Funder refund transfer finalized |
| #6 | REJECTED | Source explicitly implements an unconditional unsafe payment gate | Funder refund transfer finalized |
| #7 | INCONCLUSIVE | Incorrect initial hash; challenge + rebuttal with valid committed evidence; second verdict VERIFIED | Recipient transfer finalized |

Both refunds' child transfers and the recipient's child transfer finalized. Each carried exactly 1,000,000,000,000 simulated wei. The recipient's final balance was exactly that amount; the funder's final balance reconciled to its initial faucet balance minus the one paid milestone. `docs/evidence/live-scenarios.json` contains all IDs, call arguments, decisions, votes, final receipts and final balances.

The browser walkthrough additionally uses Studio's actual built-in signer for proposal/funding and the web frontend for recipient actions. Browser and deployment evidence are recorded in `docs/EVIDENCE.md`.

**Environment:** StudioNet, chain 61999. All balances and transfers here are simulated development GEN. This is not a mainnet service, an audited treasury contract or evidence of real customer adoption. StudioNet may reset. Transfer-queued state alone does not prove beneficiary receipt.

V1 deliberately supports **source-verifiable deliverables**. A README claiming a production deployment, successful tests or real users does not establish those facts. Unsupported runtime/adoption requirements should remain UNKNOWN. Arbitrary application URLs, CI attestations and real-money stablecoin custody are outside V1.

## Try it

1. Open the DApp and inspect existing finalized records without connecting an account.
2. Create two temporary demo accounts. Request simulated GEN for the Funder.
3. Create a grant with an exact repository and objective criteria. Switch to Recipient to accept, then Funder to fund.
4. Submit a commit-pinned raw GitHub file and its SHA-256. The built-in hasher computes the exact file hash locally.
5. Review, inspect the result, optionally challenge and rebut, then finalize after the contract-enforced interval.
6. Withdraw using the authorized beneficiary and inspect the transfer and balance evidence.

See [complete walkthrough](docs/DEPLOYMENT.md). The public smoke test is intentionally unfunded. Earlier interrupted test records remain visible as development history; no records are hidden or presented as successful settled milestones.

## Develop and verify

Requires Node 22+ and Python 3.12+.

```sh
npm ci
python -m pip install -r requirements-dev.txt
python scripts/prepare-test-sdk.py
npm test
python -m pytest -q tests/test_contract.py tests/test_example.py
genvm-lint check contracts/grant_oracle.py
npm run build
npm run dev
```

Verified locally: **40 Python tests**, **16 frontend tests**, GenVM lint and semantic validation, and production build. Python tests use the official GenLayer direct-mode testing SDK. The suites include validator dissent, source alteration, bad hashes, failed attachments, semantic-audit rejection, ungrounded prompt injection, access control, exact funding, deadlines, challenge/rebuttal timing, refund states and duplicate withdrawal protection. The message transport is replaced only in the withdrawal unit test; the live suite exercises actual Studio messages.

`npm run validate` expects `genvm-lint` on PATH (after installing development requirements). CI repeats local tests, validation and build. Live scripts are opt-in and never run in CI. Do not redeploy unchanged contracts or repeat live suites merely to regenerate documentation.

## Documentation

- [Architecture and state transitions](docs/ARCHITECTURE.md)
- [Security and limits](docs/SECURITY.md)
- [Deployment and user walkthrough](docs/DEPLOYMENT.md)
- [Verified evidence index](docs/EVIDENCE.md)
- [Project Explorer submission fields](docs/SUBMISSION.md)
- [Logo PNG, 512 × 512](public/grantoracle-logo.png)

## Continued development

The next credible steps are authenticated CI/build attestations and deployment evidence, a production wallet path, independent security review, persistent testnet validation, resilient message-delivery accounting and then carefully scoped stablecoin escrow. None is claimed as already implemented.

MIT licensed. No points or steward-acceptance guarantee is made.
