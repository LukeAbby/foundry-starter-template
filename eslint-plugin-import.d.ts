// Annoying eslint-plugin-import doesn't seem to ship with it's own types and there's not a `@types/eslint-plugin-import` package.
import type { ESLint } from "eslint";

export const flatConfigs: {
  recommended: ESLint.Plugin;
};
