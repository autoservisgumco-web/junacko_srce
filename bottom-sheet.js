/* HTML омотач заједничког панела — убацује се пре повезивања његових контрола. */
document.body.insertAdjacentHTML('beforeend', `<div class="sheet-backdrop" id="sheetBackdrop" hidden></div>
<section class="bottom-sheet" id="bottomSheet" role="dialog" aria-modal="true" aria-hidden="true" hidden>
<div class="sheet-handle" aria-hidden="true"><span></span></div>
<div class="sheet-top" id="sheetTop"><div class="sheet-top-row"><button class="sheet-back" id="sheetBack" type="button" aria-label="Назад" hidden>←</button><span class="sheet-kicker" id="sheetKicker"></span><span class="sheet-title" id="sheetTitle"></span><button class="sheet-close" id="closeSheet" type="button" aria-label="Затвори">×</button></div><div class="sheet-heading" id="sheetHeading" hidden><h2 id="sheetHeadingTitle"></h2><p id="sheetDescription"></p></div></div>
<div class="sheet-content" id="sheetContent"></div>
</section>`);

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
  const options=[
   {name:'Време и рад',type:'Физичко учешће',hint:'У којим акцијама или пословима желиш да учествујеш?'},
   {name:'Знање и вештине',type:'Знање и стручна помоћ',hint:'Које знање, вештине или искуство можеш да понудиш?'},
   {name:'Материјална подршка',type:'Материјална подршка',hint:'Шта можеш да обезбедиш — алат, опрему, материјал, превоз...?'},
   {name:'Финансијска подршка',type:'Финансијска подршка',hint:'Напиши ако имаш питање или предлог у вези са финансијском подршком.'},
   {name:'Предлог и сарадња',type:'Предлог и сарадња',hint:'Опиши своју идеју или предлог.'}
  ];
  const selected=options[i];if(!selected)return;
  setJoinHeader('ОДГОВОРНА ПЛАНА · ПОДРШКА ПОКРЕТУ',selected.name,'Остави контакт и напиши како можеш да допринесеш.',()=>showJoinFlowSection('support'));
  const root=$('joinFlowContent');
  root.innerHTML='<div class="join-flow-list"><div class="association-card"><p>Изабрано: <strong>'+esc(selected.name)+'</strong></p><form id="joinSupportFlowForm"><div class="support-form-grid"><label>Име и презиме *<input name="full_name" required maxlength="120" autocomplete="name"></label><label>Телефон *<input name="phone" type="tel" required maxlength="50" autocomplete="tel"></label><label>Имејл<input name="email" type="email" maxlength="180" autocomplete="email"></label><label>Место<input name="location" maxlength="180"></label><label class="support-form-wide">Како конкретно можеш да помогнеш?<textarea name="description" rows="4" maxlength="2500" placeholder="'+esc(selected.hint)+'"></textarea></label></div><p id="joinSupportFlowMessage" role="status" aria-live="polite"></p><button class="join-product-shop" type="submit">Пошаљи пријаву</button></form></div></div>';
  const form=$('joinSupportFlowForm'),message=$('joinSupportFlowMessage'),submit=form.querySelector('[type="submit"]');
  form.addEventListener('submit',async e=>{
   e.preventDefault();if(!form.reportValidity())return;
   const d=new FormData(form);submit.disabled=true;submit.textContent='Шаљем пријаву…';message.textContent='';message.style.color='';
   try{
    const client=window.supabase.createClient('https://hmfeizkmpmxcnzhwxgbn.supabase.co','sb_publishable_JPtLezaiIeq4MsQ2f3LSlg_nT01Chxe');
    const {error}=await client.from('civic_submissions').insert({submission_type:'help',title:'Подршка раду Покрета Одговорна Плана',description:String(d.get('description')||'').trim()||'Пријава за подршку раду Покрета Одговорна Плана.',full_name:String(d.get('full_name')||'').trim(),phone:String(d.get('phone')||'').trim(),email:String(d.get('email')||'').trim()||null,location:String(d.get('location')||'').trim()||null,support_type:selected.type,status:'new',social_links:{source:'ukljuci-se',scope:'project'}});
    if(error)throw error;
    message.style.color='#176b3a';message.textContent='Хвала ти! Пријава је послата. Јавићемо ти се да договоримо детаље.';form.reset();submit.textContent='Пријава је послата';
   }catch(error){console.error('Грешка при слању пријаве за подршку:',error);message.style.color='#b42318';message.textContent='Пријава није послата. Покушај поново.';submit.disabled=false;submit.textContent='Пошаљи пријаву';}
  });
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

