import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.VITE_API_BASE || 'http://localhost:5000';

  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': apiBase,
      },
    },
  };
});
