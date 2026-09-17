const tseslint = require("typescript-eslint");

module.exports = tseslint.config({
  files: ["lib/**/*.ts"],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { projectService: true },
  },
  plugins: { "@typescript-eslint": tseslint.plugin },
  rules: {
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-empty-object-type": "error",
    "@typescript-eslint/no-unsafe-function-type": "error",
    "@typescript-eslint/no-wrapper-object-types": "error",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/unified-signatures": "error",
    "arrow-body-style": "error",
    "constructor-super": "error",
    "dot-notation": "error",
    "guard-for-in": "error",
    "no-bitwise": "error",
    "no-console": [
      "error",
      { allow: ["debug", "info", "time", "timeEnd", "trace"] },
    ],
    "no-debugger": "error",
    "no-invalid-this": "error",
    "no-new-wrappers": "error",
    "no-undef-init": "error",
    "object-shorthand": "error",
    "prefer-const": "error",
  },
});
