import { readFileSync } from "node:fs";

const settings = JSON.parse(
    readFileSync(new URL("./.vscode/settings.json", import.meta.url), "utf8"),
) as { "cSpell.words": string[]; "cSpell.ignorePaths": string[] };

export default {
    version: "0.2",
    words: settings["cSpell.words"],
    ignorePaths: settings["cSpell.ignorePaths"],
};
