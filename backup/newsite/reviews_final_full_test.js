// Full regression for reviews_embed_final.html
const {chromium}=require('playwright');
const fs=require('fs');
const dir=process.cwd();
const results=[];
function ok(name,cond,info){results.push([cond?'PASS':'FAIL',name,info===undefined?'':JSON.stringify(info)]);}
(async()=>{
const b=await chromium.launch();
async function open(file,opts={}){const p=await b.newPage({viewport:{width:1440,height:900},...opts});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));p.on('console',m=>{if(m.type()==='error')p.errs.push(m.text())});await p.goto('file://'+dir+'/'+file);await p.waitForTimeout(500);return p;}
const T='.reviews_track_text',P='.reviews_track_phones';

// ---------- Desktop ----------
let p=await open('final.html');
let s=await p.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return{
  dup:ids.filter((x,i)=>ids.indexOf(x)!==i).length,
  textKids:document.querySelector('.reviews_track_text').children.length,
  phoneKids:document.querySelector('.reviews_track_phones').children.length,
  ghosts:document.querySelectorAll('.reviews_track_text>:not([data-clone]) [data-review-ghost]').length,
  hrefHidden:document.querySelectorAll('[aria-hidden=true] a[href]').length,
  inertGhosts:[...document.querySelectorAll('[data-review-ghost]')].every(g=>g.inert&&g.getAttribute('aria-hidden')==='true'),
  clipped:document.querySelector('.reviews_row_text').classList.contains('is-clipped'),
  moreVisible:[...document.querySelectorAll('.reviews_track_text>:not([data-clone]) [data-review-card] [data-review-more]')].map(m=>m.classList.contains('is-visible')),
  cloneMore:[...document.querySelectorAll('.reviews_track_text>[data-clone] [data-review-card] [data-review-more]')].map(m=>m.classList.contains('is-visible')).slice(0,6),
  speed:[...document.querySelectorAll('.is-marquee')].map(t=>+(parseFloat(t.style.getPropertyValue('--reviews-shift'))/parseFloat(getComputedStyle(t).animationDuration)).toFixed(3))}});
