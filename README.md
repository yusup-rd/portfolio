# Yusup Rejebov's portfolio

A personal portfolio for full-stack web and mobile work, built with React 19,
TypeScript, Tailwind CSS 4, and Vite. It includes selected projects, career and
education timelines, a reusable document reader, and an EmailJS contact form.

## Development

Use Node.js 22.13+ (22.x) or Node.js 24+ and npm.

```sh
npm ci
npm run dev
```

Copy `.env.example` to `.env` and set the EmailJS service ID, template ID, and
`VITE_EMAILJS_PUBLIC_KEY`. Vite exposes `VITE_` values to the browser; use only
the public key here, never a private key.

```sh
npm run format
npm run format:check
npm run spellcheck
npm run lint
npm run build
npm run preview
```

The build includes TypeScript checking. TypeScript stays on 6.0.x until the
installed typescript-eslint supports newer versions. Tailwind uses its Vite
plugin and CSS-first configuration in `src/App.css`. Theme tokens live there
and apply at the document root, including portaled dialogs. Light/dark follows
the OS preference until an explicit choice is saved.

Workspace settings enable Prettier, import organization, and unused-import
cleanup on save. Project spelling exceptions live in `.vscode/settings.json`.
Husky runs lint-staged before commits: Prettier, ESLint fixes, then Prettier again
on staged TypeScript files. Partially staged files remain supported. Contributor
conventions and official documentation links are in [AGENTS.md](AGENTS.md).

## Files and assets

```text
public/
  docs/
    cv/                 Resume PDFs
    university/         UNITEN certificates and transcripts
    udemy/              Course certificates
  images/
    projects/           Screenshots prefixed with their project name
    profile/            Portrait
    logos/              Logos actually used, including the portfolio favicon
    social/             Social preview image
src/
  components/           Portfolio sections and reusable UI
  data/
    constants.ts        Portfolio content and asset URLs
    asset-sources.json  Provenance for retained local assets
  hooks/                Shared React hooks
  types/                Portfolio content models
  utils/                Shared motion timing
```

Files in `public` are served directly from `/docs/...` or `/images/...`. Keep new reader documents
with the relevant institution or provider, and name screenshots clearly, such
as `qalb-prayer-times.png`. Remove assets when their last use is removed. Devicons
are the explicit remote exception: use official CDN URLs in the constants.

The document reader loads on demand, bundles its PDF worker locally, and offers
zoom, selectable PDF text, download, and keyboard dismissal. Pagination appears
only for multi-page PDFs. The bachelor's degree certificate and academic
transcript are separate documents. Udemy courses display completion dates only.

## Content maintenance

Qalb, Tangle, and Real-time Chat are the initial selection. Other retained
projects are available through the expanded collection. Source repositories:
[Qalb](https://github.com/yusup-rd/qalb),
[Tangle](https://github.com/yusup-rd/tangle), and
[Real-time Chat](https://github.com/yusup-rd/chat-app-backend).

The supplied CV states 2.5+ years of experience and dates the Ornate Oasis role
January 2025-June 2026. Career metrics come from the owner's CV. Tangle's CV
entry and repository differ on the authentication provider, so its description
avoids naming an unconfirmed current provider. Do not invent deployment links,
app-store availability, or usage counts.

Assets still needed for future content updates:

- Foundation, Dean's List, final-year-project excellence, and cultural-night
  certificates. Original PDFs can optionally replace the existing degree and
  transcript JPEGs.
- Updated Tangle and higher-resolution chat screenshots, if available.
- Hakyda Auto visuals and the owner's publishable contribution details; FinchNest
  screenshots and a substantive project summary before considering either for
  the featured selection.
- Confirmed Qalb store or demo links, if published.

## Interaction

The hero has a full-viewport-width starfield adapted from
[React Bits Particles](https://reactbits.dev/c/backgrounds/particles?glow=1&twinkle=0.85).
Dark-mode stars rotate at speed `0.05`, twinkle, and react gently to the cursor. Light mode uses
a [React Bits Dot Grid](https://reactbits.dev/c/backgrounds/dot-grid). Both stay mounted
for smooth crossfades and replay their entrance on theme activation. Reduced motion
uses still compositions; no pause/play control is displayed. Rendering suspends offscreen and in hidden tabs, caps pixel ratio at
1.5 and frame rate at 30, and falls back to Canvas 2D if WebGL is unavailable.
Attribution and the upstream license are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
Disclosures and mobile navigation
share measured, interruptible height transitions through `AnimatedHeight`.
`AnimatedDialog` retains project and document dialogs until their exits finish.
Shared timing lives in `src/utils/motion.ts`; reduced-motion and keyboard input
update immediately. Timelines follow scroll progress without per-frame React
renders. The project collection includes its toolbar in height transitions and
restores the saved scroll position on collapse.

Project screenshots use Embla with swipe, previous/next buttons, active dots,
keyboard navigation, and announced counts. Apple platforms use a native sort
selector; other platforms use Radix Select. Material UI and Emotion provide
modal focus handling and the contact snackbar. Contact validation uses Zod;
smoke tests must never send real emails.

Project categories use a controlled Rubber Segment adapted from React Bits, with
a restrained, interruptible highlight, drag selection, radio-group keyboard
navigation, and immediate keyboard/reduced-motion updates. It keeps 44px touch
targets and uses a shorter "All" label on mobile.

## License and contact

[MIT](LICENSE). Contact [yusuprd@icloud.com](mailto:yusuprd@icloud.com).
