/* jsdom tests for recipe_video_embed.html: click-to-play YouTube with consent notice. Run: node recipe_video_test.js */
const { JSDOM } = require('jsdom');
const fs = require('fs'); const path = require('path');
const embed = fs.readFileSync(path.join(__dirname, '..', 'recipe_video_embed.html'), 'utf8');
let failures = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) failures++; };
const page = (url, category, extra) => `<!doctype html><body>${extra || ''}<div class="recipe-video_component" data-recipe-video data-video-url="${url}" data-consent-category="${category}">
 <div class="recipe-video_player" data-video-player role="button" tabindex="0" aria-label="Rezeptvideo abspielen"><img class="recipe-video_image" src="x.jpg" alt=""><div class="video-overlay-layer"></div><div class="lightbox-play-icon"></div></div>
</div>${embed}</body>`;
const run = (html, cookie) => {
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://burgis.example/rezepte/x', beforeParse(w) { if (cookie) w.document.cookie = cookie; } });
  return dom.window.document;
};
const iframe = d => d.querySelector('.recipe-video_iframe');

let d = run(page('https://www.youtube.com/watch?v=plBYJdadYHQ', 'marketing'));
ok(!iframe(d) && !d.querySelector('iframe'), 'nothing from YouTube before click');
d.querySelector('[data-video-player]').click();
ok(!iframe(d) && d.querySelector('.recipe-video_consent'), 'no consent: click shows notice, no iframe');
ok(!d.querySelector('.recipe-video_consent').textContent.includes('Cookie-Einstellungen'), 'no Finsweet on page: no settings button');
d.querySelector('[data-video-accept]').click();
ok(iframe(d) && iframe(d).src === 'https://www.youtube-nocookie.com/embed/plBYJdadYHQ?autoplay=1&rel=0&playsinline=1', 'accept loads nocookie player: ' + (iframe(d) && iframe(d).src));
ok(!d.querySelector('.recipe-video_consent') && d.querySelector('[data-video-player]').classList.contains('is-playing'), 'notice removed, player is-playing');
d.querySelector('[data-video-player]').click();
ok(d.querySelectorAll('iframe').length === 1, 'second click does not add a second iframe');

const granted = 'fs-cc=' + encodeURIComponent(JSON.stringify({ id: 'a', consents: { analytics: false, marketing: true, personalization: false } }));
d = run(page('https://www.youtube.com/shorts/-rWbBqIyYj0', 'marketing'), granted);
d.querySelector('[data-video-player]').click();
ok(iframe(d) && iframe(d).src.includes('/embed/-rWbBqIyYj0?'), 'Finsweet marketing consent: plays at once (shorts link)');

const denied = 'fs-cc=' + encodeURIComponent(JSON.stringify({ id: 'a', consents: { marketing: false } }));
d = run(page('https://youtu.be/eSv0vi1eg2Q', 'marketing', '<a href="#" fs-cc="open-preferences">prefs</a>'), denied);
let opened = 0; d.querySelector('[fs-cc="open-preferences"]').addEventListener('click', e => { e.preventDefault(); opened++; });
d.querySelector('[data-video-player]').dispatchEvent(new d.defaultView.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
ok(!iframe(d) && d.querySelector('.recipe-video_consent'), 'consent denied: Enter shows notice');
const prefsBtn = [...d.querySelectorAll('.recipe-video_consent button')].find(b => b.textContent === 'Cookie-Einstellungen');
ok(!!prefsBtn, 'Finsweet present: settings button shown');
prefsBtn.click();
ok(opened === 1 && !iframe(d), 'settings button opens Finsweet preferences, no video');

d = run(page('https://youtube.com/watch?v=-J24urNb5v8', ''));
d.querySelector('[data-video-player]').click();
ok(iframe(d) && iframe(d).src.includes('/embed/-J24urNb5v8?'), 'empty consent category: plays at once');

d = run(page('', 'marketing'));
ok(d.querySelector('[data-recipe-video]').hidden, 'no link: block hidden');
d = run(page('https://example.com/video', 'marketing'));
ok(d.querySelector('[data-recipe-video]').hidden, 'non-YouTube link: block hidden');

console.log(failures ? failures + ' FAILED' : 'ALL PASSED');
process.exit(failures ? 1 : 0);
