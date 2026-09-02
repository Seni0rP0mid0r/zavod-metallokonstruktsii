'use strict';
const catalog = [{"id":"pressed","name":"Прессованный настил","category":"grating","type":"pressed"},{"id":"welded","name":"Сварной настил","category":"grating","type":"welded"},{"id":"frame","name":"Металлоконструкции","category":"frame"},{"id":"cabin","name":"Блок-контейнеры","category":"cabin"},{"id":"water","name":"Очистные сооружения","category":"water"},{"id":"doors","name":"Двери","category":"doors"},{"id":"ventilation","name":"Вентиляционные системы","category":"ventilation"}];
const {definitions,defaults,calculate}=MetalCalculator;
const $=s=>document.querySelector(s);
const money=v=>new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0}).format(v);
const states=Object.fromEntries(Object.keys(definitions).map(k=>[k,defaults(k)]));
let active='grating';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let invalid=false;
function result(){return calculate(active,states[active]);}
function fieldLabel(f){return f.type==='select'?f.options.find(o=>o[0]===states[active][f.key])[1]:String(states[active][f.key]).replace('.',',');}
function renderForm(){
  $('#calc-editor').innerHTML=definitions[active].fields.map(f=>'<label class="field" for="field-'+f.key+'"><span>'+f.label+'</span>'+
    (f.type==='select'?'<select id="field-'+f.key+'" name="'+f.key+'">'+f.options.map(([value,label])=>'<option value="'+value+'" '+(states[active][f.key]===value?'selected':'')+'>'+label+'</option>').join('')+'</select>':
    '<input id="field-'+f.key+'" name="'+f.key+'" type="number" min="'+f.min+'" max="'+f.max+'" step="'+f.step+'" value="'+states[active][f.key]+'" inputmode="decimal" aria-describedby="error-'+f.key+'">')+
    '<span class="field-error" id="error-'+f.key+'"></span></label>').join('');
  invalid=false;
  const heightField=$('#field-height');
  if(active==='ventilation' && heightField)heightField.disabled=states.ventilation.section==='round';
  $('#calc-editor').oninput=()=>{
    let valid=true; const next={...states[active]};
    for(const f of definitions[active].fields){
      const input=$('#field-'+f.key);
      const value=f.type==='number'?input.valueAsNumber:input.value;
      const ok=f.type==='select'||(input.value!==''&&input.validity.valid&&Number.isFinite(value));
      input.setAttribute('aria-invalid',String(!ok));
      $('#error-'+f.key).textContent=ok?'':'От '+f.min+' до '+f.max+'; шаг '+f.step;
      if(!ok) valid=false; else next[f.key]=value;
    }
    invalid=!valid;
    if(valid) states[active]=next;
    if(active==='ventilation')$('#field-height').disabled=$('#field-section').value==='round';
    updateTotal();
  };
}
function updateTotal(){
  const r=result();
  $('#total').textContent=invalid?'—':money(r.total);
  $('#calc-breakdown').innerHTML=invalid?'':r.lines.filter(x=>x[1]>0).map(([label,v])=>'<div class="breakdown-line"><span>'+label+'</span><span>'+money(v)+'</span></div>').join('');
  $('#calc-error').textContent=invalid?'Проверьте выделенные параметры. Расчёт временно недоступен.':'';
  $('#view-order').disabled=invalid;
  $('#footer-order').disabled=invalid;
  $('#selection-summary').textContent=definitions[active].name;
  if($('#contact-product'))$('#contact-product').textContent=definitions[active].name+' · '+(invalid?'Проверьте параметры':r.summary+' · '+money(r.total));
  $('#order-count').textContent=invalid?'Исправьте параметры':r.summary;
  document.querySelectorAll('[data-detail]').forEach(el=>{const item=catalog.find(x=>x.id===el.dataset.detail);const yes=item.category===active&&(!item.type||states.grating.type===item.type);el.classList.toggle('current',yes);el.setAttribute('aria-pressed',String(yes));});
}
function selectProduct(key){
  if(!definitions[key])return;
  const changed=active!==key;active=key;
  $('.stack').classList.add('has-selection');
  document.querySelectorAll('[data-product]').forEach(el=>{
    const current=el.dataset.product===key;
    el.classList.toggle('selected',current);
    el.setAttribute('aria-pressed',String(current));
    const icon=el.querySelector('.part-add');if(icon)icon.textContent=current?'●':'○';
  });
  document.querySelectorAll('[data-category]').forEach(el=>{
    el.classList.toggle('active',el.dataset.category===key);
    el.setAttribute('aria-pressed',String(el.dataset.category===key));
  });
  renderForm();updateTotal();
  if(changed&&!reduced) $('#calc-editor').animate([{opacity:.3,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'ease-out'});
}
const tabNames={grating:'Решётчатый настил',frame:'Металло-<br>конструкции',cabin:'Блок-<br>контейнеры',doors:'Двери',ventilation:'Вентиляционные<br>системы',water:'Очистные<br>сооружения'};
$('.calc-tabs').innerHTML=Object.entries(definitions).map(([key,item])=>'<button type="button" data-category="'+key+'" aria-pressed="false">'+(tabNames[key]||item.name)+'</button>').join('');
document.querySelectorAll('[data-product]').forEach(el=>el.addEventListener('click',()=>{
  selectProduct(el.dataset.product);
  if(el.closest('.hero'))scrollToSection($('#calculator'));
}));
document.querySelectorAll('[data-category]').forEach(el=>el.addEventListener('click',()=>selectProduct(el.dataset.category)));
$('#calc-editor').addEventListener('submit',e=>e.preventDefault());

const detailIcon='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9 7h8v8"/></svg>';
$('#product-grid').innerHTML=catalog.map((item,i)=>'<button class="product-card" data-detail="'+item.id+'" aria-pressed="false"><span class="product-index">'+String(i+1).padStart(2,'0')+'</span><h3>'+item.name+'</h3><img src="assets/catalog-'+item.id+'.svg" alt="Чертёж: '+item.name.toLowerCase()+'" loading="lazy"><span class="product-arrow">'+detailIcon+'</span></button>').join('');
document.querySelectorAll('[data-detail]').forEach(el=>el.addEventListener('click',()=>{
  const item=catalog.find(x=>x.id===el.dataset.detail);
  if(item.type)states.grating.type=item.type;
  selectProduct(item.category);
  scrollToSection($('#calculator'));
}));
function openOrder(){
  if(invalid){scrollToSection($('#calculator'));return;}
  const r=result();
  $('#order-title').textContent='Заявка менеджеру';
  $('#request-product').textContent=definitions[active].name+' · '+r.summary;
  $('#lead-status').textContent='';
  $('#order-items').innerHTML='<p class="spec-meta">'+r.summary+'</p><ul class="spec-list">'+definitions[active].fields.map(f=>'<li><span>'+f.label+'</span><strong>'+fieldLabel(f)+'</strong></li>').join('')+'</ul>';
  $('#dialog-total').textContent=money(r.total);
  $('#order-dialog').showModal();
}
$('#view-order').addEventListener('click',openOrder);$('#footer-order').addEventListener('click',openOrder);
document.querySelectorAll('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{
  if(e.target!==dialog)return;
  const r=dialog.getBoundingClientRect();
  if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();
}));
$('#lead-form').addEventListener('submit',e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const phone=form.elements.phone.value.trim(),email=form.elements.email.value.trim();
  form.elements.phone.setCustomValidity('');
  if(!phone&&!email){form.elements.phone.setCustomValidity('Укажите телефон или электронную почту.');form.reportValidity();return;}
  if(phone && phone.replace(/\D/g,'').length<7){form.elements.phone.setCustomValidity('Проверьте номер телефона: не менее 7 цифр.');form.reportValidity();return;}
  if(!form.reportValidity())return;
  $('#lead-status').textContent='Заявка подготовлена: контакты и параметры заполнены. Это демонстрация — письмо не отправлено. Подключение почты будет добавлено позже.';
  $('#lead-status').classList.add('prepared');
});
$('#lead-form').addEventListener('input',()=>{$('#lead-form').elements.phone.setCustomValidity('');$('#lead-status').textContent='';});
const menu=$('.menu-toggle');
menu.addEventListener('click',()=>{
  const open=$('.header').classList.toggle('menu-open');
  menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('.header').classList.remove('menu-open');menu.setAttribute('aria-expanded','false');}});
function scrollToSection(target,immediate=false){
  const top=target.getBoundingClientRect().top+scrollY-$('.header').getBoundingClientRect().height-18;
  window.scrollTo({top:Math.max(0,top),behavior:immediate||reduced?'instant':'smooth'});
}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const id=a.getAttribute('href');const target=id==='#'?document.body:document.querySelector(id);
  if(!target)return;e.preventDefault();
  $('.header').classList.remove('menu-open');menu.setAttribute('aria-expanded','false');
  scrollToSection(target);history.replaceState(null,'',id);
}));
if(!reduced&&window.gsap&&window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.steps article,.request>div').forEach(el=>gsap.fromTo(el,{y:24,opacity:.3},{y:0,opacity:1,duration:.85,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
}
const initialQuery=new URLSearchParams(location.search);
if(['pressed','welded'].includes(initialQuery.get('type')))states.grating.type=initialQuery.get('type');
selectProduct(definitions[initialQuery.get('category')]?initialQuery.get('category'):active);
