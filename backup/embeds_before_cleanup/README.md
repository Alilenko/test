# Backup before embed cleanup (2026-11-05)

Each file = full code of an HTML embed / custom code block before the cleanup.
- hero.html      → page embed 10725ae2 (Hero)
- brands.html    → page embed d0d0f0d9 (Brands-Anzahl)
- saeulen.html   → page embed a62a2815 (Profit-System)
- cases.html     → page embed fa085472 (Cases)
- reviews.html   → page embed ef99c5ae (Bewertungen)
- team.html      → page embed d19f6b9f (Team)
- ac33.html      → page embed ac33bf5c (FAQ)
- cta_proof.html → embed 51afa742 inside component "CTA Proof"
- page_footer.html → page settings: custom code, footer

Webflow class values before the cleanup (to restore):
- hero_kpi_left  (main): left: clamp(-202px, -14em, -16px)
- hero_kpi_right (main): right: max(-11.25rem, calc(23.25rem - 50vw))
- hero_kpi_list: no transition
- saeulen_slider: no touch-action
- saeulen_slide: no opacity
- cta_proof_subline: no properties
- saeulen_tab, saeulen_next, slider_dot, cases_link, review_phone: no :focus-visible state
