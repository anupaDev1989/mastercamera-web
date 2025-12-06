# Landing Page Instructions

## Purpose

- **Goal:** Create a marketing landing page to promote the Kitly mobile app and collect a wishlist of interested users.
- **Primary CTA:** Join the wishlist (email capture).
- **Secondary CTA:** Learn more about features / view screenshots.

## Recommended Tech

- Any modern stack is fine (e.g. static HTML, React, or Next.js).
- Use **Resend** for handling wishlist email submissions via a backend/API route.
- Keep the page fast, mobile-first, and lightweight.

## Theme & Colors

- Use the app's **midDark** theme as the visual baseline so the landing page matches the in-app dark mode.
- Suggested mappings (from `src/ui/colors.ts`):
  - Page background: `#121417` (`colors.bg.page`).
  - Main surfaces/sections: `#171A1E` (`colors.bg.surface`).
  - Cards/panels: `#1E2227` (`colors.bg.card`).
  - Primary accent (buttons, key links): `#fc5e56` (`colors.primary.base`).
  - Primary hover/pressed states: `#e3554d` / `#ca4b45`.
  - Primary text on dark: `#E8ECF2` (`colors.text.primary`).
  - Secondary/muted text: `#BAC6D6` / `#93A0B6` (`colors.text.secondary` / `colors.text.muted`).
  - Subtle borders/dividers: `#2B323B` / `#3C4653` (`colors.border.subtle` / `colors.border.strong`).
- Buttons and CTAs:
  - Primary CTA (e.g. "Join the Wishlist"): background `#fc5e56`, text `#0E1116` or white.
  - Secondary/ghost buttons: transparent or `#171A1E` background, `#E8ECF2` text, border `#3C4653`.
- Avoid introducing new brand colors; if a lighter section is needed, keep it minimal and still use `#fc5e56` as the main accent.

## Page Structure

1. **Hero Section**
   - Short value-driven headline (e.g. "Stay on top of your Gear").
   - One-line subheading explaining who it’s for (solo creators, small production teams).
   - Primary button: **"Join the Wishlist"** (scrolls to or opens the signup form).
   - Optional secondary button: **"See How It Works"** (jumps to feature section).
   - Visual: phone mockup or screenshots showing Gear, Kits, Projects, and Tracking screens.

2. **Key Features Section**
   - **Offline-first gear inventory:** Track cameras, audio, lighting, drones, accessories, and more, even without internet.
   - **Smart kits & projects:** Bundle gear into reusable kits and assign them to projects with clear date ranges.
   - **Checkouts & returns:** Self, project, and third‑party checkout flows with full history and due dates.
   - **Active gear & issues tracking:** See what’s out, what’s overdue, and open issues (damaged/missing/maintenance).
   - **Bulk operations for shoots:** Bulk checkout/check-in for kits and projects to speed up packing and wrap.
   - **Preventive maintenance:** Usage-based and date-based maintenance plans with progress indicators.
   - **Multi-quantity inventory:** Track quantities, missing units, and available vs. reserved counts.

3. **Social Proof / Use Cases (Optional)**
   - Short bullets for primary use cases (solo filmmaker, small studio, school/media lab, rental closet).
   - Include any testimonials or quotes once available.

4. **Wishlist / Early Access Section**
   - Short pitch: what users get for joining (early access, influence roadmap, launch discount if applicable).
   - Simple form (email required; optional fields like role, team size, primary use case).
   - Clear privacy note (no spam, unsubscribe anytime).

## Wishlist Implementation (Resend)

- **Frontend form**
  - Fields: `email` (required), `role` (optional), `teamSize` (optional), `useCase` (optional free text).
  - On submit: POST JSON to `/api/wishlist` (or similar) and show success/error states.

- **Backend / API route** (Node/Next.js or any server)
  - Use the official **Resend** SDK.
  - Load `RESEND_API_KEY` from environment variables (never hard-code keys in the repo).
  - When a wishlist request is received:
    - Send an internal notification email to you (summary of fields).
    - Optionally send a confirmation email to the user ("You’re on the Kitly wishlist").
  - Optionally log wishlist entries to a database or sheet for later export.

- **Error & edge cases**
  - Validate email format before calling the API.
  - Show friendly messages on failure ("Something went wrong, please try again").
  - Protect the API route with basic rate limiting if it will be public.

## Content Checklist

- **Branding:** App name (Kitly), short tagline, and consistent colors that match the mobile app.
- **Visuals:** At least 2–3 screenshots: Gear, Kits/Projects, and Tracking or Preventive Maintenance.
- **Copy:** Focus on problems solved (lost gear, chaotic shoots, forgotten maintenance) rather than raw tech.
- **CTA Placement:** Wishlist CTA in hero + repeated near the bottom of the page.

Use this file as the brief for whoever designs/builds the landing page so they can implement quickly without needing app-internal context.
