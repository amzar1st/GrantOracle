import './style.css';
import { createClient, createAccount, generatePrivateKey } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { TransactionHashVariant } from 'genlayer-js/types';
import { parseEther, formatEther, sha256 } from 'viem';
import deployment from './deployment.json';
import { classify, canAct, parseEvidence } from './lifecycle.js';

const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const short = x => x ? `${x.slice(0,8)}…${x.slice(-6)}` : '—';
const badge = x => `<span class="badge ${esc(x)}">${esc(x || 'NOT REVIEWED')}</span>`;
const date = x => x ? new Date(x*1000).toLocaleString() : '—';
const units = x => formatEther(BigInt(x));
const reader = createClient({chain:studionet});
let accounts = [], active = 0, offset = 0, total = 0, currentGrant, busy = false;
let txs = [];
try { accounts = JSON.parse(sessionStorage.getItem('grantoracle.accounts') || '[]').map(k=>({key:k,account:createAccount(k)})); active=Number(sessionStorage.getItem('grantoracle.active')||0); if (!accounts[active]) active=0; } catch { sessionStorage.removeItem('grantoracle.accounts'); }
try { txs=JSON.parse(localStorage.getItem('grantoracle.transactions')||'[]').filter(t=>/^0x[0-9a-f]{64}$/i.test(t.hash)).slice(0,20); } catch { txs=[]; }
let pending = txs.find(t=>t.phase==='pending');
const signer = () => accounts[active]?.account;
const client = () => createClient({chain:studionet, account:signer()});
function toast(text) { $('toast').textContent=text; $('toast').hidden=false; clearTimeout(toast.timer); toast.timer=setTimeout(()=>$('toast').hidden=true,9000); }
function persistTxs(){localStorage.setItem('grantoracle.transactions',JSON.stringify(txs)); renderTxs();}
function renderTxs(){
  $('transactions').innerHTML = txs.length ? txs.map(t=>`<div class="tx">${badge(t.phase)}<div class="tx-meta"><b>${esc(t.method)}</b><small>${esc(t.detail || 'Submitted')} • ${esc(new Date(t.at).toLocaleString())}</small><a href="${deployment.explorer}/transactions/${esc(t.hash)}" target="_blank" rel="noopener"><code>${esc(short(t.hash))} ↗</code></a></div>${t.phase==='pending'?`<button class="secondary resume" data-hash="${esc(t.hash)}">Resume tracking</button>`:''}</div>`).join('') : '<div class="empty">Your transactions will appear here. No writes have been submitted from this browser.</div>';
  document.querySelectorAll('.resume').forEach(b=>b.onclick=()=>track(b.dataset.hash));
}
function saveAccounts(){sessionStorage.setItem('grantoracle.accounts',JSON.stringify(accounts.map(a=>a.key)));sessionStorage.setItem('grantoracle.active',String(active));}
async function walletUI(){
  $('wallet').hidden=!signer();$('connect').textContent=signer()?`Demo signer · ${active===0?'Funder':'Recipient'}`:'Create demo accounts';
  if (!signer()) return;
  $('account').innerHTML=accounts.map((a,i)=>`<option value="${i}" ${i===active?'selected':''}>${i===0?'Funder':'Recipient'}</option>`).join('');
  $('walletAddress').textContent=signer().address;
  try { const bal=await reader.getBalance({address:signer().address}); $('balance').textContent=`${units(bal)} test GEN`; } catch {$('balance').textContent='Balance unavailable';}
  if(currentGrant) renderDetail(currentGrant);
}
$('connect').onclick=async()=>{if(!signer()){accounts=[0,1].map(()=>{const key=generatePrivateKey();return {key,account:createAccount(key)}});active=0;saveAccounts();toast('Two temporary demo signers created. Get test GEN for the funder before funding. These accounts are separate from Studio.');} await walletUI();};
$('account').onchange=async e=>{active=Number(e.target.value);saveAccounts();await walletUI();};
$('disconnect').onclick=()=>{if(busy||pending){toast('A transaction is unresolved. Track it before ending the session.');return;}if(!confirm('End this demo session? Keys will be removed from this tab. You will lose access to unfinished demo grants owned by these accounts.'))return;accounts=[];sessionStorage.removeItem('grantoracle.accounts');walletUI();};
$('faucet').onclick=async()=>{if(!signer())return;const b=$('faucet');b.disabled=true;try{const r=await fetch(deployment.rpc,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'sim_fundAccount',params:[signer().address,1000000000000000000]})});const json=await r.json();if(json.error)throw new Error(json.error.message);toast('Studio faucet credited simulated GEN.');await walletUI();}catch(e){toast(`Faucet: ${e.message}`);}finally{b.disabled=false;}};
$('contractLink').href=`${deployment.explorer}/address/${deployment.address}`;
async function read(method,args=[]){return JSON.parse(await reader.readContract({address:deployment.address,functionName:method,args,transactionHashVariant:TransactionHashVariant.LATEST_FINAL}));}
async function refresh(){
  $('refresh').disabled=true;
  try {const data=await read('list_grants',[offset,10]);total=data.total;$('count').textContent=total;$('escrow').textContent=`${units(data.escrow_wei)} GEN`;$('networkStatus').textContent=`Live finalized state · ${short(deployment.address)} · Chain ${deployment.chainId}`;$('grants').innerHTML=data.grants.length?data.grants.map(g=>`<tr><td><b>${esc(g.title)}</b><small>#${esc(g.id)} · Recipient ${esc(short(g.recipient))}</small></td><td>${esc(units(g.amount_wei))} GEN</td><td>${badge(g.state)}</td><td>${badge(g.verdict)}</td><td><button class="ghost inspect" data-id="${esc(g.id)}">Open ↗</button></td></tr>`).join(''):'<tr><td colspan="5"><div class="empty">No grants yet. Create the first milestone to lock its terms on-chain.</div></td></tr>';
    $('page').textContent=total?`${offset+1}–${Math.min(offset+10,total)} of ${total}`:'0 grants';$('prev').disabled=offset===0;$('next').disabled=offset+10>=total;
    document.querySelectorAll('.inspect').forEach(b=>b.onclick=()=>openGrant(b.dataset.id));
    if(currentGrant)await openGrant(currentGrant.id,false);
  }catch(e){$('networkStatus').textContent=`Contract read failed: ${e.message}. Use Refresh to retry.`;$('grants').innerHTML='<tr><td colspan="5"><div class="empty">Live state is unavailable. No sample data is substituted.</div></td></tr>';}finally{$('refresh').disabled=false;}
}
$('refresh').onclick=refresh;$('prev').onclick=()=>{offset=Math.max(0,offset-10);refresh()};$('next').onclick=()=>{offset+=10;refresh()};
async function openGrant(id,scroll=true){try{currentGrant=await read('get_grant',[id]);renderDetail(currentGrant);if(scroll)$('detail').scrollIntoView({behavior:'smooth',block:'start'});}catch(e){toast(`Grant read: ${e.message}`)}}
const actionLabels={'accept_grant':'Accept terms','fund_grant':'Fund escrow','submit_evidence':'Submit evidence','review':'Run validator review','challenge':'Challenge verdict','rebut':'Submit rebuttal','finalize':'Finalize decision','expire':'Recover expired grant','withdraw':'Withdraw to beneficiary'};
function renderDetail(g){
  const who=signer()?.address;const actionButtons=Object.entries(actionLabels).filter(([a])=>canAct(g,a,who)).map(([a,l])=>`<button class="act ${a==='review'?'':'secondary'}" data-action="${a}" ${busy||pending?'disabled':''}>${l}</button>`).join('');
  $('detail').hidden=false;
  $('detail').innerHTML=`<div class="detail-card"><div class="detail-head"><div><span class="eyebrow">MILESTONE #${esc(g.id)}</span><h2>${esc(g.title)}</h2>${badge(g.state)} ${badge(g.verdict)}</div><button id="closeDetail" class="ghost" aria-label="Close milestone">✕</button></div><div class="meta"><div><span>FUNDER</span><code>${esc(g.funder)}</code></div><div><span>RECIPIENT</span><code>${esc(g.recipient)}</code></div><div><span>LOCKED REPOSITORY</span><code>${esc(g.repository)}</code></div><div><span>ESCROW</span><code>${esc(units(g.amount_wei))} GEN ${g.funded?'funded':'not funded'}</code></div><div><span>TERMS SHA-256</span><code>${esc(g.terms_hash)}</code></div><div><span>DECISION SHA-256</span><code>${esc(g.decision_hash||'Pending review')}</code></div></div><h3 style="font-size:13px">Acceptance criteria</h3><ol class="criteria">${g.criteria.map(c=>`<li>${esc(c)}</li>`).join('')}</ol><p class="deadline">Submission due: ${date(g.due_at)} · Dispute ends: ${date(g.challenge_until)} · Rebuttal ends: ${date(g.review_after)} · Recovery expiry: ${date(g.expires_at)}</p>${g.challenge_reason?`<p><b>Challenge:</b> ${esc(g.challenge_reason)}</p>`:''}<div class="actions">${actionButtons||'<p>Connect a demo signer, switch to the appropriate party, or wait for the current window. Refresh after deadlines.</p>'}</div>${['RELEASE_QUEUED','REFUND_QUEUED'].includes(g.state)?'<div class="notice">Transfer emitted. This state records a queued transfer, not proof of beneficiary receipt. Inspect the parent and child transaction and the recipient balance before calling it paid.</div>':''}<details class="evidence-entry" open><summary>Evidence submission & hashing</summary><p>Only files in the locked repository at a full 40-character commit SHA are accepted. Keep each file under 14,000 bytes. Hashes commit to exact UTF-8 bytes.</p><div class="helper"><input id="evidenceURL" aria-label="Commit-pinned raw GitHub file URL" placeholder="https://raw.githubusercontent.com/owner/repo/COMMIT/file"><button id="hashEvidence" class="secondary">Hash & append file</button></div><label>Evidence JSON <small>Used for submit, challenge or rebuttal</small><textarea id="evidenceJSON" rows="4" placeholder='[{"url":"https://raw.githubusercontent.com/…","sha256":"…"}]'></textarea></label><label>Challenge reason<textarea id="challengeReason" rows="2" maxlength="700" placeholder="Explain which criterion or evidence needs re-examination"></textarea></label></details><div class="result">${g.reviews.map(r=>`<h3>Review ${r.round} · ${esc(r.result.verdict)}</h3><p class="muted">${date(r.at)} · Decision ${esc(r.decision_hash)}</p>${r.result.checks.map((c,i)=>`<div><p><b>${i+1}. ${esc(g.criteria[i])}</b> ${badge(c.status)}</p><p>${esc(c.reason)}</p>${c.quote?`<blockquote>${esc(c.quote)}</blockquote><p class="muted">Source ${c.source+1}</p>`:''}</div>`).join('')}<h3>Retrieved source fingerprints</h3>${r.result.sources.map(s=>`<div class="source">${badge(s.status)} Source ${s.index+1}: <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url)} ↗</a><br><code>Expected: ${esc(s.expected_sha256)}<br>Retrieved: ${esc(s.sha256||'No usable body')}</code></div>`).join('')}`).join('')||'<p>No validator review yet. Evidence will be independently retrieved when review runs.</p>'}</div><details><summary class="inline-link">Inspect complete on-chain grant record</summary><pre>${esc(JSON.stringify(g,null,2))}</pre></details></div>`;
  $('closeDetail').onclick=()=>{currentGrant=undefined;$('detail').hidden=true;};
  $('hashEvidence').onclick=async()=>{try{const url=$('evidenceURL').value.trim();if(!/^https:\/\/raw\.githubusercontent\.com\//.test(url))throw new Error('Use raw.githubusercontent.com.');const r=await fetch(url,{redirect:'error'});if(!r.ok)throw new Error(`HTTP ${r.status}`);const body=await r.arrayBuffer();if(!body.byteLength||body.byteLength>14000)throw new Error('File size must be 1–14,000 bytes.');const hash=sha256(new Uint8Array(body)).slice(2);const rows=JSON.parse($('evidenceJSON').value||'[]');rows.push({url,sha256:hash});$('evidenceJSON').value=parseEvidence(JSON.stringify(rows));toast('SHA-256 computed from exact file bytes.');}catch(e){toast(e.message)}};
  document.querySelectorAll('.act').forEach(b=>b.onclick=async()=>{try{const method=b.dataset.action;let args=[g.id],value=0n;if(['submit_evidence','rebut'].includes(method))args.push(parseEvidence($('evidenceJSON').value));if(method==='challenge'){const reason=$('challengeReason').value.trim();if(reason.length<10)throw new Error('Explain the challenge in at least 10 characters.');args.push(reason,parseEvidence($('evidenceJSON').value));}if(method==='fund_grant')value=BigInt(g.amount_wei);await write(method,args,value);}catch(e){toast(e.message)}});
}
async function track(hash){
  if(busy)return;const entry=txs.find(t=>t.hash===hash);if(!entry)return;
  busy=true;pending=entry;renderTxs();if(currentGrant)renderDetail(currentGrant);
  try{for(let i=0;i<90;i++){const tx=await reader.getTransaction({hash});const state=classify(tx);Object.assign(entry,state);persistTxs();if(state.phase!=='pending'){pending=undefined;toast(state.phase==='success'?`${entry.method}: finalized with successful execution.`:`${entry.method}: ${state.detail}. Inspect receipt before retrying.`);break;}await new Promise(r=>setTimeout(r,2500));}
    if(entry.phase==='pending')toast('Transaction is still pending. Its ID is saved. Resume tracking; do not submit again.');
  }catch(e){toast(`Tracking paused: ${e.message}. Your transaction ID is saved.`);}finally{busy=false;renderTxs();await refresh();await walletUI();}
}
async function write(method,args,value=0n){
  if(!signer())throw new Error('Create demo accounts first.');if(busy||pending)throw new Error('An unresolved transaction exists. Resume tracking before another write.');
  busy=true;if(currentGrant)renderDetail(currentGrant);$('grantForm').querySelector('button[type="submit"]').disabled=true;
  try{
    const hash=await client().writeContract({address:deployment.address,functionName:method,args,value,leaderOnly:false});
    const entry={hash,method,at:new Date().toISOString(),phase:'pending',detail:'Submitted to GenLayer consensus'};txs.unshift(entry);txs=txs.slice(0,20);pending=entry;persistTxs();$('modal').close();busy=false;await track(hash);
  }catch(e){toast(`Submission failed: ${e.message}. Check activity and chain state before retrying if submission was interrupted.`);throw e;}finally{busy=false;$('grantForm').querySelector('button[type="submit"]').disabled=false;if(currentGrant)renderDetail(currentGrant);}
}
$('newGrant').onclick=()=>{if(!signer()){toast('Create temporary demo accounts first.');return;}if(accounts[1])$('grantForm').elements.recipient.value=accounts[1].account.address;$('formError').textContent='';$('modal').showModal();};
$('closeModal').onclick=()=>$('modal').close();
$('grantForm').onsubmit=async e=>{e.preventDefault();try{const f=new FormData(e.target);const criteria=f.get('criteria').split('\n').map(s=>s.trim()).filter(Boolean);if(criteria.length<1||criteria.length>6||criteria.some(c=>c.length<10||c.length>400))throw new Error('Supply 1–6 criteria, each 10–400 characters.');const amount=parseEther(f.get('amount'));if(amount<=0n)throw new Error('Use a positive escrow amount.');await write('create_grant',[f.get('title').trim(),f.get('recipient').trim(),f.get('repository').trim(),JSON.stringify(criteria),String(amount),Number(f.get('submission')),Number(f.get('dispute'))]);}catch(e){$('formError').textContent=e.message;}};
renderTxs();walletUI();refresh();
