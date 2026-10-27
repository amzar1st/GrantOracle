# Project Explorer submission

Contribution type: **Builder → Projects**

Project name: **GrantOracle**

Suggested primary tag: **DeFi** (or Infrastructure if the form's available taxonomy is different).

Tagline: **Evidence-based grant milestone verification and payment authorization.**

Website: https://grantoracle.tinymule33.chatgpt.site/

Source code: https://github.com/amzar1st/GrantOracle

Logo: `public/grantoracle-logo.png` (PNG, 512 × 512, below 2 MB). Also served at https://grantoracle.tinymule33.chatgpt.site/grantoracle-logo.png

## Description (under 1,000 characters)

GrantOracle is a GenLayer DApp for evidence-based grant milestone verification. Funders lock criteria, a repository and an escrow amount; recipients accept the terms before funding. GenLayer validators independently retrieve commit-pinned GitHub files, verify SHA-256 hashes, assess each criterion with grounded quotations and semantic audits, and compare source fingerprints and outcomes. Verdicts are VERIFIED, PARTIALLY_COMPLETED, REJECTED or INCONCLUSIVE. Only VERIFIED can authorize recipient withdrawal after a dispute window. Either party can challenge once, with separate counter-evidence and rebuttal periods. Other finalized verdicts permit refunds, and expiry recovers stalled grants. The public frontend interacts with the deployed contract and tracks finalized execution. Live StudioNet evidence covers all four verdicts, a successful challenge, refunds, payout and duplicate-withdrawal rejection. Development demo with simulated GEN; no real-money or adoption claims.

## GenLayer integration

The AI consensus result controls whether escrow becomes withdrawable by the recipient or refundable to the funder. Every validator retrieves and assesses committed evidence independently. The custom equivalence function compares source fingerprints, per-criterion statuses and the derived verdict. Deterministic contract logic enforces permissions, windows, aggregation and one-shot settlement.

## Evidence for reviewers

- Contract: `0xfC94797c8b1AA6d31023fE0C30ED60320F80Ca64`
- Chain: StudioNet, **61999**
- Deployment: https://explorer-studio.genlayer.com/transactions/0x1edc039af42866c5f2ee449be43ac3988e2c4625afa8a4c81606484c13845e23
- Corrected-evidence second review: https://explorer-studio.genlayer.com/transactions/0x9d945659042784bd55d07d894c72c7d6bc456b704c651048e91e781332ab579f
- Recipient withdrawal: https://explorer-studio.genlayer.com/transactions/0x2e783bb6cb9edaeb90c331f22d8861bc128eec47c931003c8ce5b099cd82aa39
- Finalized recipient transfer: https://explorer-studio.genlayer.com/transactions/0x4a498128019f5c4045981f5cfcf1ce708bfa1f62136850e4ca7c6e5a7854285d
- Full evidence table and browser proof: `docs/EVIDENCE.md`
- 40 Python tests, 16 frontend tests, GenVM lint/validation and production build.

## Scope and limitations to disclose

StudioNet balances/transfers are simulated and the network can reset. V1 evaluates source-verifiable deliverables; it does not certify runtime behavior, deployment, authorship or adoption from self-reports. Studio's built-in signer was used for deployment and a browser funding demonstration; the external DApp uses separate temporary SDK signers. Transfer-queued records require child/balance verification. The full settlement cycle is proven by live SDK transactions; the last additional browser-only settlement walkthrough remains blocked at recipient acceptance by automatic approval review. No production security audit, real treasury integration, stablecoin custody or live customer traction is claimed.

Do not mark optional video, audit or social-post fields as completed; none was published. The project has not been submitted on the user's behalf and steward acceptance is not guaranteed.