/* Обрада јавних форми — издвојена из index.html */
(function(){
/* Предлог акције: фотографије се чувају у приватном bucket-у и везују за пријаву. */
async function uploadActionProposalFiles(files,submissionId){
 const paths=[];
 for(const file of Array.from(files||[])){
  if(!['image/jpeg','image/png','image/webp','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type))throw new Error('Формат датотеке није дозвољен.');
  if(file.size>15*1024*1024)throw new Error('Свака датотека мора бити мања од 15 MB.');
  const clean=file.name.replace(/[^a-zA-Z0-9._-]/g,'_').slice(-100);
  const path=submissionId+'/'+Date.now()+'-'+clean;
  const {error}=await civicDb.storage.from('action-proposal-files').upload(path,file,{contentType:file.type,upsert:false});
  if(error)throw error;
  paths.push(path);
 }
 return paths;
}
document.getElementById('joinForm').addEventListener('submit',async event=>{
 event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
 const btn=form.querySelector('button[type="submit"]');btn.disabled=true;btn.textContent='Слање...';
 const actionId=document.getElementById('joinActionId').value;
 const method=document.getElementById('joinMethod').value;
 const note=document.getElementById('joinHelp').value.trim();
 const payload={action_id:actionId,full_name:document.getElementById('joinName').value.trim(),phone:document.getElementById('joinPhone').value.trim(),message:'Начин прикључења: '+method+(note?'\\n'+note:''),form_data:{participation_method:method},status:'new',source:'website'};
 try{
  const {error}=await civicDb.from('support_applications').insert(payload);
  if(error)throw error;
  form.reset();showJoinSuccess();
 }catch(error){
  console.error('Грешка при слању пријаве за акцију:',error);
  showSubmitMessage('joinMessage','Пријава није послата. Проверите интернет везу и покушајте поново.',true);
 }finally{btn.disabled=false;btn.textContent='Пошаљи пријаву';}
});
document.getElementById('membershipForm').addEventListener('submit',async event=>{
 event.preventDefault();const form=event.currentTarget;const btn=form.querySelector('button[type="submit"]');btn.disabled=true;btn.textContent='Слање...';
 const payload={submission_type:'membership',title:'Пријава за укључивање у Одговорну Плану',description:document.getElementById('membershipNote').value.trim()||'Пријава за укључивање у рад организације.',full_name:document.getElementById('membershipName').value.trim(),phone:document.getElementById('membershipPhone').value.trim(),viber_phone:document.getElementById('membershipPhone').value.trim(),email:document.getElementById('membershipEmail').value.trim()||null,support_type:document.getElementById('membershipWay').value,status:'new'};
 const {error}=await civicDb.from('civic_submissions').insert(payload);
 btn.disabled=false;btn.textContent='Пошаљи пријаву';
 if(error){alert('Пријава није послата. Проверите интернет везу и покушајте поново.');return;}
 form.reset();hidePanels();showJoinSuccess();
});
document.getElementById('proposalForm').addEventListener('submit',async event=>{
 event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const btn=form.querySelector('button[type="submit"]');btn.disabled=true;btn.textContent='Слање...';
 const title=form.querySelector('input[placeholder="Шта предлажеш?"]').value.trim();
 const description=form.querySelector('textarea[placeholder="Опиши идеју..."]').value.trim();
 const fullName=form.querySelector('input[placeholder="Име и презиме"]').value.trim();
 const phone=form.querySelector('input[placeholder="Број телефона"]').value.trim();
 const files=document.getElementById('proposalPhotos').files;
 const submissionId=crypto.randomUUID();
 let attachments=[];
 try{attachments=await uploadActionProposalFiles(files,submissionId);}catch(uploadError){btn.disabled=false;btn.textContent='Пошаљи предлог';showSubmitMessage('proposalMessage',uploadError.message||'Датотеке нису отпремљене. Покушајте поново.',true);return;}
 const payload={id:submissionId,submission_type:'action',title,description,full_name:fullName,phone,viber_phone:phone,social_links:{attachments},status:'new'};
 const {error}=await civicDb.from('civic_submissions').insert(payload);
 btn.disabled=false;btn.textContent='Пошаљи предлог';
 if(error){showSubmitMessage('proposalMessage','Предлог није послат. Проверите интернет везу и покушајте поново.',true);return;}
 form.reset();showSubmitMessage('proposalMessage','success',false);
});

loadActiveActions();
initShopPage();

let deferredInstallPrompt=null;
window.addEventListener('beforeinstallprompt',event=>{
 event.preventDefault();deferredInstallPrompt=event;
 const button=document.getElementById('installAppBtn');if(button)button.hidden=false;
});
document.getElementById('installAppBtn')?.addEventListener('click',async()=>{
 if(!deferredInstallPrompt)return;
 deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;
 deferredInstallPrompt=null;const button=document.getElementById('installAppBtn');if(button)button.hidden=true;closeSideMenu();
});
window.addEventListener('appinstalled',()=>{const button=document.getElementById('installAppBtn');if(button)button.hidden=true;deferredInstallPrompt=null;});
/* PWA: региструј service worker и учитај живе акције и кампање */
if('serviceWorker' in navigator && location.protocol.startsWith('http')) {
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('PWA service worker:',err)));
}
function safeHomeText(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function homeActionCard(action){
 const node=document.createElement('article');node.className='home-live-card';
 if(action.image_url){const img=document.createElement('img');img.src=action.image_url;img.alt='';img.loading='lazy';node.appendChild(img);}
 const tag=document.createElement('span');tag.className='tag';tag.textContent=action.status==='completed'?'ЗАВРШЕНА АКЦИЈА':'АКЦИЈА';node.appendChild(tag);
 const h=document.createElement('h3');h.textContent=action.title;node.appendChild(h);
 const p=document.createElement('p');p.textContent=action.summary||action.description||'Погледај детаље о акцији и начину учешћа.';node.appendChild(p);
 if(action.location){const loc=document.createElement('p');loc.textContent='📍 '+action.location;node.appendChild(loc);}
 const actions=document.createElement('div');actions.className='home-card-actions';
 const detail=document.createElement('a');detail.className='btn secondary';detail.textContent='Детаљи';const url=new URL('index.html',location.href);url.searchParams.set('akcija',action.slug||action.id);detail.href=url.href;actions.appendChild(detail);
 if(action.status!=='completed'){const join=document.createElement('button');join.className='btn';join.type='button';join.textContent='Прикључи се';join.addEventListener('click',()=>showPanel('join',action.id,action.title));actions.appendChild(join);}
 node.appendChild(actions);return node;
}
async function loadHomeActions(){
 const list=document.getElementById('homeActionCards');if(!list)return;
 const {data,error}=await civicDb.from('actions').select('id,title,slug,summary,description,location,status,action_date,image_url').eq('is_published',true).order('created_at',{ascending:false}).limit(3);
 list.replaceChildren();
 if(error||!data){list.innerHTML='<p class="home-live-loading">Акције тренутно нису доступне. Покушај поново касније.</p>';return;}
 if(!data.length){list.innerHTML='<p class="home-live-loading">Тренутно нема објављених акција. Можеш да покренеш нову.</p>';return;}
 data.forEach(item=>list.appendChild(homeActionCard(item)));
}
function homeCampaignCard(campaign){
 const node=document.createElement('article');node.className='home-live-card';
 if(campaign.hero_image && /^https?:\/\//i.test(campaign.hero_image)){const img=document.createElement('img');img.src=campaign.hero_image;img.alt='';img.loading='lazy';node.appendChild(img);}
 const tag=document.createElement('span');tag.className='tag';tag.textContent='КАМПАЊА';node.appendChild(tag);
 const h=document.createElement('h3');h.textContent=campaign.title;node.appendChild(h);
 const p=document.createElement('p');p.textContent=campaign.description||campaign.goal||'Упознај заједнички циљ и види како можеш да допринесеш.';node.appendChild(p);
 const actions=document.createElement('div');actions.className='home-card-actions';
 const details=document.createElement('button');details.type='button';details.className='btn secondary';details.textContent='Упознај кампању';details.addEventListener('click',()=>openCampaignDetail(campaign));actions.appendChild(details);
 const join=document.createElement('button');join.type='button';join.className='btn';join.textContent='Прикључи се';join.addEventListener('click',()=>openCampaignJoin(campaign));actions.appendChild(join);
 node.appendChild(actions);return node;
}
let allCampaigns=[];
async function loadHomeCampaigns(showAll=false){
 const list=document.getElementById('homeCampaignCards');if(!list)return;
 const {data,error}=await civicDb.from('campaigns').select('id,title,slug,description,goal,hero_image,status,is_published').eq('is_published',true).order('created_at',{ascending:false}).limit(showAll?50:3);
 list.replaceChildren();
 if(error||!data){list.innerHTML='<p class="home-live-loading">Кампање тренутно нису доступне. Покушај поново касније.</p>';return;}
 allCampaigns=data;
 if(!data.length){list.innerHTML='<p class="home-live-loading">Тренутно нема објављених кампања.</p>';return;}
 data.forEach(item=>list.appendChild(homeCampaignCard(item)));
 const more=document.getElementById('showAllCampaigns');if(more){more.hidden=showAll||data.length<3;more.textContent='Прикажи све кампање';}
}
function openCampaignDetail(campaign){
 document.getElementById('campaignDetailTitle').textContent=campaign.title;
 document.getElementById('campaignDetailDescription').textContent=campaign.description||'';
 document.getElementById('campaignDetailGoal').textContent=campaign.goal?'Циљ: '+campaign.goal:'';
 document.getElementById('campaignDetailJoin').onclick=()=>openCampaignJoin(campaign);
 showPanel('campaignDetail');
}
function openCampaignJoin(campaign){
 document.getElementById('campaignJoinId').value=campaign.id;
 document.getElementById('campaignJoinTitle').textContent=campaign.title;
 document.getElementById('campaignJoinMessage').textContent='';
 showPanel('campaignJoin');
}
document.getElementById('showAllCampaigns')?.addEventListener('click',()=>loadHomeCampaigns(true));
loadHomeActions();loadHomeCampaigns();

/* Предлог акције: фотографије се чувају у приватном bucket-у и везују за пријаву. */
async function uploadActionProposalFiles(files,submissionId){
 const paths=[];
 for(const file of Array.from(files||[])){
  if(!['image/jpeg','image/png','image/webp','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type))throw new Error('Формат датотеке није дозвољен.');
  if(file.size>15*1024*1024)throw new Error('Свака датотека мора бити мања од 15 MB.');
  const clean=file.name.replace(/[^a-zA-Z0-9._-]/g,'_').slice(-100);
  const path=submissionId+'/'+Date.now()+'-'+clean;
  const {error}=await civicDb.storage.from('action-proposal-files').upload(path,file,{contentType:file.type,upsert:false});
  if(error)throw error;
  paths.push(path);
 }
 return paths;
}
document.getElementById('supportForm')?.addEventListener('submit',async event=>{
 event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const btn=form.querySelector('button[type="submit"]');btn.disabled=true;btn.textContent='Слање...';
 const selected=document.getElementById('supportAction');const actionTitle=selected.options[selected.selectedIndex].text;
 const payload={submission_type:'help',title:'Подршка акцији: '+actionTitle,description:document.getElementById('supportDescription').value.trim(),full_name:document.getElementById('supportName').value.trim(),phone:document.getElementById('supportPhone').value.trim(),viber_phone:document.getElementById('supportPhone').value.trim(),support_type:'Подршка акцији',social_links:{action_slug:selected.value},status:'new'};
 const {error}=await civicDb.from('civic_submissions').insert(payload);btn.disabled=false;btn.textContent='Пошаљи подршку';
 if(error){showSubmitMessage('supportMessage','Подршка није послата. Проверите податке и покушајте поново.',true);return;}
 form.reset();showSubmitMessage('supportMessage','success',false);
});
document.getElementById('campaignProposalForm')?.addEventListener('submit',async event=>{
 event.preventDefault();const form=event.currentTarget;const btn=form.querySelector('button[type="submit"]');if(!form.reportValidity())return;
 btn.disabled=true;btn.textContent='Слање...';
 const payload={submission_type:'campaign',title:document.getElementById('campaignProposalTitle').value.trim(),description:document.getElementById('campaignProposalDescription').value.trim(),full_name:document.getElementById('campaignProposalName').value.trim(),phone:document.getElementById('campaignProposalPhone').value.trim(),viber_phone:document.getElementById('campaignProposalPhone').value.trim(),status:'new'};
 const {error}=await civicDb.from('civic_submissions').insert(payload);
 btn.disabled=false;btn.textContent='Пошаљи предлог кампање';
 if(error){showSubmitMessage('campaignProposalMessage','Предлог кампање није послат. Проверите податке и покушајте поново.',true);return;}
 form.reset();showSubmitMessage('campaignProposalMessage','success',false);
});
document.getElementById('campaignJoinForm')?.addEventListener('submit',async event=>{
 event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const btn=form.querySelector('button[type="submit"]');btn.disabled=true;btn.textContent='Слање...';
 const title=document.getElementById('campaignJoinTitle').textContent;
 const payload={submission_type:'help',title:'Подршка кампањи: '+title,description:'Начин подршке: '+document.getElementById('campaignJoinMethod').value+'. '+document.getElementById('campaignJoinNote').value.trim(),full_name:document.getElementById('campaignJoinName').value.trim(),phone:document.getElementById('campaignJoinPhone').value.trim(),viber_phone:document.getElementById('campaignJoinPhone').value.trim(),support_type:document.getElementById('campaignJoinMethod').value,social_links:{campaign_id:document.getElementById('campaignJoinId').value,campaign_title:title},status:'new'};
 const {error}=await civicDb.from('civic_submissions').insert(payload);
 btn.disabled=false;btn.textContent='Пошаљи пријаву';
 if(error){showSubmitMessage('campaignJoinMessage','Пријава није послата. Проверите податке и покушајте поново.',true);return;}
 form.reset();hidePanels();showJoinSuccess();
});
})();
