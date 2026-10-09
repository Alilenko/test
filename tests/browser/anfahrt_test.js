const {chromium}=(()=>{try{return require('playwright')}catch(e){return require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright')}})();
const fs=require('fs');const path=require('path');
/* Real Mapbox GL in headless Chromium: the Anfahrt map fills its wrapper and shows the Werksverkauf pin in the centre.
   All Mapbox requests are answered locally. Run: npm run test:anfahrt */
const gl=fs.readFileSync(require.resolve('mapbox-gl/dist/mapbox-gl.js'),'utf8')+'\n;(function(){var M=mapboxgl.Map;function W(o){var m=new M(o);window.__map=m;return m}W.prototype=M.prototype;Object.setPrototypeOf(W,M);mapboxgl.Map=W;})();';
const css=fs.readFileSync(require.resolve('mapbox-gl/dist/mapbox-gl.css'),'utf8');
const style={version:8,sources:{},layers:[{id:'bg',type:'background',paint:{'background-color':'#e8e8e8'}}]};
const embed=fs.readFileSync(path.join(__dirname,'..','..','anfahrt_map_embed.html'),'utf8');
const page=path.join(__dirname,'anfahrt_page.html');
fs.writeFileSync(page,fs.readFileSync(path.join(__dirname,'anfahrt_page.template.html'),'utf8').replace('<!--EMBED-->',()=>embed));
let failures=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)failures++;};
(async()=>{
 for(const [name,w,h] of [['phone',375,740],['tablet',768,1024],['desktop',1440,900]]){
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:w,height:h}});
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/*',r=>{const u=r.request().url();
   if(u.startsWith('file:'))return r.continue();
   if(u.includes('mapbox-gl.js'))return r.fulfill({contentType:'application/javascript',body:gl});
   if(u.includes('mapbox-gl.css'))return r.fulfill({contentType:'text/css',body:css});
   if(u.includes('/styles/v1/'))return r.fulfill({contentType:'application/json',body:JSON.stringify(style)});
   return r.fulfill({status:204,body:''});});
  await p.goto('file://'+page);
  await p.waitForFunction(()=>window.__map&&window.__map.isStyleLoaded()&&window.__map.getLayer('werksverkauf'),null,{timeout:30000});
  await p.waitForTimeout(500);
  const r=await p.evaluate(()=>{const w=document.querySelector('[data-anfahrt-map]').getBoundingClientRect();const c=window.__map.getCanvas().getBoundingClientRect();const q=window.__map.project([11.462,49.28]);
   const f=window.__map.queryRenderedFeatures([q.x,q.y],{layers:['werksverkauf']});
   return {fills:Math.abs(w.width-c.width)<1&&Math.abs(w.height-c.height)<1,centre:Math.abs(q.x-c.width/2)<2&&Math.abs(q.y-c.height/2)<2,pin:f.length>0,zoom:!!document.querySelector('.mapboxgl-ctrl-zoom-in')}});
  ok(r.fills,name+' map fills the wrapper');ok(r.centre,name+' Werksverkauf is in the centre');ok(r.pin,name+' pin is rendered');ok(r.zoom,name+' zoom buttons shown');ok(!errors.length,name+' no page errors '+errors.join('; '));
  if(process.env.SCREENSHOTS)await (await p.$('[data-anfahrt-map]')).screenshot({path:path.join(__dirname,'anfahrt-'+name+'.png')});
  await b.close();
 }
 fs.unlinkSync(page);console.log(failures?failures+' FAILED':'ALL PASSED');process.exit(failures?1:0);
})();
