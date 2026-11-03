(function(){
  if(document.querySelector('.site-bottom-nav')) return;
  const path='/'+(location.pathname.split('/').pop()||'index.html');
  const onJoinPage=path==='/ukljuci-se.html';
  const nav=document.createElement('nav');
  nav.className='site-bottom-nav';
  nav.setAttribute('aria-label','Доња навигација');
  const items=[
    ['/index.html','⌂','Почетна','/index.html'],
    ['/akcije.html','✓','Акције','/akcije.html'],
    ['/kampanje.html','◎','Кампање','/kampanje.html'],
    [onJoinPage?'#associationPanel':'/podrska.html','♡','Подршка Покрету',onJoinPage?'/ukljuci-se.html':'/podrska.html']
  ];
  items.forEach(([href,icon,label,target],index)=>{
    const a=document.createElement('a');a.href=href;
    a.innerHTML=icon+'<span>'+label+'</span>';
    if((onJoinPage&&index===3)||path===target) a.setAttribute('aria-current','page');
    if(onJoinPage&&index===3)a.setAttribute('data-open-association','true');
    nav.appendChild(a);
  });
  document.querySelectorAll('.mobile-bottom-nav').forEach(el=>el.remove());
  document.body.appendChild(nav);
})();