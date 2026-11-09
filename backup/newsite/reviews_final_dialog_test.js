const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('file://'+process.cwd()+'/'+process.argv[2]);await p.waitForTimeout(500);
const st=()=>p.evaluate(()=>{const t=document.querySelector('.reviews_track_text');const a=t.getAnimations()[0];const f=document.activeElement;const r=f.getBoundingClientRect();return {time:Math.round(a.currentTime),paused:getComputedStyle(t).animationPlayState,focusVisible:r.left>=-1&&r.right<=innerWidth+1,focus:f.textContent.trim().slice(0,11)}});
await p.focus('#before');await p.keyboard.press('Tab');
console.log('focused   ',JSON.stringify(await st()));
await p.keyboard.press('Enter');await p.waitForTimeout(1500);
console.log('dialog 1.5s',JSON.stringify(await st()),'open',await p.evaluate(()=>document.querySelector('.reviews_dialog').open));
await p.keyboard.press('Escape');await p.waitForTimeout(100);
console.log('closed    ',JSON.stringify(await st()));
// mouse: click visible clone Weiterlesen and clone phone
await p.focus('#before');await p.evaluate(()=>document.activeElement.blur());
for(const sel of ['[data-clone] [data-review-more].is-visible','[data-clone] [data-review-zoom]']){
  await p.evaluate(()=>document.querySelectorAll('.is-marquee').forEach(t=>{const a=t.getAnimations()[0];a.pause();a.currentTime=a.effect.getComputedTiming().duration*0.6;}));
  const h=await p.evaluateHandle(s=>[...document.querySelectorAll(s)].find(e=>{const r=e.getBoundingClientRect();return r.width&&r.left>0&&r.right<innerWidth}),sel);
  const el=h.asElement();
  if(!el){console.log(sel,'no visible clone');continue;}
  await el.click();await p.waitForTimeout(100);
  console.log('mouse',sel,'-> dialog',await p.evaluate(()=>document.querySelector('.reviews_dialog').open+' '+document.querySelector('.reviews_dialog').getAttribute('aria-label')));
  await p.keyboard.press('Escape');await p.waitForTimeout(100);
}
await b.close();})();
