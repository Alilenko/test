# Säulen card – button-group before the two-button change (new site 6aee063a46605b708b3cf7a4)
button-group d7e10c26-210c-de8b-176f-2f7667e7ade6
└ Link 867ba485-78f2-f6c5-b507-421bec7a3882 (button is-secondary is-alternate is-icon)
   link → CMS Profit-Systems "Button Link" (6113d5a31c3fd56ef3e25b23fd0134bb), no attributes, visible
   ├ div 86d6a40a-abc9-1db3-cabe-8ba353504a78 text → CMS "Button text" (841694f1915d60e3dc65538e2d0a5041)
   └ Button arrow instance 035bca0a-58a7-261d-f48c-c255a7705a1d
CTA Links component 23d046e7-de0b-6506-d2d5-519259b8da66: cta_proof_row …da6d visible (static), new prop "Show Proof" 7c56783f-fd51-d39e-0c1d-291c3b467c05 added (default true)
CMS before: Daten 6aee063a46605b708b3cf9c2 text "Nächste Säule: Traffic", link https://www.google.com; Traffic …9c3 text "Nächste Säule: Traffic"; Conversion/CRM/Systeme empty

## Applied (after)
- CTA Links: cta_proof_row visibility ← prop "Show Proof"
- New CTA Links instance fa2668f4-ac25-3c03-1b87-1ffd1472c93a after the link: Button Link ← CMS Button Link, Button Titel ← CMS Button text, Show Proof=false, Show Trustpilot=false
- Link 867ba485: href "#", attribute data-saeule-next="true"
- Text div 86d6a40a: static "Nächste Säule" (CMS binding removed), attribute data-saeule-next-name="Nächste Säule: "
- Embed: label line now prefixes the data-saeule-next-name value (see saeulen_embed_after_buttons.html; before = saeulen_embed_before_buttons.html)
- CMS: Daten/Traffic test text+link cleared; Systeme Button text = "Jetzt gemeinsam wachsen" (link still empty)