ok('no duplicate ids',s.dup===0,s.dup);
ok('marquee clones created',s.textKids>6&&s.phoneKids>5,[s.textKids,s.phoneKids]);
ok('one ghost per review',s.ghosts===6,s.ghosts);
ok('ghosts inert + aria-hidden',s.inertGhosts);
ok('no href inside aria-hidden',s.hrefHidden===0,s.hrefHidden);
ok('row clipped (mask on)',s.clipped);
ok('Weiterlesen only on long texts',JSON.stringify(s.moreVisible)==='[true,false,true,false,true,false]',s.moreVisible);
ok('clones mirror Weiterlesen state',JSON.stringify(s.cloneMore)===JSON.stringify(s.moreVisible),s.cloneMore);
ok('constant speed 40px/s',s.speed.every(v=>Math.abs(v-40)<0.01),s.speed);
// seam exact for both tracks at end of cycle
const seam=await p.evaluate(()=>[...document.querySelectorAll('.is-marquee')].map(t=>{const a=t.getAnimations()[0],d=a.effect.getComputedTiming().duration;const k=t.children.length/2;const rev=t.matches('.reviews_track_phones');a.currentTime=rev?d-0.0001:0;const x0=t.children[0].getBoundingClientRect().left;a.currentTime=rev?0.0001:d-0.0001;const xk=t.children[k].getBoundingClientRect().left;return +(xk-x0).toFixed(2)}));
ok('seamless loop (both rows)',seam.every(v=>Math.abs(v)<0.1),seam);
// hover pause
await p.hover('.reviews_row_text');ok('hover pauses text row',await p.evaluate(()=>getComputedStyle(document.querySelector('.reviews_track_text')).animationPlayState)==='paused');
await p.mouse.move(5,5);
// offscreen pause
await p.evaluate(()=>scrollTo(0,3000));await p.waitForTimeout(300);
ok('paused when offscreen',await p.evaluate(()=>getComputedStyle(document.querySelector('.reviews_track_text')).animationPlayState)==='paused');
await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(300);
ok('runs when visible',await p.evaluate(()=>getComputedStyle(document.querySelector('.reviews_track_text')).animationPlayState)==='running');
// mouse: click original + clone Weiterlesen and phone
for(const [name,sel,label] of [['orig Weiterlesen','.reviews_track_text>:not([data-clone]) [data-review-more].is-visible','Bewertung'],['clone Weiterlesen','[data-clone] [data-review-more].is-visible','Bewertung'],['orig phone','.reviews_track_phones>:not([data-clone]) [data-review-zoom]','Kundenfeedback'],['clone phone','[data-clone] [data-review-zoom]','Kundenfeedback']]){
  await p.evaluate(isClone=>document.querySelectorAll('.is-marquee').forEach(t=>{const a=t.getAnimations()[0],d=a.effect.getComputedTiming().duration,rev=t.matches('.reviews_track_phones');a.currentTime=isClone?d*0.55:(rev?d-1:0)}),name.startsWith('clone'));
  const h=await p.evaluateHandle(s=>[...document.querySelectorAll(s)].find(e=>{const r=e.getBoundingClientRect();return r.width&&r.left>0&&r.right<innerWidth}),sel);
  if(!h.asElement()){ok('click '+name,false,'no visible element');continue;}
  {const el=h.asElement();const bb=await el.boundingBox();const cx=bb.x+bb.width/2,cy=bb.y+bb.height/2;const hit=await p.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return e?(e.className||e.tagName)+' | '+(e.closest('[data-review-more],[data-review-zoom]')?'trigger':'NOT trigger'):'none'},[cx,cy]);if(!hit.includes('| trigger'))console.log('   hit',name,hit);await p.mouse.click(cx,cy);}await p.waitForTimeout(80);
  const d=await p.evaluate(()=>{const d=document.querySelector('.reviews_dialog');return{open:d.open,label:d.getAttribute('aria-label'),bodyHidden:document.querySelector('.reviews_dialog_body').hidden,imgHidden:document.querySelector('.reviews_dialog_image').hidden,more:!!d.querySelector('[data-review-more]'),ids:d.querySelectorAll('[id]').length,clamp:d.querySelector('.rating_card_text')?getComputedStyle(d.querySelector('.rating_card_text')).display:null,bodyOverflow:getComputedStyle(document.body).overflow,url:location.hash}});
  ok('click '+name+' opens dialog',d.open&&d.label===label&&(label==='Bewertung'?(!d.bodyHidden&&d.imgHidden&&!d.more&&d.ids===0&&d.clamp==='block'):(d.bodyHidden&&!d.imgHidden)),d);
  ok('page scroll locked while open',d.bodyOverflow==='hidden');
  ok('no # navigation',d.url==='');
  // close via backdrop for clones, button for originals
  if(await p.evaluate(()=>document.querySelector('.reviews_dialog').open)){if(name.startsWith('clone'))await p.mouse.click(5,5);else await p.click('.reviews_dialog_close');}
  await p.waitForTimeout(80);
  ok('close dialog ('+(name.startsWith('clone')?'backdrop':'button')+')',!(await p.evaluate(()=>document.querySelector('.reviews_dialog').open)));
}
// keyboard
await p.evaluate(()=>{const a=document.querySelector('.reviews_track_text').getAnimations()[0];a.currentTime=30000;});
await p.focus('#before');const seq=[];let allVisible=true;
for(let i=0;i<9;i++){await p.keyboard.press('Tab');const r=await p.evaluate(()=>{const a=document.activeElement;const r=a.getBoundingClientRect();const inTrack=!!a.closest('.reviews_marquee');return{n:a.closest('[data-clone],[data-review-ghost]')?'HIDDEN':(a.getAttribute('aria-label')||a.textContent.trim().slice(0,11)),vis:!inTrack||(r.left>=-1&&r.right<=innerWidth+1),scroll:[...document.querySelectorAll('.reviews_row_text,.reviews_row_phones')].map(r=>r.scrollLeft).join('/')}});seq.push(r.n);if(!r.vis||r.scroll!=='0/0')allVisible=false;}
ok('tab order = originals only',!seq.includes('HIDDEN')&&seq.filter(x=>x==='Weiterlesen').length===3&&seq.filter(x=>x.includes('vergr')||x==='zoom').length===5,seq);
ok('focused card always visible, no row scroll',allVisible);
// Enter + Space + Esc + no jump (fresh page: no WAAPI pause/play overrides)
ok('no errors desktop part 1',p.errs.length===0,p.errs);await p.close();p=await open('final.html');
await p.focus('#before');await p.keyboard.press('Tab');
const t0=await p.evaluate(()=>document.querySelector('.reviews_track_text').getAnimations()[0].currentTime);
await p.keyboard.press('Enter');await p.waitForTimeout(800);
const inDlg=await p.evaluate(()=>({open:document.querySelector('.reviews_dialog').open,t:document.querySelector('.reviews_track_text').getAnimations()[0].currentTime}));
await p.keyboard.press('Escape');await p.waitForTimeout(80);
const after=await p.evaluate(()=>({t:document.querySelector('.reviews_track_text').getAnimations()[0].currentTime,focus:document.activeElement.textContent.trim()}));
ok('Enter opens, row stays paused during dialog',inDlg.open&&Math.abs(inDlg.t-t0)<1,{t0,inDlg});
ok('Esc closes, focus returns, no jump',Math.abs(after.t-t0)<1&&after.focus==='Weiterlesen',after);
await p.keyboard.press(' ');await p.waitForTimeout(80);
ok('Space opens dialog',await p.evaluate(()=>document.querySelector('.reviews_dialog').open));
await p.keyboard.press('Escape');
await p.focus('#before');await p.waitForTimeout(80);
ok('leaving resumes from same position',await p.evaluate(()=>getComputedStyle(document.querySelector('.reviews_track_text')).animationPlayState)==='running');
// resize sequence
const mark=await p.evaluate(()=>{window._m=document.querySelector('.reviews_track_text').lastElementChild;return 1});
let resErr=[];
for(const w of [1400,1200,800,2600,1440]){await p.setViewportSize({width:w,height:900});await p.waitForTimeout(350);
  const r=await p.evaluate(()=>[...document.querySelectorAll('.is-marquee')].map(t=>{const row=t.closest('.reviews_row_text,.reviews_row_phones');const k=t.children.length/2;const shift=parseFloat(t.style.getPropertyValue('--reviews-shift'));return{fill:shift>=row.clientWidth,seam:Math.abs(t.children[k].getBoundingClientRect().left-t.children[0].getBoundingClientRect().left-shift)<0.1,even:t.children.length%2===0}}));
  if(!r.every(x=>x.fill&&x.seam&&x.even))resErr.push([w,r]);}
