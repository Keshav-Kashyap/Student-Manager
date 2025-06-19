import { defineConfig } from 'vite'; // <-- ✅ this line is very important
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/', // optional but recommended
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'https://student-manager-backend-zbjw.onrender.com',
    },
  },
});
