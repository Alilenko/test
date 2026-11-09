import sys
emb = open(sys.argv[1]).read()
names = ["Daten", "Traffic", "Conversion", "CRM", "Systeme"]
tabs = ""
slides = ""
for i, n in enumerate(names):
    tabs += f'<div role="listitem" class="saeulen_tab w-dyn-item"><div class="saeulen_tab_icon"></div><div class="saeulen_tab_text"><div class="saeulen_tab_number">0{i+1}</div><div class="saeulen_tab_name">{n}</div></div></div>'
    last = i == len(names) - 1
    nxt_cls = " w-condition-invisible" if last else ""
    cta_cls = "" if last else " w-condition-invisible"
    slides += f'''<div role="listitem" class="saeulen_slide w-dyn-item"><div class="saeulen_item"><div class="saeulen_card_content">
<div class="saeulen_card_count"><div class="saeulen_card_number">0{i+1}</div><div class="saeulen_card_of">von 5 Säulen</div></div>
<h3 class="saeulen_card_name">{n}</h3><p class="saeulen_card_text">Beschreibung {n}. Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
<div class="saeulen_card_list"><ul><li><strong>Punkt:</strong> Lorem ipsum dolor sit amet.</li><li><strong>Punkt:</strong> Lorem ipsum dolor sit amet.</li></ul></div>
<div class="button-group"><a href="#" data-saeule-next="true" class="button{nxt_cls}"><div data-saeule-next-name="Nächste Säule: ">Nächste Säule</div></a>
<div class="cta{cta_cls}"><a class="cta_btn" href="https://example.com/audit">Jetzt gemeinsam wachsen</a></div></div>
</div><div class="saeulen_card_media"><div class="saeulen_card_image"></div></div></div></div>'''
css = '''
*{box-sizing:border-box}body{margin:0;background:#140404;color:#fff;font-family:sans-serif}
.w-condition-invisible{display:none!important}
.padding-global{padding:0 5%}.container-large{max-width:80rem;margin:0 auto}.padding-section-large{padding:4rem 0 12rem}
.saeulen_tabs{max-width:75rem;margin:0 auto 3rem;padding:.375rem;border:1px solid hsla(0,0%,100%,.1);border-radius:24px;background:rgba(255,255,255,.04)}
.saeulen_tabs_list{display:flex;justify-content:space-between;column-gap:.25rem}
.saeulen_tab{position:relative;display:flex;min-height:6.1625rem;min-width:0;padding:.625rem 2.5%;justify-content:center;align-items:center;flex:0 1 auto;border-radius:18px;transition:background-color .3s;column-gap:.5rem;cursor:pointer}
.saeulen_tab_icon{flex:none;width:clamp(2.5rem,4.5vw,4.9rem);height:clamp(2.5rem,4.5vw,4.9rem);background:#5a2a2a;border-radius:50%}
.saeulen_tab_text{display:flex;min-width:0;flex-direction:column;row-gap:.2rem}
.saeulen_tab_number{color:#e1bf6e;font-size:1.2rem;line-height:1;font-style:italic}
.saeulen_tab_name{transition:color .3s;color:rgba(255,255,255,.62);line-height:1.4;font-style:italic;white-space:nowrap;font-size:clamp(1rem,1.4vw,1.25rem)}
.saeulen_slider{position:relative;overflow:visible;max-width:75rem;margin:0 auto;touch-action:pan-y}
.saeulen_list{display:flex;box-sizing:content-box}
.saeulen_slide{width:70rem;height:auto;max-width:100%;flex:0 0 auto;opacity:.5;transition:opacity .4s}
.saeulen_item{position:relative;display:grid;overflow:hidden;height:100%;padding:3.5rem;align-items:center;gap:3.5rem;border-radius:28px;box-shadow:0 0 0 1px rgba(255,255,255,.08);grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);background:#2a0c0c}
.saeulen_card_content{position:relative;z-index:2;display:flex;flex-direction:column;align-items:flex-start;row-gap:.9rem}
.saeulen_card_name{font-size:2.5rem;line-height:1.2;font-style:italic;font-weight:400;margin:0}
.saeulen_card_media{display:flex;overflow:hidden;aspect-ratio:600/640;border-radius:24px;background:rgba(20,4,4,.35)}
.button-group{display:flex;gap:1rem}.button,.cta_btn{display:inline-block;padding:.75rem 1.5rem;border:1px solid #fff;border-radius:99px;color:#fff;text-decoration:none}
.arrow_wrap{display:flex;justify-content:flex-end;gap:1rem;max-width:75rem;margin:2rem auto 0}
.slider_arrow{display:flex;padding:.75rem;border-radius:50px;background:#fff;color:#0a0a0a}.slider_arrow.is-disabled{opacity:.4}
@media (max-width:991px){.saeulen_tabs{margin-bottom:2rem;overflow-x:auto}.saeulen_tab{min-height:3.5rem;padding:.5rem .875rem .5rem .5rem;flex:0 0 auto;border-radius:14px;column-gap:.375rem}.saeulen_tab_icon{width:2.25rem;height:2.25rem}.saeulen_tab_name{font-size:1rem}.saeulen_slide{width:92%}.saeulen_item{padding:2rem;grid-template-columns:1fr}.saeulen_card_media{aspect-ratio:4/3}}
@media (max-width:767px){.saeulen_tabs{margin-bottom:1.5rem;padding:.25rem;border-radius:18px}.saeulen_item{padding:1.5rem}}
'''
arrow = '<svg aria-hidden="true" fill="currentColor" viewBox="0 -960 960 960" height="24" width="24"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>'
print(f'''<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>{css}</style></head><body>
<a href="#" id="before">before</a><div style="height:1200px"></div>
<section class="section is-dark" id="system" data-saeulen="true"><div class="padding-global"><div class="container-large"><div class="padding-section-large">
<div class="saeulen_tabs"><div class="w-dyn-list"><div role="list" class="saeulen_tabs_list w-dyn-items">{tabs}</div></div></div>
<div class="saeulen_slider w-dyn-list"><div role="list" class="saeulen_list w-dyn-items">{slides}</div></div>
<div class="arrow_wrap"><a href="#" class="slider_arrow" data-saeulen-prev="true" aria-label="Vorherige Säule" role="button">{arrow}</a><a href="#" class="slider_arrow" data-saeulen-next="true" aria-label="Nächste Säule" role="button">{arrow}</a></div>
<script src="swiper-bundle.min.js"></script>
{emb}
</div></div></div></section><div style="height:1500px"></div></body></html>''')
