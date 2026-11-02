(function(){
  const nav=document.createElement('nav');
  nav.className='site-bottom-nav';
  nav.setAttribute('aria-label','Доња навигација');
  const items=[
    ['/index.html','⌂','Почетна','/index.html'],
    ['/akcije.html','✓','Акције','/akcije.html'],
    ['/kampanje.html','◎','Кампање','/kampanje.html'],
    ['/podrska.html','♡','Подршка','/podrska.html']
  ];
  const path='/'+(location.pathname.split('/').pop()||'index.html');
  items.forEach(([href,icon,label,target])=>{
    const a=document.createElement('a');a.href=href;
    a.innerHTML=icon+'<span>'+label+'</span>';
    if(path===target && !(label==='Подршка' && !location.hash)) a.setAttribute('aria-current','page');
    nav.appendChild(a);
  });
  document.querySelectorAll('.mobile-bottom-nav').forEach(el=>el.remove());
  document.body.appendChild(nav);
})();