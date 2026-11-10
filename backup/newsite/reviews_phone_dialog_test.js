const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [n,w,h,mob] of [['desktop',1440,900,false],['phone',390,844,true]]){
 const p=await b.newPage({viewport:{width:w,height:h},isMobile:mob,hasTouch:mob,deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+process.cwd()+'/phone_new.html');await p.waitForTimeout(400);
 const card=await p.evaluate(()=>{const ph=document.querySelector('.reviews_track_phones .review_phone');const r=ph.getBoundingClientRect(),i=ph.querySelector('img').getBoundingClientRect();return{bg:getComputedStyle(ph).backgroundImage.slice(0,30),imgW:+(i.width/r.width).toFixed(3),top:+((i.top-r.top)/r.width).toFixed(3),bottom:+((r.bottom-i.bottom)/r.width).toFixed(3),ar:+(r.height/r.width).toFixed(3)}});
 await p.evaluate(()=>document.querySelector('.reviews_track_phones [data-review-zoom]').click());await p.waitForTimeout(200);
 const d=await p.evaluate(()=>{const f=document.querySelector('.reviews_dialog_phone');const r=f.getBoundingClientRect(),i=f.querySelector('img').getBoundingClientRect();const dl=document.querySelector('.reviews_dialog').getBoundingClientRect();return{open:document.querySelector('.reviews_dialog').open,hidden:f.hidden,bg:getComputedStyle(f).backgroundImage.slice(0,30),imgW:+(i.width/r.width).toFixed(3),top:+((i.top-r.top)/r.width).toFixed(3),bottom:+((r.bottom-i.bottom)/r.width).toFixed(3),ar:+(r.height/r.width).toFixed(3),frameW:Math.round(r.width),fitsVert:r.bottom<=innerHeight&&r.top>=0,dialogH:Math.round(dl.height),scroll:document.querySelector('.reviews_dialog_inner').scrollHeight>document.querySelector('.reviews_dialog_inner').clientHeight,bodyHidden:document.querySelector('.reviews_dialog_body').hidden}});
 console.log(n,'card ',JSON.stringify(card));console.log(n,'popup',JSON.stringify(d));
 await p.screenshot({path:`phone_dialog_${n}.png`});
 await p.keyboard.press('Escape');
 await p.evaluate(()=>document.querySelector('.reviews_track_text [data-review-more].is-visible').click());await p.waitForTimeout(150);
 console.log(n,'review popup',JSON.stringify(await p.evaluate(()=>({frameHidden:document.querySelector('.reviews_dialog_phone').hidden,bodyHidden:document.querySelector('.reviews_dialog_body').hidden,label:document.querySelector('.reviews_dialog').getAttribute('aria-label')}))));
 console.log('errors',errs);await p.close();}
await b.close();})();
