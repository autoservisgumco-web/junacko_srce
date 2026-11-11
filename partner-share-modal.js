(function () {
  if (window.__partnerShareMenuReady) return;
  window.__partnerShareMenuReady = true;

  const css = document.createElement('style');
  css.textContent = `
    .partner-share{display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:9px 14px;border:1px solid #ffffff70;border-radius:999px;background:#ffffff16;color:#fff;text-decoration:none;font:inherit;font-size:14px;font-weight:800;cursor:pointer;backdrop-filter:blur(8px)}
    .partner-share:hover{background:#ffffff28}
    .partner-share-menu{position:fixed;z-index:1200;width:240px;padding:7px;background:#fff;border:1px solid #e6ebf1;border-radius:13px;box-shadow:0 12px 35px #061a3530;color:#152b43;transform-origin:top left;animation:partnerMenuIn .13s ease-out}
    @keyframes partnerMenuIn{from{opacity:0;transform:translateY(-5px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
    .partner-share-menu button,.partner-share-menu a{width:100%;min-height:44px;box-sizing:border-box;display:flex;align-items:center;gap:12px;padding:9px 11px;border:0;border-radius:8px;background:#fff;color:#1e293b;text-decoration:none;text-align:left;font:inherit;font-size:14px;font-weight:650;cursor:pointer}
    .partner-share-menu button:hover,.partner-share-menu a:hover{background:#f0f5fa}
    .partner-share-menu .share-icon{width:23px;flex:none;text-align:center;font-size:18px;font-weight:800}
    .partner-share-menu .share-divider{height:1px;margin:5px 4px;background:#edf0f4}
    .partner-share-menu .share-copy-status{display:none;padding:7px 10px 5px;color:#16834b;font-size:12px;font-weight:700}
    .partner-share-menu .share-copy-status.visible{display:block}
    @media(prefers-reduced-motion:reduce){.partner-share-menu{animation:none}}
  `;
  document.head.appendChild(css);

  const getData = () => {
    const name = document.querySelector('.partner-hero h1')?.textContent?.trim() || 'удружења';
    const summary = document.querySelector('.partner-hero-inner > p')?.textContent?.trim() || '';
    const description = document.querySelector('.partner-description')?.innerText?.trim() || summary;
    const supportMessage = document.querySelector('.partner-support-message, [data-partner-support-message]')?.innerText?.trim()
      || document.querySelector('.partner-needs, [data-partner-needs]')?.innerText?.trim()
      || '';
    const helpMethods = document.querySelector('.partner-help-methods, [data-partner-help-methods]')?.innerText?.trim()
      || 'Волонтирањем и укључивањем у активности удружења; донацијама и материјалном помоћи; дељењем објаве и ширењем информација о њиховом раду.';

    const contactLinks = Array.from(document.querySelectorAll('.partner-meta a'));
    const phone = contactLinks.find(a => a.href.startsWith('tel:'))?.textContent?.trim();
    const email = contactLinks.find(a => a.href.startsWith('mailto:'))?.textContent?.trim();
    const url = location.href.split('#')[0];
    const title = 'ПОМОЗИМО ' + name.toLocaleUpperCase('sr-RS') + ' | Одговорна Плана';

    const paragraphs = [
      '❤️ ПОМОЗИМО ' + name.toLocaleUpperCase('sr-RS') + '!',
      'О њиховом раду',
      description || summary || (name + ' својим радом доприноси заједници.'),
      supportMessage ? 'ЊИХОВ ПОЗИВ ЗА ПОМОЋ\n' + supportMessage : '',
      'КАКО МОЖЕТЕ ДА ПОМОГНЕТЕ?',
      helpMethods,
      phone ? 'Контакт телефон: ' + phone : '',
      email ? 'Контакт имејл: ' + email : '',
      'Страница партнера: ' + url
    ].filter(Boolean);

    const message = paragraphs.slice(0, -1).join('\n\n');
    const fullText = paragraphs.join('\n\n');
    const enc = encodeURIComponent;
    return {
      name, url, title, message, fullText,
      links: {
        Facebook:'https://www.facebook.com/sharer/sharer.php?u='+enc(url)+'&quote='+enc(message),
        X:'https://twitter.com/intent/tweet?url='+enc(url)+'&text='+enc('❤️ Подржимо удружење '+name+'. Погледајте чиме се бави и како можете да помогнете:'),
        WhatsApp:'https://wa.me/?text='+enc(fullText),
        Telegram:'https://t.me/share/url?url='+enc(url)+'&text='+enc(message),
        Email:'mailto:?subject='+enc(title)+'&body='+enc(fullText)
      }
    };
  };

  function closeMenu() {
    const menu=document.querySelector('.partner-share-menu');
    if(menu)menu.remove();
    document.querySelectorAll('#openPartnerShare,.partner-share').forEach(button=>button.setAttribute('aria-expanded','false'));
    document.removeEventListener('pointerdown',outsideClick,true);
    document.removeEventListener('keydown',escapeKey);
  }

  function outsideClick(event) {
    const menu=document.querySelector('.partner-share-menu');
    const trigger=event.target.closest('#openPartnerShare,.partner-share');
    if(menu&&!menu.contains(event.target)&&!trigger)closeMenu();
  }
  function escapeKey(event){if(event.key==='Escape')closeMenu();}

  async function copyText(text, status) {
    try {
      if(navigator.clipboard&&window.isSecureContext) await navigator.clipboard.writeText(text);
      else {
        const field=document.createElement('textarea');
        field.value=text;
        field.setAttribute('readonly','');
        field.style.position='fixed';
        field.style.opacity='0';
        document.body.appendChild(field);
        field.select();
        const copied=document.execCommand('copy');
        field.remove();
        if(!copied)throw new Error('copy failed');
      }
      status.textContent='✓ Текст објаве и линк су копирани';
      status.classList.add('visible');
    } catch(error) {
      status.textContent='Копирање није успело. Покушај поново.';
      status.classList.add('visible');
    }
  }

  function openMenu(trigger) {
    closeMenu();
    const data=getData();
    const menu=document.createElement('div');
    menu.className='partner-share-menu';
    menu.setAttribute('role','menu');
    menu.innerHTML=`
      <button type="button" role="menuitem" data-native-share><span class="share-icon">↗</span>Подели преко телефона</button>
      <div class="share-divider"></div>
      <a role="menuitem" target="_blank" rel="noopener" href="${data.links.Facebook}"><span class="share-icon">f</span>Facebook</a>
      <a role="menuitem" target="_blank" rel="noopener" href="${data.links.X}"><span class="share-icon">𝕏</span>X</a>
      <a role="menuitem" target="_blank" rel="noopener" href="${data.links.WhatsApp}"><span class="share-icon">◉</span>WhatsApp</a>
      <a role="menuitem" target="_blank" rel="noopener" href="${data.links.Telegram}"><span class="share-icon">➤</span>Telegram</a>
      <a role="menuitem" href="${data.links.Email}"><span class="share-icon">✉</span>Имејл</a>
      <div class="share-divider"></div>
      <button type="button" role="menuitem" data-copy-partner-post><span class="share-icon">▣</span>Копирај текст и линк</button>
      <div class="share-copy-status" role="status" aria-live="polite"></div>`;
    document.body.appendChild(menu);

    const rect=trigger.getBoundingClientRect();
    const width=240;
    const left=Math.max(10,Math.min(rect.right-width,window.innerWidth-width-10));
    const estimatedHeight=menu.offsetHeight||390;
    const top=rect.bottom+8+estimatedHeight<window.innerHeight-8
      ?rect.bottom+8
      :Math.max(8,rect.top-estimatedHeight-8);
    menu.style.left=left+'px';
    menu.style.top=top+'px';
    trigger.setAttribute('aria-expanded','true');

    menu.querySelector('[data-native-share]').addEventListener('click',async()=>{
      if(!navigator.share){
        const status=menu.querySelector('.share-copy-status');
        status.textContent='Дељење преко телефона није доступно у овом прегледачу. Изабери апликацију испод.';
        status.classList.add('visible');
        return;
      }
      try {
        await navigator.share({title:data.title,text:data.message,url:data.url});
        closeMenu();
      } catch(error) {
        if(error.name!=='AbortError'){
          const status=menu.querySelector('.share-copy-status');
          status.textContent='Дељење тренутно није доступно.';
          status.classList.add('visible');
        }
      }
    });

    menu.querySelector('[data-copy-partner-post]').addEventListener('click',()=>{
      copyText(data.fullText,menu.querySelector('.share-copy-status'));
    });

    setTimeout(()=>{
      document.addEventListener('pointerdown',outsideClick,true);
      document.addEventListener('keydown',escapeKey);
    },0);
  }

  document.addEventListener('click',event=>{
    const trigger=event.target.closest('#openPartnerShare,.partner-share');
    if(!trigger)return;
    event.preventDefault();
    event.stopPropagation();
    if(document.querySelector('.partner-share-menu'))closeMenu();
    else openMenu(trigger);
  });
  window.addEventListener('resize',closeMenu);
  window.addEventListener('scroll',closeMenu,true);
})();