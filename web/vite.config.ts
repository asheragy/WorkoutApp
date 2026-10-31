import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import routinesApi from './plugins/routinesApi.ts';

const shared = fileURLToPath(new URL('../src/core', import.meta.url));
// Shared code still reaches `src/components/Utils.ts` until that file moves
// into src/core (see WEB_APP_PLAN.md, Phase 1).
const src = fileURLToPath(new URL('../src', import.meta.url));
// Where Save writes routine JSON. Read-only for the web app for now (routines
// still load from the code files); the phone will later import from here.
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
