# Subscribe Page Overrides

> **PROJECT:** Furniro
> **Generated:** 2026-05-30 12:40:00
> **Page Type:** Engagement / Lead Generation

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1280px (standard desktop bounds)
- **Layout:** Two-column split layout for larger screens (lg+):
  - **Left Column**: Promotion grids & Exclusive Club values.
  - **Right Column**: Interactive subscription form in a floating glassmorphic container.
- **Sections:** 
  1. `SubscribeHero`: Premium editorial title, luxury badges, subtle parallax scaling.
  2. `SubscribeFormSection`: split content with promotional items & glassmorphism card.

### Spacing Overrides

- No overrides — use Master spacing.

### Typography Overrides

- **Main Heading:** Cormorant (serif, letter-spacing: -0.02em, italic highlights).
- **Body Font:** Montserrat (clean sans-serif).

### Color Overrides

- **Strategy:** Luxury neutrals combined with gold accents.
  - Primary Accent: `#CA8A04` (CTA)
  - Card Glass Base: `rgba(255, 255, 255, 0.7)` / Dark: `rgba(28, 25, 23, 0.6)`
  - Error Indicators: `#DC2626`
  - Success feedback: Gold or soft green backdrop.

### Component Overrides

- **Card Styles:** Glass card styling with iridescent borders:
  - Gradient borders transitioning from gold to translucent whites.
  - Interactive input items with subtle inset background shifts on focus.
- **Inputs:** Floating/stable labels, rounded-lg borders, focus-ring gold.

---

## Page-Specific Components

### Promotion Card Grid
Interactive benefit deck items showing:
- 🏷️ **Welcome Discount**: 10% off code on the first luxury furniture purchase.
- 📬 **Eco-Wood Access**: Priority notifications for FSC-certified wood releases.
- 🎨 **Milanese Inspiration**: Monthly care guides, design catalogs, and lookbooks.

---

## Recommendations

- **Hover States:** Stable scaling transforms `hover:scale-[1.01]` that do not cause layouts to shift or text to wrap.
- **Interactions:** Input border changes must feature `transition-all duration-200`.
- **Pre-delivery rules**:
  - No emojis in UI (Lucide/Heroicons SVG components only).
  - Explicit `cursor-pointer` on checkboxes, labels, and CTA buttons.
  - Sufficient WCAG contrast on all custom elements.
