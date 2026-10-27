// Opt-in live test: creates fictional grants using temporary test-only SDK accounts.
// Never uses real funds or exports private keys. Run once; inspect evidence before re-running.
import {createClient,createAccount} from 'genlayer-js';import {studionet} from 'genlayer-js/chains';import {TransactionHashVariant} from 'genlayer-js/types';import fs from 'node:fs';import deployment from '../web/deployment.json' with {type:'json'};
const reader=createClient({chain:studionet});const funder=createAccount(),recipient=createAccount();const F=createClient({chain:studionet,account:funder}),R=createClient({chain:studionet,account:recipient});
const path='docs/evidence/live-scenarios.json';const report={network:'studionet',contract:deployment.address,funder:funder.address,recipient:recipient.address,startedAt:new Date().toISOString(),transactions:[],scenarios:[]};
const save=()=>fs.writeFileSync(path,JSON.stringify(report,null,2)+'\n');const pause=ms=>new Promise(r=>setTimeout(r,ms));
const raw=async(method,params)=>{const r=await reader.request({method,params});return r};
await raw('sim_fundAccount',[funder.address,1000000000000000000]);
const read=async(name,args)=>JSON.parse(await reader.readContract({address:deployment.address,functionName:name,args}));
function ok(t){const r=t.consensus_data?.leader_receipt?.filter(r=>r.mode==='leader').at(-1);return t.txExecutionResultName==='FINISHED_WITH_RETURN'||(r?.execution_result==='SUCCESS'&&r?.result?.status==='return')}
async function tx(c,method,args,value=0n,expectFail=false){const hash=await c.writeContract({address:deployment.address,functionName:method,args,value,leaderOnly:false});const e={method,args,value:String(value),hash,expectFail};report.transactions.push(e);save();console.log('SUBMITTED',method,hash);for(let i=0;i<100;i++){const t=await reader.getTransaction({hash});const s=t.statusName;if(['ACCEPTED','FINALIZED','UNDETERMINED','CANCELED'].includes(s)){e.status=s;e.success=ok(t);e.leaderOnly=t.leader_only;e.leaderResult=t.consensus_data?.leader_receipt?.filter(r=>r.mode==='leader').at(-1)?.result;e.votes=t.consensus_data?.votes;save();if(!expectFail&&!e.success)throw new Error(`${method} failed ${JSON.stringify(e.leaderResult)}`);if(expectFail&&e.success)throw new Error('Expected failure succeeded');return e;}await pause(2000)}throw new Error(`Tracking timeout ${hash}`)}
const good={url:'https://raw.githubusercontent.com/amzar1st/GrantOracle/4bb1a32ce516a5205e5f474258923868d16d9c0d/examples/payment_gate.py',sha256:'fb29b7b407438554a54a59c95f726bc1deda3403303a4340aeb8cb1facc8b28a'};
const bad={url:'https://raw.githubusercontent.com/amzar1st/GrantOracle/095f0cda205fafdbde0a28878b03bbc5a903d266/examples/unsafe_gate.py',sha256:'fb4d5ec681b1f6c3c97ccca2bd420f7a4910dcbbb6548eb0f79ed8e3676b9bb4'};
async function scenario(title,criteria,evidence){const e=await tx(F,'create_grant',[title,recipient.address,'amzar1st/GrantOracle',JSON.stringify(criteria),'1000000000000',86400,60]);const gid=JSON.parse(e.leaderResult.payload.readable);const s={id:String(gid),title,criteria};report.scenarios.push(s);save();await tx(R,'accept_grant',[s.id]);await tx(F,'fund_grant',[s.id],1000000000000n);await tx(R,'submit_evidence',[s.id,JSON.stringify(evidence)]);await tx(R,'review',[s.id]);s.initial=await read('get_grant',[s.id]);save();console.log('VERDICT',s.id,s.initial.verdict);return s;}
try{
 const partial=await scenario('Partial delivery · missing Merkle proof primitive',['Implement count_supported(checks) to count exactly entries equal to SUPPORTED.','Implement verify_merkle_proof(leaf, proof, root) that verifies Merkle tree inclusion.'],[good]);
 if(partial.initial.verdict!=='PARTIALLY_COMPLETED')throw new Error('Unexpected partial verdict');
 const rejected=await scenario('Rejected delivery · unconditional payment gate',['Implement authorize_payment(checks) so that it returns False for an empty list and for any list containing UNKNOWN or CONTRADICTED.'],[bad]);
 if(rejected.initial.verdict!=='REJECTED')throw new Error('Unexpected rejection verdict');
 const recovery=await scenario('Hash mismatch recovery · challenged evidence',['Implement count_supported(checks) to count exactly entries equal to SUPPORTED.'],[{...good,sha256:'0'.repeat(64)}]);
 if(recovery.initial.verdict!=='INCONCLUSIVE')throw new Error('Unexpected inconclusive verdict');
 await tx(F,'challenge',[recovery.id,'The original attachment has an incorrect SHA-256 commitment. The verified file bytes support this criterion.',JSON.stringify([good])]);
 await tx(R,'rebut',[recovery.id,JSON.stringify([good])]);
 for(const s of [partial,rejected]){const current=await read('get_grant',[s.id]);while(Date.now()/1000<current.challenge_until+2)await pause(2000);await tx(R,'finalize',[s.id]);const before=await reader.getBalance({address:funder.address});await tx(F,'withdraw',[s.id]);s.balanceBefore=String(before);s.balanceAfter=String(await reader.getBalance({address:funder.address}));s.final=await read('get_grant',[s.id]);save();}
 let g=await read('get_grant',[recovery.id]);while(Date.now()/1000<g.review_after+2)await pause(2000);
 await tx(R,'review',[recovery.id]);g=await read('get_grant',[recovery.id]);recovery.second=g;if(g.verdict!=='VERIFIED')throw new Error('Recovery did not verify');save();
 while(Date.now()/1000<g.challenge_until+2)await pause(2000);await tx(F,'finalize',[recovery.id]);const before=await reader.getBalance({address:recipient.address});await tx(R,'withdraw',[recovery.id]);recovery.balanceBefore=String(before);recovery.balanceAfter=String(await reader.getBalance({address:recipient.address}));recovery.final=await read('get_grant',[recovery.id]);save();
 await tx(R,'withdraw',[recovery.id],0n,true);
 for(const e of report.transactions){const t=await reader.getTransaction({hash:e.hash});e.status=t.statusName;e.success=ok(t);e.triggeredTransactions=t.triggered_transactions;e.votes=t.consensus_data?.votes;}
 report.completedAt=new Date().toISOString();save();console.log('COMPLETE',report.scenarios.map(s=>({id:s.id,initial:s.initial.verdict,final:s.final?.state})));
}catch(error){report.error=String(error);save();console.error(error);process.exitCode=1;}
