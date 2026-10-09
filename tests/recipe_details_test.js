/* jsdom tests for recipe_details_embed.html: portions, nutrition, steps. Run: node recipe_details_test.js */
const { JSDOM } = require('jsdom');
const fs = require('fs'); const path = require('path');
const embed = fs.readFileSync(path.join(__dirname, '..', 'recipe_details_embed.html'), 'utf8');
let failures = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) failures++; };
const row = (amount, unit, name) => `<div class="recipe-details_row" data-ingredient><div>${name}</div><div class="recipe-details_row-amount"><div class="recipes_tag-time"><div data-amount ${amount === '' ? 'class="w-dyn-bind-empty"' : ''}>${amount}</div><div class="recipes_tag-unit ${unit ? '' : 'w-dyn-bind-empty'}" data-amount-unit>${unit}</div></div></div></div>`;
const nrow = (key, v) => `<div data-nutrition-row="${key}"><div>${key}</div><div class="recipes_tag-time"><div data-nutrition-value="${key}" ${v === '' ? 'class="w-dyn-bind-empty"' : ''}>${v}</div><div class="recipes_tag-unit">g</div></div></div>`;
const page = (nutr, rich) => `<!doctype html><body><div data-recipe-details>
 <div data-recipe-ingredients><div><div>Zutaten für</div><div data-portions-label>4</div><div>Personen</div></div>
  <div data-portions><button class="slider_arrow" data-portions-minus></button><div data-portions-value>4</div><button class="slider_arrow" data-portions-plus></button></div>
  ${row('1', 'Packung', 'Herzelinos')}${row('100', 'g', 'Hähnchen')}${row('1', '', 'Mozzarella')}${row('80', 'ml', 'Sahne')}${row('', 'nach Geschmack', 'Salz')}${row('1.5', 'TL', 'Brühe')}
 </div>
 <div data-recipe-nutrition>${nutr}</div>
 <div data-recipe-steps><div class="w-richtext" data-steps-source>${rich}</div></div>
</div>${embed}</body>`;
const run = html => { const dom = new JSDOM(html, { runScripts: 'dangerously' }); return dom.window.document; };
const RICH = '<h3>Schritt 1</h3><p>Den Backofen vorheizen.</p><h3>Schritt 2</h3><p>Zutaten: 80 ml Sahne · Salz</p><p>Alles verrühren.</p><h3>Schritt 3</h3><p>Utensil: Backofen</p><p>30 Minuten backen.</p>';

let d = run(page(nrow('eiweiss', '') + nrow('fett', ''), RICH));
const amounts = () => [...d.querySelectorAll('[data-amount]')].map(e => e.textContent);
ok(amounts().join('|') === '1|100|1|80||1,5', 'initial amounts formatted de-DE: ' + amounts().join('|'));
d.querySelector('[data-portions-plus]').click(); d.querySelector('[data-portions-plus]').click();
ok(d.querySelector('[data-portions-value]').textContent === '6' && d.querySelector('[data-portions-label]').textContent === '6', 'plus x2 -> 6 portions in value and title');
ok(amounts().join('|') === '1,5|150|1,5|120||2,5', '6 portions scale: ' + amounts().join('|'));
for (let i = 0; i < 10; i++) d.querySelector('[data-portions-minus]').click();
ok(d.querySelector('[data-portions-value]').textContent === '1', 'minimum is 1');
ok(d.querySelector('[data-portions-minus]').disabled && d.querySelector('[data-portions-minus]').classList.contains('is-disabled'), 'minus disabled at 1');
ok(amounts().join('|') === '0,5|25|0,5|20||0,5', '1 portion: ' + amounts().join('|'));
for (let i = 0; i < 30; i++) d.querySelector('[data-portions-plus]').click();
ok(d.querySelector('[data-portions-value]').textContent === '20' && d.querySelector('[data-portions-plus]').disabled, 'maximum is 20, plus disabled');
for (let i = 0; i < 16; i++) d.querySelector('[data-portions-minus]').click();
ok(amounts().join('|') === '1|100|1|80||1,5', 'back to 4 shows original amounts');
ok(d.querySelector('[data-recipe-nutrition]').hidden, 'empty nutrition block is hidden');

const steps = d.querySelectorAll('.recipe-details_step');
ok(steps.length === 3, '3 steps built');
ok(d.querySelector('[data-steps-source]').hidden, 'source rich text hidden');
ok(steps[0].querySelector('.recipe-details_step-label').textContent === 'Schritt 1' && steps[0].querySelector('.recipe-details_step-text').textContent === 'Den Backofen vorheizen.', 'step 1 label + text');
ok(steps[1].querySelector('.recipe-details_step-meta span').textContent === '80 ml Sahne · Salz', 'Zutaten line without prefix');
ok(steps[2].querySelector('.recipe-details_step-meta span').textContent === 'Backofen' && steps[2].querySelector('.recipe-details_step-meta svg'), 'Utensil line with icon');
const check = steps[1].querySelector('.recipe-details_step-check');
check.click();
ok(steps[1].classList.contains('is-done') && check.getAttribute('aria-pressed') === 'true', 'check marks step done');
check.click();
ok(!steps[1].classList.contains('is-done') && check.getAttribute('aria-pressed') === 'false', 'second click undoes');
ok(check.getAttribute('aria-label') === 'Schritt 2 erledigt' && check.type === 'button', 'check button has label');

d = run(page(nrow('eiweiss', '3.5') + nrow('fett', ''), '<p>Nur Text ohne Schritte.</p>'));
ok(!d.querySelector('[data-recipe-nutrition]').hidden, 'nutrition with a value stays visible');
ok(d.querySelector('[data-nutrition-value="eiweiss"]').textContent === '3,5', 'nutrition number formatted');
ok(d.querySelector('[data-nutrition-value="fett"]').textContent === '—' && d.querySelector('[data-nutrition-row="fett"] .recipes_tag-unit').hidden, 'empty value shows dash, unit hidden');
ok(!d.querySelector('.recipe-details_steps') && !d.querySelector('[data-steps-source]').hidden, 'rich text without headings stays as is');

console.log(failures ? failures + ' FAILED' : 'ALL PASSED'); process.exit(failures ? 1 : 0);
