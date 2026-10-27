export function classify(tx) {
  const status = String(tx.statusName ?? tx.status ?? '').toUpperCase();
  const leaders = tx.consensus_data?.leader_receipt;
  const receipt = Array.isArray(leaders) ? (leaders.filter(r=>r.mode === 'leader').at(-1) ?? leaders.filter(r=>!r.mode).at(-1)) : leaders;
  const execution = tx.txExecutionResultName ?? receipt?.execution_result ?? tx.execution_result;
  if (['CANCELED','CANCELLED','UNDETERMINED','REJECTED'].includes(status)) return {phase:'failed',detail:status};
  if (status === 'FINALIZED') return (execution === 'FINISHED_WITH_RETURN' || (execution === 'SUCCESS' && receipt?.result?.status === 'return'))
    ? {phase:'success',detail:'Finalized • execution succeeded'}
    : {phase:'failed',detail:`Finalized • ${execution ?? 'missing execution proof'}`};
  return {phase:'pending',detail:status === 'ACCEPTED' ? 'Accepted • awaiting finalization' : status || 'Waiting for receipt'};
}
export function canAct(g, action, address, time = Math.floor(Date.now()/1000)) {
  const who = address?.toLowerCase();
  const party = who === g.funder || who === g.recipient;
  if (!who) return false;
  switch(action) {
    case 'accept_grant': return who === g.recipient && g.state === 'PROPOSED' && time < g.funding_deadline;
    case 'fund_grant': return who === g.funder && g.state === 'ACCEPTED' && time < g.funding_deadline;
    case 'submit_evidence': return who === g.recipient && g.state === 'FUNDED' && time < g.due_at;
    case 'review': return ['SUBMITTED','CHALLENGED'].includes(g.state) && time >= g.review_after && time < g.expires_at;
    case 'challenge': return party && g.state === 'PROVISIONAL' && !g.challenge_used && time < g.challenge_until;
    case 'rebut': return party && who !== g.challenger && g.state === 'CHALLENGED' && time < g.review_after && !g.rebuttal_evidence.length;
    case 'finalize': return g.state === 'PROVISIONAL' && time >= g.challenge_until && time < g.expires_at;
    case 'expire': return (g.state === 'FUNDED' && time >= g.due_at) || (['SUBMITTED','CHALLENGED','PROVISIONAL'].includes(g.state) && time >= g.expires_at) || (['PROPOSED','ACCEPTED'].includes(g.state) && time >= g.funding_deadline);
    case 'withdraw': return g.funded && ((g.state === 'AUTHORIZED' && who === g.recipient) || (g.state === 'REFUNDABLE' && who === g.funder));
    default: return false;
  }
}
export function parseEvidence(raw) {
  const rows = JSON.parse(raw);
  if (!Array.isArray(rows) || rows.length < 1 || rows.length > 4) throw new Error('Supply 1–4 files.');
  for (const row of rows) if (!/^https:\/\/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[0-9a-f]{40}\/[A-Za-z0-9_./-]+$/.test(row.url) || !/^[0-9a-f]{64}$/.test(row.sha256)) throw new Error('Each file needs a full commit URL and SHA-256.');
  return JSON.stringify(rows);
}
