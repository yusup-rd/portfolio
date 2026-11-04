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

The production build includes TypeScript checking. Husky runs lint-staged before
commits. Contribution guidelines are in [AGENTS.md](AGENTS.md).

## Production

```sh
npm run build
npm run preview
```

Deploy the generated `dist` directory to a static host. Set the EmailJS environment
variables in the hosting environment before building. For Netlify, use
`npm run build` as the build command and `dist` as the publish directory.

The portfolio is hosted at [yusuprd.com](https://yusuprd.com/).
The Tangle demo is available at [tangle.yusuprd.com](https://tangle.yusuprd.com/).

## Content maintenance

- Portfolio content and project URLs: `src/data/constants.ts`
- Global styles and theme tokens: `src/App.css`
- Reusable UI and portfolio sections: `src/components`
- Résumé: `public/docs/cv/yusup-rejebov-cv.pdf`
- Education documents: `public/docs/university` and `public/docs/udemy`
- Images: `public/images`
- Social metadata: `index.html`

Files in `public` are served from the site root. Replace the résumé at its existing
path to preserve the reader and download links. Update project demo URLs in the
shared data so cards and project dialogs remain consistent.

## License

[MIT](LICENSE). Third-party component attribution and licenses are documented in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
