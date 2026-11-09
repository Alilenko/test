const {chromium}=require('playwright');
const file=process.argv[2];
const R=[];const ok=(n,c,i)=>R.push([c?'PASS':'FAIL',n,i===undefined?'':JSON.stringify(i)]);
(async()=>{
const b=await chromium.launch();
async function open(opts={}){const p=await b.newPage({viewport:{width:1440,height:900},...opts});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
await p.addInitScript(()=>{window.__anims=0;const o=Element.prototype.animate;Element.prototype.animate=function(...a){if(this.tagName==='path')window.__anims++;return o.apply(this,a)};});
await p.goto('file://'+process.cwd()+'/'+file);await p.waitForTimeout(400);return p;}
const state=p=>p.evaluate(()=>{const sw=document.querySelector('.saeulen_slider').swiper;const slides=[...document.querySelectorAll('.saeulen_slide')];const tabs=[...document.querySelectorAll('.saeulen_tab')];
  const svg=document.querySelector('.saeulen_outline');const path=svg&&svg.querySelector('path');
  let startX=null,dotX=null;
  if(path){const m=path.getAttribute('d').match(/^M([\d.]+)/);const pt=path.getPointAtLength(0);const ctm=path.getScreenCTM();startX=pt.x*ctm.a+ctm.e;const t=document.querySelector('.saeulen_tab.is-active');const tr=t.getBoundingClientRect();dotX=tr.left+tr.width/2;}
  return{active:sw.activeIndex,tab:tabs.findIndex(t=>t.classList.contains('is-active')),sel:tabs.map(t=>t.getAttribute('aria-selected')==='true'?1:0).join(''),ti:tabs.map(t=>t.tabIndex).join(','),inert:slides.map(s=>s.inert?1:0).join(''),opacity:slides.map(s=>(+getComputedStyle(s).opacity).toFixed(1)).join(','),svgs:document.querySelectorAll('.saeulen_outline').length,svgIn:slides.findIndex(s=>s.querySelector('.saeulen_outline')),startX,dotX,anims:window.__anims,dash:path?getComputedStyle(path).strokeDashoffset:null};});
const scrollIn=p=>p.evaluate(()=>document.querySelector('#system').scrollIntoView());
const drag=async p=>{const box=await p.locator('.saeulen_slider').boundingBox();await p.mouse.move(box.x+box.width*0.8,box.y+200);await p.mouse.down();await p.mouse.move(box.x+box.width*0.1,box.y+200,{steps:8});await p.mouse.up();await p.waitForTimeout(900);};

let p=await open();
let s=await state(p);
ok('no outline before section visible',s.svgs===0,s);
const aria=await p.evaluate(()=>{const l=document.querySelector('.saeulen_tabs_list');const t=document.querySelectorAll('.saeulen_tab');const sl=document.querySelectorAll('.saeulen_slide');return{list:l.getAttribute('role'),label:l.getAttribute('aria-label'),tab:t[1].getAttribute('role'),ctrl:t[1].getAttribute('aria-controls')===sl[1].id,lab:sl[1].getAttribute('aria-labelledby')===t[1].id,panel:sl[1].getAttribute('role'),labels:[...document.querySelectorAll('[data-saeule-next-name]')].map(x=>x.textContent)}});
ok('ARIA tablist/tab/tabpanel wiring',aria.list==='tablist'&&aria.tab==='tab'&&aria.ctrl&&aria.lab&&aria.panel==='tabpanel'&&aria.label==='Die 5 Säulen',aria);
ok('next labels from next card name',aria.labels.join('|')==='Nächste Säule: Traffic|Nächste Säule: Conversion|Nächste Säule: CRM|Nächste Säule: Systeme|Nächste Säule: Daten',aria.labels);
await scrollIn(p);await p.waitForTimeout(300);
s=await state(p);
ok('init: tab 0, only active slide interactive & opaque',s.tab===0&&s.sel==='10000'&&s.ti==='0,-1,-1,-1,-1'&&s.inert==='01111'&&s.opacity.startsWith('1.0,0.5'),s);
ok('outline appears when visible, 1 svg in slide 0, animated once',s.svgs===1&&s.svgIn===0&&s.anims===1,s);
ok('outline starts at dot under active tab',Math.abs(s.startX-s.dotX)<1.5,[s.startX,s.dotX]);
await p.waitForTimeout(3200);s=await state(p);
ok('outline fully drawn after 3s',parseFloat(s.dash)===0,s.dash);
// tab click
await p.click('.saeulen_tab >> nth=2');await p.waitForTimeout(900);s=await state(p);
ok('click tab 3 -> slide 2 active, outline in slide 2, from dot',s.active===2&&s.tab===2&&s.svgIn===2&&s.svgs===1&&Math.abs(s.startX-s.dotX)<1.5,s);
ok('one animation per change',s.anims===2,s.anims);
// click same tab -> no new animation
await p.click('.saeulen_tab >> nth=2');await p.waitForTimeout(900);s=await state(p);
ok('click active tab again: no re-run',s.anims===2,s.anims);
// drag
await p.evaluate(()=>document.querySelector('.saeulen_slider').swiper.slideTo(0,0));await p.waitForTimeout(300);
const a0=(await state(p)).anims;
const dr=[];for(let k=0;k<5;k++){await drag(p);const t=await state(p);dr.push([t.active,t.tab,t.svgIn,t.inert]);}
s=await state(p);
ok('drag/swipe: outline drawn on each new card',dr.slice(0,4).every((d,k)=>d[0]===k+1&&d[1]===k+1&&d[2]===k+1),dr);
ok('drag beyond end: no extra animation',s.anims-a0===4,s.anims-a0);
// last card CTA
const cta=await p.evaluate(()=>{const sl=document.querySelectorAll('.saeulen_slide')[4];const a=sl.querySelector('.cta_btn');const r=a.getBoundingClientRect();const n=sl.querySelector('[data-saeule-next]');return{hit:document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)===a,nextHidden:getComputedStyle(n).display==='none'}});
ok('last card: CTA visible & clickable, next button hidden',cta.hit&&cta.nextHidden,cta);
// arrows
const ar=await p.evaluate(()=>[...document.querySelectorAll('[data-saeulen-prev],[data-saeulen-next]')].map(a=>a.classList.contains('is-disabled')+'/'+a.getAttribute('aria-disabled')));
ok('arrows at end: next disabled (+aria-disabled if new)',ar[1].startsWith('true'),ar);
await p.focus('[data-saeulen-prev]');await p.keyboard.press(' ');await p.waitForTimeout(900);s=await state(p);
ok('Space on prev arrow -> slide 3',s.active===3,s.active);
await p.keyboard.press('Enter');await p.waitForTimeout(900);s=await state(p);
ok('Enter on prev arrow -> slide 2',s.active===2,s.active);
ok('no # in URL',await p.evaluate(()=>location.hash)==='');
// next card button (mouse)
await p.evaluate(()=>document.querySelector('.saeulen_slider').swiper.slideTo(2,0));await p.waitForTimeout(200);await p.click('.saeulen_slide:not([inert]) [data-saeule-next]');await p.waitForTimeout(900);s=await state(p);
ok('next-card button: 2 -> 3, focus to tab 4',s.active===3&&await p.evaluate(()=>document.activeElement.classList.contains('saeulen_tab')&&document.activeElement.textContent.includes('CRM')),s.active);
// keyboard tabs
await p.focus('.saeulen_tab.is-active');
const kseq=[];for(const k of ['ArrowRight','ArrowRight','Home','End','ArrowLeft']){await p.keyboard.press(k);await p.waitForTimeout(700);kseq.push(await p.evaluate(()=>[document.querySelector('.saeulen_slider').swiper.activeIndex,[...document.querySelectorAll('.saeulen_tab')].indexOf(document.activeElement)].join('')));}
ok('tabs keyboard Right/Right(wrap)/Home/End/Left',kseq.join(' ')==='44 00 00 44 33',kseq);
// Space on next-card button
await p.focus('.saeulen_slide:not([inert]) [data-saeule-next]');await p.keyboard.press(' ');await p.waitForTimeout(900);
ok('Space on next-card button',(await state(p)).active===4);
// resize: same svg node, no new animations, geometry updated
await p.waitForTimeout(3100);
const before=await p.evaluate(()=>{window.__svg=document.querySelector('.saeulen_outline');return window.__anims});
await p.setViewportSize({width:1300,height:900});await p.waitForTimeout(500);
s=await state(p);
const same=await p.evaluate(()=>document.querySelector('.saeulen_outline')===window.__svg);
ok('resize: no new animation',s.anims===before,[before,s.anims]);
ok('resize: same SVG node reused (new code) / geometry follows card',s.svgs===1&&Math.abs(s.startX-s.dotX)<1.5,{same,startX:s.startX,dotX:s.dotX});
await p.setViewportSize({width:1440,height:900});await p.waitForTimeout(400);
// resize during animation does not restart it
await p.click('.saeulen_tab >> nth=0');await p.waitForTimeout(900);
const midA=await p.evaluate(()=>window.__anims);await p.waitForTimeout(500);
await p.setViewportSize({width:1440,height:800});await p.waitForTimeout(300);
const run=await p.evaluate(()=>{const pth=document.querySelector('.saeulen_outline path');return{anims:window.__anims,running:pth.getAnimations().some(a=>a.playState==='running')}});
ok('height-only resize during animation: animation keeps running',run.anims===midA&&run.running,run);
// double init
await p.evaluate(()=>{const s=[...document.scripts].find(x=>x.textContent.includes('saeulen_slider')&&x.textContent.includes('Swiper('));const n=document.createElement('script');n.textContent=s.textContent;document.body.appendChild(n);document.dispatchEvent(new Event('DOMContentLoaded'));});
await p.waitForTimeout(300);
ok('double init: still one outline',await p.evaluate(()=>document.querySelectorAll('.saeulen_outline').length)<=1);
ok('no errors (desktop)',p.errs.length===0,p.errs);
await p.screenshot({path:file+'.desk.png'});
await p.close();

// reduced motion
p=await open({reducedMotion:'reduce'});await scrollIn(p);await p.waitForTimeout(300);
await p.click('.saeulen_tab >> nth=1');await p.waitForTimeout(150);s=await state(p);
ok('reduced motion: instant slide, outline drawn without animation',s.active===1&&s.svgIn===1&&s.anims===0&&parseFloat(s.dash)===0,s);
await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(100);
await p.click('.saeulen_tab >> nth=2');await p.waitForTimeout(100);
const spd=await p.evaluate(()=>document.querySelector('.saeulen_slider').swiper.params.speed);
ok('reduced motion switched off at runtime -> speed 600',spd===600,spd);
ok('no errors (reduced)',p.errs.length===0,p.errs);await p.close();

// mobile
p=await open({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await scrollIn(p);await p.waitForTimeout(400);
s=await state(p);
ok('mobile: outline drawn on first card',s.svgIn===0,s);
await p.evaluate(()=>document.querySelectorAll('.saeulen_tab')[4].click());await p.waitForTimeout(1000);s=await state(p);
const sc=await p.evaluate(()=>{const sc=document.querySelector('.saeulen_tabs');const t=document.querySelector('.saeulen_tab.is-active');const r=t.getBoundingClientRect(),rr=sc.getBoundingClientRect();return r.left>=rr.left-1&&r.right<=rr.right+1});
ok('mobile: tab 5 -> slide 4, active tab scrolled into view, outline',s.active===4&&sc&&s.svgIn===4,{s,sc});
ok('no errors (mobile)',p.errs.length===0,p.errs);
await p.screenshot({path:file+'.mob.png'});
await p.close();

await b.close();
for(const r of R)console.log(r[0],'-',r[1],r[0]==='FAIL'?r[2]:'');
console.log(R.filter(r=>r[0]==='PASS').length,'passed,',R.filter(r=>r[0]==='FAIL').length,'failed');
})();
