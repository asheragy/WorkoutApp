import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import routinesApi from './plugins/routinesApi.ts';

const shared = fileURLToPath(new URL('../src/core', import.meta.url));
const src = fileURLToPath(new URL('../src', import.meta.url));
// Routine JSON files: globbed by TemplateRepository and written by Save.
const routinesDir = fileURLToPath(
  new URL('../src/core/routines', import.meta.url),
);

export default defineConfig({
  plugins: [react(), routinesApi(routinesDir)],
  resolve: {
    alias: { '@shared': shared },
  },
  server: {
    fs: { allow: ['.', src] },
  },
});
