import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        game: resolve(__dirname, 'pages/game.html'),
        ai: resolve(__dirname, 'pages/ai-match.html'),
        review: resolve(__dirname, 'pages/review.html'),
        statistics: resolve(__dirname, 'pages/statistics.html'),
        kifu: resolve(__dirname, 'pages/kifu.html'),
        kifuPlayer: resolve(__dirname, 'pages/kifu-player.html'),
        setup: resolve(__dirname, 'pages/setup.html'),
        aiSetup: resolve(__dirname, 'pages/ai-setup.html'),
        patternList: resolve(__dirname, 'pages/pattern-list.html'),
        patternStudy: resolve(__dirname, 'pages/pattern-study.html'),
        auth: resolve(__dirname, 'pages/auth.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  css: {
    devSourcemap: true,
  },
  js: {
    devSourcemap: true,
  },
});
