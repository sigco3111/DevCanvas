import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: '/' — Vercel root context 호스팅용 (tech-toolkit-hub 71f 함정 회피)
  // Pages로 이관 시 '/devcanvas/'로 변경 필요 (현재는 Vercel 유지 결정)
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
}) 