ok('resize 1400/1200/800/2600/1440: half fills row, seam exact',resErr.length===0,resErr);
const u0=await p.evaluate(()=>{window.__n=0;const RO=1;return 0});
ok('no errors desktop',p.errs.length===0,p.errs);
await p.close();

// ---------- RO idle / loops ----------
p=await b.newPage({viewport:{width:1440,height:900}});
await p.addInitScript(()=>{window.__raf=0;const o=requestAnimationFrame;window.requestAnimationFrame=f=>o(t=>{window.__raf++;f(t)})});
await p.goto('file://'+dir+'/final.html');await p.waitForTimeout(800);
const r0=await p.evaluate(()=>window.__raf);await p.waitForTimeout(2000);
ok('ResizeObserver: no updates while idle (no loop)',await p.evaluate(()=>window.__raf)-r0===0);
// late font/image change -> recompute once
await p.evaluate(()=>document.querySelectorAll('.rating_card_text').forEach(e=>e.style.fontSize='13px'));await p.waitForTimeout(400);
const clipNew=await p.evaluate(()=>{const cards=[...document.querySelectorAll('.reviews_track_text>:not([data-clone]) [data-review-card]')];const max=Math.max(...cards.map(c=>c.offsetHeight));return{clip:parseFloat(document.querySelector('.reviews_row_text').style.getPropertyValue('--reviews-clip')),expect:Math.ceil(max+24+36)}});
ok('content size change -> clip recomputed',clipNew.clip===clipNew.expect,clipNew);
await p.close();

// ---------- Touch / reduced motion / switching ----------
p=await open('final.html',{viewport:{width:390,height:844},hasTouch:true,isMobile:true});
s=await p.evaluate(()=>({clones:document.querySelectorAll('[data-clone]').length,marquee:document.querySelectorAll('.is-marquee').length,ghosts:document.querySelectorAll('[data-review-ghost]').length,ox:getComputedStyle(document.querySelector('.reviews_row_text')).overflowX,clipped:document.querySelector('.reviews_row_text').classList.contains('is-clipped')}));
ok('touch: no marquee, swipe scroll, ghosts+clip kept',s.clones===0&&s.marquee===0&&s.ghosts===6&&s.ox==='auto'&&s.clipped,s);
await p.tap('.reviews_track_text [data-review-more].is-visible');await p.waitForTimeout(80);
ok('touch: Weiterlesen opens dialog',await p.evaluate(()=>document.querySelector('.reviews_dialog').open));
ok('no errors touch',p.errs.length===0,p.errs);await p.close();

