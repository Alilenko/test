const {chromium}=require('playwright');
const snap=p=>p.evaluate(()=>{
  const cs=document.querySelector('[data-cases] .swiper').swiper;
  const top=document.querySelector('.team_list.is-top'),bot=document.querySelector('.team_list.is-bottom');
  const tsw=top.parentElement.swiper,bsw=bot.parentElement.swiper;
  const rs=document.querySelector('.res_swiper').swiper;
  return {
    brands:[...document.querySelectorAll('[data-brands-count]')].map(e=>e.textContent),
    cases:cs?{init:true,active:cs.activeIndex,locked:!!cs.isLocked,controlsHidden:document.querySelector('.slider_controls').classList.contains('is-locked-hidden'),dots:document.querySelectorAll('[data-cases-dots] .slider_dot').length,prevDisabled:document.querySelector('[data-cases-prev]').classList.contains('is-disabled'),speed:cs.params.speed}:null,
    team:{topKids:top.children.length,botKids:bot.children.length,clonesHidden:[...document.querySelectorAll('[data-team] [data-clone]')].every(c=>c.getAttribute('aria-hidden')==='true'),current:top.querySelector('.is-current')?.textContent.slice(0,2),currents:top.querySelectorAll('.is-current').length,margin:bot.style.marginLeft,badges:document.querySelectorAll('.team_list.is-top > :not([data-clone]) .team_badge').length,topSwiper:!!tsw,botSwiper:!!bsw,autoplay:!!(tsw&&tsw.autoplay&&tsw.autoplay.running)},
    faq:[...document.querySelectorAll('details.faq_item')].map(d=>d.open),
    res:rs?{init:true,active:rs.activeIndex}:null,
    video:['yt','bad','vm'].map(id=>{const e=document.getElementById(id);return [e.getAttribute('role'),e.getAttribute('aria-label'),e.querySelector('iframe')?.src||null]}),
    resVideo:[...document.querySelectorAll('.res_swiper .video_wrap')].map(e=>e.getAttribute('role'))
  };});
(async()=>{
  const b=await chromium.launch();
  const results={};
  for(const which of ['before','after']){
    const R=[];
    const p=await b.newPage({viewport:{width:1440,height:900}});
    const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.type()+': '+m.text())});
    await p.goto('file://'+process.cwd()+`/page_${which}.html`);await p.waitForTimeout(600);
    R.push(['load',await snap(p)]);
    await p.click('[data-cases-next]');await p.waitForTimeout(700);
    R.push(['cases next',await snap(p)]);
    await p.waitForTimeout(3200);
    R.push(['team autoplay after 3.8s',await snap(p)]);
    await p.click('#yt');await p.waitForTimeout(100);
    await p.focus('#vm');await p.keyboard.press('Enter');await p.waitForTimeout(100);
    await p.click('.res_swiper .swiper-slide:nth-child(1) [data-video-play]');await p.waitForTimeout(100);
    const hashAfterPlay=await p.evaluate(()=>location.hash);
    await p.click('.res_swiper .swiper-slide:nth-child(2) [data-video-play]',{force:true});await p.waitForTimeout(100);
    const hashAfterNoVideo=await p.evaluate(()=>location.hash);
    R.push(['videos',{...(await snap(p)),hashAfterPlay,hashAfterNoVideo}]);
    await p.setViewportSize({width:800,height:900});await p.waitForTimeout(700);
    R.push(['resize 800',await snap(p)]);
    await p.setViewportSize({width:3000,height:900});await p.waitForTimeout(700);
    R.push(['resize 3000',await snap(p)]);
    await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(200);
    R.push(['reduce at runtime',await snap(p)]);
    R.push(['errors',errs]);
    results[which]=R;await p.close();
  }
  // reduced motion from start
  for(const which of ['before','after']){
    const p=await b.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});const errs=[];p.on('pageerror',e=>errs.push(e.message));
    await p.goto('file://'+process.cwd()+`/page_${which}.html`);await p.waitForTimeout(500);
    results[which].push(['reduced from start',await snap(p)],['errors reduced',errs]);await p.close();
  }
  await b.close();
  let same=0,diff=0;
  results.before.forEach(([k,v],i)=>{
    const a=JSON.stringify(v),c=JSON.stringify(results.after[i][1]);
    if(a===c){same++;console.log('SAME ',k);}else{diff++;console.log('DIFF ',k,'\n  before:',a,'\n  after: ',c);}
  });
  console.log('\nexample state (after, load):',JSON.stringify(results.after[0][1]));
  console.log('videos (after):',JSON.stringify(results.after[3][1].video),results.after[3][1].hashAfterPlay,results.after[3][1].hashAfterNoVideo);
  console.log('errors before:',JSON.stringify(results.before.filter(r=>r[0].startsWith('errors')).map(r=>r[1])),'after:',JSON.stringify(results.after.filter(r=>r[0].startsWith('errors')).map(r=>r[1])));console.log('team current over time (after):',results.after.slice(0,3).map(r=>r[1].team.current).join(' -> '));console.log(same,'same,',diff,'different');
})();
