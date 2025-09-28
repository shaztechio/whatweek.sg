import { defineConfig } from 'vite';
import { resolve } from 'path';
import eslint from 'vite-plugin-eslint';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  test: {
    include: ['test/**/*.test.js'],
    environment: 'jsdom',
    coverage: {
      include: ['src/js/*'],
    },
    setupFiles: ['test/vitest.setup.js'],
    exclude: ['tests/e2e/**'],
  },
  publicDir: 'public',
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
          return null;
        },
      },
    },
    minify: 'esbuild',
  },
  plugins: [
    eslint({
      cache: false,
      fix: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['index.png'],
      manifestFilename: 'manifest.json',
      manifest: {
        short_name: 'Odd or Even',
        name: 'Odd or Even School Weeks',
        icons: [
          {
            src: '/index.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        start_url: '.',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'wwsg-html-cache',
            },
          },
          {
            urlPattern: ({ request }) =>
              ['style', 'script', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'wwsg-asset-cache',
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'wwsg-image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
      },
    }),
  ],
});