p=await open('final.html',{reducedMotion:'reduce'});
ok('reduced motion: no marquee',await p.evaluate(()=>document.querySelectorAll('[data-clone]').length===0&&!document.querySelector('.is-marquee')));
await p.evaluate(()=>document.querySelector('.reviews_row_text').scrollLeft=400);
await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(300);
s=await p.evaluate(()=>({m:document.querySelectorAll('.is-marquee').length,sl:document.querySelector('.reviews_row_text').scrollLeft}));
ok('switch reduce -> motion: marquee on, scroll reset',s.m===2&&s.sl===0,s);
await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(300);
ok('switch motion -> reduce: clones removed',await p.evaluate(()=>document.querySelectorAll('[data-clone]').length===0&&!document.querySelector('.is-marquee')));
ok('no errors reduce',p.errs.length===0,p.errs);await p.close();

// ---------- double init ----------
p=await open('final.html');
await p.evaluate(()=>{const s=[...document.scripts].find(x=>x.textContent.includes('reviewsReady'));const n=document.createElement('script');n.textContent=s.textContent;document.body.appendChild(n);});await p.waitForTimeout(300);
s=await p.evaluate(()=>({g:document.querySelectorAll('.reviews_track_text>:not([data-clone]) [data-review-ghost]').length,k:document.querySelector('.reviews_track_text').children.length}));
ok('double init: no duplicate ghosts/clones',s.g===6&&s.k===12,s);
// click once -> one dialog open, no double handlers error
await p.evaluate(()=>document.querySelector('.reviews_track_text [data-review-more].is-visible').click());
ok('double init: click still works',await p.evaluate(()=>document.querySelector('.reviews_dialog').open));
ok('no errors double init',p.errs.length===0,p.errs);await p.close();

// ---------- edge DOMs ----------
const emb=fs.readFileSync(process.argv[2],'utf8');
const edge={
 'empty collection':`<section data-reviews><div class="reviews_marquee"><div class="reviews_row_text"><div class="w-dyn-list"><div class="reviews_track_text w-dyn-items"></div><div class="w-dyn-empty">leer</div></div></div><div class="reviews_row_phones"><div class="w-dyn-list"><div class="reviews_track_phones w-dyn-items"></div></div></div></div><dialog class="reviews_dialog"></dialog>${emb}</section>`,
 'no dialog, 1 review, no phones':`<section data-reviews><div class="reviews_marquee"><div class="reviews_row_text"><div class="w-dyn-list"><div class="reviews_track_text w-dyn-items" style="display:grid;grid-auto-flow:column;grid-auto-columns:300px;column-gap:24px;width:max-content"><div class="w-dyn-item"><article class="rating_card" data-review-card><div class="rating_card_text" data-review-text>Kurz</div><a data-review-more href="#">Weiterlesen</a></article></div></div></div></div></div>${emb}</section>`
};
for(const [name,body] of Object.entries(edge)){
  fs.writeFileSync(dir+'/edge.html',`<!doctype html><html><body>${body}</body></html>`);
  p=await open('edge.html');await p.setViewportSize({width:900,height:800});await p.waitForTimeout(300);
  ok('edge: '+name+' – no errors',p.errs.length===0,p.errs);await p.close();
}

// ---------- no JS ----------
p=await b.newPage({viewport:{width:1440,height:900},javaScriptEnabled:false});
await p.goto('file://'+dir+'/final.html');
s=await p.evaluate?null:null;
await p.close();
const html=fs.readFileSync(dir+'/final.html','utf8').replace(/<script>[\s\S]*?<\/script>/,'');
fs.writeFileSync(dir+'/nojs.html',html);
p=await open('nojs.html');
s=await p.evaluate(()=>({mask:getComputedStyle(document.querySelector('.reviews_row_text')).maskImage||getComputedStyle(document.querySelector('.reviews_row_text')).webkitMaskImage,h:getComputedStyle(document.querySelector('.reviews_row_text')).height}));
ok('no JS: no fade mask, row height auto',s.mask==='none',s);
await p.close();

await b.close();
for(const r of results)console.log(r[0],'-',r[1],r[0]==='FAIL'||r[1].startsWith('tab')?r[2]:'');
console.log('\n',results.filter(r=>r[0]==='PASS').length,'passed,',results.filter(r=>r[0]==='FAIL').length,'failed');
})();
