// @blockly/theme-modern 5.x ships without type declarations.
declare module "@blockly/theme-modern" {
  import type { Theme } from "blockly/core";
  const theme: Theme;
  export default theme;
}
