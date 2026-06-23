import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
  },
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/address': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
})
