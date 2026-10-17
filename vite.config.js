import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  // Root deployments (Vercel, `vite preview`, local dev) serve assets from `/`.
  // Sub-path deployments pass VITE_BASE explicitly, e.g. the GitHub Actions
  // Pages deploy uses VITE_BASE=/makrana_transportation/.
  const base = process.env.VITE_BASE || '/';

  return {
    root: 'client',
    base,
    plugins: [react()],
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      // In local dev the Express server runs separately on 5000.
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  };
});
