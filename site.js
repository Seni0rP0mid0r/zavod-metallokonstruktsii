(() => {
  const header=document.querySelector('.header'), menu=document.querySelector('.menu-toggle');
  if(!document.querySelector('#calculator')) menu.addEventListener('click',()=>{const open=header.classList.toggle('menu-open');menu.setAttribute('aria-expanded',open);});
  document.querySelectorAll('.nav-submenu').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)d.parentElement.querySelectorAll('.nav-submenu').forEach(other=>{if(other!==d)other.open=false;});}));
  const dropdowns=[...document.querySelectorAll('.nav-dropdown')];
  dropdowns.forEach(d=>d.addEventListener('toggle',()=>{if(d.open)dropdowns.filter(x=>x!==d).forEach(x=>x.open=false);}));
  document.addEventListener('click',e=>{if(!e.target.closest('.nav-dropdown'))dropdowns.forEach(d=>d.open=false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){dropdowns.forEach(d=>d.open=false);header.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');}});
  document.querySelectorAll('[data-contact-form]').forEach(form=>{
    form.addEventListener('input',()=>{form.elements.phone.setCustomValidity('');form.querySelector('.contact-status').textContent='';});
    form.addEventListener('submit',e=>{e.preventDefault();const phone=form.elements.phone,email=form.elements.email;
      phone.setCustomValidity(!phone.value.trim()&&!email.value.trim()?'Укажите телефон или электронную почту.':phone.value.trim()&&phone.value.replace(/\D/g,'').length<7?'Проверьте номер: нужно не менее 7 цифр.':'');
      if(!form.reportValidity())return;
      form.querySelector('.contact-status').textContent='Заявка подготовлена. Это демонстрация: письмо не отправлено, данные не сохранены. Подключение почты будет добавлено позже.';
    });
  });
  const partners=[
    [1,1662,407,123,113,333,210,'Роснефть'],[1,1662,407,485,113,333,210,'МВД России'],
    [1,1662,407,848,113,333,210,'Партнёр — логотип из предоставленных материалов'],[1,1662,407,1210,113,333,210,'Минздрав России'],
    [2,1592,392,105,85,327,238,'Министерство обороны Российской Федерации'],[2,1592,392,464,83,333,242,'ЕВРАЗ'],
    [2,1592,392,827,83,332,242,'МЧС России'],[2,1592,392,1189,83,333,242,'Газпром'],
    [3,1545,391,78,79,333,236,'Партнёр — ведомственная эмблема из предоставленных материалов'],
    [3,1545,391,440,79,334,236,'Полюс'],[3,1545,391,806,81,327,232,'РЖД']
  ];
  document.querySelectorAll('[data-partners]').forEach(grid=>partners.forEach(([n,w,h,x,y,cw,ch,name])=>{
    const tile=document.createElement('div');tile.className='partner-tile';tile.title=name;
    const crop=document.createElement('div');crop.className='partner-crop';crop.style.aspectRatio=cw+'/'+ch;
    const img=document.createElement('img');img.src='assets/partners-'+n+'.png';img.alt=name;img.loading='lazy';
    img.style.cssText='width:'+w/cw*100+'%;left:'+(-x/cw*100)+'%;top:'+(-y/ch*100)+'%;';
    crop.append(img);tile.append(crop);grid.append(tile);
  }));
  document.querySelectorAll('[data-partners]').forEach((grid,index)=>{
    grid.classList.add('is-carousel');grid.id='partners-track-'+index;grid.tabIndex=0;grid.setAttribute('aria-label','Логотипы партнёров. Листайте стрелками или свайпом');
    const controls=document.createElement('div');controls.className='carousel-controls';controls.innerHTML='<span class="partner-position" aria-live="polite"></span><button type="button" aria-label="Предыдущие партнёры">←</button><button type="button" aria-label="Следующие партнёры">→</button>';
    grid.after(controls);const [prev,next]=controls.querySelectorAll('button');[prev,next].forEach(b=>b.setAttribute('aria-controls',grid.id));
    const update=()=>{const max=grid.scrollWidth-grid.clientWidth;prev.disabled=grid.scrollLeft<2;next.disabled=grid.scrollLeft>=max-2;const width=grid.firstElementChild.getBoundingClientRect().width+1;const start=Math.round(grid.scrollLeft/width)+1;const end=Math.min(partners.length,Math.ceil((grid.scrollLeft+grid.clientWidth)/width));controls.querySelector('span').textContent=(start===end?start:start+'–'+end)+' / '+partners.length;};
    const move=direction=>grid.scrollBy({left:direction*(grid.firstElementChild.getBoundingClientRect().width+1),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));grid.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}});
    grid.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(grid);update();
  });
  const stage=document.querySelector('.showcase-stage');if(!stage)return;
  const slides=[
    ['platform','ПРОЧНАЯ ОПОРА.\nОТКРЫТАЯ СТРУКТУРА.','Решётчатый настил для проходов, площадок и технологических перекрытий.','grating','Подробнее о настиле'],
    ['structure','БОЛЬШИЕ ПРОЛЁТЫ.\nТОЧНЫЕ СОЕДИНЕНИЯ.','Металлоконструкции как основа производственных и складских пространств.','structures','Подробнее о конструкциях'],
    ['modules','ГОТОВАЯ ФОРМА.\nВАША КОМПЛЕКТАЦИЯ.','Блок-контейнеры для рабочих, бытовых и технических задач.','cabins','Подробнее о модулях']
  ];let current=0;
  let slideRequest=0;
  async function show(i){schedule();current=(i+slides.length)%slides.length;const request=++slideRequest,s=slides[current],img=document.querySelector('#showcase-image');
    const preload=new Image();preload.src='assets/showcase-'+s[0]+'.png';
    try{await preload.decode();}catch{return;}if(request!==slideRequest)return;
    img.src='assets/showcase-'+s[0]+'.png';img.alt='Концептуальная визуализация: '+s[2];
    document.querySelector('#slide-title').textContent=s[1];document.querySelector('#slide-text').textContent=s[2];
    document.querySelector('#slide-link').href='page.html?slug='+s[3];document.querySelector('#slide-link').textContent=s[4]+' ↗';
    document.querySelector('#slide-count').textContent='0'+(current+1)+' / 03';
    document.querySelectorAll('[data-slide]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.slide===current)));
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches)img.animate([{opacity:.45,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:350,easing:'cubic-bezier(.16,1,.3,1)'});
  }
  const showcase=stage.closest('.showcase'),motion=matchMedia('(prefers-reduced-motion: reduce)');
  const pause=document.createElement('button');pause.type='button';pause.id='slide-pause';
  document.querySelector('#slide-prev').before(pause);
  let timer,visible=false,paused=motion.matches;
  function schedule(){clearTimeout(timer);if(visible&&!paused&&!document.hidden)timer=setTimeout(()=>show(current+1),3500);}
  function pauseLabel(){pause.textContent=paused?'Продолжить':'Пауза';pause.setAttribute('aria-label',paused?'Включить автоматическую смену слайдов':'Остановить автоматическую смену слайдов');pause.setAttribute('aria-pressed',String(paused));}
  pause.addEventListener('click',()=>{paused=!paused;pauseLabel();schedule();});pauseLabel();
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.25}).observe(stage);
  document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',()=>{paused=motion.matches;pauseLabel();schedule();});
  document.querySelectorAll('[data-slide]').forEach(b=>b.addEventListener('click',()=>show(+b.dataset.slide)));
  document.querySelector('#slide-prev').addEventListener('click',()=>show(current-1));
  document.querySelector('#slide-next').addEventListener('click',()=>show(current+1));
  stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(current+(e.key==='ArrowRight'?1:-1));}});
})();

