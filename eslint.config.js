import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

// Full browser + timer globals so no-undef doesn't fire on window APIs
const browserGlobals = {
  window: true, document: true, navigator: true, location: true, history: true,
  localStorage: true, sessionStorage: true, indexedDB: true,
  console: true, alert: true, confirm: true, prompt: true,
  fetch: true, URL: true, URLSearchParams: true, Blob: true, File: true, FileReader: true,
  FormData: true, Headers: true, Request: true, Response: true,
  setTimeout: true, clearTimeout: true, setInterval: true, clearInterval: true,
  requestAnimationFrame: true, cancelAnimationFrame: true, performance: true,
  crypto: true, btoa: true, atob: true,
  Event: true, CustomEvent: true, MutationObserver: true, ResizeObserver: true,
  IntersectionObserver: true, MediaStream: true, MediaRecorder: true,
  HTMLElement: true, HTMLInputElement: true, HTMLVideoElement: true,
  HTMLCanvasElement: true, HTMLButtonElement: true, HTMLDivElement: true,
  SVGElement: true, Element: true, Node: true, HTMLFormElement: true,
  React: true, // for JSX files without explicit React import
};

// Vitest globals for test files
const vitestGlobals = {
  describe: true, it: true, test: true, expect: true,
  beforeEach: true, afterEach: true, beforeAll: true, afterAll: true,
  vi: true,
};

export default [
  js.configs.recommended,
  // Source files
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/test/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
      globals: browserGlobals,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      // Only use the stable, well-established react-hooks rules
      // (v7 introduced many experimental rules that are too strict for a prototype)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['error', 'warn'] }],
    },
    settings: { react: { version: 'detect' } },
  },
  // Test files — same rules + Vitest globals
  {
    files: ['src/test/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
      globals: { ...browserGlobals, ...vitestGlobals },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
    settings: { react: { version: 'detect' } },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'src/app/components/ui/**'],
  },
];
