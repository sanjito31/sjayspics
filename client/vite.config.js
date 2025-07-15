import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    outDir: 'build',
    emptyOutDir: true
  }
  //    ONLY UNCOMMENT BELOW WHEN LOCALLY DEVELOPING
  // ,
  // server: {
  //   proxy: {
  //     "/api/images.json": "http://localhost:5001"
  //   }
  // }
})
