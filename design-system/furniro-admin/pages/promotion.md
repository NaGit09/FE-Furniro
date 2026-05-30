# Admin Promotions Page Overrides

> **PROJECT:** Furniro
> **Generated:** 2026-05-30 12:41:00
> **Page Type:** Admin / Dashboard CRUD

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** Full-width container inside the admin viewport wrapper.
- **Grid Layout:** 
  - **KPI Section**: 4-column responsive statistics deck.
  - **Promotions Section**: 3-column / 4-column grid (depending on screen bounds) showcasing Liquid Glass campaign decks.
- **Drawer Placement**: Absolute right slide-out panel (`max-w-xl`) for creating a promotion.

### Spacing Overrides

- No overrides — use Master spacing.

### Typography Overrides

- **Heading Font:** Cormorant (serif, for page headings and stats summaries).
- **Body Font:** Montserrat (clean, compact sans-serif for tables, lists, and forms).

### Color Overrides

- **Strategy:** Business admin styling keeping the luxury Furniro vibe.
  - Primary Accent: `#CA8A04`
  - Active Campaign Badge: `#10B981` (emerald green text and backdrop glow).
  - Archived Campaign Badge: `#78716C` (stone stone gray).
  - Percent Discount Pill: `#2563EB` (blue).
  - Amount Discount Pill: `#E11D48` (rose red).

### Component Overrides

- **Cards:** `.glass-prod-card` with customized glow borders and dynamic details overlays.
- **Inputs:** High contrast input boxes with rounded borders, focus state rings (`#CA8A04`).
- **Submit Buttons**: Prominent full-width button inside drawer with loading spinner support.

---

## Recommendations

- **Hover States:** Hover cards scale up smoothly (`hover:scale-[1.02]`) without breaking structural grid spacing.
- **Drawers:** Right-aligned slide-out panel must have a slide-in-from-right animation (`350ms cubic-bezier(0.16, 1, 0.3, 1)`).
- **Submissions**: Form validation must validate in real-time. Validation errors shake slightly for quick physical feedback.
