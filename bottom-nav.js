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
})();