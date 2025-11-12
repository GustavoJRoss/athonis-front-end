import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import next from "@next/eslint-plugin-next";
import a11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import promise from "eslint-plugin-promise";
import deprecate from "eslint-plugin-deprecate";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/dist/**",
      "**/.git/**",
      "**/coverage/**",
      "**/public/**",
      "**/*.config.js",
      "**/next-env.d.ts",
      "**/*.min.js",
      "**/openapi-generator/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        // Sem type-aware linting (rápido e simples)
        project: false,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".ts", ".tsx", ".js", ".jsx"],
          paths: ["src"],
        },
        alias: {
          map: [["@", "./src"]],
          extensions: [".ts", ".tsx", ".js", ".jsx"],
        },
      },
    },
    plugins: {
      security,
      sonarjs,
      promise,
      deprecate,
      next,
      import: importPlugin,
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": a11y,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      "@typescript-eslint": tseslint.plugin,
    },

    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-cycle": ["warn", { ignoreExternal: true }],
      "import/no-extraneous-dependencies": "off",
      "import/extensions": [
        "error",
        "ignorePackages",
        { js: "never", jsx: "never", ts: "never", tsx: "never" },
      ],
      "import/prefer-default-export": "off",
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/cognitive-complexity": "warn",
      "jsx-a11y/anchor-is-valid": "off",
      "no-await-in-loop": "warn",
      "no-underscore-dangle": "off",
      "no-duplicate-string": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "class-methods-use-this": "warn",
      "no-nested-ternary": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-shadow": ["off"],
      "react/destructuring-assignment": "warn",
      "react/require-default-props": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/function-component-definition": "off",
      "react/jsx-filename-extension": [
        1,
        { extensions: [".ts", ".tsx", ".js", ".jsx"] },
      ],
      "react/jsx-props-no-spreading": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/rules-of-hooks": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "next/no-img-element": "warn",
      "next/no-head-element": "warn",
      "next/no-html-link-for-pages": "warn",
      "next/no-sync-scripts": "warn",
    },
  },
];
