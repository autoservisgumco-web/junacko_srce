document.getElementById('year').textContent=new Date().getFullYear();const toggle=document.getElementById('menuToggle'),nav=document.getElementById('nav');toggle.addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
/* Визуелно уређивање текста у овом прегледачу. Измене се чувају локално, не у GitHub-у. */
(function(){
 const btn=document.getElementById('editToggle');
 if(!btn)return;
 const key='junacko-srce-edit-v1';
 const help=document.createElement('div');
 help.className='edit-help';
 help.innerHTML='Режим уређивања је укључен. Притисни на означени текст и измени га. Измене се чувају само у овом прегледачу. <button type="button" id="saveLocalEdits">Сачувај</button><button type="button" id="resetLocalEdits">Врати оригинал</button>';
 document.body.appendChild(help);
 const targets=Array.from(document.querySelectorAll('main h1,main h2,main h3,main p,main .button,main .eyebrow'));
 targets.forEach((el,i)=>{el.dataset.editable='true';el.dataset.editIndex=String(i)});
 function restore(){try{const saved=JSON.parse(localStorage.getItem(key)||'{}');targets.forEach((el,i)=>{if(typeof saved[i]==='string')el.innerHTML=saved[i]})}catch(e){}}
 restore();
 btn.addEventListener('click',()=>{const on=!document.body.classList.contains('editing');document.body.classList.toggle('editing',on);help.classList.toggle('show',on);btn.classList.toggle('active',on);btn.textContent=on?'✓ Заврши уређивање':'✎ Уреди приказ';targets.forEach(el=>el.contentEditable=on?'true':'false')});
 document.getElementById('saveLocalEdits').addEventListener('click',()=>{const saved={};targets.forEach(el=>saved[el.dataset.editIndex]=el.innerHTML);localStorage.setItem(key,JSON.stringify(saved));help.firstChild.textContent='Измене су сачуване у овом прегледачу. Не виде их други посетиоци.';});
 document.getElementById('resetLocalEdits').addEventListener('click',()=>{localStorage.removeItem(key);location.reload()});
})();