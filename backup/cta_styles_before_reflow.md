# Backup: CTA Audit / CTA Founders styles before the one-column reflow (2026-11-05)

To restore: set these values back exactly (main = desktop, medium = tablet, tiny = mobile).
Properties not listed were not touched.

## cta_audit
- main: padding 3rem 3rem 3rem 3rem; align-items center; flex-direction row; flex-wrap wrap; min-height 36rem
- medium: flex-direction column; align-items stretch; min-height 0; padding 0 (unchanged)

## cta_audit_content
- main: width 46%; (no flex, no padding, no justify-content)
- medium: width 100%; padding 2.5rem 2rem; tiny: padding 2rem 1.25rem (unchanged)

## cta_audit_media
- main: position absolute; z-index 1; width 48.2%; top 0; right 0; bottom 0; (no flex, no min-height)
- medium: position relative; width 100%; aspect-ratio 4/3 (unchanged)

## cta_founders_card
- main: position relative; display flex; margin-top 2.5rem; align-items stretch; (no flex-wrap)
- medium: flex-direction column; margin-top 0 (unchanged)

## cta_founders_content
- main: width 50%; padding 3rem; (no flex)
- medium: width 100%; padding 2rem; tiny: padding 1.5rem (unchanged)

## cta_founders_media
- main: position absolute; top auto; z-index 1; width 56%; right 0; bottom 0; (no flex, no min-height)
- medium: position relative; top auto; width 100%; aspect-ratio 722/810 (unchanged)

## Also changed in the same round
- saeulen_tab_icon main: width/height were clamp(3.25rem, 5.4vw, 4.9rem) → now clamp(2.5rem, 4.5vw, 4.9rem)
