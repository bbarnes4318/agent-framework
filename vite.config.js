import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        live: resolve(__dirname, 'live.html'),
        framework: resolve(__dirname, 'framework.html'),
        preclosed: resolve(__dirname, 'preclosed.html')
      }
    }
  },
  server: {
    open: '/live.html'
  }
})