// Compact, keyboard-accessible information tabs.
(() => {
 const flow=document.querySelector('.engineering-flow');if(!flow)return;
 const articles=[...flow.querySelectorAll('article')];
 const tabs=document.createElement('div');tabs.className='engineering-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Этапы работы');
 const details=[
 ['Что подготовить','Укажите назначение изделия, габариты, количество и условия эксплуатации. Для настила важны нагрузки, пролёты и схема опирания. Приложите имеющиеся чертежи, спецификацию и требования к материалу. Неизвестные параметры можно обозначить отдельно для уточнения.'],
 ['Что прорабатываем','Технический отдел рассматривает исходные документы, индивидуальные чертежи, раскладку настила и деталировку КМД. Уточняются размеры, вырезы, соединения и комплектность. Состав документации и объём работ определяются по конкретной задаче.'],
 ['Что согласовываем','В спецификации фиксируются размеры и количество изделий, материал, покрытие, обрамление и необходимые комплектующие. Проверьте актуальность чертежей и отдельно обозначьте изменения: итоговый состав должен соответствовать вашему проекту.'],
 ['Что нужно для предложения','Сообщите город поставки, желаемые сроки и требования к комплектности. Стоимость, сроки изготовления, доставка и разгрузка обсуждаются отдельно. Калькулятор на сайте даёт демонстрационный ориентир; окончательные условия требуют согласования.']
 ];
 const buttons=articles.map((article,i)=>{const b=document.createElement('button');b.type='button';b.id='engineering-tab-'+i;b.setAttribute('role','tab');b.setAttribute('aria-controls','engineering-panel-'+i);b.textContent=article.querySelector('span').textContent;b.addEventListener('click',()=>select(i));b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%articles.length;if(e.key==='ArrowLeft')next=(i+articles.length-1)%articles.length;if(e.key==='Home')next=0;if(e.key==='End')next=articles.length-1;if(next!==undefined){e.preventDefault();select(next);buttons[next].focus();}});tabs.append(b);
 article.querySelector('span').remove();article.id='engineering-panel-'+i;article.setAttribute('role','tabpanel');article.setAttribute('aria-labelledby',b.id);article.tabIndex=0;
 const extra=document.createElement('div');extra.className='engineering-extra';const h=document.createElement('h4'),p=document.createElement('p');h.textContent=details[i][0];p.textContent=details[i][1];extra.append(h,p);article.append(extra);return b;});
 function select(i){buttons.forEach((b,j)=>{b.setAttribute('aria-selected',String(i===j));b.tabIndex=i===j?0:-1;articles[j].hidden=i!==j;});}
 flow.classList.add('has-tabs');flow.prepend(tabs);select(0);
})();

