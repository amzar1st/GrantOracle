# Milestone v1 · Independent evidence audit

The accepted GrantOracle frontend showed the fingerprints recorded by validators. This update gives reviewers a separate way to fetch the committed evidence, hash the exact bytes themselves and export the results alongside the on-chain record.

## Reproduce

1. Run `npm ci`, `npm test` and `npm run dev`.
2. Open a grant with evidence and select **Run audit**. No signer is needed.
3. Review the expected and observed hashes by submission, challenge and rebuttal. Each file is checked separately. A failed request or a hash mismatch leaves the other results available.
4. Select **Download JSON report** to retain the grant snapshot, validator reviews, terms and decision hashes, chain ID, contract address, deployment transaction and file results.

Grant #7 is a useful example when the StudioNet record is available. Its archived final record is in [the original live evidence](evidence/live-scenarios.json). The original submission committed an incorrect hash. The challenge and rebuttal committed valid hashes. Replaying the archived record against the bytes from the pinned Git commits produces one submission mismatch and two matches.

The browser only fetches HTTPS raw GitHub files at full commit SHAs in the locked repository. Requests omit credentials, reject redirects and time out. The checker reads at most 14,000 bytes into its hashing buffer and rejects larger files. A report records what the browser observed and can be rerun independently. It carries no consensus signature and does not establish settlement or receipt of a payout.

This milestone uses the existing StudioNet contract on chain 61999 at [0xfC94797c8b1AA6d31023fE0C30ED60320F80Ca64](https://explorer-studio.genlayer.com/address/0xfC94797c8b1AA6d31023fE0C30ED60320F80Ca64). The audit calls the existing finalized read path and introduces no transactions or contract migration.
