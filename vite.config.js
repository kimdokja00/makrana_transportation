import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  const base = process.env.VITE_BASE || (isBuild ? '/makrana_transportation/' : '/');

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
