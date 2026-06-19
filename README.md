# Stackr Camera — Promotional Website

Promotional / waitlist landing page for **Stackr Camera**, a professional work-capture iOS app.

## What is Stackr Camera?

Stackr Camera is an iOS camera app built for professionals, hobbyists, scientists, and anyone capturing structured work. It provides:

- **Capture** — Professional camera with grid overlays, watermarking, voice notes, metadata fields, geolocation
- **Organize** — Projects/stacks, tags, custom fields, fast search (by location, date, metadata)
- **Edit** — In-app markup/annotation, quick edits
- **Share** — Individual or batch zip sharing
- **Privacy/offline** — Local-only storage, zero cloud, full functionality without internet
- **Map view** — Locate photos by GPS coordinates

## Tech Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS (v3) + CSS Variables for centralized color system (integrated with the official Stackr Camera palette, with automatic system dark mode detection)
- **Deployment:** Cloudflare Pages + Cloudflare Workers (API)
- **Database:** Cloudflare D1 (waitlist)
- **Security:** Cloudflare Turnstile (CAPTCHA), honeypot fields, rate limiting

## Getting Started

```bash
npm install
npm run dev
```

## Building for Production

```bash
npm run build
npm run preview  # preview the production build locally
```

## Project Structure

```
├── index.html              # Entry point
├── src/
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # React root
│   ├── index.css           # Global styles + Tailwind
│   ├── styles/
│   │   └── variables.css   # Centralized color system
│   ├── sections/
│   │   ├── Hero.jsx        # Hero section with image carousel
│   │   ├── Features.tsx    # Features section (card stack)
│   │   ├── Platforms.jsx   # Platform availability (iOS)
│   │   └── Wishlist.jsx    # Waitlist form with Turnstile
│   └── components/
│       ├── Navbar.jsx      # Navigation bar
│       ├── Footer.jsx      # Footer
│       ├── Button.jsx      # Button component
│       ├── Input.jsx       # Input component
│       └── ui/             # Shared UI components
├── public/                 # Static assets (images, logos)
├── functions/              # Cloudflare Workers API
├── DOCS/                   # Feature documentation
└── wrangler.toml           # Cloudflare deployment config
```

## Environment Variables

- `VITE_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key (client-side)
- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile secret key (server-side, set via `wrangler secret`)
