# Admin Product Catalog Overrides

> **PROJECT:** Furniro
> **Generated:** 2026-05-30 12:53:00
> **Page Type:** Admin / Product Inventory Specs

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** Full-width container inside the admin viewport wrapper.
- **Grid Layout:** 
  - **KPI Section**: 4-column responsive statistics deck.
  - **Catalog Section**: 4-column dynamic grid displaying `.glass-prod-card` elements.
- **Drawer Placement**: Right-aligned slide-out specs drawer panel (`max-w-xl`) for viewing blueprints.

### Spacing Overrides

- No overrides — use Master spacing.

### Typography Overrides

- **Heading Font:** Cormorant (serif, for stats and specs sheet title).
- **Body Font:** Montserrat (clean, compact sans-serif for description, weights, sizes, SKUs).

### Color Overrides

- **Strategy:** Business admin styling keeping the luxury Furniro vibe.
  - Primary Accent: `#CA8A04`
  - Active Listings Badge: `#10B981` (emerald green text and backdrop glow).
  - Blueprints Specs background: `#FAFAF9` / Dark: `#0C0A09`

---

## Recommendations

- **Hover States:** Hover cards scale up smoothly (`hover:scale-[1.01]`) without breaking structural grid spacing.
- **Drawers:** Slide-out blueprints drawer panel must have a slide-in-from-right animation (`350ms cubic-bezier(0.16, 1, 0.3, 1)`).
- **Accessibilities:** Image alt-tags, specs labels, and close triggers have explicit labels.
