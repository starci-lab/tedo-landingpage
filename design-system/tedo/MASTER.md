# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Tedo
**Generated:** 2026-08-02 21:19:02
**Category:** SaaS (General)
**Design Dials:** Variance 7/10 (Balanced / Modern) | Motion 6/10 (Standard) | Density 3/10 (Spacious)

---

## Global Rules

### Color Palette

> **LOCKED (2026-08-02):** overrides the generator's default. Lifted from TEDO's
> "Credential / Web design" Canva deck — blue-led, light/airy, orange accent, a
> green note from the logo's "D". Direction = **Authority** (proof-forward).
> Implemented as Tailwind `@theme` tokens in `src/app/globals.css`.

| Role | Hex | Token |
|------|-----|-------|
| Brand (primary/structure) | `#1B7BC9` | `--color-brand` |
| Brand deep (headings/ink) | `#14305C` | `--color-brand-deep` / `--color-ink` |
| Brand bright | `#2B8AE0` | `--color-brand-bright` |
| Brand soft (tint) | `#E8F2FB` | `--color-brand-soft` |
| Green (secondary) | `#43B04A` | `--color-green` |
| **Accent / CTA (orange)** | `#F58220` | `--color-accent` |
| Accent dim (hover) | `#D96F14` | `--color-accent-dim` |
| Canvas | `#FFFFFF` | `--color-canvas` |
| Surface-2 / sky | `#F4F9FE` / `#EEF6FD` | `--color-surface-2` / `--color-sky` |
| Border | `#DBE7F3` | `--color-line` |
| Body text | `#33445F` | `--color-ink-body` |
| Muted | `#5B6B82` | `--color-ink-muted` |

**Prominence rule:** orange `#F58220` is reserved for **CTAs + a single emphasis
per region** (hero accent phrase, featured plan). Everything structural/decorative
uses brand blue — never flood the page with orange. Site commits to a LIGHT world;
one optional dark showcase band may echo the deck's product-shot slides.

**Logo:** currently a TEXT wordmark placeholder (`components/wordmark.tsx`) — swap
for the real SVG when it lands; nothing else depends on the letter styling.

### Typography — LOCKED

- **Display Font:** Outfit (headings, wordmark, big numbers) → `font-display` / `--font-display`
- **Body Font:** Work Sans → `font-sans` / `--font-sans`
- **Mono:** system `ui-monospace` for eyebrows/labels/tags → `font-mono`
- Loaded via `next/font/google` in `src/app/[locale]/layout.tsx` (self-hosted at build, no CDN link).

### Spacing Variables

*Density: 3/10 — Spacious*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `24px` / `1.5rem` | Standard padding |
| `--space-lg` | `32px` / `2rem` | Section padding |
| `--space-xl` | `48px` / `3rem` | Large gaps |
| `--space-2xl` | `64px` / `4rem` | Section margins |
| `--space-3xl` | `96px` / `6rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #EC4899;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #7C3AED;
  border: 2px solid #7C3AED;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #FAF5FF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #7C3AED;
  outline: none;
  box-shadow: 0 0 0 3px #7C3AED20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Flat Design

**Keywords:** 2D, minimalist, bold colors, no shadows, clean lines, simple shapes, typography-focused, modern, icon-heavy

**Best For:** Web apps, mobile apps, cross-platform, startup MVPs, user-friendly, SaaS, dashboards, corporate

**Key Effects:** No gradients/shadows, simple hover (color/opacity shift), fast loading, clean transitions (150-200ms ease), minimal icons

### Page Pattern — LOCKED: Trust & Authority + Conversion

- **Conversion Strategy:** Lead with proof (real shipped products), then method, then a low-friction CTA.
- **CTA Placement:** Header (orange) + Hero + repeated at Contact.
- **Section Order (implemented):** 1. Hero (proven thesis + proof cards), 2. Metrics,
  3. Cases (proof — StarCi cleared; CatMoc anonymized pending consent; FTES pending),
  4. AI-first, 5. Services, 6. Design, 7. Process, 8. Engagement (2 models: Fixed scope /
  Fixed-fee+revenue-share), 9. Stack, 10. FAQ, 11. Contact.
- **Content SoT:** `MO-HINH-KINH-DOANH.md` — esp. §7 (engagement=2 models, one time figure ~50%,
  real cases) and §7.3 **legal hold on CatMoc** (do not publish name/details without written consent).

---

## Motion

**Stagger List** (Standard) — Trigger: load or scroll | Duration: 300-450ms | Easing: `back.out(1.4)`

```js
gsap.from('.grid-item', { opacity: 0, scale: 0.92, y: 16, duration: 0.4, stagger: { each: 0.06, from: 'start', grid: 'auto' }, ease: 'back.out(1.4)' });
```

**Framework notes:** grid: 'auto' lets GSAP infer rows/columns from a CSS grid layout for a natural wave stagger

- ✅ Combine with from: 'center' for a bento-grid layout to draw the eye inward first
- ❌ Don't use back.out on dense data tables; the overshoot reads as sloppy on informational UI
- ⚡ Group DOM writes; avoid interleaving layout reads (getBoundingClientRect) between staggered tweens

---

## Anti-Patterns (Do NOT Use)

- ❌ Excessive animation
- ❌ Dark mode by default

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
