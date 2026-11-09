const {chromium}=require('playwright');
const R=[];const ok=(n,c,i)=>R.push([c?'PASS':'FAIL',n,i===undefined?'':JSON.stringify(i)]);
(async()=>{const b=await chromium.launch();
const cnt=p=>p.evaluate(()=>({svg:document.querySelectorAll('.saeulen_outline').length,active:document.querySelector('.saeulen_slider').swiper.activeIndex,tab:[...document.querySelectorAll('.saeulen_tab')].findIndex(t=>t.classList.contains('is-active')),pointer:document.querySelectorAll('.saeulen_pointer').length}));
for(const [n,w,h] of [['phone',390,844],['tablet',820,1180]]){
 const p=await b.newPage({viewport:{width:w,height:h},hasTouch:true,isMobile:w<500});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+process.cwd()+'/nomob.html');await p.evaluate(()=>document.querySelector('#system').scrollIntoView());await p.waitForTimeout(600);
 let s=await cnt(p);ok(n+': no outline, no pointer on load',s.svg===0&&s.pointer===0,s);
 await p.evaluate(()=>document.querySelectorAll('.saeulen_tab')[3].click());await p.waitForTimeout(1000);s=await cnt(p);
 ok(n+': tab click works, no outline',s.active===3&&s.tab===3&&s.svg===0,s);
 const box=await p.locator('.saeulen_slider').boundingBox();await p.mouse.move(box.x+box.width*0.8,box.y+150);await p.mouse.down();await p.mouse.move(box.x+box.width*0.1,box.y+150,{steps:8});await p.mouse.up();await p.waitForTimeout(1000);
 s=await cnt(p);ok(n+': swipe works, no outline',s.active===4&&s.tab===4&&s.svg===0,s);
 await p.setViewportSize({width:1440,height:900});await p.waitForTimeout(600);s=await cnt(p);
 ok(n+': resize to desktop -> outline appears',s.svg===1,s);
 await p.setViewportSize({width:w,height:h});await p.waitForTimeout(600);s=await cnt(p);
 ok(n+': back to mobile -> outline removed',s.svg===0,s);
 ok(n+': no errors',errs.length===0,errs);await p.close();}
await b.close();for(const r of R)console.log(r[0],'-',r[1],r[0]==='FAIL'?r[2]:'');console.log(R.filter(r=>r[0]==='PASS').length,'passed,',R.filter(r=>r[0]==='FAIL').length,'failed');})();
