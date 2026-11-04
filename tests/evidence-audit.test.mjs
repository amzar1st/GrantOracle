import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { auditReport, checkFile, committedFiles } from '../web/evidence-audit.js';

const repository = 'amzar1st/GrantOracle';
const url = `https://raw.githubusercontent.com/${repository}/${'a'.repeat(40)}/proof.txt`;
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const body = new Uint8Array([0x61, 0x0d, 0x0a, 0xc3, 0xa9]);
const file = { url, sha256: digest(body) };

test('checks exact bytes and reports mismatches independently', async () => {
  const fetchFile = async (target, options) => {
    assert.equal(target, url);
    assert.equal(options.redirect, 'error');
    assert.equal(options.credentials, 'omit');
    return new Response(body);
  };
  const expected = { status: 'MATCH', observedSha256: digest(body), bytes: body.length };
  assert.deepEqual(await checkFile(file, repository, fetchFile), expected);
  assert.deepEqual(await checkFile({ ...file, sha256: '0'.repeat(64) }, repository, fetchFile),
    { ...expected, status: 'HASH_MISMATCH' });
});

test('never fetches an invalid commitment', async () => {
  for (const invalid of [url.replace('amzar1st', 'other'), url.replace('a'.repeat(40), 'main'),
    url.replace('proof.txt', '../proof.txt'), url + '?extra=1']) {
    let calls = 0;
    const result = await checkFile({ ...file, url: invalid }, repository, () => { calls++; });
    assert.equal(result.status, 'INVALID_COMMITMENT');
    assert.equal(calls, 0);
  }
});

test('distinguishes unavailable, empty and oversized evidence', async () => {
  assert.equal((await checkFile(file, repository, () => new Response(null, { status: 404 }))).status, 'UNAVAILABLE');
  assert.equal((await checkFile(file, repository, () => { throw new Error('network'); })).status, 'UNAVAILABLE');
  assert.equal((await checkFile(file, repository, () => new Response(''))).status, 'EMPTY');
  assert.equal((await checkFile(file, repository, () => new Response(new Uint8Array(14_000)))).bytes, 14_000);
  let canceled = false;
  const stream = new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(14_001)); },
    cancel() { canceled = true; },
  });
  assert.equal((await checkFile(file, repository, () => new Response(stream))).status, 'TOO_LARGE');
  assert.equal(canceled, true);
});

test('retains every evidence stage and chain provenance in the report', () => {
  const grant = { id: '7', evidence: [file], counter_evidence: [file], rebuttal_evidence: [file], decision_hash: 'example' };
  const files = committedFiles(grant);
  assert.deepEqual(files.map(row => row.stage), ['Submission', 'Challenge', 'Rebuttal']);
  const deployment = { chainId: 61999, address: '0xexample', deploymentTransaction: '0xdeployment' };
  const report = JSON.parse(JSON.stringify(auditReport(grant, deployment, files)));
  assert.equal(report.chainId, 61999);
  assert.equal(report.contractAddress, deployment.address);
  assert.equal(report.deploymentTransaction, deployment.deploymentTransaction);
  assert.equal(report.readMode, 'LATEST_FINAL');
  assert.deepEqual(report.grant, grant);
  assert.deepEqual(report.files, files);
});
