import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { Bio } from "./data/constants";

export const render = () => {
    return renderToString(
        <StrictMode>
            <App />
        </StrictMode>,
    );
};

export const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": "https://yusuprd.com/#website",
            url: "https://yusuprd.com/",
            name: "Yusup Rejebov",
            inLanguage: "en",
            publisher: { "@id": "https://yusuprd.com/#person" },
        },
        {
            "@type": "ProfilePage",
            "@id": "https://yusuprd.com/#profile",
            url: "https://yusuprd.com/",
            name: "Yusup Rejebov — Software Engineer",
            isPartOf: { "@id": "https://yusuprd.com/#website" },
            mainEntity: { "@id": "https://yusuprd.com/#person" },
            inLanguage: "en",
        },
        {
            "@type": "Person",
            "@id": "https://yusuprd.com/#person",
            name: "Yusup Rejebov",
            url: "https://yusuprd.com/",
            jobTitle: "Software Engineer",
            description:
                "Software engineer building dependable web products and iOS and Android applications.",
            image: new URL(Bio.image, "https://yusuprd.com").href,
            sameAs: [Bio.github, Bio.linkedin, Bio.telegram, Bio.instagram],
        },
    ],
};
