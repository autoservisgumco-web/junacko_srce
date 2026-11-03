/* Јединствени формулари за предлоге кампања и акција на целом сајту. */
(function(){
 if(window.OPProposalModalLoaded)return;window.OPProposalModalLoaded=true;
 const style=document.createElement('style');
 style.textContent=`
 #opSharedProposalBackdrop{position:fixed;inset:0;background:rgba(3,18,39,.68);z-index:99990;opacity:0;transition:opacity .2s}
 #opSharedProposalBackdrop.open{opacity:1}
 #opSharedProposalSheet{position:fixed;z-index:99991;left:50%;bottom:0;transform:translate(-50%,105%);width:min(760px,100%);height:min(88dvh,900px);background:#fff;border-radius:20px 20px 0 0;overflow:hidden;display:flex;flex-direction:column;transition:transform .25s ease;box-shadow:0 -12px 50px #061a3530}
 #opSharedProposalSheet.open{transform:translate(-50%,0)}
 #opSharedProposalSheet header{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;background:#071d3a;color:white;font-weight:800;flex:none}
 #opSharedProposalSheet header button{border:0;background:transparent;color:white;font-size:30px;line-height:1;cursor:pointer;padding:0 8px}
 #opSharedProposalSheet iframe{display:block;border:0;width:100%;height:0;min-height:0;flex:1 1 auto;background:#f3f6fa}
 @media(min-width:760px){#opSharedProposalSheet{bottom:50%;transform:translate(-50%,55%);height:min(88dvh,900px);border-radius:18px}#opSharedProposalSheet.open{transform:translate(-50%,50%)}}
 `;
 document.head.appendChild(style);
 const backdrop=document.createElement('div');backdrop.id='opSharedProposalBackdrop';backdrop.hidden=true;
 const sheet=document.createElement('section');sheet.id='opSharedProposalSheet';sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');sheet.setAttribute('aria-hidden','true');
 sheet.innerHTML='<header><span id="opSharedProposalTitle">Покрени предлог</span><button type="button" aria-label="Затвори" id="opSharedProposalClose">×</button></header><iframe title="Формулар за предлог" src="about:blank"></iframe>';
 document.body.append(backdrop,sheet);
 const frame=sheet.querySelector('iframe'),title=sheet.querySelector('#opSharedProposalTitle');
 function open(kind){title.textContent=kind==='campaign'?'Покрени своју кампању':'Покрени своју акцију';frame.src='about:blank';frame.src=kind==='campaign'?'/predlog-kampanje.html?embed=1':'/predlog-akcije.html?embed=1';backdrop.hidden=false;sheet.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';requestAnimationFrame(()=>{backdrop.classList.add('open');sheet.classList.add('open')});}
 function close(){backdrop.classList.remove('open');sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');document.body.style.overflow='';setTimeout(()=>{backdrop.hidden=true;frame.src='about:blank'},260);}
 document.addEventListener('click',function(e){
  const el=e.target.closest('button,a,[role="button"]');if(!el)return;
  let kind=null;
  const text=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
  const actionTarget=el.matches('[data-open-form="action"],.open-proposal')||
   el.matches('a[href*="predlog-akcije.html"]')||
   /^(?:\+\s*)?(?:покрени|предложи|додај)(?: своју| сопствену| нову)? акциј/.test(text)||
   el.getAttribute('onclick')?.includes("showPanel('proposal')");
  const campaignTarget=el.matches('[data-open-form="campaign"],.open-campaign-proposal')||
   /^(?:\+\s*)?(?:покрени|предложи)(?: своју| сопствену| нову)? кампањ/.test(text)||
   el.getAttribute('onclick')?.includes("showPanel('campaignProposal')");
  if(actionTarget)kind='action';else if(campaignTarget)kind='campaign';
  if(!kind)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open(kind);
 },true);
 window.addEventListener('message',function(e){if(e.origin===location.origin&&e.data?.type==='op-proposal-submitted')close();});\n backdrop.addEventListener('click',close);sheet.querySelector('#opSharedProposalClose').addEventListener('click',close);
 document.querySelectorAll('[data-open-form="action"]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();open('action')}));
 document.querySelectorAll('[data-open-form="campaign"]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();open('campaign')}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!backdrop.hidden)close()});
 window.OPProposalModal={open,close};
})();