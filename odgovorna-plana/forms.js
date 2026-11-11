/* Заједнички обрасци Одговорне Плане — сви уписи иду у civic_submissions. */
(function(){
 'use strict';
 let config={db:null,getContext:()=>({}),getAction:()=>null};
 const val=(fd,key)=>String(fd.get(key)||'').trim();
 function feedback(el,text,type){if(!el)return;el.className='form-message '+(type||'');el.textContent=text;}
 async function save(payload){const {error}=await config.db.from('civic_submissions').insert(payload);if(error)throw error;}
 async function actionJoin(form){
  const action=config.getAction(form.dataset.joinForm);if(!action)return;
  const btn=form.querySelector('[type="submit"]'),msg=form.querySelector('.form-message'),fd=new FormData(form);
  btn.disabled=true;btn.textContent='Шаљем…';feedback(msg,'','');
  try{
   await save({submission_type:'help',title:'Пријава за учешће: '+action.title,description:'Желим да се прикључим акцији: '+action.title,full_name:val(fd,'full_name'),email:val(fd,'email')||null,phone:val(fd,'phone')||null,viber_phone:val(fd,'phone')||null,support_type:'Учешће у акцији',social_links:{source:location.pathname,action_id:action.id,action_title:action.title,campaign_id:action.campaign_id||null},status:'new'});
   feedback(msg,'Пријава је послата. Хвала што желиш да учествујеш!','success');form.reset();
  }catch(e){console.error(e);feedback(msg,'Пријава није послата. Провери податке и покушај поново.','error');}
  finally{btn.disabled=false;btn.textContent='Пошаљи пријаву →';}
 }
 async function general(form){
  const ctx=config.getContext()||{},btn=form.querySelector('[type="submit"]'),msg=document.getElementById('modalMessage'),fd=new FormData(form),kind=ctx.kind||'help',proposal=kind==='campaign'||kind==='action';
  const title=proposal?val(fd,'title'):(kind==='campaign-help'?'Подршка кампањи: '+(ctx.campaignTitle||'Кампања'):'Подршка раду Покрета Одговорна Плана');
  btn.disabled=true;btn.textContent='Шаљем…';feedback(msg,'','');
  try{
   await save({submission_type:proposal?kind:'help',title,description:val(fd,'description'),full_name:val(fd,'full_name'),email:val(fd,'email')||null,phone:val(fd,'phone')||null,viber_phone:val(fd,'phone')||null,location:val(fd,'location')||null,support_type:proposal?null:(val(fd,'support_type')||'Подршка раду'),social_links:{source:location.pathname,campaign_id:ctx.campaignId||null,campaign_title:ctx.campaignTitle||null,action_id:ctx.actionId||null,action_title:ctx.actionTitle||null,kind},status:'new'});
   feedback(msg,proposal?'Предлог је успешно послат. Прегледаћемо га и јавити ти се.':'Пријава је послата. Хвала ти на подршци!','success');
   form.reset();const field=document.getElementById('proposalTitleField');if(field)field.hidden=!proposal;
  }catch(e){console.error(e);feedback(msg,'Слање није успело. Провери да ли су поља попуњена и покушај поново.','error');}
  finally{btn.disabled=false;btn.textContent=proposal?'Пошаљи предлог →':'Пошаљи пријаву →';}
 }
 function init(options){config={...config,...options};if(!config.db)throw new Error('OPForms захтева Supabase клијент.');
  window.OPForms.ready=fetch('/forms.html').then(r=>{if(!r.ok)throw new Error('Образац није доступан');return r.text();}).then(markup=>{const mount=document.getElementById('sharedFormsMount');if(mount)mount.innerHTML=markup;});
  document.addEventListener('submit',event=>{const f=event.target;if(f.matches('[data-join-form]')){event.preventDefault();actionJoin(f);}else if(f.id==='participationForm'){event.preventDefault();general(f);}});
 }
 window.OPForms={init,ready:Promise.resolve()};
})();