(function () {
  if (window.__partnerShareModalReady) return;
  window.__partnerShareModalReady = true;

  const css = document.createElement('style');
  css.textContent = `
    .partner-share{display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:9px 14px;border:1px solid #ffffff70;border-radius:999px;background:#ffffff16;color:#fff;text-decoration:none;font:inherit;font-size:14px;font-weight:800;cursor:pointer;backdrop-filter:blur(8px)}
    .partner-share:hover{background:#ffffff28}
    .partner-share-backdrop{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:18px;background:#061a35a8;backdrop-filter:blur(5px)}
    .partner-share-card{width:min(100%,430px);box-sizing:border-box;background:#fff;border-radius:22px;padding:23px;box-shadow:0 22px 70px #061a3540;animation:partnerShareIn .18s ease-out}
    @keyframes partnerShareIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
    .partner-share-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px}
    .partner-share-card h2{margin:0;color:#123f78;font-size:22px}
    .partner-share-card p{margin:0 0 17px;color:#64748b;font-size:14px;line-height:1.6}
    .partner-share-close{width:36px;height:36px;flex:none;border:0;border-radius:50%;background:#eef3f8;color:#274563;font-size:22px;cursor:pointer}
    .partner-share-primary{width:100%;min-height:48px;border:0;border-radius:12px;background:#2166a8;color:#fff;font-size:15px;font-weight:850;cursor:pointer}
    .partner-share-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:13px}
    .partner-share-options a,.partner-share-options button{display:flex;align-items:center;justify-content:center;min-height:43px;padding:8px 5px;border:1px solid #dce5ef;border-radius:10px;background:#f7faff;color:#244b73;text-decoration:none;font:inherit;font-size:12px;font-weight:800;cursor:pointer}
    .partner-share-options a:hover,.partner-share-options button:hover{background:#eaf2fc}
    .partner-share-copy-status{min-height:18px;margin:12px 0 0!important;color:#16834b!important;font-size:12px!important}
    @media(max-width:480px){.partner-share-card{padding:20px 17px;border-radius:19px}.partner-share-options{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(prefers-reduced-motion:reduce){.partner-share-card{animation:none}}
  `;
  document.head.appendChild(css);

  const getData = () => {
    const name = document.querySelector('.partner-hero h1')?.textContent?.trim() || document.title;
    const url = location.href.split('#')[0];
    const title = name + ' — Одговорна Плана';
    const message = 'Упознајте ' + name + ' и погледајте страницу партнера: ' + url;
    const enc = encodeURIComponent;
    return {name,url,title,message,links:{
      WhatsApp:'https://wa.me/?text='+enc(message),
      Viber:'viber://forward?text='+enc(message),
      Telegram:'https://t.me/share/url?url='+enc(url)+'&text='+enc('Упознајте '+name+' — партнер Одговорне Плане.'),
      Facebook:'https://www.facebook.com/sharer/sharer.php?u='+enc(url),
      Имејл:'mailto:?subject='+enc(title)+'&body='+enc(message)
    }};
  };

  function closeDialog() {
    document.querySelector('.partner-share-backdrop')?.remove();
    document.body.style.overflow = '';
  }

  function openDialog() {
    if (document.querySelector('.partner-share-backdrop')) return;
    const data = getData();
    const backdrop = document.createElement('div');
    backdrop.className = 'partner-share-backdrop';
    backdrop.innerHTML = `
      <section class="partner-share-card" role="dialog" aria-modal="true" aria-labelledby="partnerShareTitle">
        <div class="partner-share-card-head">
          <h2 id="partnerShareTitle">Подели страницу партнера</h2>
          <button class="partner-share-close" type="button" aria-label="Затвори">×</button>
        </div>
        <p>Позови друге да упознају овог партнера и подрже његов рад.</p>
        <button class="partner-share-primary" type="button" data-native-share>↗ Подели преко телефона</button>
        <div class="partner-share-options">
          ${Object.entries(data.links).map(([label,href])=>'<a href="'+href+'" target="_blank" rel="noopener">'+label+'</a>').join('')}
          <button type="button" data-copy-partner-link>Копирај линк</button>
        </div>
        <p class="partner-share-copy-status" role="status" aria-live="polite"></p>
      </section>`;
    backdrop.addEventListener('click',event=>{if(event.target===backdrop)closeDialog();});
    backdrop.querySelector('.partner-share-close').addEventListener('click',closeDialog);
    backdrop.querySelector('[data-native-share]').addEventListener('click',async()=>{
      if (navigator.share) {
        try { await navigator.share({title:data.title,text:'Упознајте '+data.name+' — партнера Одговорне Плане.',url:data.url}); }
        catch(error) { if(error.name!=='AbortError') backdrop.querySelector('.partner-share-copy-status').textContent='Дељење тренутно није доступно.'; }
      } else {
        backdrop.querySelector('.partner-share-copy-status').textContent='Изабери апликацију испод или копирај линк.';
      }
    });
    backdrop.querySelector('[data-copy-partner-link]').addEventListener('click',async()=>{
      const status=backdrop.querySelector('.partner-share-copy-status');
      try {
        if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(data.url);
        else {
          const field=document.createElement('textarea');field.value=data.url;document.body.appendChild(field);field.select();document.execCommand('copy');field.remove();
        }
        status.textContent='Линк странице је копиран.';
      } catch(error) { status.textContent='Копирање није успело. Покушај поново.'; }
    });
    document.body.appendChild(backdrop);
    document.body.style.overflow='hidden';
    backdrop.querySelector('.partner-share-close').focus();
  }

  document.addEventListener('click',event=>{
    const trigger=event.target.closest('#openPartnerShare, .partner-share');
    if(!trigger)return;
    event.preventDefault();
    openDialog();
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeDialog();});
})();