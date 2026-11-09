# Reviews (new site) – faded duplicate under each text review
Embed element: b0e08f6a-f017-16d1-7047-ecdd1670d314 (section [data-reviews] b0e08f6a-…2ef)

## Revert
1. Remove the CSS block marked "/* Text-Bewertungen: zweite, ausgeblendete Karte */" (5 lines) from <style>.
2. In the script remove function `ghosts(...)`, function `clip()`, the call `ghosts(text);` in init, and `clip();` calls in build() and the load listener.
Everything else is unchanged (full new code: reviews_embed_after_ghost.html).
