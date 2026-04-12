import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages project sites are served from "/<repo>/"
// The workflow sets VITE_BASE accordingly.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@ui': path.resolve(__dirname, '../src/components/ui'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@features': path.resolve(__dirname, '../src/features'),
      '@res': path.resolve(__dirname, '../src/res'),
    },
  },
  css: {
    postcss: path.resolve(__dirname, './postcss.config.cjs'),
  },
})
