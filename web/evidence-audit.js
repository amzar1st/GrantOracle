const MAX_BYTES = 14_000;
const evidenceGroups = [
  ['Submission', 'evidence'],
  ['Challenge', 'counter_evidence'],
  ['Rebuttal', 'rebuttal_evidence'],
];

export function committedFiles(grant) {
  return evidenceGroups.flatMap(([stage, key]) =>
    grant[key].map(file => ({ ...file, stage })),
  );
}

export async function checkFile(file, repository, fetchFile = fetch) {
  const { url, sha256: expected } = file;
  const match = /^https:\/\/raw\.githubusercontent\.com\/([^/]+\/[^/]+)\/[0-9a-f]{40}\/[A-Za-z0-9_./-]+$/.exec(url);
  if (!match || match[1] !== repository || url.length > 400 ||
      url.includes('/..') || url.slice(8).includes('//') || !/^[0-9a-f]{64}$/.test(expected)) {
    return { status: 'INVALID_COMMITMENT' };
  }

  try {
    const response = await fetchFile(url, {
      redirect: 'error',
      credentials: 'omit',
      cache: 'no-store',
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok || !response.body) return { status: 'UNAVAILABLE' };

    const stream = response.body.getReader();
    const bytes = new Uint8Array(MAX_BYTES);
    let size = 0;
    try {
      while (true) {
        const { done, value } = await stream.read();
        if (done) break;
        if (size + value.byteLength > MAX_BYTES) {
          await stream.cancel();
          return { status: 'TOO_LARGE' };
        }
        bytes.set(value, size);
        size += value.byteLength;
      }
    } finally {
      stream.releaseLock();
    }
    if (!size) return { status: 'EMPTY' };

    const digest = await crypto.subtle.digest('SHA-256', bytes.subarray(0, size));
    const observedSha256 = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    return { status: observedSha256 === expected ? 'MATCH' : 'HASH_MISMATCH', observedSha256, bytes: size };
  } catch {
    return { status: 'UNAVAILABLE' };
  }
}

export function auditReport(grant, deployment, files) {
  return {
    schema: 'grantoracle-evidence-audit-v1',
    checkedAt: new Date().toISOString(),
    chainId: deployment.chainId,
    contractAddress: deployment.address,
    deploymentTransaction: deployment.deploymentTransaction,
    readMode: 'LATEST_FINAL',
    grant,
    files,
  };
}
