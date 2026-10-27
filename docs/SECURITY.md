# Security model and limitations

GrantOracle is a StudioNet development demonstrator, not an audited treasury product. Studio balances and transfers are simulated. Do not deposit real funds, use valuable accounts, or claim real payouts. Stable StudioNet may reset.

## Trust boundaries

- Funders choose criteria and the repository; recipients explicitly accept them. Both can collude. The contract does not certify personal identity, repository ownership, professional authorship, originality, production deployment, test execution, user numbers or adoption.
- A commit-pinned file and SHA-256 establish the exact bytes validators saw. They do not establish that its claims are true. Documentation asserting a deployment or successful test is not independent proof of that assertion. V1 supports source-verifiable deliverables; runtime and external adoption criteria should remain UNKNOWN without directly verifiable evidence. Arbitrary live application URLs are deliberately outside V1's supported evidence surface.
- GitHub's HTTPS delivery and repository history are evidence dependencies. Content availability, deletion, resource limits and provider failures may prevent resolution. There are no API tokens or privileged GitHub permissions in a contract.
- Native GEN escrow and asynchronous external transfers depend on GenLayer's execution and message semantics. Studio is not full chain-layer parity. Transfer-queued state is not a proof of delivery. Child-transaction failure requires operator investigation and must not be blindly retried.
- AI consensus reduces reliance on a single examiner; correlated model errors, ambiguous criteria and sophisticated prompt injection remain possible. Quotation checking and a second entailment audit are layered defenses, not a proof of semantic correctness.

## Enforced controls

Immutable accepted terms; distinct funder/recipient; sender-based permissions; exact funded amount; reservation accounting; one-shot beneficiary-only withdrawals; bounded source counts, bytes, criteria and storage; exact source-host/repository/commit restrictions; mandatory hash verification; independently repeated validator evaluation; exact criterion and source-fingerprint comparison; source-grounded quotations; prompt-injection instructions in both assessment and audit; safe UNKNOWN handling; deterministic verdicts/hashes; one bounded challenge; a separate rebuttal window; permissionless review/finalization/expiry; and no privileged funder veto after funding.

Invalid attachments are recorded individually. If a good file supports every criterion, an unrelated invalid attachment does not override those supported findings. If decision-critical evidence is unavailable the relevant criteria remain UNKNOWN, preventing recipient authorization.

The contract does not truncate large files into apparently complete evidence. It rejects them as SIZE_ERROR. This bounds subsequent prompt size, although the web runtime may still buffer a large response before the size check. Transport-level resource limits remain a network responsibility.

## Failure and recovery

Review failures that revert or remain undetermined leave state retryable. A successfully recorded INCONCLUSIVE verdict can be challenged once using corrected or new evidence from the same locked repository. After the challenge round and quiet interval, any non-verified verdict refunds the funder. Hard expiry allows escrow recovery when no review can complete. This favors capital recovery over indefinite escrow and should be explicitly agreed by both parties.

No funder or recipient can edit original criteria, replace submitted evidence, bypass a dispute deadline, reopen a consumed challenge, or withdraw a partial payment. Partial payments, ERC-20/stablecoin custody, automated scheduling, cross-chain release, authenticated CI attestations and upgrade governance are future work.

## Browser security

All on-chain text is escaped before HTML insertion. Evidence links are restricted by the contract; the local hasher separately validates the raw host. No HTML returned by evidence sources is rendered. External links use `noopener`. No private keys are included in source, receipts, logs, exports or published assets. Demo keys live in tab session storage, which is readable by scripts on the app origin and is inappropriate for production money. Use a supported secure wallet integration for a future audited production version.

SDK/network pins are intentional: release-candidate Studio-dev and Consensus v0.6 use different RPCs, chains and APIs. Do not relabel a stable chain preset or deploy unchanged code just to refresh evidence.

## Disclosure

Report reproducible problems through the repository's security contact workflow or a private GitHub vulnerability report when available. Do not include private keys or unpublished exploit details in a public issue.
