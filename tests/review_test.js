/* Tests for the second review: Path2D fallback, map error recovery, empty search, store layer per map, ARIA */
const {JSDOM}=require('jsdom');const fs=require('fs');
const code=fs.readFileSync(require('path').join(__dirname,'..','store_locator_embed.html'),'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
const tick=(ms=0)=>new Promise(r=>setTimeout(r,ms));let failures=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)failures++;};
function setup(opts={}){
 const tpl=opts.tpl||`<div data-store-card class="anfahrt_store is-card"><p data-store-name id="n1">M</p><p data-store-street aria-describedby="n1 keep">S</p><a data-store-route href="#">Route</a></div>`;
 const dom=new JSDOM(`<section data-store-locator data-mapbox-token="pk.t" data-mapbox-tileset="u.t" data-factory-lnglat="11.46,49.28"><div data-store-map></div><input data-store-search><button data-store-submit>F</button><button data-store-reset>R</button><button data-store-list-open aria-haspopup="dialog" hidden>L</button><p data-store-message aria-live="polite"></p><p id="keep">x</p><div data-store-templates>${tpl}</div><div data-store-modal class="filter-modal" role="dialog" aria-modal="true" aria-labelledby="t"><p id="t">T</p><button data-store-close>x</button><div data-store-list></div></div></section>`,{runScripts:'outside-only',url:'https://x.webflow.io/'});
 const w=dom.window,T={w,d:w.document,maps:[],logs:[],tjFail:false,delay:0};w.console={info(){},warn:m=>T.logs.push(m),log(){},error(){}};
 class Map{constructor(){this.h={};this.layers=[];this.removed=false;T.maps.push(this)} addControl(){} resize(){} addImage(n,img){T.img=img} addSource(){} addLayer(l){this.layers.push(l.id)} getLayer(id){return this.layers.includes(id)}
  on(ev,a,b){const k=b?ev+':'+a:ev;(this.h[k]=this.h[k]||[]).push(b||a)} fire(k,e){if(this.removed)return;(this.h[k]||[]).forEach(f=>f(e||{}))} remove(){this.removed=true} getCanvas(){return{style:{}}} flyTo(){} fitBounds(){} queryRenderedFeatures(){return[]}}
 w.mapboxgl={Map,NavigationControl:class{},Marker:class{setLngLat(){return this}addTo(){return this}remove(){}},Popup:class{setLngLat(){return this}setDOMContent(){return this}addTo(){return this}remove(){}},LngLatBounds:class{extend(){}}};
 if(!opts.noPath2D) w.Path2D=class{};
 w.IntersectionObserver=class{constructor(cb){T.io=cb}observe(){}disconnect(){}};
 T.fills=0;w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({getImageData:()=>({ok:1}),fill:()=>{T.fills++}},{get:(t,k)=>k in t?t[k]:()=>{}});
 w.fetch=(u,o)=>new Promise((res,rej)=>{const sig=o&&o.signal;if(sig)sig.addEventListener('abort',()=>{const e=new Error('a');e.name='AbortError';rej(e)});
  setTimeout(()=>{ if(u.includes('.json?secure')) return res(T.tjFail?{ok:false,status:503}:{ok:true,status:200,json:()=>Promise.resolve({vector_layers:[{id:'l'}]})});
   res({ok:true,status:200,json:()=>Promise.resolve(u.includes('geocode')?{features:[{geometry:{coordinates:[11,49]}}]}:{features:[{properties:{name:'Markt A',strasse:'Weg',hausnummer:1},geometry:{coordinates:[11,49]}},{properties:{name:'Markt B'},geometry:{coordinates:[11.1,49]}}]})}); },u.includes('geocode')?T.delay:0);});
 w.eval(code);return T;}
