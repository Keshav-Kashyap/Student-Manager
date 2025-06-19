export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'https://student-manager-backend-zbjw.onrender.com',
    },
  },
  build: {
    outDir: 'dist', // already default, but you can make it explicit
  },
  base: '/', // for correct relative path handling on refresh
});
