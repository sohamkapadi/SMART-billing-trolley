import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true, // Allows access from other devices on the network
    port: 5173, // Use the appropriate port
  },
  plugins: [react()],
})
