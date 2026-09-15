const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/SeniorPomidor/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const base='http://127.0.0.1:4173/';
 await page.goto(base+'page.html');const slugs=await page.evaluate(()=>Object.keys(window.EtalonPages));
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ['',...slugs.map(slug=>'page.html?slug='+slug)]){
   await page.goto(base+route,{waitUntil:'domcontentloaded'});
   const report=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,text:document.body.innerText}));
   assert.equal(report.overflow,false,route+' overflow at '+width);
   assert.doesNotMatch(report.text,/демо|заглушк/i,route+' placeholder copy');
  }
  await page.goto(base+'page.html?slug=pressed');
  assert.deepEqual(await page.locator('.project-name').allTextContents(),['Прессованный настил · ЕВРАЗ','Прессованный настил']);
  await page.locator('.project-image').first().click();
  const close=await page.locator('.photo-preview .close-dialog').boundingBox();
  assert(close.x>=0&&close.x+close.width<=width&&close.y>=0);
  await page.getByRole('button',{name:'Увеличить фотографию',exact:true}).click();
  await page.getByRole('button',{name:'Увеличить фотографию',exact:true}).click();
  const stage=await page.locator('.photo-preview-stage').boundingBox();const x=stage.x+stage.width/2,y=stage.y+stage.height/2;
  await page.mouse.move(x,y);const before=await page.locator('.photo-preview img').getAttribute('style');
  await page.mouse.move(x+30,y+25);assert.equal(await page.locator('.photo-preview img').getAttribute('style'),before,'hover must not pan');
  await page.mouse.down();await page.mouse.move(x+80,y+65);await page.mouse.up();
  const dragged=await page.locator('.photo-preview img').getAttribute('style');
  assert.notEqual(dragged,before,'drag must pan');
  await page.mouse.move(x-50,y-40);assert.equal(await page.locator('.photo-preview img').getAttribute('style'),dragged,'released drag must stop');
  await page.getByRole('button',{name:'Сбросить масштаб'}).click();assert.match(await page.locator('.photo-preview img').getAttribute('style'),/translate\(0px, 0px\) scale\(1\)/);
  await page.keyboard.press('Escape');assert.equal(await page.locator('.photo-preview').evaluate(e=>e.open),false);
  await page.goto(base+'page.html?slug=welded');assert.deepEqual(await page.locator('.project-name').allTextContents(),['Сварной настил · «Красное&Белое»']);
  console.log('PASS routes, galleries and photo controls at '+width);
 }
 await page.goto(base+'page.html?slug=projects');
 const sources=await page.evaluate(()=>[...new Set([...window.EtalonProjectGroups,...window.EtalonSpecialGroups].flatMap(group=>group.items.map(item=>item.src)))]);
 for(const src of sources){const response=await page.request.get(base+src);assert.equal(response.status(),200,src);}
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base);await page.locator('.menu-toggle').evaluate(e=>e.click());assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');
 assert.deepEqual(errors,[]);console.log('PASS '+sources.length+' gallery assets; no JavaScript errors');
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
