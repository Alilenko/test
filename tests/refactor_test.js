const {JSDOM}=require('jsdom');const fs=require('fs');
const code=fs.readFileSync(require('path').join(__dirname,'..','store_locator_embed.html'),'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
const tick=(ms=0)=>new Promise(r=>setTimeout(r,ms));
let failures=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)failures++;};
function setup(opts={}){
 const token=opts.token||'pk.test';
 const html=`<section data-store-locator data-mapbox-token="${token}" data-mapbox-tileset="${opts.tileset||'u.t'}" data-factory-lnglat="${opts.factory||'11.46,49.28'}">
<div data-store-map></div><input data-store-search><button data-store-reset class="store-locator_reset">x</button>
<button data-store-submit>Find</button><button data-store-list-open aria-haspopup="dialog" hidden>Liste</button><p data-store-message>Lorem</p>
<div data-chain><img src="https://cdn/edeka.svg" alt="EDEKA"><span data-chain-slug>EDEKA</span></div>
<div data-chain><img src="javascript:alert(1)" alt="x"><span data-chain-slug>evil</span></div>
<div data-chain><img src="https://cdn/p.svg"><span data-chain-slug>__proto__</span></div>
<div class="anfahrt_store is-white" data-store-factory id="factory"><p>Werksverkauf</p></div>
<div data-store-templates><div class="anfahrt_store is-card" data-store-card id="tpl"><img data-store-logo id="tpl-logo"><div><p data-store-name>M</p><p data-store-street>S</p><p data-store-city>C</p><p data-store-phone>T</p><a data-store-route href="#">Route</a></div></div></div>
<div data-store-modal class="filter-modal" role="dialog" aria-modal="true" aria-labelledby="store-modal-title"><h2 id="store-modal-title">Märkte</h2><button data-store-close>x</button><div data-store-list></div></div></section>`;
 const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://burgis.webflow.io/'});
 const w=dom.window;const T={w,d:w.document,calls:[],fetches:[],logs:[],scripts:0};
 w.console={info:m=>T.logs.push(m),warn:m=>T.logs.push('WARN '+m),log(){},error(){}};
 class Map{isMoving(){return false} once(){} panBy(d){(T.pans=T.pans||[]).push(d)} constructor(o){T.map=this;this.h={};this.layers=[];T.calls.push('newMap')} addControl(){} resize(){} addImage(){} addSource(){}
  addLayer(l){this.layers.push(l.id)} getLayer(id){return this.layers.includes(id)} on(ev,a,b){const k=b?ev+':'+a:ev;(this.h[k]=this.h[k]||[]).push(b||a)}
  fire(k,e){(this.h[k]||[]).forEach(f=>f(e||{}))} queryRenderedFeatures(){return []} getCanvas(){return{style:{}}}
  flyTo(o){T.calls.push('flyTo '+JSON.stringify(o.center))} fitBounds(b){T.calls.push('fitBounds '+b.b.length)} remove(){T.calls.push('mapRemove')}}
 const gl={Map,NavigationControl:class{},Marker:class{setLngLat(c){this.c=c;return this}addTo(){T.calls.push('marker '+this.c);return this}remove(){}},
  Popup:class{getElement(){if(!this._el){this._el=w.document.createElement('div');this._el.innerHTML='<div class="mapboxgl-popup-content"></div>';}return this._el}setLngLat(c){this.c=c;return this}setDOMContent(n){this.n=n;return this}addTo(){T.calls.push('popup '+this.n.textContent.trim().replace(/\s+/g,' '));T.lastPopup=this.n;return this}remove(){}},
  LngLatBounds:class{constructor(a){this.b=[a]}extend(p){this.b.push(p)}}};
 T.gl=gl;
 // intercept script injection
 const orig=w.document.head.appendChild.bind(w.document.head);
 w.document.head.appendChild=(el)=>{if(el.tagName==='SCRIPT'){T.scripts++;T.lastScript=el;} return orig(el);};
 w.Path2D=class{};w.requestAnimationFrame=cb=>setTimeout(cb,0);w.IntersectionObserver=class{constructor(cb){T.io=cb} observe(){} disconnect(){}};
 w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({getImageData:()=>({})},{get:(t,k)=>k in t?t[k]:()=>{}});
 T.responders=[];
 w.fetch=(url,o)=>{const kind=url.includes('geocode')?'geo':url.includes('tilequery')?'tq':'tj';T.fetches.push({kind,url});
  return new Promise((res,rej)=>{const sig=o&&o.signal;if(sig)sig.addEventListener('abort',()=>{const e=new Error('aborted');e.name='AbortError';rej(e)});
   const r=(T.respond||(()=>({ok:true,status:200,json:()=>Promise.resolve({})})))(kind,url);
   const delay=(T.delay&&T.delay(kind,url))||0;setTimeout(()=>res(r),delay);});};
 w.eval(code);
 T.loadScript=()=>{w.mapboxgl=gl;T.lastScript.onload();};
 return T;
}
const geo=(lng,lat)=>({ok:true,status:200,json:()=>Promise.resolve({features:[{geometry:{coordinates:[lng,lat]}}]})});
const tq=(n,base=11)=>({ok:true,status:200,json:()=>Promise.resolve({features:Array.from({length:n},(_,i)=>({properties:{id:'s'+i,name:'Markt '+base+'-'+i,chain:'edeka',plz:1067,ort:'Ort'},geometry:{coordinates:[base+i/100,49]}}))})});
const tj={ok:true,status:200,json:()=>Promise.resolve({vector_layers:[{id:'lyr'}]})};
const msg=T=>T.d.querySelector('[data-store-message]').textContent;
const cards=T=>[...T.d.querySelectorAll('[data-store-list] [data-store-card]')];
const doSearch=(T,v)=>{T.d.querySelector('[data-store-search]').value=v;T.d.querySelector('[data-store-submit]').click();};

