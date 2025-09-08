import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
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
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
      util: 'util',
      process: 'process/browser',
      events: 'events',
      url: 'url',
      querystring: 'querystring-es3',
      path: 'path-browserify',
      fs: false,
      net: false,
      tls: false,
      child_process: false,
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
      '@polkadot/util-crypto',
      '@polkadot-auth/core',
      '@polkadot-auth/ui'
    ],
    exclude: [
      '@noble/hashes',
      '@noble/secp256k1',
      'tweetnacl',
      'tweetnacl/nacl-fast'
    ]
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Exclude Node.js modules and crypto libraries from the bundle
        if (id.startsWith('@noble/') || id.startsWith('tweetnacl')) {
          return true;
        }
        return false;
      }
    }
  }
})
