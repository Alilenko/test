# Reviews (new site) – faded duplicate under each text review
Embed element: b0e08f6a-f017-16d1-7047-ecdd1670d314 (section [data-reviews] b0e08f6a-…2ef)

## Revert
1. Remove the CSS block marked "/* Text-Bewertungen: zweite, ausgeblendete Karte */" (5 lines) from <style>.
2. In the script remove function `ghosts(...)`, function `clip()`, the call `ghosts(text);` in init, and `clip();` calls in build() and the load listener.
Everything else is unchanged (full new code: reviews_embed_after_ghost.html).

## Refactor (superseded)

## Final (applied in Webflow, new site): reviews_embed_final.html — previous live version: reviews_embed_refactor.html
- New code: reviews_embed_refactor.html
- Before refactor (current live in Webflow): reviews_embed_before_refactor.html
- Test: reviews_refactor_test.js (Playwright, compares old vs new)

## ES6 version (const/let, no comments) — reviews_embed_es6.html (APPLIED in Webflow); previous: reviews_embed_before_es6.html
## Säulen refactor — saeulen_embed_refactor.html (APPLIED in Webflow); previous live: saeulen_embed_before_refactor.html; test: saeulen_refactor_test.js
Säulen: mobile pointer version APPLIED in Webflow (saeulen_embed_mobile_pointer.html); previous: saeulen_embed_refactor.html
Säulen: APPLIED saeulen_embed_no_mobile_outline.html (pointer reverted, outline desktop-only); previous: saeulen_embed_mobile_pointer.html
Reviews: APPLIED reviews_embed_phone_dialog.html (phone mockup in zoom dialog); previous: reviews_embed_es6.html
