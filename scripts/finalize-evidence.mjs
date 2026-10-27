// Read-only final evidence collection. Never submits or repeats a write.
import {createClient} from 'genlayer-js';import {studionet} from 'genlayer-js/chains';import fs from 'node:fs';import d from '../web/deployment.json' with {type:'json'};
const c=createClient({chain:studionet}),p='docs/evidence/live-scenarios.json',r=JSON.parse(fs.readFileSync(p,'utf8'));
const clean=t=>({hash:t.hash,status:t.statusName,from:t.from_address,to:t.to_address,value:t.data?.value??t.value,result:t.result,leaderOnly:t.leader_only,leaders:t.consensus_data?.leader_receipt?.filter(x=>x.mode==='leader').map(x=>({mode:x.mode,execution_result:x.execution_result,result:x.result})),votes:t.consensus_data?.votes,triggeredTransactions:t.triggered_transactions,messages:t.messages});
for(const e of r.transactions){const t=await c.getTransaction({hash:e.hash});e.finalReceipt=clean(t);}
for(const s of r.scenarios){s.current=JSON.parse(await c.readContract({address:d.address,functionName:'get_grant',args:[s.id]}));}
r.finalBalances={funder:String(await c.getBalance({address:r.funder})),recipient:String(await c.getBalance({address:r.recipient})),contract:String(await c.getBalance({address:d.address}))};
r.transferReceipts=[];
for(const e of r.transactions.filter(e=>e.method==='withdraw'&&!e.expectFail)){
 const t=await c.getTransaction({hash:e.hash});console.log(JSON.stringify({hash:e.hash,status:t.statusName,children:t.triggered_transactions,messages:t.messages}));
 for(const child of t.triggered_transactions||[]){const hash=typeof child==='string'?child:child.hash||child.tx_id;if(hash){try{r.transferReceipts.push({parent:e.hash,receipt:clean(await c.getTransaction({hash}))});}catch(error){r.transferReceipts.push({parent:e.hash,child,error:String(error)})}}}
}
r.collectedAt=new Date().toISOString();fs.writeFileSync(p,JSON.stringify(r,(_,v)=>typeof v==='bigint'?String(v):v,2)+'\n');console.log(JSON.stringify({balances:r.finalBalances,states:r.scenarios.map(s=>({id:s.id,state:s.current.state,verdict:s.current.verdict})),finalization:r.transactions.map(e=>[e.method,e.finalReceipt.status])}));
