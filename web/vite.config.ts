import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const shared = fileURLToPath(new URL('../src/core', import.meta.url));
// Shared code still reaches `src/components/Utils.ts` until that file moves
// into src/core (see WEB_APP_PLAN.md, Phase 1).
const src = fileURLToPath(new URL('../src', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@shared': shared },
  },
  server: {
    fs: { allow: ['.', src] },
  },
});
