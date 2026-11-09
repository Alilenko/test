// Probes the CURRENT implementation for the 5 review points
const {chromium}=require('playwright');
const file=process.argv[2];
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1440,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{window.__upd=0;const o=window.requestAnimationFrame;window.requestAnimationFrame=f=>o(t=>{window.__upd++;f(t)});});
await p.goto('file://'+process.cwd()+'/'+file);await p.waitForTimeout(600);
// 1 aria-hidden + focusable/interactive
console.log('1) links inside aria-hidden with href:',await p.evaluate(()=>document.querySelectorAll('[aria-hidden=true] a[href]').length));
// 3 RO idle loops
const u0=await p.evaluate(()=>window.__upd);await p.waitForTimeout(1500);
console.log('3) rAF callbacks during 1.5s idle (marquee CSS anim needs none):',await p.evaluate(()=>window.__upd)-u0);
// 4 seam accuracy at root font 15.3px (fractional widths)
await p.evaluate(()=>document.documentElement.style.fontSize='15.3px');await p.waitForTimeout(400);
console.log('4) seam error px:',await p.evaluate(()=>[...document.querySelectorAll('.is-marquee')].map(t=>{const n=t.children.length;const k=n/2;const a=t.getAnimations()[0];const shift=parseFloat(t.style.getPropertyValue('--reviews-shift'));return +(t.children[k].getBoundingClientRect().left-t.children[0].getBoundingClientRect().left-shift).toFixed(3)})));
await p.evaluate(()=>document.documentElement.style.fontSize='');await p.waitForTimeout(400);
// 5b rebuild on width change restarts animation?
const t1=await p.evaluate(()=>document.querySelector('.reviews_track_text').getAnimations()[0].currentTime);
await p.setViewportSize({width:3000,height:900});await p.waitForTimeout(300);
const t2=await p.evaluate(()=>document.querySelector('.reviews_track_text').getAnimations()[0]?.currentTime);
console.log('5) anim time before/after sets change (restart if small):',Math.round(t1),Math.round(t2));
await p.setViewportSize({width:1440,height:900});await p.waitForTimeout(400);
// 2 keyboard: tab into 3rd original card, check jump & restore
await p.evaluate(()=>{const a=document.querySelector('.reviews_track_text').getAnimations()[0];a.currentTime=30000;});
await p.focus('#before');
const vis=()=>p.evaluate(()=>{const a=document.activeElement;const r=a.getBoundingClientRect();return {txt:a.textContent.trim().slice(0,10),left:Math.round(r.left),inView:r.left>=0&&r.right<=innerWidth,cls:document.querySelector('.reviews_track_text').className.replace('reviews_track_text w-dyn-items ',''),scrollLeft:document.querySelector('.reviews_row_text').scrollLeft,time:Math.round(document.querySelector('.reviews_track_text').getAnimations()[0]?.currentTime??-1)}});
for(let i=0;i<3;i++){await p.keyboard.press('Tab');console.log('2) tab',i+1,JSON.stringify(await vis()));}
await p.focus('#before');await p.waitForTimeout(50);
console.log('2) after focus leaves:',JSON.stringify(await p.evaluate(()=>({cls:document.querySelector('.reviews_track_text').className,scrollLeft:document.querySelector('.reviews_row_text').scrollLeft,time:Math.round(document.querySelector('.reviews_track_text').getAnimations()[0]?.currentTime??-1)}))));
// 5 double init
await p.evaluate(()=>{const s=document.querySelector('section script:last-of-type');const n=document.createElement('script');n.textContent=s.textContent;document.body.appendChild(n);});
await p.waitForTimeout(300);
console.log('5) ghosts after second init (should be 6):',await p.evaluate(()=>document.querySelectorAll('.reviews_track_text>.w-dyn-item:not([data-clone]) [data-review-ghost]').length));
// 5 swipe -> marquee keeps user scrollLeft?
await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(300);
await p.evaluate(()=>document.querySelector('.reviews_row_text').scrollLeft=500);
await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(300);
console.log('5) scrollLeft after reduce->motion (should be 0):',await p.evaluate(()=>document.querySelector('.reviews_row_text').scrollLeft));
console.log('errors',errs);await b.close();})();
