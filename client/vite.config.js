import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'https://student-manager-backend-zbjw.onrender.com', // 🧠 Backend URL yahan set kar
    },
  },
});
