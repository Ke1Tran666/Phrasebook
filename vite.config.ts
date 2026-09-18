import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  server: { proxy: { '/api/tts': 'http://127.0.0.1:3001' } },
  preview: { proxy: { '/api/tts': 'http://127.0.0.1:3001' } },
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
