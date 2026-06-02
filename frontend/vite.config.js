import path from 'path';

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Build na Vercel: ignora placeholder antigo se a env var não foi atualizada
  if (mode === 'production') {
    const backend = env.VITE_BACKEND_SERVER || '';
    const isPlaceholder =
      !backend ||
      backend.includes('your_backend_url_server') ||
      backend.includes('your_url_backend_server');

    if (isPlaceholder) {
      process.env.VITE_BACKEND_SERVER = 'https://gestpr-backend.vercel.app/';
      process.env.VITE_FILE_BASE_URL = 'https://gestpr-backend.vercel.app/';
    }
  }

  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const proxy_url =
    process.env.VITE_DEV_REMOTE === 'remote'
      ? process.env.VITE_BACKEND_SERVER
      : 'http://localhost:8888/';

  const config = {
    plugins: [react()],
    resolve: {
      base: '/',
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: proxy_url,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
  return defineConfig(config);
};
