---
name: Lentera Belajar
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3f4850'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#825100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies an approachable, dependable, and uplifting educational atmosphere crafted specifically for Indonesian parents seeking primary education enrichment (ages 7–13). The visual tone bridges institutional trust with warm neighborhood familiarity—combining professional academic guidance with the safety and care of a local tutoring home.

The aesthetic blends **Modern Tactile Minimalism** with **Warm Editorial Accents**. It relies on bright, airy compositions, soft elevated cards, crisp micro-interactions, and supportive structural lines. The emotional goal is immediate reassurance for working parents: high readability, low cognitive friction during registration, and direct connectivity via WhatsApp.

## Colors

The palette is engineered to convey educational rigor balanced by optimism:

- **Primary (`#0284C7` - Vibrant Sky Blue):** The anchor for key navigational anchors, progress indicators, active states, and primary call-to-actions. Conveys optimism, clarity, and intellectual growth.
- **Secondary (`#0D9488` - Trust Teal/Cyan):** Used for security cues, verified teacher credentials, subject badges, and secondary affirmative actions. Instills dependability and calm focus.
- **Tertiary (`#F59E0B` - Warm Gold/Amber):** Applied sparingly to draw attention to milestone achievements, fee perks, high-priority trial slots, and star ratings.
- **Neutral (`#0F172A` - Deep Slate/Navy):** Provides contrast for headings and text copy against clean white and cool tinted surfaces (`#F8FAFC`, `#F0FDFA`), avoiding pure harsh blacks.
- **Special Action Accent (`#25D366` - WhatsApp Green):** Reserved exclusively for direct WhatsApp inquiries, floating help widgets, and submission receipts.

## Typography

Typography relies entirely on **Plus Jakarta Sans**, chosen for its friendly geometric contours, legibility in Indonesian and English, and welcoming humanist proportions. 

Headlines leverage bold weights with tightened letter-spacing to build instant credibility without feeling corporate or cold. Subheadings and body copy prioritize balanced line heights (`1.5` to `1.6`) to maintain effortless scanning on mid-range and mobile phone displays. Numeric elements (tuition, student quotas, class schedules) must use tabular numbers (`tnum`) to maintain vertical alignment in summary cards.

## Layout & Spacing

The layout is built upon an adaptive 12-column grid for desktop views (`max-width: 1200px`) transitioning to a 4-column layout on mobile devices. 

- **Desktop (>= 1024px):** 12-column configuration with `gutter: 1.5rem` and outer page margins centered with generous section paddings (`space-xl` multiplied for thematic breaks). Registration forms employ a 7:5 split (7 columns for multi-step input fields, 5 columns for live class summaries and tutor trust badges).
- **Tablet (768px - 1023px):** 8-column layout with 1.25rem gutters. Forms collapse into vertical stacked modules.
- **Mobile (< 768px):** 4-column structure with `margin-mobile: 1.25rem` and `gutter-mobile: 1rem`. Floating sticky actions for primary registration and WhatsApp consult triggers anchor directly above bottom device safe areas.

## Elevation & Depth

Visual depth combines layered surface tints and delicate, ambient shadows to produce a grounded yet tactile experience:

- **Flat Foundation:** Canvas base (`#FFFFFF`) with alternating sections layered in soft sky (`#F0F9FF`) or whisper teal (`#F0FDFA`).
- **Low Elevation (Interactive Cards & Inputs):** `0 2px 4px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.06)`. Accompanied by a 1px solid low-contrast border (`#E2E8F0`).
- **Mid Elevation (Hovered Cards & Step Containers):** `0 10px 15px -3px rgba(2, 132, 199, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.05)`. A sky-blue tint subtly activates the shadow.
- **Floating Modals & WhatsApp Assist Bar:** `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.

## Shapes

With a roundedness level of `2`, the design system enforces friendly, approachable radii across every element without becoming childlike or imprecise:

- **Core Elements (Inputs, Buttons, Badges):** Standard corner radius of `0.5rem` (8px).
- **Surface Enclosures (Cards, Feature Tiles):** Employs `rounded-lg` (`1rem` / 16px) for a soft, human feel.
- **Hero Containers & Step Panels:** Utilize `rounded-xl` (`1.5rem` / 24px) to encapsulate distinct milestones in the enrollment process.
- **Pill Tags & Progress Badges:** Use total pill rounding (`9999px`) exclusively for state badges, child age indicators, and step counter pills.

## Components

### Buttons
- **Primary Registration CTA:** Solid sky blue (`#0284C7`) with white text, `label-lg`, 8px radius, height 48px. Resting subtle shadow, transitions on hover to `#0369A1` with slight upward translation (`-1px`).
- **Secondary Action:** Ghost border (1.5px solid `#0284C7`) with slate/blue label; light sky background on hover (`#E0F2FE`).
- **WhatsApp Direct Connect:** Solid green (`#25D366`), white text, bold icon prefix, paired with micro-copy showing average response time ("Balas cepat < 15 menit").

### Stepped Progress Indicators
- Linear numbered sequence across desktop; compact progress bar with milestone tokens on mobile.
- **Active Step:** Filled circle (`#0284C7`) with crisp white numerical label, surrounded by a faint glowing ring (`4px` spread of `#BAE6FD`).
- **Completed Step:** Filled circle (`#0D9488`) featuring a sharp white checkmark icon.
- **Connecting Tracks:** 3px rounded line connecting step circles (`#E2E8F0` for future steps, gradient `#0284C7` to `#0D9488` for traversed steps).

### Input Fields & Selectors
- Background `#FFFFFF` with 1.5px border `#CBD5E1`, 8px radius, height 48px with generous internal padding (`space-md`).
- Focus state: Border transforms to `#0284C7` with a 3px ring of `#E0F2FE`.
- Helper text: Positioned below input in `body-sm`, transitioning to red (`#EF4444`) on validation error or teal (`#0D9488`) upon verified child NIK/phone input.

### Selection Chips & Age Tags
- Radio/Checkbox style chips for selecting program tracks (e.g., "Kelas 1-3 SD", "Bimbel Calistung", "Persiapan Ujian").
- Unselected: Light gray border, white fill, slate text.
- Selected: Border 1.5px solid `#0284C7`, fill `#F0F9FF`, label `#0369A1`, accompanied by an embedded teal checkmark icon.

### Modern Information Cards
- Clean white surface with subtle 1px border (`#E2E8F0`), padded with `space-lg`.
- Contains distinct card header (e.g., "Jadwal & Kuota Belajar") with warm gold highlight accents (`#F59E0B`) for spots remaining (e.g., "Sisa 3 Kursi").
- Subtle hover animation: Elevates smoothly using the mid-elevation shadow token.