const isDev = !import.meta.env.PROD;
const devRemote = import.meta.env.VITE_DEV_REMOTE === 'remote';

function normalizeBaseUrl(url) {
  if (!url || typeof url !== 'string') return '';
  return url.endsWith('/') ? url : `${url}/`;
}

function devBaseUrl() {
  if (devRemote && import.meta.env.VITE_BACKEND_SERVER) {
    return normalizeBaseUrl(import.meta.env.VITE_BACKEND_SERVER) || 'http://localhost:8888/';
  }
  return 'http://localhost:8888/';
}

// Produção na Vercel: URLs relativas → proxy em vercel.json (mesma origem, zero CORS)
const devBase = devBaseUrl();

export const API_BASE_URL = isDev ? `${devBase}api/` : '/api/';
export const BASE_URL = isDev ? devBase : '/';
export const DOWNLOAD_BASE_URL = isDev ? `${devBase}download/` : '/download/';
export const FILE_BASE_URL = isDev ? devBase : '/';

export const WEBSITE_URL = import.meta.env.VITE_APP_URL
  ? normalizeBaseUrl(import.meta.env.VITE_APP_URL)
  : isDev
    ? 'http://localhost:3000/'
    : '/';

export const ACCESS_TOKEN_NAME = 'x-auth-token';
