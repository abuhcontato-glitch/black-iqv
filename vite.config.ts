import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { rollupOptions: { input: {
    studio: new URL('./index.html', import.meta.url).pathname,
    construcel: new URL('./construcel/index.html', import.meta.url).pathname,
    onboarding: new URL('./construcel/onboarding/index.html', import.meta.url).pathname,
  } } },
});
