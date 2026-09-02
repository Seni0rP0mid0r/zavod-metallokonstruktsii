(() => {
 const slug=new URLSearchParams(location.search).get('slug')||'catalog',p=window.EtalonPages[slug];
 const el=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text)node.textContent=text;return node;};
 if(!p){document.querySelector('#page-title').textContent='Раздел не найден';document.querySelector('#page-lead').textContent='Вернитесь на главную или выберите раздел в меню.';return;}
 document.title=p.title+' — ЭТАЛОН';
 for(const [id,text] of [['page-title',p.title],['breadcrumb',p.title],['page-lead',p.lead]])document.getElementById(id).textContent=text;
 const body=document.querySelector('#page-body'),aside=document.querySelector('#page-aside');
 if(p.image){const figure=el('figure','article-image'),img=el('img');img.src=p.image;img.alt=p.imageAlt||p.title;const crop=el('div','blog-illustration '+(slug==='article-kmd'?'illustration-right':'illustration-left'));crop.append(img);figure.append(crop,el('figcaption','','Иллюстрация к материалу'));body.append(figure);}
 p.sections.forEach((s,i)=>{const article=el('article');article.id='section-'+i;article.append(el('h2','',s.title),el('p','',s.text));body.append(article);});
 const images={grating:slug==='welded'?'welded':'pressed',frame:'frame',cabin:'cabin',water:'water',doors:'doors',ventilation:'ventilation'};
 if(p.category||['chassis-cabins','sea-containers'].includes(slug)){
 const view=el('div','product-view'),scene=el('div','product-view-scene'),img=el('img');img.src='assets/catalog-'+(images[p.category]||'cabin')+'.svg';img.alt='Схема: '+p.title;scene.append(img);view.append(scene);
 const progress=el('div','reading-progress');progress.setAttribute('aria-hidden','true');progress.append(el('span'));view.append(progress);aside.append(view);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let queued=false;
 const paint=()=>{queued=false;const rect=body.getBoundingClientRect(),amount=Math.max(0,Math.min(1,(innerHeight*.25-rect.top)/Math.max(1,rect.height-innerHeight*.5)));progress.firstChild.style.transform='scaleX('+amount+')';const angle=reduced.matches?0:amount*12;img.style.transform='perspective(700px) rotateY('+angle+'deg)';};
 window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(paint);}},{passive:true});window.addEventListener('resize',paint);reduced.addEventListener('change',paint);paint();
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){body.querySelectorAll('article').forEach(a=>a.classList.toggle('reading-active',a===entry.target));aside.querySelectorAll('a[href^="#section-"]').forEach(a=>a.classList.toggle('reading-current',a.hash==='#'+entry.target.id));}}),{rootMargin:'-15% 0px -55% 0px',threshold:0});body.querySelectorAll('article').forEach(a=>observer.observe(a));
 }
 if(p.sections.length>2){aside.append(el('h2','','В этом разделе'));p.sections.forEach((s,i)=>{const a=el('a','',s.title);a.href='#section-'+i;aside.append(a);});}
 (p.links||[]).forEach(l=>{const a=el('a','',l.label+' ↗');a.href='page.html?slug='+l.slug;aside.append(a);});
 const cta=el('a','primary',p.category?'Рассчитать изделие ↗':'Обсудить задачу ↗');cta.href=p.category?'./?category='+p.category+(slug==='pressed'?'&type=pressed':slug==='welded'?'&type=welded':'')+'#calculator':'#request';aside.append(cta);
 document.querySelector('.contact-selection').hidden=true;
 if(slug==='partners')document.querySelector('#page-partners').hidden=false;
 const insert=section=>document.querySelector('#request').before(section);
 const catalogSlugs=['catalog','grating','pressed','welded','structures','lstk','cabins','site-cabins','chassis-cabins','sea-containers','treatment','doors','ventilation'];
 if(slug==='catalog'){
  const section=el('section','page-directory');section.append(el('h2','','Выберите направление'));const grid=el('div','directory-grid');
  catalogSlugs.slice(1).forEach(key=>{const item=window.EtalonPages[key],a=el('a','directory-item');a.href='page.html?slug='+key;a.append(el('h3','',item.title),el('p','',item.lead),el('span','','Изучить направление ↗'));grid.append(a);});section.append(grid);insert(section);
 }
 if(catalogSlugs.includes(slug)||slug==='projects'){
  const section=el('section','project-gallery');section.setAttribute('aria-label','Галерея проектов');
  const head=el('div','wide-heading');head.append(el('h2','',slug==='projects'?'Проекты в деталях':'Продукция на объекте'),el('p','',slug==='doors'?'Демонстрация галереи: одна концептуальная иллюстрация повторена в трёх слайдах.':'Фотографии готовых проектов будут добавлены. Сейчас в галерее показаны заглушки.'));section.append(head);
  const figure=el('figure','project-slide'),image=el('img');image.width=1440;image.height=800;const caption=el('figcaption'),title=el('h3'),text=el('p');caption.append(title,text);figure.append(image,caption);section.append(figure);
  const controls=el('div','carousel-controls'),count=el('span','partner-position'),prev=el('button','','←'),next=el('button','','→');count.setAttribute('aria-live','polite');prev.type=next.type='button';prev.setAttribute('aria-label','Предыдущий проект');next.setAttribute('aria-label','Следующий проект');controls.append(count,prev,next);section.append(controls);
  const slides=window.EtalonGallery[slug]||window.EtalonGallery.default;let index=0;
  let galleryAnimation;const show=(n,animate=true)=>{index=(n+slides.length)%slides.length;const slide=slides[index];image.src=slide.src;image.alt=slide.title+' — '+slide.text;title.textContent=slide.title;text.textContent=slide.text;count.textContent=(index+1)+' / '+slides.length;if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){galleryAnimation?.cancel();galleryAnimation=image.animate([{opacity:.35,transform:'translateX(18px)'},{opacity:1,transform:'translateX(0)'}],{duration:400,easing:'cubic-bezier(.16,1,.3,1)'});}};
  prev.addEventListener('click',()=>show(index-1));next.addEventListener('click',()=>show(index+1));figure.tabIndex=0;figure.setAttribute('aria-label','Галерея: переключение стрелками клавиатуры');figure.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1));}});show(0,false);insert(section);
 }
 if(slug==='blog'){
  const section=el('section','blog-list');section.append(el('h2','','Полезное за пять минут'));const grid=el('div','blog-grid');
  ['article-grating','article-kmd'].forEach(key=>{const item=window.EtalonPages[key],a=el('a','blog-card');a.href='page.html?slug='+key;const img=el('img');img.src=item.image;img.alt=item.imageAlt;img.loading='lazy';const crop=el('div','blog-illustration '+(key==='article-kmd'?'illustration-right':'illustration-left'));crop.append(img);a.append(crop,el('h3','',item.title),el('p','',item.lead),el('span','','Читать статью ↗'));grid.append(a);});section.append(grid);insert(section);
 }
 if(slug==='contacts'){
  const section=el('section','contact-map-section');const contacts=el('div','contact-direct');contacts.innerHTML='<a href="tel:+79161219988">+7 (916) 121-99-88</a><a href="mailto:sales@etalonorg.ru">sales@etalonorg.ru</a>';body.prepend(contacts);section.append(el('h2','','Как нас найти'));const loc=window.EtalonLocation;
  if(Number.isFinite(loc.latitude)&&Number.isFinite(loc.longitude)&&Math.abs(loc.latitude)<=90&&Math.abs(loc.longitude)<=180){
   const lat=loc.latitude,lon=loc.longitude,iframe=el('iframe');iframe.title=loc.cityOnly?'Город производства — Великие Луки':'Расположение ООО «ПК-П ЭТАЛОН»';iframe.loading='lazy';iframe.src='https://www.openstreetmap.org/export/embed.html?bbox='+encodeURIComponent([lon-.08,lat-.04,lon+.08,lat+.04].join(','))+'&layer=mapnik&marker='+lat+','+lon;section.append(iframe,el('p','',loc.address+(loc.cityOnly?' · Отмечен город, точный адрес производства уточняйте по телефону.':''))); const link=el('a','','Открыть карту ↗');link.href='https://www.openstreetmap.org/?mlat='+lat+'&mlon='+lon+'#map=16/'+lat+'/'+lon;link.target='_blank';link.rel='noopener';section.append(link);
  }else{const placeholder=el('div','map-awaiting');placeholder.innerHTML='<svg viewBox="0 0 80 96" width="64" height="76" aria-hidden="true"><path d="M40 88S10 58 10 35a30 30 0 0 1 60 0c0 23-30 53-30 53Z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="40" cy="35" r="10" fill="none" stroke="currentColor" stroke-width="3"/></svg>';placeholder.append(el('h3','','Адрес уточняется'),el('p','','Карта с точкой появится после подтверждения адреса компании.'));section.append(placeholder);}
  insert(section);
 }
})();
