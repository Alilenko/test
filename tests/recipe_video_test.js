/* jsdom tests for recipe_video_embed.html: click-to-play video cards from links or IDs. Run: node recipe_video_test.js */
const { JSDOM } = require('jsdom');
const fs = require('fs'); const path = require('path');
const embed = fs.readFileSync(path.join(__dirname, '..', 'recipe_video_embed.html'), 'utf8');
let failures = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) failures++; };
const card = attrs => `<div class="video_wrap" ${attrs} data-video-title="Herzelinosauflauf"><img src="x.jpg" alt=""><div class="play_button_wrap"></div><div class="video_overlay"></div></div>`;
const run = cards => {
  const dom = new JSDOM(`<!doctype html><body>${cards}${embed}</body>`, { runScripts: 'dangerously' });
  dom.window.matchMedia = () => ({ matches: false });
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return dom.window.document;
};
const play = (d, i = 0) => { const c = d.querySelectorAll('.video_wrap')[i]; c.click(); return c.querySelector('iframe'); };
const esc = s => s.replace(/"/g, '&quot;');

const cases = [
  ['data-video-url="https://www.youtube.com/watch?v=plBYJdadYHQ"', 'youtube-nocookie.com/embed/plBYJdadYHQ?', 'watch link'],
  ['data-video-url="https://youtube.com/watch?v=eSv0vi1eg2Q&t=10s"', '/embed/eSv0vi1eg2Q?', 'watch link with extra params'],
  ['data-video-url="https://www.youtube.com/shorts/-rWbBqIyYj0"', '/embed/-rWbBqIyYj0?', 'shorts link'],
  ['data-video-url="https://youtu.be/-J24urNb5v8"', '/embed/-J24urNb5v8?', 'youtu.be link'],
  ['data-video-url="https://vimeo.com/1056575566"', 'player.vimeo.com/video/1056575566?', 'vimeo link'],
  ['data-video-url="https://player.vimeo.com/video/1056575566"', 'player.vimeo.com/video/1056575566?', 'vimeo player link'],
  ['data-vimeo="1056575566"', 'player.vimeo.com/video/1056575566?', 'old data-vimeo with ID'],
  ['data-youtube="plBYJdadYHQ"', '/embed/plBYJdadYHQ?', 'old data-youtube with ID'],
  ['data-vimeo="https://www.youtube.com/shorts/-rWbBqIyYj0"', '/embed/-rWbBqIyYj0?', 'YouTube link in data-vimeo still plays YouTube'],
  ['data-video-url="' + esc('<iframe src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FeSv0vi1eg2Q%3Ffeature%3Doembed"></iframe>') + '"', '/embed/eSv0vi1eg2Q?', 'embedly iframe html'],
];
for (const [attrs, expect, name] of cases) {
  const d = run(card(attrs));
  ok(!d.querySelector('iframe'), name + ': nothing loaded before click');
  const iframe = play(d);
  ok(iframe && iframe.src.includes(expect), name + ': ' + (iframe && iframe.src));
}

let d = run(card('data-video-url="https://www.youtube.com/watch?v=plBYJdadYHQ"'));
const c = d.querySelector('.video_wrap');
ok(c.getAttribute('role') === 'button' && c.getAttribute('aria-label') === 'Video abspielen: Herzelinosauflauf', 'button role and label from title');
c.dispatchEvent(new d.defaultView.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
ok(c.querySelector('iframe') && c.querySelector('img').hidden && !c.hasAttribute('role'), 'Enter plays, poster hidden, role removed');
c.click();
ok(c.querySelectorAll('iframe').length === 1, 'second click does not add a second iframe');

d = run(card('data-video-url=""'));
ok(d.querySelector('.video_wrap').style.display === 'none', 'empty CMS video: card hidden');
d = run(card('data-video-url="https://example.com/clip"'));
ok(d.querySelector('.video_wrap').style.display === 'none', 'unknown link: card hidden');

console.log(failures ? failures + ' FAILED' : 'ALL PASSED');
process.exit(failures ? 1 : 0);
