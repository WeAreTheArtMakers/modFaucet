(()=>{'use strict';
const $=s=>document.querySelector(s),dialog=$('#install-dialog');let checksum='',toastTimer;
function toast(text){$('#toast').textContent=text;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').textContent='',4500);}
async function copy(text){try{await navigator.clipboard.writeText(text);toast('Copied to clipboard.');}catch{toast('Copy this address: '+text);}}
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>copy(b.dataset.copy)));
document.querySelectorAll('.install-link').forEach(a=>a.addEventListener('click',()=>{if(dialog&&!dialog.open)dialog.showModal();}));
$('#close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
$('#copy-checksum').addEventListener('click',()=>{if(checksum)copy(checksum);});
const demoCoins=['USDT','DOGE','ETH','LTC','SOL','TRX'];let demo=0;$('#demo-next').addEventListener('click',()=>{demo=(demo+1)%demoCoins.length;$('#demo-next').textContent='Next coin · '+demoCoins[demo];$('#demo-status').textContent='Illustrative status · demo only';toast('Preview only. The extension opens your real coin tabs.');});
function safeRelease(r){try{const u=new URL(r.url);return typeof r.version==='string'&&/^\d+\.\d+\.\d+$/.test(r.version)&&u.origin==='https://github.com'&&u.pathname.startsWith('/WeAreTheArtMakers/modFaucet/releases/download/')&&u.pathname.endsWith('.zip')&&/^[a-f0-9]{64}$/.test(r.sha256)&&Number.isInteger(r.bytes)&&r.bytes>0;}catch{return false;}}
fetch('downloads.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
 const releases=(data.releases||[]).filter(safeRelease),latest=releases.find(r=>r.version===data.latest);if(!latest)throw Error();
 document.querySelectorAll('.install-link').forEach(a=>a.href=latest.url);document.querySelectorAll('[data-version]').forEach(n=>n.textContent='v'+latest.version);
 $('#package-size').textContent=(latest.bytes/1024).toFixed(1)+' KB';$('#release-date').textContent=new Date(latest.date+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
 checksum=latest.sha256;$('#checksum').textContent=checksum;
 const nodes=releases.map(r=>{const article=document.createElement('article'),link=document.createElement('a'),p=document.createElement('p');link.href=r.url;link.textContent='v'+r.version+' · Download ZIP';p.textContent=r.notes;article.append(link,p);return article;});$('#release-history').replaceChildren(...nodes);
}).catch(()=>{$('#package-size').textContent='ZIP package';$('#checksum').textContent='See SHA256SUMS.txt in the GitHub release.';$('#copy-checksum').disabled=true;});
})();
