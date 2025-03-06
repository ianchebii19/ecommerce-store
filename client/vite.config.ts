import path from 'path'  // Make sure to import 'path' module correctly
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      'https://ecommerce-store-uz8o.vercel.app': 'https://ecommerce-store-uz8o.vercel.app', // Proxy for API calls
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias for src directory
    },
  },
})
