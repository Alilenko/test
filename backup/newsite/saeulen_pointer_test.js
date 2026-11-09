const {chromium}=require('playwright');
const file=process.argv[2];
const R=[];const ok=(n,c,i)=>R.push([c?'PASS':'FAIL',n,i===undefined?'':JSON.stringify(i)]);
(async()=>{
const b=await chromium.launch();
const geo=p=>p.evaluate(()=>{const pt=document.querySelector('.saeulen_pointer');const tab=document.querySelector('.saeulen_tab.is-active');const sl=document.querySelector('.saeulen_slide:not([inert])');const card=sl.querySelector('.saeulen_item');
  const svg=document.querySelector('.saeulen_outline');let startX=null,startY=null;if(svg){const path=svg.querySelector('path');const q=path.getPointAtLength(0);const m=path.getScreenCTM();startX=q.x*m.a+m.e;startY=q.y*m.d+m.f;}
  const tr=tab.getBoundingClientRect(),cr=card.getBoundingClientRect();
  if(!pt||pt.hidden)return{visible:false,startX,tabX:tr.left+tr.width/2,cardLeft:cr.left};
  const r=pt.getBoundingClientRect();const dot=getComputedStyle(pt,'::after');
  return{visible:true,ptX:r.left+r.width/2,tabX:tr.left+tr.width/2,top:r.top,tabBottom:tr.bottom,dotCenterY:r.bottom-6,cardTop:cr.top,startX,startY,dotBg:dot.backgroundColor}});
for(const [name,vw,vh] of [['phone',390,844],['tablet',820,1180],['desktop',1440,900]]){
  const mob=vw<992;
  const p=await b.newPage({viewport:{width:vw,height:vh},isMobile:vw<500,hasTouch:mob});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+process.cwd()+'/'+file);await p.evaluate(()=>document.querySelector('#system').scrollIntoView());await p.waitForTimeout(500);
  let g=await geo(p);
  if(!mob){ok(name+': pointer hidden on desktop (CSS pseudo used)',!g.visible,g);
    const ps=await p.evaluate(()=>getComputedStyle(document.querySelector('.saeulen_tab.is-active'),'::before').display);ok(name+': desktop dot pseudo still shown',ps!=='none',ps);}
  else{
    ok(name+': pointer visible under active tab',g.visible&&Math.abs(g.ptX-g.tabX)<1,g);
    ok(name+': line starts at tab bottom, dot touches card (6px above)',Math.abs(g.top-g.tabBottom)<1&&Math.abs(g.dotCenterY-(g.cardTop-6))<1,g);
    ok(name+': outline starts at dot',Math.abs(g.startX-g.ptX)<1.5&&Math.abs(g.startY-g.dotCenterY)<1.5,g);
    for(const i of [4,2,0]){
      await p.evaluate(i=>document.querySelectorAll('.saeulen_tab')[i].click(),i);await p.waitForTimeout(1200);
      g=await geo(p);ok(`${name}: tab ${i+1} -> pointer under tab, outline from dot`,g.visible&&Math.abs(g.ptX-g.tabX)<1&&Math.abs(g.startX-g.ptX)<1.5,g);}
    // swipe
    const box=await p.locator('.saeulen_slider').boundingBox();
    await p.mouse.move(box.x+box.width*0.8,box.y+150);await p.mouse.down();await p.mouse.move(box.x+box.width*0.1,box.y+150,{steps:8});await p.mouse.up();await p.waitForTimeout(1200);
    g=await geo(p);ok(name+': after swipe pointer follows + outline from dot',g.visible&&Math.abs(g.ptX-g.tabX)<1&&Math.abs(g.startX-g.ptX)<1.5,g);
    // user scrolls tabs: pointer follows / hides when tab out of view
    const sc=await p.evaluate(()=>{const s=document.querySelector('.saeulen_tabs');return s.scrollWidth>s.clientWidth});
    if(sc){
      await p.evaluate(()=>{const s=document.querySelector('.saeulen_tabs');s.scrollLeft=s.scrollWidth});await p.waitForTimeout(200);
      g=await geo(p);const inView=await p.evaluate(()=>{const t=document.querySelector('.saeulen_tab.is-active').getBoundingClientRect(),s=document.querySelector('.saeulen_tabs').getBoundingClientRect();const x=t.left+t.width/2;return x>=s.left&&x<=s.right});
      ok(name+': tabs scrolled by user -> pointer follows or hides',inView?(g.visible&&Math.abs(g.ptX-g.tabX)<1):!g.visible,{inView,g});
    }
    await p.screenshot({path:`ptr_${name}.png`});
  }
  // rotate/resize between mobile and desktop
  await p.setViewportSize({width:mob?1440:390,height:900});await p.waitForTimeout(500);g=await geo(p);
  ok(name+': after resize to '+(mob?'desktop':'phone')+' pointer state correct',mob?!g.visible:(g.visible&&Math.abs(g.ptX-g.tabX)<1),g);
  ok(name+': no errors',errs.length===0,errs);
  await p.close();}
await b.close();
for(const r of R)console.log(r[0],'-',r[1],r[0]==='FAIL'?r[2]:'');
console.log(R.filter(r=>r[0]==='PASS').length,'passed,',R.filter(r=>r[0]==='FAIL').length,'failed');
})();
