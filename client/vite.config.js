import { defineConfig } from 'vite'; // <-- ✅ this line is very important
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { API_BASE } from './src/config/api';

export default defineConfig({
  base: '/', // optional but recommended
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
    '/api': `${API_BASE}`,
    },
  },
});
