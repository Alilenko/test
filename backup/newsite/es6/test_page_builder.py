import sys, re
d = sys.argv[1]
which = sys.argv[2]  # before | after
rd = lambda n: open(f"{d}/{n}_{which}.html").read()
footer = rd("footer").replace("https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js", "swiper-bundle.min.js")
cases_slides = "".join(f'<div class="swiper-slide"><div class="case">Case {i}</div></div>' for i in range(6))
def team_items(n, badges=True):
    out = ""
    for i in range(n):
        title = f"Badge {i}" if badges and i % 2 == 0 else ""
        out += f'<div class="w-dyn-item"><div class="team_card">P{i}<div class="team_badge"><div class="team_badge_title">{title}</div></div></div></div>'
    return out
res_slides = "".join(
    f'<div class="swiper-slide"><div class="resource_card"><div class="video_wrap" data-vimeo="{"10565755" + str(i) if i % 2 == 0 else ""}" data-video-title="Video {i}"><img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></div><a href="#res{i}" data-video-play="true" class="btn">Video ansehen {i}</a></div></div>'
    for i in range(6))
css = """
body{margin:0;font-family:sans-serif}section{padding:40px 20px}
.swiper-wrapper{display:flex}.swiper-slide{flex-shrink:0;width:320px}
.case{height:200px;background:#eee}
.slider_controls{display:flex;gap:8px}.slider_dot{width:10px;height:10px}
.team_list{display:flex}.team_card{width:220px;height:260px;background:#ddd}
.res_swiper .swiper-slide{width:340px}.resource_card{height:220px;background:#f3f3f3}
.video_wrap{width:300px;height:160px;background:#ccc}
"""
print(f"""<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>{css}</style></head><body>
<a href="#" id="top">top</a>
<p>Über <em data-brands-count="true">500</em> Brands · <span data-brands-count="true">500</span></p>
<data data-brands-source="true" value="" hidden></data>
<data data-brands-source="true" value=" 550+ " hidden></data>
<section data-cases="true"><div class="cases_slider"><div class="swiper"><div class="swiper-wrapper">{cases_slides}</div></div></div>
<div class="slider_controls"><a href="#" data-cases-prev="true" class="slider_arrow">prev</a><div data-cases-dots="true"></div><a href="#" data-cases-next="true" class="slider_arrow">next</a></div>
{rd("cases")}</section>
<section data-team="true" id="team"><div class="team_row"><div class="w-dyn-list"><div class="team_list is-top w-dyn-items">{team_items(5)}</div></div></div>
<div class="team_row"><div class="w-dyn-list"><div class="team_list is-bottom w-dyn-items">{team_items(4, False)}</div></div></div>
{rd("team")}</section>
<section data-faq-light="true"><details class="faq_item" name="faq-light"><summary class="faq_item_question">Q1</summary><div>A1</div></details><details class="faq_item" name="faq-light"><summary class="faq_item_question">Q2</summary><div>A2</div></details>{rd("faq")}</section>
<section><div class="res_swiper"><div class="swiper-wrapper">{res_slides}</div></div><a href="#" class="res_arrow_prev">rp</a><a href="#" class="res_arrow_next">rn</a></section>
<section>
<div class="video_wrap" id="yt" data-youtube="https://youtu.be/abc_DEF-123" data-video-title="YT"><img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></div>
<div class="video_wrap" id="bad" data-vimeo="https://evil.com/x y\"><img alt=""></div>
<div class="video_wrap" id="vm" data-vimeo="https://vimeo.com/1056575566"><span>poster</span></div>
</section>
<div style="height:2500px"></div>
{footer}
</body></html>""")
