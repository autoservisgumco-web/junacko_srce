(function(){
  if(document.querySelector('.site-bottom-nav')) return;
  const path='/'+(location.pathname.split('/').pop()||'index.html');
  const onJoinPage=path==='/ukljuci-se.html';
  const nav=document.createElement('nav');
  nav.className='site-bottom-nav';
  nav.setAttribute('aria-label','Доња навигација');
  const items=[
    {href:'/index.html',icon:'⌂',label:'Почетна',target:'/index.html'},
    {href:'/akcije.html',icon:'✓',label:'Акције',target:'/akcije.html',sheet:'action'},
    {href:'/kampanje.html',icon:'◎',label:'Кампање',target:'/kampanje.html',sheet:'campaign'},
    {href:'/podrska.html',icon:'♡',label:'Подршка удружењу',target:'/podrska.html',sheet:'association'}
  ];
  items.forEach((item,index)=>{
    const a=document.createElement('a');
    a.href=item.href;
    a.innerHTML=item.icon+'<span>'+item.label+'</span>';
    if(item.sheet)a.setAttribute('data-open-sheet-tab',item.sheet);
    if(path===item.target)a.setAttribute('aria-current','page');
    nav.appendChild(a);
  });
  nav.addEventListener('click',event=>{
    const link=event.target.closest('a[data-open-sheet-tab]');
    if(!link)return;
    // На страници која има заједнички панел, доње картице отварају његов садржај.
    if(typeof window.openJoinFlow==='function'&&typeof window.showJoinFlowSection==='function'){
      event.preventDefault();
      const kind=link.getAttribute('data-open-sheet-tab');
      window.openJoinFlow();
      window.showJoinFlowSection(kind);
      nav.querySelectorAll('a').forEach(item=>item.removeAttribute('aria-current'));
      link.setAttribute('aria-current','page');
    }
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