import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/app': resolve(__dirname, './src/app'),
      '@/shared': resolve(__dirname, './src/shared'),
      '@/entities': resolve(__dirname, './src/entities'),
      '@/features': resolve(__dirname, './src/features'),
      '@/widgets': resolve(__dirname, './src/widgets'),
      '@/pages': resolve(__dirname, './src/pages'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/backend': {
        target: 'http://backend:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})