import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages project sites are served from "/<repo>/"
// The workflow sets VITE_BASE accordingly.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  css: {
    postcss: path.resolve(__dirname, './postcss.config.cjs'),
  },
})
