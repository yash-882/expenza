import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@constants': '/src/constants',
      '@assets': '/src/assets',
      '@pages': '/src/pages',
      '@utils': '/src/utils'
    }
  }
})
