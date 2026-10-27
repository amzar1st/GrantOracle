import {createClient} from 'genlayer-js';import {studionet} from 'genlayer-js/chains';import fs from 'node:fs';import deployment from '../web/deployment.json' with {type:'json'};
const c=createClient({chain:studionet});
const receipt=await c.getTransaction({hash:deployment.deploymentTransaction});
fs.mkdirSync('docs/evidence',{recursive:true});fs.writeFileSync('docs/evidence/deployment-receipt.json',JSON.stringify(receipt,(_,v)=>typeof v==='bigint'?String(v):v,2)+'\n');console.log(JSON.stringify({status:receipt.status,statusName:receipt.statusName,exec:receipt.txExecutionResultName,consensus:receipt.consensus_data}));
const code=await c.getContractCode(deployment.address);fs.writeFileSync('docs/evidence/deployed-source.py',code);console.log('Source equal:',code===fs.readFileSync('contracts/grant_oracle.py','utf8'));
