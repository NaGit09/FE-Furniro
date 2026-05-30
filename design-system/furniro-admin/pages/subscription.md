# Admin Subscription List Overrides

> **PROJECT:** Furniro
> **Generated:** 2026-05-30 12:51:00
> **Page Type:** Admin / Members Directory

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** Full-width container inside the admin viewport wrapper.
- **Grid Layout:** 
  - **KPI Section**: 3-column statistics deck.
  - **Directory Section**: Single full-width grid layout containing a scrollable table or list card system for desktop and compact grid cards on mobile.

### Spacing Overrides

- No overrides — use Master spacing.

### Typography Overrides

- **Heading Font:** Cormorant (serif, for page headings and stats summaries).
- **Body Font:** Montserrat (clean, compact sans-serif for lists, filters, tables, and search bounds).

### Color Overrides

- **Strategy:** Refined list styling retaining luxury Furniro accents.
  - Primary Accent: `#CA8A04`
  - Table Zebra stripes: Alternate `#FAFAF9` and transparent background.
  - Border separators: `#E2E8F0` / Dark: `#1F2937`
  - Active check-badges: `#10B981` (emerald green text and backdrop).

---

## Recommendations

- **Interactions:** Table rows shift slightly on hover (`hover:bg-stone-50 dark:hover:bg-stone-900/30`) with smooth transitions.
- **Accessibilities:** Keyboard navigation on scrollable grids, inputs, and search fields.
- **Mobile responsiveness**: Grid collapses to item cards at `768px` to ensure visual stability and prevent horizontal viewport scrolling.
