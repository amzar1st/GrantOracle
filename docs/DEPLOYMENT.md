# Deployment and reproduction

## Verified deployment

- Network: GenLayer StudioNet, chain ID **61999**
- RPC: `https://studio.genlayer.com/api`
- Contract: `0xfC94797c8b1AA6d31023fE0C30ED60320F80Ca64`
- Deployment transaction: `0x1edc039af42866c5f2ee449be43ac3988e2c4625afa8a4c81606484c13845e23`
- Built-in Studio deployer: `0xf3C059C1495C80c4C94D4eB9eA43FE2fd5D6ED88`
- Explorer: https://explorer-studio.genlayer.com/address/0xfC94797c8b1AA6d31023fE0C30ED60320F80Ca64
- Pinned GenVM ABI: `v0.2.16`
- Pinned Python SDK dependency: `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6`

The contract was imported and deployed through Studio's built-in account with **Normal (Full Consensus)**. `scripts/check-live.mjs` queried the finalized receipt and fetched contract source; source bytes matched `contracts/grant_oracle.py` exactly. The deployment receipt and deployed source are in `docs/evidence/`.

## Use the deployed app

1. Open the public website linked from the README. Browse finalized grant records without an account.
2. Click **Create demo accounts**. This creates two separate test-only browser signers, named Funder and Recipient. They are not Studio's existing accounts. Click **Get test GEN** while Funder is selected.
3. Create a grant. Use a repository you intend to inspect and precise source-verifiable criteria. Use the generated Recipient address. Creation commits terms without moving funds.
4. Switch to Recipient, open the record and **Accept terms**. Wait for finalized successful execution.
5. Switch to Funder and **Fund escrow**. The app sends the exact wei amount. Wait for finalization.
6. Switch to Recipient. Paste a raw GitHub file URL containing a full commit SHA; **Hash & append file** computes the actual bytes' SHA-256. Submit evidence and wait for finalization.
7. **Run validator review**. This triggers real independent web retrieval and AI assessment, not a sample verdict. Inspect criteria, quotations, source fingerprints and decision hash.
8. Either party may challenge before the displayed deadline. Enter a reason and a new evidence bundle. The opposing party may rebut before `review_after`. Review only after that window closes.
9. Refresh after the dispute deadline and **Finalize decision**. VERIFIED authorizes recipient withdrawal; other verdicts authorize funder refund.
10. Switch to the beneficiary and **Withdraw to beneficiary**. Inspect the parent/child transaction and actual balance change. `RELEASE_QUEUED` and `REFUND_QUEUED` describe emitted transfers, not guaranteed delivery.

Windows are contract-enforced. The minimum dispute interval is 60 seconds for the demo; use a more realistic interval for any future grant program. There is no automatic background keeper. Use the displayed actions to advance eligible records.

## Use Studio's actual built-in account

Visit https://studio.genlayer.com/run-debug, import the deployed contract by address, and use the account selector's built-in account and faucet. Do not connect MetaMask. The Studio editor can also import `contracts/grant_oracle.py` for inspection. Reuse this deployed instance rather than redeploying unchanged code.

The stable Studio UI currently parses the payable field with integer `BigInt(value) * 10^18`; fractional GEN values fail before submission. Use whole GEN amounts for Studio UI funding. The website and SDK use exact decimal-to-wei conversion and support fractional amounts. An initial unfunded fractional proposal remains as a recorded UI-limit test; it never received escrow.

## Local validation

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

`genvm-lint` checks syntax/safety and SDK semantic validation. Direct-mode tests use the actual GenLayer testing SDK, with mocked web/model responses and a controlled deterministic test clock. Withdrawal unit tests replace only the message transport. Live Studio evidence validates consensus, real web/LLM calls, native funding, emitted transfers and receipt interpretation.

`scripts/live-scenarios.mjs` is an explicitly opt-in live test. It creates fictional grants using temporary process-memory signers and simulated faucet funds. It must not run in ordinary CI, and should not be repeated merely to refresh documentation. Keys are not exported. `scripts/check-live.mjs` only reads the existing deployment.

## Official references consulted

- https://docs.genlayer.com/developers/networks
- https://docs.genlayer.com/developers/intelligent-contracts/equivalence-principle
- https://docs.genlayer.com/developers/intelligent-contracts/features/value-transfers
- https://docs.genlayer.com/developers/intelligent-contracts/features/web-access
- https://docs.genlayer.com/developers/intelligent-contracts/features/transaction-context
- https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/limitations
- https://docs.genlayer.com/developers/decentralized-applications/writing-data

Use stable StudioNet-compatible SDK APIs, not preview-only methods. Current documentation includes next-stack APIs that are absent from the stable `genlayer-js@1.1.8` used here. Actual receipt behavior is covered by the frontend tests.

### Reproducible SDK artifact setup

`python scripts/prepare-test-sdk.py` resolves the official GenVM runner bundle through genvm-linter, verifies its pinned SHA-256, and shares it with genlayer-test. GenVM renamed the release asset from `genvm-universal.tar.xz` to `genvm-runners-all.tar.xz`; the pinned direct-test package still expects the legacy cache filename. The setup script corrects only cache naming. It does not modify contract code, mock execution, or change validator behavior. The direct test fixture explicitly pins GenVM `v0.3.0-rc7`.
