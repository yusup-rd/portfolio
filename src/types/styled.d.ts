import "styled-components";
import type { PortfolioTheme } from "../utils/Themes";

declare module "styled-components" {
    // Declaration merging requires an interface to extend the shared theme type.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface DefaultTheme extends PortfolioTheme {}
}
