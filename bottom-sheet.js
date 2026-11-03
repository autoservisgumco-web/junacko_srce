/* Заједнички садржај за bottom sheet — index.html обезбеђује сам панел и setJoinHeader(). */
(function(){
 'use strict';

 const bottomSheet=document.getElementById('bottomSheet'),sheetBackdrop=document.getElementById('sheetBackdrop'),sheetContent=document.getElementById('sheetContent');
 let sheetTarget=null,sheetParent=null,sheetNext=null,sheetTouchY=0;
 window.setJoinHeader=function(kicker,title,description,backAction){
  const top=document.getElementById('sheetTop'),heading=document.getElementById('sheetHeading'),back=document.getElementById('sheetBack');
  top.classList.add('join-header');
  document.getElementById('sheetKicker').textContent=kicker||'ОДГОВОРНА ПЛАНА';
  document.getElementById('sheetTitle').textContent='';
  document.getElementById('sheetHeadingTitle').textContent=title||'';
  document.getElementById('sheetDescription').textContent=description||'';
  heading.hidden=false;back.hidden=!backAction;back.onclick=backAction||null;
 };
 window.showPanel=function(id,actionId='',actionTitle=''){
  const target=document.getElementById(id);if(!target)return;
  if(id==='join'){
   document.getElementById('joinActionId').value=actionId;document.getElementById('joinActionTitle').value=actionTitle;
   document.querySelector('#join h2').textContent='Придружи се акцији';document.querySelector('#join>p').textContent=actionTitle;document.getElementById('joinMessage').textContent='';
  }
  if(sheetTarget)window.hidePanels();
  sheetTarget=target;sheetParent=target.parentNode;sheetNext=target.nextSibling;sheetContent.appendChild(target);
  target.hidden=false;target.classList.add('active');
  const isJoin=id==='joinChoice';
  document.getElementById('sheetTop').classList.toggle('join-header',isJoin);
  document.getElementById('sheetBack').hidden=true;document.getElementById('sheetHeading').hidden=true;
  document.getElementById('sheetKicker').textContent='';
  document.getElementById('sheetTitle').textContent=isJoin?'':id==='proposal'?'Предложи акцију':id==='campaignProposal'?'Покрени кампању':id==='campaignJoin'?'Прикључи се кампањи':id==='campaignDetail'?'О кампањи':id==='join'?'Придружи се акцији':id==='membership'?'Пријава за чланство':id==='support'?'Подржи акцију':'Акције којима можеш да се придружиш';
  if(isJoin)window.setJoinHeader('ОДГОВОРНА ПЛАНА · ЗАЈЕДНИЧКО ДЕЛОВАЊЕ','Укључи се.','Изабери како желиш да се укључиш.',null);
  sheetBackdrop.hidden=false;bottomSheet.hidden=false;bottomSheet.setAttribute('aria-hidden','false');
  requestAnimationFrame(()=>{sheetBackdrop.classList.add('open');bottomSheet.classList.add('open')});document.body.classList.add('sheet-open');
 };
 window.openJoinFlow=function(){window.renderJoinChoices();window.showPanel('joinChoice');};
 window.hidePanels=function(){
  if(!sheetTarget)return;
  bottomSheet.classList.remove('open');sheetBackdrop.classList.remove('open');bottomSheet.setAttribute('aria-hidden','true');document.body.classList.remove('sheet-open');
  sheetTarget.classList.remove('active');if(sheetParent)sheetParent.insertBefore(sheetTarget,sheetNext&&sheetNext.parentNode===sheetParent?sheetNext:null);
  sheetTarget.hidden=true;sheetTarget=null;sheetParent=null;sheetNext=null;
  setTimeout(()=>{bottomSheet.hidden=true;sheetBackdrop.hidden=true},330);
 };
 document.getElementById('closeSheet').addEventListener('click',window.hidePanels);
 sheetBackdrop.addEventListener('click',window.hidePanels);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')window.hidePanels();});
 bottomSheet.addEventListener('touchstart',e=>{sheetTouchY=e.touches[0].clientY;},{passive:true});
 bottomSheet.addEventListener('touchend',e=>{if(e.changedTouches[0].clientY-sheetTouchY>90&&sheetContent.scrollTop===0)window.hidePanels();},{passive:true});

 const $=id=>document.getElementById(id);
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 window.renderJoinChoices=function(){
  const root=$('joinFlowContent');if(!root)return;
  setJoinHeader('ОДГОВОРНА ПЛАНА · ЗАЈЕДНИЧКО ДЕЛОВАЊЕ','Укључи се.','Изабери како желиш да се укључиш.',null);
  root.innerHTML='<div class="join-flow-options"><button class="join-flow-option" type="button" onclick="showJoinFlowSection(\'campaign\')"><span class="flow-icon">◎</span><span><strong>Кампање</strong><small>Кампања окупља људе око проблема или заједничког циља. Повезује више активности и помаже да се истрајно ради на решењу.</small></span><span class="join-flow-arrow">→</span></button><button class="join-flow-option" type="button" onclick="showJoinFlowSection(\'action\')"><span class="flow-icon">✓</span><span><strong>Акције</strong><small>Акција је конкретан корак у нашој заједници. Предложи шта треба урадити или се прикључи људима који су већ започели рад.</small></span><span class="join-flow-arrow">→</span></button><button class="join-flow-option" type="button" onclick="showJoinFlowSection(\'movement\')"><span class="flow-icon">♡</span><span><strong>Покрет</strong><small>Покрет повезује људе, идеје и иницијативе и отвара простор да заједно преузмемо одговорност за промене.</small></span><span class="join-flow-arrow">→</span></button></div>';
 };
 window.showJoinFlowSection=async function(kind){
  const root=$('joinFlowContent');if(!root)return;
  const pages={campaign:['ОДГОВОРНА ПЛАНА · КАМПАЊЕ','Кампање','Кампања окупља људе око проблема или заједничког циља. Повезује више активности, информисање и подршку како бисмо истрајно радили на решењу.'],action:['ОДГОВОРНА ПЛАНА · АКЦИЈЕ','Акције','Акција је конкретан корак који предузимамо у својој заједници. Можеш да предложиш шта треба урадити, прикључиш се другима и помогнеш да се нешто заиста промени.'],movement:['ОДГОВОРНА ПЛАНА · ПОКРЕТ','Покрет','Покрет Одговорна Плана повезује грађане који желе да учествују у животу своје заједнице, покрећу идеје, организују активности и преузимају одговорност за промене.']};
  if(kind==='support'){
   setJoinHeader('ОДГОВОРНА ПЛАНА · ПОДРШКА','Подржи другачије','Изабери начин на који можеш да допринесеш.',()=>showJoinFlowSection('movement'));
   const choices=[['Време и рад','Учествуј у акцијама и раду на терену.'],['Знање и вештине','Помози својим знањем и искуством.'],['Материјална подршка','Алат, опрема, материјал или превоз.'],['Финансијска подршка','Подржи активности средствима.'],['Предлог и сарадња','Предложи идеју или заједнички рад.']];
   root.innerHTML='<div class="join-flow-options">'+choices.map((x,i)=>'<button class="join-flow-option" type="button" onclick="showJoinSupportForm('+i+')"><span><strong>'+x[0]+'</strong><small>'+x[1]+'</small></span><span class="join-flow-arrow">→</span></button>').join('')+'</div>';return;
  }
  const p=pages[kind];if(!p)return;
  setJoinHeader(p[0],p[1],p[2],()=>renderJoinChoices());
  if(kind==='movement'){
   root.innerHTML='<div class="join-flow-list"><div class="association-card"><div class="association-icon">♡</div><h3>Придружи се Покрету Одговорна Плана</h3><p>Покрет Одговорна Плана повезује грађане који желе да буду део промена у својој заједници. То је простор за људе који имају идеје, желе да покрену иницијативу, подрже друге и преузму део одговорности за место у ком живе.</p><p>Удружење повезује људе који желе да своје време, знање, искуство и идеје ставе у службу заједнице. Можеш да учествујеш у организовању активности, помогнеш својим знањем или предложиш шта би требало да мењамо у нашој општини.</p><div class="association-points"><div class="association-point"><b>✓</b><span>Учешће у акцијама и заједничким активностима</span></div><div class="association-point"><b>✓</b><span>Предлагање идеја и покретање иницијатива</span></div><div class="association-point"><b>✓</b><span>Дељење знања, искуства и времена</span></div></div><p>Информације о условима и поступку учлањења добићеш од удружења.</p><button class="join-product-shop" type="button" onclick="showPanel(\'membership\')">Прикључи се Покрету</button></div><div class="support-intro-copy"><h3>Подржи рад Одговорне Плане</h3><p>За повезивање људи, припрему акција и одржавање овог простора потребни су време, знање и средства. Рад можеш да подржиш куповином производа или на други начин који ти одговара.</p></div><div class="join-product"><div class="join-product-image"><img src="https://hmfeizkmpmxcnzhwxgbn.supabase.co/storage/v1/object/public/Proizvodi/Privezak-plana.png" alt="Привезак Одговорна Плана"></div><div class="join-product-details"><strong class="join-product-name">Привезак Одговорна Плана</strong><p>Куповином подржаваш рад Покрета.</p><strong>150 дин.</strong><button class="join-product-shop" type="button" onclick="toggleJoinProductOrder()">Наручи →</button></div></div><div class="join-order-box" id="joinOrderBox" hidden><h3>Подаци за наруџбину</h3><div class="join-order-quantity"><span>Количина</span><div><button type="button" id="joinQtyMinus">−</button><output id="joinQty">1</output><button type="button" id="joinQtyPlus">+</button></div><strong id="joinOrderTotal">150 динара</strong></div><form id="joinProductOrderForm"><label>Име *</label><input name="first_name" required maxlength="80"><label>Презиме *</label><input name="last_name" required maxlength="80"><label>Телефон *</label><input name="phone" type="tel" required maxlength="40"><label>Место *</label><input name="city" required maxlength="100"><label>Адреса или напомена за преузимање</label><input name="pickup_note" maxlength="220"><p class="join-order-error" id="joinOrderError" role="alert"></p><button class="join-product-shop" type="submit">Потврди наруџбину</button></form><div id="joinOrderSuccess" class="join-order-success" hidden></div></div><button class="support-different-button" type="button" onclick="showJoinFlowSection(\'support\')">Прикључи се на другачији начин</button></div>';
   initJoinProductOrder();return;
  }
  root.innerHTML='<div id="joinFlowItems" class="join-flow-list"><p class="join-flow-description">Учитавање...</p></div>';
  const list=$('joinFlowItems');
  try{
   const table=kind==='campaign'?'campaigns':'actions';
   const fields=kind==='campaign'?'id,title,slug,description,goal,hero_image':'id,title,slug,summary,description,image_url,location';
   const {data,error}=await civicDb.from(table).select(fields).eq('is_published',true).order('created_at',{ascending:false}).limit(30);
   if(error)throw error;
   list.innerHTML=data?.length?data.map(x=>{const title=esc(x.title),desc=esc(x.description||x.summary||x.goal||'Погледај детаље и начин да допринесеш.'),img=kind==='campaign'?x.hero_image:x.image_url,photo=img&&/^https?:\/\//i.test(img)?'<img src="'+esc(img)+'" alt="" loading="lazy">':'',url=(kind==='campaign'?'/kampanja.html?slug=':'/akcija.html?slug=')+encodeURIComponent(x.slug||x.id);return '<a class="join-flow-card" href="'+url+'">'+photo+'<span><strong>'+title+'</strong><small>'+desc+'</small><span class="join-flow-action">Погледај '+(kind==='campaign'?'кампању':'акцију')+' →</span></span></a>';}).join(''):'<p class="join-flow-description">Тренутно нема објављених '+(kind==='campaign'?'кампања.':'акција.')+'</p>';
   const add=document.createElement('button');add.className='add-button';add.type='button';add.textContent=kind==='campaign'?'＋ Додај кампању':'＋ Додај акцију';add.onclick=()=>showPanel(kind==='campaign'?'campaignProposal':'proposal');list.appendChild(add);
  }catch(e){console.error('Грешка при учитавању садржаја панела:',e);list.innerHTML='<p class="join-flow-description">Садржај тренутно није доступан. Покушај поново касније.</p>';}
 };
 window.showJoinSupportForm=function(i){
  const names=['Време и рад','Знање и вештине','Материјална подршка','Финансијска подршка','Предлог и сарадња'];if(!names[i])return;
  setJoinHeader('ОДГОВОРНА ПЛАНА · ПОДРШКА ПОКРЕТУ',names[i],'Остави нам контакт и кратко опиши како желиш да помогнеш.',()=>showJoinFlowSection('support'));
  const target=$('joinFlowContent');target.innerHTML='<div class="join-flow-list"><div class="association-card"><p>Изабрали сте: <strong>'+names[i]+'</strong>.</p><p>За ову врсту подршке користи постојећи контакт са Покретом.</p><button class="join-product-shop" type="button" onclick="showPanel(\'membership\')">Пријава за Покрет</button></div></div>';
 };
 let quantity=1;
 function updateTotal(){if($('joinQty'))$('joinQty').textContent=quantity;if($('joinOrderTotal'))$('joinOrderTotal').textContent=(quantity*150).toLocaleString('sr-RS')+' динара';}
 window.toggleJoinProductOrder=function(){const box=$('joinOrderBox');if(!box)return;box.hidden=!box.hidden;if(!box.hidden){quantity=1;updateTotal();box.scrollIntoView({behavior:'smooth',block:'nearest'});}};
 function initJoinProductOrder(){
  const form=$('joinProductOrderForm');if(!form||form.dataset.ready)return;form.dataset.ready='1';
  $('joinQtyMinus').onclick=()=>{quantity=Math.max(1,quantity-1);updateTotal();};
  $('joinQtyPlus').onclick=()=>{quantity=Math.min(99,quantity+1);updateTotal();};
  form.onsubmit=async e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form),button=form.querySelector('[type=submit]'),error=$('joinOrderError');button.disabled=true;error.textContent='';button.textContent='Шаљем наруџбину…';
   try{const {data,error:dbError}=await civicDb.rpc('create_public_order',{p_first_name:String(d.get('first_name')).trim(),p_last_name:String(d.get('last_name')).trim(),p_phone:String(d.get('phone')).trim(),p_city:String(d.get('city')).trim(),p_pickup_note:String(d.get('pickup_note')||'').trim(),p_quantity:quantity});if(dbError)throw dbError;const order=Array.isArray(data)?data[0]:data;if(!order||!order.order_number)throw new Error('Наруџбина није потврђена у бази.');form.hidden=true;$('joinOrderSuccess').hidden=false;$('joinOrderSuccess').textContent='Наруџбина '+order.order_number+' је примљена. Укупно: '+Number(order.total).toLocaleString('sr-RS')+' динара. Јавићемо ти се ради договора о преузимању или достави.';}catch(err){console.error(err);error.textContent='Наруџбина није послата. Проверите податке и покушајте поново.';}finally{button.disabled=false;button.textContent='Потврди наруџбину';}
  };
  updateTotal();
 }
})();
