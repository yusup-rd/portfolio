# Yusup's Portfolio Website

Hello and welcome to my portfolio website!

## Description

This website serves as a showcase for my creative works and technical projects. Here, you'll find a collection of engaging content, including web applications, programming projects, and machine learning endeavors.

## Features

- Browse through my creative portfolio.
- Explore a variety of my web applications, programs, and technical projects.
- Learn more about me and my background.
- Contact me for collaborations or inquiries.

## Technologies Used

- React.js
- Tailwind CSS 4 (CSS-first configuration)
- TypeScript (strict mode)
- Vite
- Git

## Local development

Use Node.js 22.13+ (22.x) or Node.js 24+ and npm.

```sh
npm ci
npm run dev
```

Copy `.env.example` to `.env` and supply your EmailJS service ID, template ID,
and public key (`VITE_EMAILJS_PUBLIC_KEY`) to enable the contact form. Vite exposes
`VITE_` values to the browser; only use the EmailJS public key, never a private key.

```sh
npm run typecheck
npm run format
npm run format:check
npm run lint
npm run build
npm run preview
```

The production build runs TypeScript checks before bundling. Application code
lives in `.ts` and `.tsx` files; shared portfolio models are in
`src/types/portfolio.ts`. Tailwind is integrated with `@tailwindcss/vite`, with
theme tokens in `src/App.css` and palette values in `src/utils/Themes.ts`.
The theme variables are applied to the document root so dialogs inherit them.
There is no JavaScript Tailwind configuration. Material UI and Emotion remain
for the existing timelines, dialogs, snackbar, and icons.

Prettier uses `prettier-plugin-tailwindcss` and the CSS entry point to sort
utility classes automatically. Run `npm run format` to format the project,
or `npm run format:check` to check formatting. Contributor conventions and
version-specific documentation links are in [AGENTS.md](AGENTS.md).
ESLint uses `eslint.config.ts`.

Workspace settings recommend Prettier, ESLint, Tailwind IntelliSense, and cSpell
extensions. Saving a file formats it and organizes/removes unused imports.
Prettier also performs import cleanup from the command line. Project spelling
exceptions live in `.vscode/settings.json`; `npm run spellcheck` reads that same
dictionary through `cspell.config.ts`.

`npm install` enables Husky through the `prepare` script. Before each commit,
lint-staged processes only staged files: it organizes imports and formats code,
applies ESLint fixes to TypeScript files, then formats the result. Unfixable lint
errors block the commit. Partially staged changes are handled by lint-staged.
You can run this manually with `npm run lint:staged`.

TypeScript is kept on 6.0.3 because the current `typescript-eslint` release
supports TypeScript below 6.1. Upgrade these tools together when TypeScript 7
support is available. AOS uses its latest stable release (2.3.4); MUI Lab uses
the latest beta for the timeline components.

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and submit a pull request with your changes. Contributions are always welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, please contact me via email at [yusuprd@icloud.com](mailto:yusuprd@icloud.com).
