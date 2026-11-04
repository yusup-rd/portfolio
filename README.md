# Yusup Rejebov — Portfolio

Personal portfolio showcasing full-stack web and mobile projects, professional
experience, skills, and education. Includes project filtering, screenshot
carousels, an accessible document reader, light and dark themes, and a contact form.

**Live website:** [yusuprd.com](https://yusuprd.com/)

## Technology

- React 19 and TypeScript 6
- Tailwind CSS 4 and Vite 8
- Radix UI primitives, Motion, and Embla Carousel
- React-PDF with a locally bundled PDF.js worker
- EmailJS, Zod, and Sonner for contact form delivery, validation, and notifications

## Getting started

Use Node.js 24, as specified in `.nvmrc`, and npm.

```sh
npm ci
```

Copy `.env.example` to `.env.local` and configure the contact form:

```dotenv
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

These values are included in the browser bundle. Use the EmailJS public key;
never add private keys or credentials to `VITE_` variables. The EmailJS template
must accept `from_name`, `from_email`, `subject`, and `message`. Allow the production
domain in EmailJS if origin restrictions are enabled.

```sh
npm run dev
```

## Quality checks

```sh
npm run format
npm run format:check
npm run spellcheck
npm run lint
npm run build
```

The production build includes TypeScript checking and build-time React rendering. Husky runs lint-staged before
commits. Contribution guidelines are in [AGENTS.md](AGENTS.md).

## Production

```sh
npm run build
npm run preview
```

Deploy the generated `dist` directory to a static host. Set the EmailJS environment
variables in the hosting environment before building. For Netlify, use
`npm run build` as the build command and `dist` as the publish directory.

The build uses React's server renderer to write the actual page content to
`dist/index.html`; React hydrates that HTML in the browser. This gives crawlers
and visitors the same content before JavaScript runs while retaining static
hosting. No production Node server is required. Run `npm run build`, rather than
`vite build` directly, to include this step. Server bundles stay in the ignored
`node_modules/.tmp/portfolio-ssr` directory and are not deployed.

`netlify.toml` configures the build, redirects the www and HTTP variants to the
canonical HTTPS origin, redirects `/index.html` to `/`, and serves the custom
404 page with HTTP 404 for unknown paths. On other hosts, configure equivalent
redirects and 404 handling; do not rewrite every URL to the homepage. Netlify
deploy previews and branch builds receive `noindex` metadata automatically.

After deploying, verify the production URL in Google Search Console, submit
`https://yusuprd.com/sitemap.xml`, and use URL Inspection to check the rendered
page and request indexing. Verify redirects, HTTP 404 responses, robots.txt,
and social previews on the live domain. Search engines and social networks may
cache older metadata until they crawl the site again. Rankings and rich results are not
guaranteed by these technical changes.

The portfolio is hosted at [yusuprd.com](https://yusuprd.com/).
The Tangle demo is available at [tangle.yusuprd.com](https://tangle.yusuprd.com/).

## Content maintenance

- Portfolio content and project URLs: `src/data/constants.ts`
- Global styles and theme tokens: `src/App.css`
- Reusable UI and portfolio sections: `src/components`
- Résumé: `public/docs/cv/yusup-rejebov-cv.pdf`
- Education documents: `public/docs/university` and `public/docs/udemy`
- Images: `public/images`
- Project screenshots use WebP at their original dimensions to reduce downloads.
- Social metadata: `index.html`
- Profile structured data: `src/entry-server.tsx` (profile links reuse `Bio`)
- Crawling and sitemap: `public/robots.txt` and `public/sitemap.xml`
- Social preview: `public/images/social/yusup-rejebov-og.png` (1200 × 630)
- Browser icon: `public/images/logos/portfolio-mark.svg` (automatic light/dark)
- Fallback icons: `public/favicon.ico` and `public/images/logos/apple-touch-icon.png`

The social card uses the portfolio's typography, evergreen and warm neutral
light palette, obsidian dark palette, and “yr.” monogram. It is independent of
the homepage layout and needs no update when projects or UI change. SVG icon
lettering is stored as paths to avoid relying on an installed font; browsers
that cannot use SVG favicons receive the dark ICO version.

Files in `public` are served from the site root. Replace the résumé at its existing
path to preserve the reader and download links. Update project demo URLs in the
shared data so cards and project dialogs remain consistent.

## License

[MIT](LICENSE). Third-party component attribution and licenses are documented in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