const msg=T=>T.d.querySelector('[data-store-message]').textContent;
const search=(T,v)=>{T.d.querySelector('[data-store-search]').value=v;T.d.querySelector('[data-store-submit]').click();};
const LOAD='Die Karte konnte nicht geladen werden. Bitte später erneut versuchen.';
(async()=>{
 // 1. Path2D missing: map still loads, pin drawn as plain square
 {const T=setup({noPath2D:true});T.io([{isIntersecting:true}]);await tick();const m=T.maps[0];m.fire('load');await tick(20);
  ok(!m.removed&&m.layers.includes('maerkte')&&T.img&&T.fills===1,'1 without Path2D the map loads (pin = yellow square only)');}
 {const T=setup();T.io([{isIntersecting:true}]);await tick();T.maps[0].fire('load');await tick(20);ok(T.fills===2,'1 with Path2D square + tower are drawn');}
 // 2. error is cleared once the store layer succeeds on retry
 {const T=setup();T.tjFail=true;T.io([{isIntersecting:true}]);await tick();const m=T.maps[0];m.fire('load');await tick(20);
  ok(msg(T)===LOAD,'2 TileJSON failure shows the map error');
  T.tjFail=false;search(T,'a');await tick(40);
  ok(msg(T)==='2 Märkte in Ihrer Nähe.','2 after a successful retry the error is gone, only the result stays ('+msg(T)+')');}
 {const T=setup();T.tjFail=true;T.io([{isIntersecting:true}]);await tick();const m=T.maps[0];m.fire('load');await tick(20);
  T.tjFail=false;T.d.querySelector('[data-store-reset]').click();search(T,'a');await tick(40);T.d.querySelector('[data-store-reset]').click();await tick(5);
  ok(msg(T)==='','2 reset after recovery leaves an empty message line');}
 // 4. empty search cancels the running one
 {const T=setup();T.delay=40;search(T,'a');await tick(5);search(T,'   ');await tick(100);
  ok(msg(T)==='Bitte PLZ oder Ort eingeben.'&&T.d.querySelectorAll('[data-store-list] [data-store-card]').length===0,'4 empty submit cancels the running search');
  ok(!T.logs.length,'4 cancelled search logs nothing');}
 // 5. store layer promise is bound to the map instance
 {const T=setup();T.io([{isIntersecting:true}]);await tick();const m1=T.maps[0];m1.fire('error',{error:{status:500}});await tick(10200);
  search(T,'a');await tick(20);const m2=T.maps[1];m2.fire('load');await tick(30);
  ok(m1.removed&&m2.layers.includes('maerkte'),'5 store layer is created for the new map, not reused from the old one');}
 // 6a. ids and references stripped
 {const T=setup();search(T,'a');await tick(30);const c=T.d.querySelector('[data-store-list] [data-store-card]');
  ok(!c.querySelector('[id]')&&c.querySelector('[data-store-street]').getAttribute('aria-describedby')==='keep','6a removed ids are dropped from aria-describedby, other ids kept');}
 // 6b. no nested interactive elements, name is the button
 {const T=setup();T.io([{isIntersecting:true}]);await tick();T.maps[0].fire('load');await tick(10);search(T,'a');await tick(30);
  const cards=[...T.d.querySelectorAll('[data-store-list] [data-store-card]')];const n=c=>c.querySelector('[data-store-name]');
  ok(!cards[0].hasAttribute('role')&&!cards[0].hasAttribute('tabindex'),'6b card itself is not a button');
  ok(n(cards[0]).getAttribute('role')==='button'&&n(cards[0]).getAttribute('tabindex')==='0'&&!n(cards[0]).querySelector('a'),'6b store name is the button, without nested links');
  ok(n(cards[0]).getAttribute('aria-current')==='true'&&!n(cards[1]).hasAttribute('aria-current'),'6b first store marked aria-current');
  T.d.querySelector('[data-store-list-open]').click();ok(T.d.activeElement===n(cards[0]),'6b modal focuses the active store name');
  n(cards[1]).dispatchEvent(new T.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));await tick(5);
  ok(cards[1].classList.contains('is-active')&&n(cards[1]).getAttribute('aria-current')==='true'&&!n(cards[0]).hasAttribute('aria-current'),'6b Enter on a name selects that store');
  ok(!T.d.querySelector('[data-store-modal]').classList.contains('is-open'),'6b selecting closes the modal');}
 {const T=setup({tpl:`<div data-store-card class="anfahrt_store is-card"><p data-store-name>M</p><a data-store-route href="#">R</a></div>`});
  T.w.fetch=(u)=>Promise.resolve({ok:true,status:200,json:()=>Promise.resolve(u.includes('geocode')?{features:[{geometry:{coordinates:[11,49]}}]}:{features:[{properties:{strasse:'Hauptstr.',hausnummer:1},geometry:{coordinates:[11,49]}}]})});
  search(T,'a');await tick(20);const nm=T.d.querySelector('[data-store-list] [data-store-name]');
  ok(nm&&nm.textContent==='Hauptstr. 1','6b store without a name still has a focusable control (street as label)');}
 // street that stands in for a missing name is not repeated
 {const T=setup({tpl:`<div data-store-card class="anfahrt_store is-card"><p data-store-name>M</p><p data-store-street>S</p><p data-store-city>C</p><a data-store-route href="#">R</a></div>`});
  T.w.fetch=(u)=>Promise.resolve({ok:true,status:200,json:()=>Promise.resolve(u.includes('geocode')?{features:[{geometry:{coordinates:[11,49]}}]}:{features:[{properties:{strasse:'Hauptstr.',hausnummer:1,plz:'92318',ort:'Neumarkt'},geometry:{coordinates:[11,49]}}]})});
  search(T,'a');await tick(20);const c=T.d.querySelector('[data-store-list] [data-store-card]');
  ok(c.querySelector('[data-store-name]').textContent==='Hauptstr. 1'&&!c.querySelector('[data-store-street]')&&c.querySelector('[data-store-city]').textContent==='92318 Neumarkt','label street not duplicated');}
 // not-found / empty keep the map error
 {const T=setup();T.tjFail=true;T.io([{isIntersecting:true}]);await tick();T.maps[0].fire('load');await tick(20);
  T.w.fetch=(u)=>Promise.resolve(u.includes('.json?secure')?{ok:false,status:503}:{ok:true,status:200,json:()=>Promise.resolve({features:[]})});
  search(T,'zzz');await tick(30);ok(msg(T)==='Diese PLZ oder dieser Ort wurde nicht gefunden. '+LOAD,'not-found keeps the map error ('+msg(T)+')');
  search(T,'');await tick(5);ok(msg(T)==='Bitte PLZ oder Ort eingeben. '+LOAD,'empty input keeps the map error');}
 console.log(failures?failures+' FAILED':'ALL PASSED');
})();
