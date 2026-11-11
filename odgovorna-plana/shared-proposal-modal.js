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
 sheet.innerHTML='<header><span id="opSharedProposalTitle">Покрени предлог</span><button type="button" aria-label="Затвори" id="opSharedProposalClose">×</button></header><div id="opSharedProposalContent" style="display:flex;flex:1;min-height:0;overflow:auto"><iframe title="Формулар за предлог" src="about:blank" style="display:block;border:0;width:100%;height:100%;min-height:0;flex:1;background:#f3f6fa"></iframe></div>';
 document.body.append(backdrop,sheet);
 const content=sheet.querySelector('#opSharedProposalContent'),frame=sheet.querySelector('iframe'),title=sheet.querySelector('#opSharedProposalTitle');let inlineNode=null,inlinePlaceholder=null,inlineOriginalDisplay='',inlineOriginalHidden=false;
 function open(kind){if(kind==='support'){openInline('#prijava-podrske','Придружи се Покрету Одговорна Плана');return;}title.textContent=kind==='campaign'?'Покрени своју кампању':'Покрени своју акцију';content.replaceChildren(frame);frame.src='about:blank';frame.src=kind==='campaign'?'/predlog-kampanje.html?embed=1':'/predlog-akcije.html?embed=1';backdrop.hidden=false;sheet.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';requestAnimationFrame(()=>{backdrop.classList.add('open');sheet.classList.add('open')});}
 function openInline(selector,heading){const node=document.querySelector(selector);if(!node)return;inlinePlaceholder=document.createComment('support-form-location');node.parentNode.insertBefore(inlinePlaceholder,node);inlineNode=node;inlineOriginalDisplay=node.style.display;inlineOriginalHidden=node.hidden;content.replaceChildren(node);node.hidden=false;node.style.display='block';node.style.margin='0';title.textContent=heading;backdrop.hidden=false;sheet.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';requestAnimationFrame(()=>{backdrop.classList.add('open');sheet.classList.add('open')});}
 function close(){if(inlineNode&&inlinePlaceholder){inlinePlaceholder.parentNode.insertBefore(inlineNode,inlinePlaceholder);inlinePlaceholder.remove();inlineNode.style.margin='';inlineNode.style.display=inlineOriginalDisplay;inlineNode.hidden=inlineOriginalHidden;inlineNode=null;inlinePlaceholder=null;}backdrop.classList.remove('open');sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');document.body.style.overflow='';setTimeout(()=>{backdrop.hidden=true;frame.src='about:blank'},260);}
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
  if(el.matches('[data-open-form="support"]'))kind='support';
  if(!kind)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open(kind);
 },true);
 window.addEventListener('message',function(e){if(e.origin===location.origin&&e.data?.type==='op-proposal-submitted')close();});
 backdrop.addEventListener('click',close);sheet.querySelector('#opSharedProposalClose').addEventListener('click',close);
 document.querySelectorAll('[data-open-form="action"]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();open('action')}));
 document.querySelectorAll('[data-open-form="campaign"]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();open('campaign')}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!backdrop.hidden)close()});
 function openParticipation(action){
  if(!action)return;
  const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  title.textContent='Пријава за учешће у акцији';
  content.innerHTML='<form id="opActionJoinForm" style="padding:20px;display:grid;gap:13px;max-width:680px;margin:auto;width:100%;box-sizing:border-box"><p style="margin:0;color:#334155">Пријављујеш се за акцију: <strong>'+safe(action.title)+'</strong></p><label>Име и презиме<input name="full_name" required autocomplete="name" style="display:block;width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:9px;box-sizing:border-box"></label><label>Телефон<input name="phone" required type="tel" autocomplete="tel" style="display:block;width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:9px;box-sizing:border-box"></label><label>Имејл (није обавезно)<input name="email" type="email" autocomplete="email" style="display:block;width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:9px;box-sizing:border-box"></label><label>Место<input name="location" autocomplete="address-level2" style="display:block;width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:9px;box-sizing:border-box"></label><label>Како желиш да помогнеш?<select name="support_type" required style="display:block;width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:9px;box-sizing:border-box"><option value="">Изабери начин учешћа</option><option>Физичко учешће у акцији</option><option>Организација и координација</option><option>Алат, материјал или опрема</option><option>Друга врста помоћи</option></select></label><label>Порука (није обавезно)<textarea name="description" rows="3" style="display:block;width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:9px;box-sizing:border-box"></textarea></label><p id="opJoinMessage" role="status" style="margin:0"></p><button type="submit" style="border:0;border-radius:10px;background:#d71920;color:#fff;padding:14px;font-weight:800;font-size:16px">Пошаљи пријаву</button></form>';
  const form=content.querySelector('#opActionJoinForm');
  form.addEventListener('submit',async e=>{
   e.preventDefault();const btn=form.querySelector('button[type=submit]'),msg=form.querySelector('#opJoinMessage');btn.disabled=true;btn.textContent='Слање…';msg.textContent='';
   const fd=new FormData(form),v=Object.fromEntries(fd.entries());
   const payload={submission_type:'help',title:'Пријава за акцију: '+action.title,description:v.description||'',full_name:v.full_name,phone:v.phone,email:v.email||null,location:v.location||null,support_type:v.support_type,status:'new',social_links:{kind:'action',target_id:action.id,action_id:action.id,action_title:action.title}};
   try{const client=window.db;if(!client)throw new Error('Веза са базом није доступна.');const {error}=await client.from('civic_submissions').insert(payload);if(error)throw error;form.innerHTML='<div style="padding:28px 8px;text-align:center"><h2 style="color:#15803d">Пријава је послата!</h2><p>Хвала ти што желиш да учествујеш. Јавићемо ти се.</p></div>';setTimeout(close,1500);}
   catch(err){msg.style.color='#b91c1c';msg.textContent=err.message||'Пријава није послата. Покушај поново.';btn.disabled=false;btn.textContent='Пошаљи пријаву';}
  });
  backdrop.hidden=false;sheet.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';requestAnimationFrame(()=>{backdrop.classList.add('open');sheet.classList.add('open')});
 }
 window.OPProposalModal={open,close,openInline,openParticipation};
 if(location.pathname.replace(/\/$/,'').endsWith('/ukljuci-se')&&location.hash==='#prijava-podrske'){open('support');}
})();