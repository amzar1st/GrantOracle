# Architecture

GrantOracle is a reusable milestone adjudication and native-GEN escrow contract, plus a browser client that reads its finalized state and signs actual StudioNet writes. There is no trusted adjudication backend, administrator override, or off-chain verdict endpoint.

One contract contains up to 10,000 independent milestone records, stored as canonical JSON values in a typed `TreeMap[str,str]`. Each grant contains one milestone with 1–6 immutable criteria. A program uses several records for multiple milestones.

## Lifecycle

1. **PROPOSED**: Funder locks a title, a distinct recipient, an exact GitHub repository, criteria, amount and windows. Terms are hashed. The recipient must accept within 24 hours.
2. **ACCEPTED**: Recipient has consented. The funder must deposit the exact amount before the funding deadline. Criteria cannot change after proposal.
3. **FUNDED**: Each milestone's deposited amount is reserved in `escrow_total`. The submission clock begins at funding. Recipient can submit one bounded evidence bundle before the deadline.
4. **SUBMITTED**: Evidence is immutable. Anyone can call review, independently of party cooperation. If consensus fails the transaction does not commit; the same review can be explicitly retried before expiry.
5. **PROVISIONAL**: A review stores per-criterion status, reasoning, supporting quotation, source fingerprints and a domain-separated decision hash. No payment is available yet.
6. **CHALLENGED**: Either party may challenge once before `challenge_until`, supplying a reason and up to four counter-evidence files. The other party can supply one rebuttal bundle. Both parties get a complete `dispute_seconds` rebuttal interval, even for a last-second challenge. Review is forbidden until that interval closes. Criteria remain unchanged. The challenge reason is recorded; it is not treated as factual evidence or as instructions to validators.
7. The second review opens another quiet finality interval, with no additional challenge. `finalize` is permissionless after the applicable interval. Only VERIFIED becomes **AUTHORIZED**. Other outcomes become **REFUNDABLE**.
8. `withdraw` requires the beneficiary: recipient for AUTHORIZED, funder for REFUNDABLE. It first consumes the reservation and changes state to **RELEASE_QUEUED** or **REFUND_QUEUED**, then emits an external native-value transfer. This is a one-shot queue record; inspect the child message and beneficiary balance for delivery. A failed external message does not automatically restore a reservation. No double withdrawal or automatic resend is permitted.

`expire` recovers unsubmitted funded grants after their submission deadline, and stalled submissions/reviews after their hard recovery expiry. Unfunded proposals cancel after the funding deadline. Review deadlines and challenge/rebuttal extensions preserve a full recovery grace period. Authorized grants do not expire; they remain withdrawable by the beneficiary.

## Evidence and consensus

Evidence is restricted to HTTPS `raw.githubusercontent.com/<locked-owner>/<locked-repo>/<40-lowercase-hex-commit>/<path>`. Branches, tags, query strings, foreign repositories, alternate hosts and traversal paths are rejected. SHA-256 commitments are mandatory. Each of the initial, challenge and rebuttal bundles supports up to four files, at most 14,000 bytes each. Invalid files get individual failure records. A failed attachment does not veto reliable evidence from other files.

Leader and validators each run the same retrieval and evaluation procedure using `gl.vm.run_nondet_unsafe`. There is no leader-only shortcut. Each criterion is SUPPORTED, CONTRADICTED or UNKNOWN. Material claims require exact quotations in a valid retrieved file and a separate semantic entailment audit. Missing proof, malformed responses, unsupported quotations, or a failed audit yield UNKNOWN. Missing evidence is never automatically treated as proof of non-completion.

The deterministic aggregation is:

| Per-criterion findings | Verdict |
| --- | --- |
| Every criterion SUPPORTED | VERIFIED |
| At least one SUPPORTED, but not all | PARTIALLY_COMPLETED |
| No SUPPORTED, at least one CONTRADICTED | REJECTED |
| All UNKNOWN | INCONCLUSIVE |

The custom validator compares the full source fingerprint list, the derived verdict, and every criterion status exactly. Reasoning and quotation wording may differ, provided both independent assessments passed the grounding checks and audit. It does not accept a leader answer merely because it has valid JSON.

Decision hashes bind canonical review data, immutable terms, evidence commitments, chain, contract, grant ID and round. Authorization hashes additionally bind decision, beneficiary, amount and authorized/refundable status. These are audit commitments, not signatures or a separate bridge protocol.

## Browser integration

The client pins `genlayer-js@1.1.8` to match stable StudioNet and chain 61999. It reads with LATEST_FINAL, signs with ephemeral local SDK accounts and uses `leaderOnly:false` for writes. Keys are generated locally and retained only in `sessionStorage`; they are never published or sent to a backend. Ending a session or closing a tab can permanently lose control of its temporary demo grants.

Studio's built-in accounts are scoped to Studio's origin and have no supported external-wallet bridge. Deployment and a funding demonstration use the actual Studio built-in signer. The external website's demo accounts are separate, and the UI says so. No MetaMask dependency or private-key import is required.

A returned transaction hash is pending, not success. The app checks finalization and explicit successful contract return, supporting both modern `FINISHED_WITH_RETURN` and stable Studio's `SUCCESS` plus `result.status=return`. It fails closed for finalized errors or missing execution proof. The transaction ID is saved before polling, unresolved writes lock new submissions, and tracking resumes without automatic resubmission. One application window should be used per demo signer; this is not a production multi-tab nonce coordinator.
