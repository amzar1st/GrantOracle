import test from 'node:test';import assert from 'node:assert/strict';import {classify,canAct,parseEvidence} from '../web/lifecycle.js';
test('accepted is pending, never success',()=>assert.equal(classify({status:'ACCEPTED',consensus_data:{leader_receipt:[{execution_result:'SUCCESS'}]}}).phase,'pending'));
test('finalized errors are failures',()=>assert.equal(classify({status:'FINALIZED',txExecutionResultName:'VM_ERROR'}).phase,'failed'));
test('missing execution proof fails closed',()=>assert.equal(classify({status:'FINALIZED'}).phase,'failed'));
test('finalized successful return is success',()=>assert.equal(classify({statusName:'FINALIZED',txExecutionResultName:'FINISHED_WITH_RETURN'}).phase,'success'));
test('Studio receipt format is handled',()=>assert.equal(classify({status:'FINALIZED',consensus_data:{leader_receipt:[{execution_result:'FINISHED_WITH_RETURN'}]}}).phase,'success'));
test('undetermined is terminal failure',()=>assert.equal(classify({status:'UNDETERMINED'}).phase,'failed'));
const g={funder:'0xa',recipient:'0xb',state:'PROVISIONAL',challenge_until:100,expires_at:200,challenge_used:false,funded:true,rebuttal_evidence:[]};
test('no early finalization',()=>assert.equal(canAct(g,'finalize','0xc',99),false));
test('permissionless finalization at deadline',()=>assert.equal(canAct(g,'finalize','0xc',100),true));
test('outsider cannot challenge',()=>assert.equal(canAct(g,'challenge','0xc',50),false));
test('party can challenge before deadline',()=>assert.equal(canAct(g,'challenge','0xa',99),true));
test('no challenge at deadline',()=>assert.equal(canAct(g,'challenge','0xa',100),false));
test('only authorized recipient withdraws',()=>{assert.equal(canAct({...g,state:'AUTHORIZED'},'withdraw','0xa'),false);assert.equal(canAct({...g,state:'AUTHORIZED'},'withdraw','0xb'),true)});
test('unpinned evidence rejected',()=>assert.throws(()=>parseEvidence('[{"url":"https://raw.githubusercontent.com/a/b/main/a","sha256":"'+'a'.repeat(64)+'"}]')));
test('bounded evidence',()=>assert.throws(()=>parseEvidence('[]')));

test('stable Studio SUCCESS requires explicit return payload',()=>{assert.equal(classify({status:'FINALIZED',consensus_data:{leader_receipt:[{execution_result:'SUCCESS',result:{status:'return'}}]}}).phase,'success');assert.equal(classify({status:'FINALIZED',consensus_data:{leader_receipt:[{execution_result:'SUCCESS',result:{status:'error'}}]}}).phase,'failed')});

test('idle validator appended to leader receipts is not mistaken for leader failure',()=>assert.equal(classify({statusName:'FINALIZED',consensus_data:{leader_receipt:[{mode:'leader',execution_result:'SUCCESS',result:{status:'return'}},{mode:'validator',execution_result:'ERROR',result:{status:'contract_error'}}]}}).phase,'success'));
