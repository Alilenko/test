const {chromium}=require('playwright');
const f=n=>'file://'+process.cwd()+'/'+n;
(async()=>{
const b=await chromium.launch();
async function page(file,opts={}){const p=await b.newPage({viewport:{width:1440,height:900},...opts});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.goto(f(file));await p.waitForTimeout(400);return p;}
const stats=p=>p.evaluate(()=>{
  const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);const dup=ids.filter((x,i)=>ids.indexOf(x)!==i);
  const tr=[...document.querySelectorAll('.reviews_track_text,.reviews_track_phones')].map(t=>{
    const n=[...t.children].filter(c=>!c.hasAttribute('data-clone')).length, sets=t.children.length/n/2;
    const k=n*sets; const seam=t.children[k]?t.children[k].offsetLeft-t.children[0].offsetLeft:null;
    const cs=getComputedStyle(t);
    return {cls:t.className,children:t.children.length,seamDiff:seam,shift:t.style.getPropertyValue('--reviews-shift'),dur:cs.animationDuration,speed:seam/parseFloat(cs.animationDuration)};});
  const focusableHidden=[...document.querySelectorAll('[aria-hidden=true] a,[aria-hidden=true] button,[inert] a')].filter(a=>a.tabIndex>=0).length;
  return {dupIds:dup.length,tracks:tr,focusableHidden,clipped:document.querySelector('.reviews_row_text').className,clip:getComputedStyle(document.querySelector('.reviews_row_text')).height,ghosts:document.querySelectorAll('[data-review-ghost]').length};});
for(const file of ['old.html','new.html']){
  const p=await page(file);console.log('\n==',file);console.log(JSON.stringify(await stats(p)));
  const before=await p.evaluate(()=>{const t=document.querySelector('.reviews_track_text');window._mark=t.children[t.children.length-1];return t.getAnimations()[0]?.currentTime});
  await p.setViewportSize({width:1400,height:900});await p.waitForTimeout(500);
  console.log('resize 1440->1400: clones kept?',await p.evaluate(()=>window._mark.isConnected),'anim time before',Math.round(before),'now',Math.round(await p.evaluate(()=>document.querySelector('.reviews_track_text').getAnimations()[0]?.currentTime)));
  await p.setViewportSize({width:3000,height:900});await p.waitForTimeout(500);
  console.log('wide 3000:',JSON.stringify((await stats(p)).tracks.map(t=>[t.children,t.seamDiff,t.shift,t.dur])));
  await p.setViewportSize({width:1440,height:900});await p.waitForTimeout(500);
  await p.focus('#before');const seq=[];
  for(let i=0;i<14;i++){await p.keyboard.press('Tab');seq.push(await p.evaluate(()=>{const a=document.activeElement;return (a.closest('[data-clone]')?'CLONE:':a.closest('[data-review-ghost]')?'GHOST:':'')+(a.getAttribute('aria-label')||a.textContent.trim().slice(0,12))}));}
  console.log('tab seq',seq.join(' | '));
  console.log('phones class while focused',await p.evaluate(()=>document.querySelector('.reviews_track_phones').className));
  await p.keyboard.press(' ');await p.waitForTimeout(100);
  console.log('dialog after space',await p.evaluate(()=>{const d=document.querySelector('.reviews_dialog');return d.open+' '+d.getAttribute('aria-label')+' imgHidden='+document.querySelector('.reviews_dialog_image').hidden}));
  await p.keyboard.press('Escape');await p.waitForTimeout(100);
  await p.evaluate(()=>document.activeElement.blur());
  await p.evaluate(()=>{document.querySelectorAll('.is-marquee').forEach(t=>t.getAnimations().forEach(a=>{a.pause();a.currentTime=0}))});
  const vis=await p.$$('[data-clone] [data-review-more].is-visible');
  if(vis.length){await vis[vis.length-1].scrollIntoViewIfNeeded().catch(()=>{});}
  const visIn=await p.evaluateHandle(()=>[...document.querySelectorAll('[data-clone] [data-review-more].is-visible')].find(e=>{const r=e.getBoundingClientRect();return r.left>0&&r.right<innerWidth}));
  await visIn.asElement().click();await p.waitForTimeout(100);
  console.log('dialog from clone click',await p.evaluate(()=>document.querySelector('.reviews_dialog').open+' ids:'+document.querySelectorAll('.reviews_dialog [id]').length+' more:'+!!document.querySelector('.reviews_dialog [data-review-more]')),'focus in clone?',await p.evaluate(()=>!!document.activeElement.closest('[data-clone]')));
  console.log('errors',p.errs);await p.close();
}
for(const file of ['old.html','new.html']){
  const p=await page(file,{reducedMotion:'reduce'});
  const s=await stats(p);console.log(file,'reduced:',JSON.stringify(s.tracks.map(t=>[t.cls,t.children])),s.clip);
  await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(400);
  console.log(file,'runtime reduce->none:',JSON.stringify((await stats(p)).tracks.map(t=>[t.cls,t.children])));
  await p.close();
  const m=await page(file,{viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const sm=await stats(m);console.log(file,'mobile touch:',JSON.stringify(sm.tracks.map(t=>[t.cls,t.children])),sm.clip);
  await m.screenshot({path:file+'.mobile.png'});await m.close();
}
for(const file of ['old.html','new.html']){const p=await page(file);await p.evaluate(()=>document.querySelectorAll('.is-marquee').forEach(t=>{t.getAnimations().forEach(a=>{a.pause();a.currentTime=0})}));await p.screenshot({path:file+'.png'});await p.close();}
{const p=await page('new.html');const r=await p.evaluate(()=>{const t=document.querySelector('.reviews_track_text');const a=t.getAnimations()[0];const d=a.effect.getComputedTiming().duration;a.pause();a.currentTime=0;const start=t.children[0].getBoundingClientRect().left;a.currentTime=d-0.0001;const k=t.children.length/2;const endK=t.children[k].getBoundingClientRect().left;return {startFirst:start,endItemK:endK};});console.log('seamless new (should match):',r);await p.close();}
await b.close();})();
