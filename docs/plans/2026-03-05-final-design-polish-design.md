# Design Doc: Final Design Polish

**Date:** 2026-03-05
**Status:** Approved

## Context

The V&V AI website is near launch-ready. The core sections, animations, accessibility features, and i18n are complete. This polish pass adds five targeted refinements that elevate perceived quality without structural risk: a scroll progress indicator, animated stat counters, gradient text on the hero headline, a back-to-top button, and the activation of the already-built `CardSpotlight` component on testimonials.

---

## Changes

### 1. Scroll Progress Bar
**File:** `src/components/ui/ScrollProgressBar.tsx` (new)
**Wired into:** `src/app/[locale]/layout.tsx`

- 2px tall strip fixed to the very top of the viewport, `z-50`, above the navbar
- `scaleX` driven by Framer Motion `useScroll` + `useSpring` (stiffness 200, damping 30)
- `transform-origin: left`
- Color: `background: linear-gradient(to right, #00C9A7, #00EDCA)`
- No interaction, `aria-hidden="true"`

---

### 2. Animated Stat Counters
**File:** `src/components/sections/About.tsx` (edit)

- The 3 stat numbers count from 0 to their target value when the About section enters the viewport
- Uses Framer Motion `useInView` (threshold 0.5, `once: true`) + `useMotionValue` + `animate`
- Duration: 1.8s, easeOut curve
- Suffix characters (%, +, h, etc.) are static — only the numeric portion animates
- Numbers displayed via `useTransform` or a `useEffect`-driven state update

---

### 3. Gradient Text on Hero Headline
**File:** `src/components/sections/Hero.tsx` (edit)

- Line 2 of the hero headline currently renders in flat `text-[#00C9A7]`
- Change to gradient: `bg-gradient-to-r from-[#00EDCA] via-[#00C9A7] to-[#33E5C7] bg-clip-text text-transparent`
- Adds luminosity and depth to the most prominent text on the page

---

### 4. Back-to-Top Button
**File:** `src/components/ui/BackToTop.tsx` (new)
**Wired into:** `src/app/[locale]/layout.tsx`

- Fixed `bottom-8 end-8`, `z-40` (respects RTL via `end-*`)
- Appears with Framer Motion fade-in when `scrollY > 400`, hides when at top
- 44×44px circle: `border border-[#1a1a1a] bg-[#0a0a0a] rounded-full`
- Hover: `border-[#00C9A7] bg-[#00C9A710]`, box-shadow `0 0 16px #00C9A740`
- Icon: `ArrowUp` (Lucide, 16px), `text-[#888888]` → `text-[#00C9A7]` on hover
- Click: `window.scrollTo({ top: 0, behavior: 'smooth' })`
- `aria-label` translated via `useTranslations`

---

### 5. CardSpotlight on Testimonials
**File:** `src/components/sections/Testimonials.tsx` (edit)
**Uses:** `src/components/ui/CardSpotlight.tsx` (existing, no changes)

- Wrap each of the 4 testimonial cards with `<CardSpotlight>`
- Remove manual hover border/glow from the inner card divs (CardSpotlight owns those)
- Three.js canvas in CardSpotlight only mounts on hover — no idle perf cost
- Teal dot colors already configured in CardSpotlight: `[0,201,167]` + `[0,237,202]`

---

## Files Modified
| File | Change |
|---|---|
| `src/components/ui/ScrollProgressBar.tsx` | New file |
| `src/components/ui/BackToTop.tsx` | New file |
| `src/app/[locale]/layout.tsx` | Import + render ScrollProgressBar + BackToTop |
| `src/components/sections/Hero.tsx` | Gradient text on headline line 2 |
| `src/components/sections/About.tsx` | Animated stat counters |
| `src/components/sections/Testimonials.tsx` | Wrap cards with CardSpotlight |

---

## Verification

1. Run dev server: `node "$WEBSITE/node_modules/next/dist/bin/next" dev`
2. Scroll the page — teal progress bar fills at top
3. Scroll to About — stat numbers animate up once
4. Check hero — Line 2 headline has gradient shimmer
5. Scroll past 400px — back-to-top button appears; click it, page returns to top
6. Hover testimonial cards — dot matrix reveals, spotlight follows cursor
7. Test on mobile (375px) — back-to-top button stays within bounds, no layout breaks
8. Test RTL (Hebrew/Arabic) — back-to-top button appears on left (`end-8` handles this)
