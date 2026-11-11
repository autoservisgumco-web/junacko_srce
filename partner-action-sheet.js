(function(){
  if(window.__partnerActionSheetsReady)return;
  window.__partnerActionSheetsReady=true;

  const style=document.createElement('style');
  style.textContent=`
    .partner-action-backdrop{position:fixed;inset:0;z-index:1300;display:flex;align-items:flex-end;justify-content:center;background:#061a3580;backdrop-filter:blur(3px)}
    .partner-action-sheet{position:relative;width:min(100%,760px);max-height:88vh;overflow:auto;overscroll-behavior:contain;box-sizing:border-box;padding:24px 22px max(24px,env(safe-area-inset-bottom));background:#fff;border-radius:22px 22px 0 0;box-shadow:0 -12px 45px #061a3530;animation:partnerSheetUp .2s ease-out}
    .partner-action-sheet:before{content:"";display:block;width:42px;height:4px;border-radius:8px;background:#d7e0e9;margin:-10px auto 18px}
    .partner-action-sheet-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
    .partner-action-sheet-head h2{margin:0;color:#123f78;font-size:22px}
    .partner-action-sheet-close{width:38px;height:38px;flex:none;border:0;border-radius:50%;background:#eef3f8;color:#274563;font-size:23px;cursor:pointer}
    .partner-action-sheet .partner-block{margin:0;padding:0;border:0;border-radius:0;box-shadow:none}
    .partner-action-sheet .partner-block h2{display:none}
    body.partner-action-sheet-open{overflow:hidden}
    @keyframes partnerSheetUp{from{transform:translateY(35px);opacity:.7}to{transform:translateY(0);opacity:1}}
    @media(prefers-reduced-motion:reduce){.partner-action-sheet{animation:none}}
    @media(min-width:761px){.partner-action-sheet{margin-bottom:24px;border-radius:22px;max-height:82vh}.partner-action-backdrop{align-items:center}}
  `;
  document.head.appendChild(style);

  let active=null;
  function close(){
    if(!active)return;
    const {section,placeholder,backdrop}=active;
    placeholder.parentNode.insertBefore(section,placeholder);
    placeholder.remove();
    backdrop.remove();
    document.body.classList.remove('partner-action-sheet-open');
    active=null;
    document.removeEventListener('keydown',onKey);
  }
  function onKey(e){if(e.key==='Escape')close()}

  function open(sectionId,title){
    if(active)close();
    const section=document.getElementById(sectionId);
    if(!section)return;
    const placeholder=document.createComment('partner-action-sheet-placeholder');
    section.parentNode.insertBefore(placeholder,section);

    const backdrop=document.createElement('div');
    backdrop.className='partner-action-backdrop';
    backdrop.innerHTML=`
      <section class="partner-action-sheet" role="dialog" aria-modal="true" aria-label="${title}">
        <div class="partner-action-sheet-head">
          <h2>${title}</h2>
          <button class="partner-action-sheet-close" type="button" aria-label="Затвори">×</button>
        </div>
        <div class="partner-action-sheet-content"></div>
      </section>`;
    backdrop.addEventListener('click',e=>{if(e.target===backdrop)close()});
    backdrop.querySelector('.partner-action-sheet-close').addEventListener('click',close);
    backdrop.querySelector('.partner-action-sheet-content').appendChild(section);
    document.body.appendChild(backdrop);
    document.body.classList.add('partner-action-sheet-open');
    active={section,placeholder,backdrop};
    document.addEventListener('keydown',onKey);
    backdrop.querySelector('.partner-action-sheet-close').focus();
  }

  document.addEventListener('click',e=>{
    const link=e.target.closest('.partner-action[href="#volontiranje"],.partner-action[href="#donacije"]');
    if(!link)return;
    e.preventDefault();
    e.stopPropagation();
    if(link.getAttribute('href')==='#volontiranje')open('volontiranje','Постани волонтер');
    else open('donacije','Подржи донацијом');
  });
})();