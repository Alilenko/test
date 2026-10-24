# Client-First cheatsheet

## Core structure classes
- `page-wrapper`, `main-wrapper`, `global-styles`
- `padding-global`
- `container-small`, `container-medium`, `container-large`
- `padding-section-small`, `padding-section-medium`, `padding-section-large`

## Typography utilities
- `heading-style-h1` … `heading-style-h6`
- `text-size-tiny`, `text-size-small`, `text-size-regular`, `text-size-medium`, `text-size-large`
- `text-weight-light`, `text-weight-normal`, `text-weight-medium`, `text-weight-semibold`, `text-weight-bold`
- `text-align-left`, `text-align-center`, `text-align-right`
- `text-color-primary`, `text-color-secondary`, `text-color-alternate`
- `text-style-italic`, `text-style-allcaps`, `text-style-muted`, `text-style-link`, `text-style-quote`, `text-rich-text`

## Spacing utilities (two classes: direction + size)
- Direction: `margin-top`, `margin-bottom`, `margin-left`, `margin-right`, `margin-vertical`, `margin-horizontal`, `margin-0`; same set for `padding-*`
- Size: `margin-tiny`, `margin-xxsmall`, `margin-xsmall`, `margin-small`, `margin-medium`, `margin-large`, `margin-xlarge`, `margin-xxlarge`, `margin-huge`, `margin-xhuge`, `margin-xxhuge`; same for `padding-*`
- Example: `margin-bottom margin-medium`
- `spacer-*` blocks only when a spacing element is clearer than a margin

## Layout / misc utilities
- `max-width-small` … `max-width-xxlarge`, `max-width-full`
- `align-center`
- `hide`, `hide-tablet`, `hide-mobile-landscape`, `hide-mobile-portrait`
- `overflow-hidden`, `pointer-events-none`, `z-index-1`, `z-index-2`
- `layer`, `icon-1x1-small`, `icon-1x1-medium`, `icon-1x1-large`
- `button`, `button is-secondary`, `button is-text`, `button is-small`, `button is-large`, `button is-icon`

## Naming examples

| Element | Good | Bad |
|---|---|---|
| Hero section | `section_hero` | `hero-section`, `Section 1` |
| Hero inner wrapper | `hero_component` | `hero-wrapper-new` |
| Card grid | `recipes_list` | `grid-3`, `div-block-7` |
| Card | `recipe-card_component` | `card`, `recipe__card` |
| Card image wrapper | `recipe-card_image-wrapper` | `img-wrap` |
| Card title | `recipe-card_title` + `heading-style-h4` | `card-title-big` |
| Featured card | `recipe-card_component is-featured` | `recipe-card-featured` |
| Active tab | `tabs_link is-active` | `tabs_link-active` |
| Navbar link | `navbar_link` | `nav-link`, `link-2` |
| Footer column | `footer_column` | `footer-col` |
