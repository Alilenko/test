# Project notes for Claude

Custom code embeds for a Webflow site (store locator, Anfahrt map, recipe details, recipe video). Each `*_embed.html` file is pasted as-is into a Webflow Embed element or page custom code.

## Webflow
- All classes follow Client-First — see `.claude/skills/client-first/SKILL.md`. Reuse existing site classes and variables before creating new ones.
- Colors come from Webflow variables (`var(--_primitives---colors--...)`), never hardcoded hex.
- JavaScript finds elements by `data-*` attributes, not by class names.
- Keep each embed self-contained (inline `<style>`/`<script>`); Webflow embeds have a 50 000 character limit.

## Supabase (when used)
- Only the anon/public key may appear in embed code; access is controlled by RLS policies on every table.
- Never put the service-role key or other secrets into Webflow or this repo.

## Tests
- `cd tests && npm install`, then `npm test` (jsdom tests `tests/*_test.js`) and `npm run test:browser` (Playwright tests in `tests/browser/`).
- Add or update a test with every embed change.
