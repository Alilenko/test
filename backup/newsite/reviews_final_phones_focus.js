const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:900}});
await p.goto('file://'+process.cwd()+'/'+process.argv[2]);await p.waitForTimeout(500);
console.log('href inside aria-hidden:',await p.evaluate(()=>document.querySelectorAll('[aria-hidden=true] a[href]').length));
for(const t0 of [5000,30000,50000]){
  await p.evaluate(t0=>{const a=document.querySelector('.reviews_track_phones').getAnimations()[0];a.currentTime=t0;},t0);
  await p.focus('#before');
  const out=[];
  for(let i=0;i<8;i++){await p.keyboard.press('Tab');out.push(await p.evaluate(()=>{const a=document.activeElement;if(!a.closest('.reviews_track_phones'))return '-';const r=a.getBoundingClientRect();return (r.left>=-1&&r.right<=innerWidth+1)?'ok':'OUT@'+Math.round(r.left);}));}
  console.log('start time',t0,'phones focus visibility:',out.join(' '));
}
await b.close();})();
