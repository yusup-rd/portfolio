# Yusup Rejebov's portfolio

A personal portfolio for full-stack web and mobile work, built with React 19,
TypeScript, Tailwind CSS 4, and Vite. It includes selected projects, career and
education timelines, a reusable document reader, and an EmailJS contact form.

UI components use Tailwind and focused Radix primitives; notifications use Sonner.
`components.json` configures the shadcn CLI and React Bits registry for adding
component source. It is development configuration and adds no browser runtime.

## Development

Use Node.js 22.13+ (22.x) or Node.js 24+ and npm.
The root `.nvmrc` selects Node.js 24.x for local version managers and Netlify
builds, overriding Netlify's older default. On Netlify, use `npm run build`
with `dist` as the publish directory.

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
  hooks/                Shared React hooks
  types/                Portfolio content models
  utils/                Shared motion timing
```

Files in `public` are served directly from `/docs/...` or `/images/...`. Keep new reader documents
with the relevant institution or provider, and name screenshots clearly, such
as `qalb-prayer-times.png`. Remove assets when their last use is removed. Devicons
are the explicit remote exception: use official CDN URLs in the constants.

The document reader keeps its controls available while its PDF engine loads on
demand. Image certificates do not load PDF.js. The PDF engine and local worker
use matching compatibility builds with a scoped `Promise.withResolvers` polyfill
in both the page and worker; Vite's default target includes Safari/iOS
16.4. PDF canvas resolution is bounded to limit memory use on mobile devices.
An error boundary isolates preview failures from the dialog, with direct access
to the original document and download if inline rendering is unavailable.
The reader offers zoom, selectable PDF text, download, and keyboard dismissal. Pagination appears
only for multi-page PDFs. The bachelor's degree certificate and academic
transcript are separate documents. Udemy courses display completion dates only.
The dialog fits its content up to the viewport height limit and uses skeletons
from `src/components/Skeletons` while loading. A tab-session cache retains up to
three recent documents and 8 MiB of PDF bytes/previews. Reopening shows a cached
first-page preview while selectable text is restored; canvases and PDF workers
are still released on close. Evicted preview URLs are revoked.
The bachelor's four records use the React Bits Folder component, installed
through shadcn (`@react-bits/Folder-TS-TW`). `components.json` records the registry;
the `@/` alias is shared by TypeScript and Vite. The upstream static paper cards
show document names without thumbnails or PDF loading. The engine provides peek, entrance,
pointer tilt, drag layering, free dragging, and viewport return on release.
Free dragging is constrained only on release, returning papers to the document
area. The section stays below the sticky header. Keyboard selection and reduced motion remain supported. Document selection
opens the reusable reader instead of a second built-in zoom preview.
The University documents heading also toggles an accessible list of the same four
records, using the Read more disclosure's shared height and opacity animation.
The folder's instructions crossfade between open and closed states without changing
their reserved height. Keyboard and reduced-motion changes are immediate.

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

- Foundation and Dean's List certificates. Original PDFs can optionally replace
  the existing degree and transcript JPEGs.
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
keyboard navigation, and announced counts. All platforms use a reusable
Glide Select adapted from React Bits,
with an animated corner pop and gliding row highlight over Radix Select. Radix Dialog
provides modal focus handling; Sonner displays contact notifications. Contact validation uses Zod;
smoke tests must never send real emails.

Project categories use a controlled Rubber Segment adapted from React Bits, with
the upstream stretch/squash, momentum, and handoff settings, drag selection, radio-group keyboard
navigation, and immediate keyboard/reduced-motion updates. It keeps 44px touch
targets and uses a shorter "All" label on mobile.

## License and contact

[MIT](LICENSE). Contact [yusuprd@icloud.com](mailto:yusuprd@icloud.com).