// Gentle wheel scrolling on desktop; touch, nested scrollers and reduced motion stay native.
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer: fine)');
 let frame=0,target=scrollY,previous=0;
 function stop(){cancelAnimationFrame(frame);frame=0;previous=0;target=scrollY;}
 function tick(time){const dt=previous?Math.min(time-previous,50):16;previous=time;const difference=target-scrollY;const next=scrollY+difference*(1-Math.exp(-dt/65));window.scrollTo({top:Math.abs(difference)<3?target:next,behavior:'instant'});if(Math.abs(difference)>=3)frame=requestAnimationFrame(tick);else{frame=0;previous=0;}}
 window.addEventListener('wheel',event=>{
  if(reduced.matches||!fine.matches||event.ctrlKey||event.metaKey||event.shiftKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||event.target.closest('input,textarea,select,dialog,[contenteditable="true"]'))return;
  for(let node=event.target;node&&node!==document.body;node=node.parentElement){const style=getComputedStyle(node);if(/auto|scroll/.test(style.overflowY)&&node.scrollHeight>node.clientHeight+1)return;if(/auto|scroll/.test(style.overflowX)&&node.scrollWidth>node.clientWidth+1)return;}
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1),max=document.documentElement.scrollHeight-innerHeight;
  if(!frame)target=scrollY;target=Math.max(0,Math.min(max,target+delta));if(target===scrollY&&!frame)return;event.preventDefault();if(!frame)frame=requestAnimationFrame(tick);
 },{passive:false});
 window.addEventListener('pointerdown',stop,{passive:true});window.addEventListener('keydown',stop);window.addEventListener('hashchange',stop);window.addEventListener('resize',stop);reduced.addEventListener('change',stop);
})();

