import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    process: JSON.stringify({
      env: {
        NODE_ENV: 'development'
      }
    })
  },
  resolve: {
    alias: {
      crypto: path.resolve(__dirname, 'node_modules/crypto-browserify'),
      stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
      buffer: path.resolve(__dirname, 'node_modules/buffer'),
      util: path.resolve(__dirname, 'node_modules/util'),
      process: path.resolve(__dirname, 'node_modules/process/browser'),
      events: path.resolve(__dirname, 'node_modules/events'),
      url: path.resolve(__dirname, 'node_modules/url'),
      querystring: path.resolve(__dirname, 'node_modules/querystring-es3'),
      path: path.resolve(__dirname, 'node_modules/path-browserify'),
    }
  },
  optimizeDeps: {
    include: [
      'buffer',
      'process',
      'crypto-browserify',
      'stream-browserify',
      'util',
      'events',
      'url',
      'querystring-es3',
      'path-browserify',
      '@polkadot/extension-dapp',
      '@polkadot/util',
      '@polkadot/util-crypto'
    ]
  },
  server: {
    hmr: {
      overlay: false
    }
  }
})
