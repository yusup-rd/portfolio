import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

const app = (
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

if (root.children.length > 0) {
    ReactDOM.hydrateRoot(root, app);
} else {
    ReactDOM.createRoot(root).render(app);
}
