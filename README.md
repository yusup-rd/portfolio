# Yusup's Portfolio Website

Hello and welcome to my portfolio website!

## Description

This website serves as a showcase for my creative works and technical projects. Here, you'll find a collection of engaging content, including web applications, programming projects, and machine learning endeavors.

## Features

-   Browse through my creative portfolio.
-   Explore a variety of my web applications, programs, and technical projects.
-   Learn more about me and my background.
-   Contact me for collaborations or inquiries.

## Technologies Used

-   React.js
-   Styled Components
-   TypeScript (strict mode)
-   Vite
-   Git

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
npm run lint
npm run build
npm run preview
```

The production build runs TypeScript checks before bundling. Application code
lives in `.ts` and `.tsx` files; shared portfolio models are in
`src/types/portfolio.ts`, and styled-components uses the typed themes in
`src/utils/Themes.ts`. ESLint uses `eslint.config.ts`.

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