(async()=>{
 // 1 duplicate script loading
 {const T=setup();T.respond=(k,u)=>k==='tj'?tj:k==='geo'?geo(11.4,49.2):tq(3);
  T.io([{isIntersecting:true}]);doSearch(T,'92318');doSearch(T,'92319');await tick(5);
  ok(T.scripts===1,'1 Mapbox script injected once despite lazy load + 2 searches ('+T.scripts+')');
  ok(T.d.querySelectorAll('link[data-mapbox-css]').length===1,'1 CSS injected once');
  T.loadScript();await tick(5);ok(T.calls.filter(c=>c==='newMap').length===1,'1 map created once');
  T.map.fire('load');await tick(20);ok(T.calls.some(c=>c.startsWith('fitBounds')),'3 pending view applied after map load');
  ok(cards(T).length===3,'3 list rendered before map ready too');}
 // 1b retry after failure
 {const T=setup();T.io([{isIntersecting:true}]);await tick();T.lastScript.onerror();await tick(5);
  ok(msg(T)==='Die Karte konnte nicht geladen werden. Bitte später erneut versuchen.','1b load failure message');
  T.respond=(k)=>k==='geo'?geo(11,49):tq(1);doSearch(T,'x');await tick(5);ok(T.scripts===2,'1b controlled retry injects script again');
  ok(T.d.querySelectorAll('script[data-mapbox-js]').length===1,'1b old failed script removed');}
 // 2 race: first search slow, second fast
 {const T=setup();T.respond=(k,u)=>k==='tj'?tj:k==='geo'?(u.includes('slow')?geo(13,52):geo(11,49)):(u.includes('/13,52')?tq(5,13):tq(2,11));
  T.delay=(k,u)=>u.includes('slow')?50:0;
  doSearch(T,'slow');doSearch(T,'fast');await tick(120);
  ok(cards(T).length===2&&cards(T)[0].textContent.includes('Markt 11'),'2 newest search wins, stale response ignored');
  ok(!T.logs.some(l=>l.startsWith('WARN')),'2 aborted request logged nothing');
  ok(msg(T)==='2 Märkte in Ihrer Nähe.','2 message from latest search');}
 // 2b reset during search
 {const T=setup();T.respond=(k)=>k==='geo'?geo(11,49):tq(4);T.delay=()=>30;doSearch(T,'a');await tick(5);
  T.d.querySelector('[data-store-reset]').click();await tick(100);
  ok(cards(T).length===0&&msg(T)==='','2b reset cancels pending search');
  ok(T.d.querySelector('[data-store-submit]').hidden===false,'2b submit visible after reset');}
 {const T=setup();T.respond=(k)=>k==='geo'?geo(11,49):tq(2);doSearch(T,'a');await tick(20);
  ok(cards(T).length===2&&T.d.querySelector('[data-store-submit]').hidden===false&&T.d.querySelector('[data-store-list-open]').hidden===false,'submit stays visible after a search, next to the list button');
  T.d.querySelector('[data-store-search]').value='b';T.d.querySelector('[data-store-submit]').click();await tick(20);
  ok(T.fetches.filter(f=>f.kind==='geo').length===2,'a second search can be started with the button');}
 // 2c duplicate submit of same query
 {const T=setup();T.respond=(k)=>k==='geo'?geo(11,49):tq(1);T.delay=()=>20;doSearch(T,'a');doSearch(T,'a');await tick(80);
  ok(T.fetches.filter(f=>f.kind==='geo').length===1,'2c same query not submitted twice');}
 // 4 errors
 {const T=setup();T.respond=(k)=>k==='geo'?{ok:false,status:401,json:()=>Promise.resolve({message:'x'})}:tq(1);doSearch(T,'a');await tick(20);
  ok(msg(T)==='Die Suche ist gerade nicht möglich. Bitte später erneut versuchen.','4 geocoding HTTP error -> search error');
  ok(T.logs.some(l=>l.includes('Geocoding HTTP 401'))&&!T.logs.some(l=>l.includes('pk.test')),'4 error logged without token');}
 {const T=setup();T.respond=(k)=>k==='geo'?{ok:true,status:200,json:()=>Promise.resolve({features:[]})}:tq(1);doSearch(T,'zzz');await tick(20);
  ok(msg(T)==='Diese PLZ oder dieser Ort wurde nicht gefunden.','4 not found message');}
 {const T=setup();T.respond=(k)=>k==='geo'?geo(11,49):{ok:true,status:200,json:()=>Promise.reject(new SyntaxError('bad'))};doSearch(T,'a');await tick(20);
  ok(msg(T).startsWith('Die Suche ist gerade'),'4 invalid JSON handled');}
 {const T=setup();T.respond=(k)=>k==='tj'?{ok:false,status:404,json:()=>Promise.resolve({})}:tq(0);T.io([{isIntersecting:true}]);await tick();T.loadScript();await tick();T.map.fire('load');await tick(20);
  ok(msg(T).startsWith('Die Karte konnte nicht'),'4 TileJSON 404 handled');ok(T.logs.some(l=>l.includes('TileJSON HTTP 404')),'4 TileJSON status logged');}
 // 6 messages
 {const T=setup();let n=0;T.respond=(k,u)=>k==='geo'?geo(11,49):(u.includes('radius=50000')?tq(0):tq(3));doSearch(T,'a');await tick(20);
  ok(msg(T)==='Im Umkreis von 50 km gibt es keine Märkte. 3 Märkte im Umkreis von 200 km.','6 fallback radius message');}
 {const T=setup();T.respond=(k)=>k==='geo'?geo(11,49):tq(50);doSearch(T,'a');await tick(20);
  ok(msg(T)==='Die 50 nächstgelegenen Märkte werden angezeigt.','6 limit message');}
 // 5 invalid coords + 7 logos + 8 ids
 {const T=setup();T.respond=(k)=>k==='geo'?geo(11,49):{ok:true,status:200,json:()=>Promise.resolve({features:[
   {properties:{name:'Gut',chain:'EDEKA',plz:'1067'},geometry:{coordinates:[13.7,51.05]}},
   {properties:{name:'NaN'},geometry:{coordinates:['x',51]}},{properties:{name:'Range'},geometry:{coordinates:[200,51]}},{properties:{name:'NoGeo'}},
   {properties:{name:'Evil',chain:'evil'},geometry:{coordinates:[13,51]}},{properties:{name:'Proto',chain:'__proto__',hausnummer:0},geometry:{coordinates:[13,51]}},
   {properties:{name:'<img src=x onerror=alert(1)>'},geometry:{coordinates:[13,51]}} ]})};
  doSearch(T,'a');await tick(20);const c=cards(T);
  ok(c.length===4,'5 invalid coordinates dropped ('+c.length+')');
  ok(c[0].querySelector('img').src==='https://cdn/edeka.svg','7 case-insensitive slug -> logo');
  ok(c[0].textContent.includes('01067'),'5 PLZ leading zero kept');
  ok(!c[1].querySelector('img'),'7 javascript: logo rejected');
  ok(c[2].querySelector('img')&&c[2].querySelector('img').src==='https://cdn/p.svg'&&Object.prototype.src===undefined,'7 __proto__ slug stored as plain key, no prototype pollution');
  ok(!c[3].querySelector('img[onerror]')&&c[3].querySelector('[data-store-name]').textContent.includes('<img'),'8 HTML in data rendered as text');
  ok(!c.some(x=>x.id||x.querySelector('[id]')),'8 cloned cards have no duplicate ids');
  ok(c[0].querySelector('a').href==='https://www.google.com/maps/dir/?api=1&destination=51.05,13.7','8 route link from validated coords');}
 {const T=setup({factory:'abc,999'});T.io([{isIntersecting:true}]);await tick();T.loadScript();await tick();T.map.fire('load');await tick(10);
  ok(!T.map.layers.includes('werksverkauf'),'5 invalid factory coords -> no factory layer');}
 // factory popup, layer order, overlap
 {const T=setup();T.respond=(k)=>k==='tj'?tj:tq(0);T.io([{isIntersecting:true}]);await tick();T.loadScript();await tick();T.map.fire('load');await tick(20);
  ok(T.map.layers.join()==='werksverkauf,maerkte'||T.map.layers.join()==='werksverkauf,maerkte','layers created');
  T.map.fire('click:werksverkauf',{});ok(T.lastPopup&&T.lastPopup.textContent.includes('Werksverkauf')&&!T.lastPopup.id,'factory popup without duplicate id');}
 // 9 modal
 {const T=setup();T.respond=(k)=>k==='geo'?geo(11,49):tq(2);doSearch(T,'a');await tick(20);const m=T.d.querySelector('[data-store-modal]');
  ok(m.getAttribute('role')==='dialog'&&m.getAttribute('aria-modal')==='true'&&m.getAttribute('aria-labelledby')==='store-modal-title','9 dialog semantics');
  ok(m.hasAttribute('inert')&&m.getAttribute('aria-hidden')==='true','9 closed modal inert');
  const lo=T.d.querySelector('[data-store-list-open]');lo.click();ok(m.classList.contains('is-open')&&!m.hasAttribute('inert'),'9 opens');
  ok(T.d.documentElement.style.overflow==='hidden','9 scroll locked');
  T.d.dispatchEvent(new T.w.KeyboardEvent('keydown',{key:'Escape'}));ok(!m.classList.contains('is-open')&&T.d.activeElement===lo,'9 Escape closes, focus restored');
  ok(T.d.documentElement.style.overflow==='','9 overflow restored');
  lo.click();cards(T)[1].click();await tick(10);ok(!m.classList.contains('is-open')&&T.d.activeElement===lo,'9 selecting store closes modal, focus on opener');
  }
 // 11 secret token
 {const T=setup({token:'sk.secret'});ok(msg(T)==='Karte nicht konfiguriert.'&&T.logs.some(l=>l.includes('pk.'))&&!T.logs.some(l=>l.includes('sk.secret')),'11 sk token refused, not logged');}
 // card click before map ready -> applied later
 {const T=setup();T.respond=(k)=>k==='tj'?tj:k==='geo'?geo(11,49):tq(2);doSearch(T,'a');await tick(20);cards(T)[1].click();T.loadScript();await tick();T.map.fire('load');await tick(10);
  ok(T.calls.some(c=>c.startsWith('flyTo'))&&T.calls.some(c=>c.startsWith('popup Markt 11-1')),'3 store selection before map ready applied after load (latest view wins)');}
 // map failure after a search keeps the result message
 {const T=setup();T.respond=(k)=>k==='geo'?geo(11,49):tq(3);doSearch(T,'a');await tick(20);
  T.lastScript.onerror();await tick(10);
  ok(msg(T)==='3 Märkte in Ihrer Nähe. Die Karte konnte nicht geladen werden. Bitte später erneut versuchen.','map error appended to search result, list kept ('+cards(T).length+')');
  T.d.querySelector('[data-store-reset]').click();T.respond=()=>({ok:false,status:500,json:()=>Promise.resolve({})});
  T.io([{isIntersecting:true}]);await tick();T.lastScript.onerror();await tick(10);
  ok(msg(T)==='Die Karte konnte nicht geladen werden. Bitte später erneut versuchen.','map error alone when there are no results');}
 // no informational console output, only warnings for real problems
 {const T=setup();T.respond=(k)=>k==='tj'?tj:k==='geo'?geo(11,49):tq(2);T.io([{isIntersecting:true}]);await tick();T.loadScript();await tick();T.map.fire('load');doSearch(T,'a');await tick(30);
  ok(T.logs.length===0,'no console output on the happy path ('+T.logs.length+')');}
 // map fails while the search is still running: the later result keeps the map error
 {const T=setup();T.respond=(k)=>k==='geo'?geo(11,49):tq(2);T.delay=()=>30;doSearch(T,'a');await tick(5);T.lastScript.onerror();await tick(80);
  ok(msg(T)==='2 Märkte in Ihrer Nähe. Die Karte konnte nicht geladen werden. Bitte später erneut versuchen.','map error during a running search survives the result');}
 console.log(failures?failures+' FAILED':'ALL PASSED');
})();
