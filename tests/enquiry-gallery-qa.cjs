const assert=require('node:assert/strict');
const{chromium}=require('C:/Users/SeniorPomidor/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true});const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const width of [360,390,768,1440]){
  await p.setViewportSize({width,height:900});await p.goto('http://127.0.0.1:4173/?category=ventilation#calculator');
  const inputs=await p.locator('.field input,.field select').evaluateAll(nodes=>nodes.map(e=>({top:e.getBoundingClientRect().top,left:e.getBoundingClientRect().left,height:e.offsetHeight})));
  for(let i=0;i<inputs.length;i++){const next=inputs[i+1];if(next&&next.left>inputs[i].left)assert(Math.abs(next.top-inputs[i].top)<2,'field alignment');}
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  for(const slug of ['structures','welded']){
   await p.goto('http://127.0.0.1:4173/page.html?slug='+slug);await p.locator('.project-image').first().click();await p.locator('.photo-preview img').evaluate(e=>e.decode());
   const fits=await p.locator('.photo-preview-stage').evaluate(e=>{const s=e.getBoundingClientRect(),r=e.firstElementChild.getBoundingClientRect();return r.width<=s.width+1&&r.height<=s.height+1&&getComputedStyle(e).overflow==='hidden'});assert(fits,'entire photo fits');
   for(let n=0;n<20;n++)await p.getByRole('button',{name:'Увеличить фотографию',exact:true}).click();
   assert.equal(await p.getByRole('button',{name:'Сбросить масштаб'}).textContent(),'600%');
   await p.keyboard.press('Escape');
  }
 }
 await p.goto('http://127.0.0.1:4173');const form=p.locator('[data-contact-form]'),phone=form.locator('[name=phone]');await phone.focus();assert.equal(await phone.inputValue(),'+7 ');await phone.fill('89161234567');assert.equal(await phone.inputValue(),'+7 (916) 123-45-67');
 await form.locator('[name=name]').fill('Проверка');await form.locator('[name=consent]').check();
 let payload;await p.route('https://formsubmit.co/ajax/**',async route=>{payload=route.request().postDataJSON();await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:'true'})})});
 await form.locator('[type=submit]').click();await p.waitForFunction(()=>document.querySelector('.contact-status').textContent.includes('принята'));assert.equal(payload.phone,'+7 (916) 123-45-67');
 await p.unroute('https://formsubmit.co/ajax/**');await p.route('https://formsubmit.co/ajax/**',r=>r.abort());await form.locator('[type=submit]').click();await p.waitForFunction(()=>document.querySelector('.contact-status').textContent.includes('Не удалось'));assert.equal(await phone.inputValue(),'+7 (916) 123-45-67');
 assert.deepEqual(errors,[]);console.log('PASS: 4 viewports, full photo fit, 600% zoom, field alignment, +7, mocked submission success/failure');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
