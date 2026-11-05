import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        campanha: resolve(process.cwd(), 'index.html'),
        construcel: resolve(process.cwd(), 'construcel/index.html'),
      },
    },
  },
});
