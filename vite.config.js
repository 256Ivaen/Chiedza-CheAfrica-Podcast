import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true,
    historyApiFallback: true,
    strictPort: false,
  },
  assetsInclude: ['**/*.JPG', '**/*.docx'],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'about.html'),
        services: path.resolve(__dirname, 'services.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        episodes: path.resolve(__dirname, 'episodes.html'),
        blog: path.resolve(__dirname, 'blog.html'),
        notfound: path.resolve(__dirname, '404.html')
      }
    }
  }
})