const {JSDOM}=require('jsdom');const fs=require('fs');
const code=fs.readFileSync(require('path').join(__dirname,'..','store_locator_embed.html'),'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
const tick=(ms=0)=>new Promise(r=>setTimeout(r,ms));let failures=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)failures++;};
function setup(){
 const dom=new JSDOM(`<section data-store-locator data-mapbox-token="pk.t" data-mapbox-tileset="u.t" data-factory-lnglat="11.46,49.28"><div data-store-map></div><input data-store-search><button data-store-submit>F</button><button data-store-reset>R</button><p data-store-message></p><div data-store-templates><div data-store-card><p data-store-name></p><a data-store-route></a></div></div><div data-store-list></div></section>`,{runScripts:'outside-only',url:'https://x.webflow.io/'});
 const w=dom.window,T={w,d:w.document,maps:[],logs:[]};w.console={info(){},warn:m=>T.logs.push(m),log(){},error(){}};
 class Map{isMoving(){return false} once(){} panBy(d){(T.pans=T.pans||[]).push(d)} constructor(){this.h={};this.layers=[];this.removed=false;this.markers=0;T.maps.push(this)} addControl(){} resize(){} addImage(){} addSource(){} addLayer(l){this.layers.push(l.id)} getLayer(id){return this.layers.includes(id)}
  on(ev,a,b){const k=b?ev+':'+a:ev;(this.h[k]=this.h[k]||[]).push(b||a)} fire(k,e){if(this.removed)return;(this.h[k]||[]).forEach(f=>f(e||{}))} remove(){this.removed=true} getCanvas(){return{style:{}}} flyTo(){} fitBounds(){this.fitted=(this.fitted||0)+1} queryRenderedFeatures(){return[]}}
 w.mapboxgl={Map,NavigationControl:class{},Marker:class{setLngLat(){return this}addTo(m){m.markers++;return this}remove(){}},Popup:class{getElement(){if(!this._el){this._el=w.document.createElement('div');this._el.innerHTML='<div class="mapboxgl-popup-content"></div>';}return this._el}setLngLat(){return this}setDOMContent(){return this}addTo(){return this}remove(){}},LngLatBounds:class{extend(){}}};
 w.Path2D=class{};w.requestAnimationFrame=cb=>setTimeout(cb,0);w.IntersectionObserver=class{constructor(cb){T.io=cb}observe(){}disconnect(){}};
 w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({getImageData:()=>({})},{get:(t,k)=>k in t?t[k]:()=>{}});
 T.tjDelay=0;
 w.fetch=(u)=>new Promise(res=>setTimeout(()=>res({ok:true,status:200,json:()=>Promise.resolve(u.includes('geocode')?{features:[{geometry:{coordinates:[11,49]}}]}:u.includes('tilequery')?{features:[{properties:{name:'M'},geometry:{coordinates:[11,49]}}]}:{vector_layers:[{id:'l'}]})}),u.includes('.json?secure')?T.tjDelay:0));
 w.eval(code);return T;}
const search=(T,v)=>{T.d.querySelector('[data-store-search]').value=v;T.d.querySelector('[data-store-submit]').click();};
(async()=>{
 // A: sprite-like early error, then load -> map kept
 {const T=setup();T.io([{isIntersecting:true}]);await tick();const m=T.maps[0];m.fire('error',{error:{status:404}});await tick(50);m.fire('load');await tick(20);
  ok(!m.removed&&m.layers.includes('maerkte')&&m.layers.includes('werksverkauf'),'A non-fatal early error: map kept and fully set up');}
 // B: early error, no load -> removed after grace, retry creates fresh map, old instance inert
 {const T=setup();T.io([{isIntersecting:true}]);await tick();const m1=T.maps[0];m1.fire('error',{error:{status:401}});
  search(T,'a');await tick(10300);
  ok(m1.removed,'B style failure: first map removed after grace period');
  ok(T.d.querySelector('[data-store-message]').textContent==='1 Markt in Ihrer Nähe. Die Karte konnte nicht geladen werden. Bitte später erneut versuchen.','B load error appended to the search result');
  search(T,'b');await tick(20);ok(T.maps.length===2,'B next search retries with a fresh map');
  const m2=T.maps[1];m1.fire('load');ok(m2.layers.length===0&&m1.layers.length===0,'B late load of removed map does nothing');
  m2.fire('load');await tick(30);ok(m2.layers.includes('maerkte')&&m2.fitted===1&&m2.markers===1,'B retried map gets layers + pending search view once');}
 // C: no response at all -> timeout path (30s) skipped for time; check timer cleared on load
 {const T=setup();T.io([{isIntersecting:true}]);await tick();const m=T.maps[0];m.fire('error',{error:{}});m.fire('load');await tick(10300);
  ok(!m.removed,'C grace timer cleared by load (no later removal)');}
 // D: tile/source errors after load never remove the map
 {const T=setup();T.io([{isIntersecting:true}]);await tick();const m=T.maps[0];m.fire('load');m.fire('error',{sourceId:'maerkte',error:{status:403}});await tick(10300);
  ok(!m.removed,'D source error after load is not fatal');}
 console.log(failures?failures+' FAILED':'ALL PASSED');
})();
