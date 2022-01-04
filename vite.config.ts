import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

export default defineConfig({
  server: {
    port: 13003
  },
  plugins: [
    createVuePlugin()
  ]
})