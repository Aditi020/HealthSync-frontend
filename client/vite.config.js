import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      verbose: false,
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
    }),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'bundle-analysis.html',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          utils: ['lodash', 'moment', 'axios'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',  // ✅ Allows external access
    port: process.env.PORT || 5173,  // ✅ Uses Render's assigned port
    open: false,  // ✅ Prevents auto-opening in production
  },
  preview: {
    port: process.env.PORT || 5173,  // ✅ Ensures correct port usage
    host: '0.0.0.0',
    allowedHosts: ['healthsync-upz6.onrender.com'],  // ✅ Allows Render-hosted frontend
  },
});
