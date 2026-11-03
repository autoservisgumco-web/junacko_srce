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
    {href:'#association-sheet',icon:'♡',label:'Подршка удружењу',target:'#association-sheet',sheet:'association'}
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
    // Подршка удружењу увек отвара заједнички bottom sheet. Ако смо на другој страници, прво се враћамо на почетну која садржи панел.
    event.preventDefault();
    const kind=link.getAttribute('data-open-sheet-tab');
    if(typeof window.openJoinFlow==='function'&&typeof window.showJoinFlowSection==='function'){
      window.openJoinFlow();
      window.showJoinFlowSection(kind);
      nav.querySelectorAll('a').forEach(item=>item.removeAttribute('aria-current'));
      link.setAttribute('aria-current','page');
    }else if(kind==='association'){
      openAssociationSheet();
    }
  });

  function openAssociationSheet(){
    let backdrop=document.getElementById('associationNavSheet');
    if(!backdrop){
      backdrop=document.createElement('div');
      backdrop.id='associationNavSheet';
      backdrop.className='association-nav-backdrop';
      backdrop.hidden=true;
      backdrop.innerHTML='<section class="association-nav-panel" role="dialog" aria-modal="true" aria-labelledby="associationNavTitle"><div class="association-nav-handle"><span></span></div><div class="association-nav-head"><div><small>ОДГОВОРНА ПЛАНА · УДРУЖЕЊЕ</small><h2 id="associationNavTitle">Подршка удружењу</h2><p>Упознај рад удружења и види како можеш да постанеш његов део.</p></div><button type="button" class="association-nav-close" aria-label="Затвори">×</button></div><div class="association-nav-content"><div class="association-nav-card"><div class="association-nav-icon">♡</div><h3>Удружење Одговорна Плана</h3><p>Удружење окупља људе који желе да учествују у животу своје заједнице, покрећу корисне активности и преузимају одговорност за место у ком живе.</p><p>Чланови могу да учествују у организовању акција, предлажу иницијативе, деле своје знање и помажу да добре идеје постану заједнички рад.</p><div class="association-nav-points"><div>✓ <span>Учешће у раду и активностима удружења</span></div><div>✓ <span>Предлагање идеја и покретање иницијатива</span></div><div>✓ <span>Дељење знања, искуства и времена</span></div></div><p>Ако желиш да се прикључиш, остави нам податке. Јавићемо ти се са информацијама о учлањењу.</p><button type="button" class="association-nav-join">Информације о учлањењу</button><div class="association-nav-membership" hidden><h3>Постани део Одговорне Плане</h3><p>Ова пријава није везана за једну акцију. Пријави се ако желиш да учествујеш у раду организације и допринесеш развоју наше заједнице.</p><p>За пријаву за чланство користи форму на почетној страници.</p></div></div></div></section>';
      document.body.appendChild(backdrop);
      const close=()=>{backdrop.classList.remove('open');document.body.classList.remove('sheet-open');setTimeout(()=>backdrop.hidden=true,250)};
      backdrop.querySelector('.association-nav-close').addEventListener('click',close);
      backdrop.addEventListener('click',e=>{if(e.target===backdrop)close()});
      backdrop.querySelector('.association-nav-join').addEventListener('click',()=>{
        if(typeof window.showPanel==='function'&&document.getElementById('membership')){close();window.showPanel('membership');return;}
        const info=backdrop.querySelector('.association-nav-membership');info.hidden=!info.hidden;
      });
      document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!backdrop.hidden)close()});
    }
    backdrop.hidden=false;
    document.body.classList.add('sheet-open');
    requestAnimationFrame(()=>backdrop.classList.add('open'));
  }
  const associationStyle=document.createElement('style');
  associationStyle.textContent='.association-nav-backdrop{position:fixed;inset:0;z-index:5000;background:rgba(3,15,34,.62);display:flex;align-items:flex-end;justify-content:center;opacity:0;transition:opacity .22s}.association-nav-backdrop[hidden]{display:none}.association-nav-backdrop.open{opacity:1}.association-nav-panel{width:min(760px,100%);max-height:90dvh;overflow:auto;background:#f5f8fc;border-radius:22px 22px 0 0;padding:10px clamp(17px,4vw,30px) calc(24px + env(safe-area-inset-bottom));box-shadow:0 -12px 40px #0003;transform:translateY(30px);transition:transform .25s}.association-nav-backdrop.open .association-nav-panel{transform:translateY(0)}.association-nav-handle{height:18px;display:grid;place-items:center}.association-nav-handle span{width:42px;height:4px;border-radius:9px;background:#b8c7d9}.association-nav-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;padding:10px 0 18px;border-bottom:1px solid #dce5f0}.association-nav-head small{font-size:11px;letter-spacing:1.3px;font-weight:850;color:#2166f3}.association-nav-head h2{font-size:26px;color:#061a35;margin:6px 0}.association-nav-head p,.association-nav-card p{color:#52677d;line-height:1.65;margin:8px 0}.association-nav-close{width:40px;height:40px;border:0;border-radius:50%;background:#e2ebf6;color:#061a35;font-size:28px;cursor:pointer}.association-nav-content{padding-top:18px}.association-nav-card{background:#fff;border:1px solid #dce5f0;border-radius:17px;padding:22px;box-shadow:0 8px 24px #061a3509}.association-nav-icon{width:48px;height:48px;border-radius:14px;background:#e8f3ff;color:#2166f3;display:grid;place-items:center;font-size:27px}.association-nav-card h3{color:#061a35;font-size:21px;margin:14px 0 8px}.association-nav-points{display:grid;gap:10px;margin:18px 0;color:#2166f3;font-weight:850}.association-nav-points div{display:flex;gap:10px}.association-nav-points span{color:#314967;font-weight:600}.association-nav-join{border:0;border-radius:10px;background:#2166f3;color:#fff;padding:13px 18px;font:inherit;font-weight:800;cursor:pointer}.association-nav-membership{margin-top:18px;padding-top:16px;border-top:1px solid #dce5f0}@media(min-width:760px){.association-nav-backdrop{align-items:center;padding:22px}.association-nav-panel{border-radius:20px;max-height:88vh}}';
  document.head.appendChild(associationStyle);

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