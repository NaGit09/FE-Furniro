# Admin Order Management Overrides

> **PROJECT:** Furniro
> **Generated:** 2026-05-30 13:05:00
> **Page Type:** Admin / Order Dashboard

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** Full-width container inside the admin viewport wrapper.
- **Grid Layout:** 
  - **KPI Section:** 4-column metrics panel (Total Orders, Total Revenue, Pending Orders, Completed Orders).
  - **Toolbar:** Inline row grouping filter dropdowns, search elements, and data selectors.
  - **Listing Section:** Single full-width grid containing a responsive, scrollable zebra-striped data table on desktop, and a flex-column stack of cards on mobile.
  - **Drill-down Panel:** A right-aligned sliding panel (drawer overlay) that overlaps the main content on activation with clear exit actions.

### Typography Overrides

- **Heading Font:** Cormorant Garamond (italicized serif for luxury totals, summary widgets, and page headings).
- **Body Font:** Montserrat (clean, bold sans-serif for search fields, order lists, addresses, and actions).
- **Monospace Font:** Fira Code / monospace (used for Order ID `#10034` and transaction capture references).

### Color Overrides

- **Strategy:** Amber luxury accents combined with precise status states:
  - Primary Accent: `#CA8A04` (Amber-600)
  - Secondary Accent: `#10B981` (Emerald-500)
  - Zebra Stripe backgrounds: Alternate `#FAFAF9` / transparent (Light) and `#1C1917` / transparent (Dark).
  - **Status Badge Theme Color Scheme:**
    - `PENDING`: Yellow/Amber background & text (`bg-amber-500/10 text-amber-600`)
    - `CREATED` / `APPROVED`: Blue/Sky background & text (`bg-sky-500/10 text-sky-600`)
    - `PAID` / `DELIVERED`: Emerald/Green background & text (`bg-emerald-500/10 text-emerald-600`)
    - `CANCELLED` / `FAILED`: Red/Rose background & text (`bg-rose-500/10 text-rose-600`)

---

## Recommendations

- **Interactions:** Rows feature elegant state changes on cursor entry (`transition-all duration-200 hover:bg-stone-50/80 dark:hover:bg-stone-950/40`).
- **Drawer Slide Animation:** Utilize smooth sliding keyframes or transitions (`translate-x-0` on active, `translate-x-full` on hidden).
- **Accessibility:** Keyboard accessibility on status selector dropdowns, text entries, and drawer exit elements.
