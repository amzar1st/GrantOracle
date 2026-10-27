// Read-only collection of transactions already submitted through Studio/browser.
import {createClient} from 'genlayer-js';import {studionet} from 'genlayer-js/chains';import fs from 'node:fs';import d from '../web/deployment.json' with {type:'json'};
const c=createClient({chain:studionet});
const history=await c.request({method:'sim_getTransactionsForAddress',params:[d.address]});
console.log('History entries',history.length,'keys',Object.keys(history[0]||{}));
const wanted=new Set([d.deployer.toLowerCase(),'0xae5200506b6692004e539a32bb365d071114cfdd','0x9847de68cc5fef6f2d42e54a63920d2de0b76ca9']);
const rows=history.filter(t=>wanted.has(String(t.from_address||t.sender||'').toLowerCase()));
const out=[];
for(const row of rows){const hash=row.hash||row.tx_id;const t=await c.getTransaction({hash});out.push({hash,status:t.statusName,from:t.from_address,to:t.to_address,data:t.data,value:t.value,leaders:t.consensus_data?.leader_receipt?.filter(r=>r.mode==='leader').map(r=>({execution_result:r.execution_result,result:r.result})),votes:t.consensus_data?.votes});}
const grant4=JSON.parse(await c.readContract({address:d.address,functionName:'get_grant',args:['4']}));
const evidence={network:d.network,contract:d.address,collectedAt:new Date().toISOString(),transactions:out,grant4,scope:'Browser/Studio creation, recipient acceptance, Studio funding, hashing, evidence submission, VERIFIED review, and public website creation were verified. Browser settlement continuation was interrupted; final additional browser write was rejected by automatic approval review. The complete settlement workflow is demonstrated separately by the finalized scripted suite.'};
fs.writeFileSync('docs/evidence/browser-flow.json',JSON.stringify(evidence,(_,v)=>typeof v==='bigint'?String(v):v,2)+'\n');console.log(out.map(r=>({hash:r.hash,status:r.status,method:r.data?.method,from:r.from}))); 
