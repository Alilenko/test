---
name: client-first
description: Finsweet Client-First naming and structure for Webflow. Use whenever building or editing anything in Webflow — creating pages, sections, elements, classes, combo classes, variables or components through the Webflow MCP, turning a Figma design into Webflow, or writing custom code embeds (HTML/CSS/JS) whose classes will live on a Webflow site. Also use when reviewing or renaming existing Webflow classes.
---

# Client-First for Webflow

Every class Claude creates or proposes on a Webflow site follows Client-First (Finsweet, v2). Before creating anything new, look at the site's existing classes and variables and reuse them; only create a class when nothing fitting exists.

## Page skeleton

```
body
└─ page-wrapper
   ├─ global-styles            (embed with site-wide CSS, if used)
   ├─ navbar_component         (symbol / component)
   ├─ main-wrapper             (<main> tag)
   │  └─ section_[name]        (<section> tag)
   │     └─ padding-global
   │        └─ container-[small|medium|large]
   │           └─ padding-section-[small|medium|large]
   │              └─ [name]_component
   │                 └─ [name]_[element] ...
   └─ footer_component
```

- One `section_[name]` per logical block: `section_hero`, `section_recipes`, `section_faq`.
- `padding-global` gives the side gutter; `container-*` sets max width; `padding-section-*` sets vertical space. Do not put these spacings on custom classes.

## Class types

| Type | Separator | Examples |
|---|---|---|
| Custom (component) class | underscore between component and element, dash inside words | `hero_component`, `hero_content`, `hero_title`, `recipe-card_image-wrapper`, `footer_link-list` |
| Utility class | dashes only, no underscore | `text-size-large`, `heading-style-h2`, `text-weight-semibold`, `text-color-secondary`, `text-align-center`, `max-width-medium`, `margin-bottom margin-small`, `padding-top padding-large`, `hide-mobile-portrait` |
| Combo class (variant/state) | `is-` prefix, always on top of a base class | `button is-secondary`, `button is-small`, `recipe-card is-featured`, `tab_link is-active` |

Rules:
- The name says what the element **is**, not how it looks: `hero_title`, not `big-red-text`.
- Component prefix = the folder: everything inside `recipe-card_component` starts with `recipe-card_`.
- Never leave Webflow defaults like `div-block-3`, `text-block-2`, `link-block`.
- Never style a bare tag or a default Webflow class (`w-*`) for one-off design.
- Combo classes only for variants of the same base; never stack more than one or two.
- No `u-`, `c-`, BEM `__`/`--` or other naming systems.

## Units and tokens

- Sizes in `rem` (1rem = 16px). Breakpoint overrides go on the same class.
- Colors, fonts, radii and spacing come from Webflow Variables; create the variables first (from Figma styles/variables when a design is given), then bind classes to them. Never hardcode a hex that already has a variable.
- Typography: tags `h1`–`h6` stay semantic; visual size comes from `heading-style-h*` / `text-size-*` utilities, so an `h2` can look like `heading-style-h4`.

## Figma → Webflow

1. Read the frame and map each Figma layer to a Client-First role (section, container, component, element).
2. Translate Figma auto-layout gap/padding to the nearest utility or variable; component-internal spacing goes on the custom class.
3. Rename Figma layers like `Frame 12` to meaningful Client-First names; do not copy Figma names verbatim.

## Custom code embeds

- Classes in embed HTML/CSS follow the same rules (`store-locator_list`, `store-locator_item is-active`).
- Scope CSS to the component class; use `var(--...)` Webflow variables for colors.
- Hooks for JavaScript use `data-*` attributes, not classes, so renaming a class never breaks the script.

See `references/cheatsheet.md` for the full utility list and naming examples.
