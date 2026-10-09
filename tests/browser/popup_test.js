const {chromium}=(()=>{try{return require('playwright')}catch(e){return require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright')}})();
const fs=require('fs');const path=require('path');
const gl=fs.readFileSync(require.resolve('mapbox-gl/dist/mapbox-gl.js'),'utf8')+'\n;(function(){var M=mapboxgl.Map;function W(o){var m=new M(o);window.__map=m;return m}W.prototype=M.prototype;Object.setPrototypeOf(W,M);mapboxgl.Map=W;})();';
const css=fs.readFileSync(require.resolve('mapbox-gl/dist/mapbox-gl.css'),'utf8');
const style={version:8,sources:{},layers:[{id:'bg',type:'background',paint:{'background-color':'#e8e8e8'}}]};
/* Real Mapbox GL in headless Chromium: checks that store and Werksverkauf popups stay fully inside the map.
   All Mapbox network requests are answered locally. Run: npm run test:browser (needs playwright + mapbox-gl). */
const embed=fs.readFileSync(path.join(__dirname,'..','..','store_locator_embed.html'),'utf8');
fs.writeFileSync(path.join(__dirname,'page.html'),fs.readFileSync(path.join(__dirname,'page.template.html'),'utf8').replace('<!--EMBED-->',()=>embed));
const DEVICES=[['phone',375,740],['small',320,568],['tablet',768,1024],['tablet-land',1024,768],['desktop',1440,900]];
const SCENARIOS=['factory','store1','store2'];
let failures=0;
const runOne=async(name,w,h,scenario)=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:+w,height:+h},deviceScaleFactor:2,hasTouch:+w<1000,isMobile:+w<1000});
 p.on('pageerror',e=>console.log('PAGEERR',e.message));
 await p.route('**/*',r=>{const u=r.request().url();
  if(u.startsWith('file:')) return r.continue();
  if(u.includes('mapbox-gl.js')) return r.fulfill({contentType:'application/javascript',body:gl});
  if(u.includes('mapbox-gl.css')) return r.fulfill({contentType:'text/css',body:css});
  if(u.includes('/styles/v1/')) return r.fulfill({contentType:'application/json',body:JSON.stringify(style)});
  if(u.includes('/geocode/')) return r.fulfill({contentType:'application/json',body:JSON.stringify({features:[{geometry:{coordinates:[6.10,50.78]}}]})});
  if(u.includes('/tilequery/')) return r.fulfill({contentType:'application/json',body:JSON.stringify({features:[
    {properties:{name:'Rewe Center Aachen mit einem sehr langen Marktnamen',strasse:'Krefelder Straße',hausnummer:'123',plz:'52070',ort:'Aachen',telefon:'0241/123456'},geometry:{coordinates:[6.09,50.79]}},
    {properties:{name:'EDEKA Grenzmarkt',strasse:'Weg',hausnummer:'1',plz:'52074',ort:'Aachen'},geometry:{coordinates:[5.99,50.77]}}]})});
  if(u.match(/\/v4\/[^/]+\.json/)) return r.fulfill({contentType:'application/json',body:JSON.stringify({tilejson:'2.2.0',vector_layers:[{id:'l'}],tiles:['https://tiles.test/{z}/{x}/{y}.pbf'],minzoom:0,maxzoom:14})});
  return r.fulfill({status:204,body:''});});
 await p.goto('file://'+path.join(__dirname,'page.html'));
 await p.waitForFunction(()=>window.__map&&window.__map.loaded&&window.__map.isStyleLoaded(),null,{timeout:30000});
 await p.waitForTimeout(600);
 const mapBox=await p.$eval('[data-store-map]',e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}});
 if(scenario==='factory'){
  await p.evaluate(()=>document.querySelector('[data-store-map]').scrollIntoView({block:'center'}));await p.waitForTimeout(300);
  const pt=await p.evaluate(()=>{const q=window.__map.project([11.462,49.28]);const r=document.querySelector('[data-store-map]').getBoundingClientRect();return {x:r.x+q.x,y:r.y+q.y}});
  await p.mouse.click(pt.x,pt.y);
 } else {
  await p.fill('[data-store-search]','52070');await p.click('[data-store-submit]');await p.waitForTimeout(800);
  await p.click('[data-store-list-open]');await p.waitForTimeout(200);
  const idx=scenario==='store2'?1:0;
  await p.evaluate(i=>document.querySelectorAll('[data-store-list] [data-store-name]')[i].click(),idx);
  await p.evaluate(()=>document.querySelector('[data-store-map]').scrollIntoView({block:'center'}));
 }
 await p.waitForTimeout(3500);
 const res=await p.evaluate(()=>{const pop=document.querySelector('.mapboxgl-popup');if(!pop)return null;const r=pop.getBoundingClientRect();const m=document.querySelector('[data-store-map]').getBoundingClientRect();const c=pop.querySelector('.mapboxgl-popup-content');
   const cl=pop.querySelector('.mapboxgl-popup-close-button').getBoundingClientRect();const top=document.elementFromPoint(cl.x+cl.width/2,cl.y+cl.height/2);const f=window.__map.project([11.462,49.28]);return {closeOnTop:!!top&&top.closest('.mapboxgl-popup-close-button')!==null,factoryPinVisible:f.x>0&&f.y>0&&f.x<m.width&&f.y<m.height,inside:r.left>=m.left-0.5&&r.right<=m.right+0.5&&r.top>=m.top-0.5&&r.bottom<=m.bottom+0.5,popup:[Math.round(r.left-m.left),Math.round(r.top-m.top),Math.round(r.width),Math.round(r.height)],map:[Math.round(m.width),Math.round(m.height)],scroll:c.scrollHeight>c.clientHeight+1}});
 const good=res&&res.inside&&res.closeOnTop&&(scenario!=='factory'||res.factoryPinVisible);
 if(!good)failures++;
 console.log((good?'PASS ':'FAIL ')+name+' '+scenario+' '+JSON.stringify(res));
 if(process.env.SCREENSHOTS){const el=await p.$('.store-locator_map-wrapper');await el.screenshot({path:path.join(__dirname,name+'-'+scenario+'.png')});}
 await b.close();};
(async()=>{for(const [n,w,h] of DEVICES)for(const s of SCENARIOS)await runOne(n,w,h,s);
 fs.unlinkSync(path.join(__dirname,'page.html'));console.log(failures?failures+' FAILED':'ALL PASSED');process.exit(failures?1:0);})();
