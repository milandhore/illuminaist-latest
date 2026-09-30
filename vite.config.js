import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('node_modules/react/')) return 'vendor'
        },
      },
    },
  },
})
