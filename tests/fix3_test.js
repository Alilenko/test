const {JSDOM}=require('jsdom');const fs=require('fs');
const code=fs.readFileSync(require('path').join(__dirname,'..','store_locator_embed.html'),'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
const tick=(ms=0)=>new Promise(r=>setTimeout(r,ms));let failures=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)failures++;};
function setup(){
 const dom=new JSDOM(`<section data-store-locator data-mapbox-token="pk.t" data-mapbox-tileset="u.t" data-factory-lnglat="11.46,49.28"><div data-store-map></div><input data-store-search><button data-store-submit>F</button><button data-store-reset>R</button><p data-store-message></p><div data-store-templates><div data-store-card><p data-store-name></p><a data-store-route></a></div></div><div data-store-list></div></section>`,{runScripts:'outside-only',url:'https://x.webflow.io/'});
 const w=dom.window,T={w,d:w.document,maps:[],logs:[],tj:0};w.console={info(){},warn:m=>T.logs.push(m),log(){},error(){}};
 class Map{isMoving(){return false} once(){} panBy(d){(T.pans=T.pans||[]).push(d)} constructor(){this.h={};this.layers=[];this.removed=false;T.maps.push(this)} addControl(){} resize(){} addImage(){} addSource(){} addLayer(l){this.layers.push(l.id)} getLayer(id){return this.layers.includes(id)}
  on(ev,a,b){const k=b?ev+':'+a:ev;(this.h[k]=this.h[k]||[]).push(b||a)} fire(k,e){if(this.removed)return;(this.h[k]||[]).forEach(f=>f(e||{}))} remove(){this.removed=true} getCanvas(){return{style:{}}} flyTo(){} fitBounds(){} queryRenderedFeatures(){return[]}}
 w.mapboxgl={Map,NavigationControl:class{},Marker:class{setLngLat(){return this}addTo(){return this}remove(){}},Popup:class{getElement(){if(!this._el){this._el=w.document.createElement('div');this._el.innerHTML='<div class="mapboxgl-popup-content"></div>';}return this._el}setLngLat(){return this}setDOMContent(){return this}addTo(){return this}remove(){}},LngLatBounds:class{extend(){}}};
 w.Path2D=class{};w.requestAnimationFrame=cb=>setTimeout(cb,0);w.IntersectionObserver=class{constructor(cb){T.io=cb}observe(){}disconnect(){}};
 w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({getImageData:()=>({})},{get:(t,k)=>k in t?t[k]:()=>{}});
 w.fetch=(u)=>{if(u.includes('.json?secure')){T.tj++;if(T.tjFail)return Promise.resolve({ok:false,status:503});}
  return Promise.resolve({ok:true,status:200,json:()=>Promise.resolve(u.includes('geocode')?{features:[{geometry:{coordinates:[11,49]}}]}:u.includes('tilequery')?{features:[{properties:{name:'M'},geometry:{coordinates:[11,49]}}]}:{vector_layers:[{id:'l'}]})})};
 w.eval(code);return T;}
const search=(T,v)=>{T.d.querySelector('[data-store-search]').value=v;T.d.querySelector('[data-store-submit]').click();};
(async()=>{
 {const T=setup();T.io([{isIntersecting:true}]);await tick();const m=T.maps[0];
  m.fire('error',{error:{status:404}});await tick(6000);m.fire('error',{error:{status:404}});await tick(4300);
  ok(m.removed,'repeated early errors do not postpone giving up (removed after ~10 s)');
  ok(T.logs.filter(l=>l.includes('Kartenfehler')).length===1,'identical map errors logged once');}
 {const T=setup();T.tjFail=true;T.io([{isIntersecting:true}]);await tick();const m=T.maps[0];m.fire('load');await tick(20);
  ok(!m.layers.includes('maerkte')&&T.d.querySelector('[data-store-message]').textContent.startsWith('Die Karte konnte'),'TileJSON failure: no store layer, error shown');
  T.tjFail=false;search(T,'a');await tick(30);
  ok(m.layers.includes('maerkte')&&!m.removed,'next search retries the store layer on the same map');
  search(T,'b');await tick(30);ok(T.tj===2&&m.layers.filter(x=>x==='maerkte').length===1,'store layer added only once, no extra TileJSON requests');
  for(let i=0;i<30;i++)m.fire('error',{sourceId:'maerkte',error:{status:401}});ok(T.logs.filter(l=>l.includes('in maerkte')).length===1,'tile errors logged once, not per tile');}
 console.log(failures?failures+' FAILED':'ALL PASSED');
})();
