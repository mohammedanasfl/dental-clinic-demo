import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the repository at /<repo-name>/ and the `docs/` folder is the publish root,
// so the production build is emitted straight into docs/. Override the base for a custom domain:
//   BASE_PATH=/ npm run build
export default defineConfig({
  base: process.env.BASE_PATH ?? '/dental-clinic-demo/',
  plugins: [react()],
  build: {
    outDir: 'docs',
    emptyOutDir: true, // docs/ is build output only; static extras live in public/
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['gsap', 'gsap/ScrollTrigger', 'lenis', 'framer-motion'],
        },
      },
    },
  },
});
