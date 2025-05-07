import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';


// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        })
      ]
    }
  },
  // If you use build.rollupOptions, you may also need:
  resolve: {
    alias: {
      // Polyfill Node.js core modules if needed
      process: 'process/browser',
      stream: 'stream-browserify',
      buffer: 'buffer'
    }
  }
})

