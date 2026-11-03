(function(){
  if(document.querySelector('.site-bottom-nav')) return;
  const path='/'+(location.pathname.split('/').pop()||'index.html');
  const onJoinPage=path==='/ukljuci-se.html';
  const nav=document.createElement('nav');
  nav.className='site-bottom-nav';
  nav.setAttribute('aria-label','Доња навигација');
  const items=[
    ['/index.html','⌂','Почетна','/index.html'],
    [onJoinPage?'#actionPanel':'/akcije.html','✓','Акције','/akcije.html'],
    [onJoinPage?'#campaignPanel':'/kampanje.html','◎','Кампање','/kampanje.html'],
    [onJoinPage?'#associationPanel':'/ukljuci-se.html#associationPanel','♡','Подршка удружењу','/ukljuci-se.html']
  ];
  items.forEach(([href,icon,label,target],index)=>{
    const a=document.createElement('a');a.href=href;
    a.innerHTML=icon+'<span>'+label+'</span>';
    if((onJoinPage&&index===3)||path===target) a.setAttribute('aria-current','page');
    if(onJoinPage&&index===1)a.setAttribute('data-open-entry-tab','action');
    if(onJoinPage&&index===2)a.setAttribute('data-open-entry-tab','campaign');
    if(onJoinPage&&index===3)a.setAttribute('data-open-entry-tab','association');
    nav.appendChild(a);
  });
  document.querySelectorAll('.mobile-bottom-nav').forEach(el=>el.remove());
  document.body.appendChild(nav);

  // Мени и статусно обавештење припадају навигацији.
  const sideMenu=document.getElementById('sideMenu');
  const menuBackdrop=document.getElementById('menuBackdrop');
  const openMenu=document.getElementById('openMenu');
  const closeMenu=document.getElementById('closeMenu');
  function closeSideMenu(){
    if(!sideMenu||!menuBackdrop)return;
    sideMenu.classList.remove('open');
    menuBackdrop.classList.remove('open');
    sideMenu.setAttribute('aria-hidden','true');
    document.body.classList.remove('sheet-open');
    setTimeout(()=>{menuBackdrop.hidden=true},260);
  }
  if(sideMenu&&menuBackdrop&&openMenu){
    openMenu.addEventListener('click',()=>{
      menuBackdrop.hidden=false;
      sideMenu.setAttribute('aria-hidden','false');
      requestAnimationFrame(()=>{sideMenu.classList.add('open');menuBackdrop.classList.add('open')});
      document.body.classList.add('sheet-open');
    });
    closeMenu?.addEventListener('click',closeSideMenu);
    menuBackdrop.addEventListener('click',closeSideMenu);
  }
  const statusToggle=document.getElementById('siteStatusToggle');
  if(statusToggle){
    statusToggle.addEventListener('click',()=>{
      const notice=document.getElementById('siteStatusNotice');
      const details=document.getElementById('siteStatusDetails');
      if(!notice||!details)return;
      const opening=!notice.classList.contains('open');
      notice.classList.toggle('open',opening);
      statusToggle.setAttribute('aria-expanded',String(opening));
      details.hidden=!opening;
    });
  }
})();