# Portfolio contributor instructions

These instructions apply throughout this repository.

## Stack and documentation

Read the relevant official documentation before changing an API or configuration.
Use the versions in `package.json` and `package-lock.json` as the source of truth.

- React 19: https://react.dev/learn and https://react.dev/reference/react
- TypeScript 6.0: https://www.typescriptlang.org/docs/ (stay on 6.0.x until the installed typescript-eslint supports newer versions).
- Tailwind CSS 4: https://tailwindcss.com/docs/installation/using-vite, https://tailwindcss.com/docs/theme, and https://tailwindcss.com/docs/responsive-design
- Vite 8: https://vite.dev/guide/
- Prettier 3: https://prettier.io/docs/configuration and https://github.com/tailwindlabs/prettier-plugin-tailwindcss
- Material UI 9: https://mui.com/material-ui/getting-started/ and https://mui.com/material-ui/migration/

## Code conventions

- Use TypeScript (`.ts` / `.tsx`) with strict types; avoid `any` and type-check suppressions.
- Declare components as `const ComponentName = () => { ... };` with a block body and explicit return.
- For components with props, declare `interface ComponentNameProps` near the top of the file, after imports and before implementation. Reuse shared models through those interfaces.
- Use Tailwind 4 utilities for styling. Configuration belongs in CSS (`src/App.css`) and the Vite plugin; do not add a Tailwind JavaScript config or styled-components.
- Prefer `gap-*` on a flex/grid parent to sibling `mt-*`, `mb-*`, `mx-*`, or `my-*` spacing. Use margins only where needed, such as auto centering or intentional overlap.
- Use `size-*` when width and height are equal, e.g. `size-14`, not `h-14 w-14`.
- Prefer Tailwind's built-in utilities and dynamic numeric spacing over arbitrary pixel values: `h-17.5`, not `h-[70px]`. Apply this to widths, gaps, padding, offsets, and other supported utilities. Use arbitrary values only when the design requires a value Tailwind cannot express directly.
- Use the standard typography scale (`text-xs`, `text-sm`, `text-base`, etc.). Custom text sizes need an explicit reason, such as text smaller than `text-xs`.
- Use only Tailwind's preset responsive breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`, and their `max-*` variants). Do not restore legacy/custom breakpoints.
- Use `dvh` and `dvw` for viewport dimensions, including inside calculations; do not use `vh` or `vw`.
- Keep class names statically discoverable. Use complete conditional classes or data/ARIA variants instead of dynamically constructing utility names.
- Use theme tokens for palette colors. Theme values live in `src/utils/Themes.ts`; `App` applies CSS variables to the document root so portaled dialogs inherit them.
- Keep custom CSS for global defaults and effects that are clearer in CSS (such as complex gradients and scrollbars). Prefer utilities for normal component layout.
- Use Prettier's Tailwind plugin to sort classes; do not manually impose a different order.

## Scope and verification

- Work only on the requested roadmap items. Preserve content, theme choices, responsiveness, and interactions during migrations unless a change is explicitly requested.
- Do not implement later form, visual redesign, content, SEO, or CMS roadmap tasks implicitly.
- Workspace settings in `.vscode` enable Prettier and import cleanup on save. Keep project-specific cSpell words in `.vscode/settings.json`; correct genuine typos rather than adding them to the dictionary.
- Husky runs lint-staged before commits. Keep fixes scoped to staged files: Prettier first organizes/removes unused imports and sorts Tailwind classes, then ESLint applies fixes, then Prettier normalizes the final formatting. Preserve lint-staged's handling of partially staged files.
- Run `npm run format`, `npm run format:check`, `npm run lint`, and `npm run build` after relevant changes; the build includes type checking.
- For styling changes, verify desktop, tablet, and mobile layouts, theme switching, project filters/dialogs, and the contact form's appearance. Do not send real emails as a smoke test.
- Reassess SEO implications for major feature, routing, rendering, or content changes; minor styling fixes do not require a full SEO audit. Do not assume the future SEO roadmap has already been implemented.
