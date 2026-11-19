import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite replaces Create React App (react-scripts).
// - Dev server stays on port 3000 (the backend's CORS allowlist expects it).
// - Production output stays in `build/` so Vercel (vercel.json) and Firebase
//   Hosting (firebase.json) keep working without changes.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
});
