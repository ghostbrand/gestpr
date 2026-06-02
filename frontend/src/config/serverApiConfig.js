const useRemoteBackend =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE === 'remote';

const PRODUCTION_API_URL = 'https://gestpr-backend.vercel.app/';
const PLACEHOLDER_HOSTS = ['your_backend_url_server.com', 'your_url_backend_server.com'];

function normalizeBaseUrl(url) {
  if (!url || typeof url !== 'string') return '';
  return url.endsWith('/') ? url : `${url}/`;
}

function isPlaceholderUrl(url) {
  if (!url) return true;
  try {
    return PLACEHOLDER_HOSTS.includes(new URL(url).hostname);
  } catch {
    return true;
  }
}

function resolveBackendUrl(raw) {
  let url = normalizeBaseUrl(raw);

  if (isPlaceholderUrl(url)) url = '';

  // Mixed content: em produção força HTTPS
  if (import.meta.env.PROD && url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }

  if (!url && import.meta.env.PROD) {
    return PRODUCTION_API_URL;
  }

  return url;
}

const remoteBackend = useRemoteBackend
  ? resolveBackendUrl(import.meta.env.VITE_BACKEND_SERVER)
  : '';

const remoteFiles = useRemoteBackend
  ? resolveBackendUrl(import.meta.env.VITE_FILE_BASE_URL || import.meta.env.VITE_BACKEND_SERVER)
  : '';

export const API_BASE_URL = useRemoteBackend
  ? `${remoteBackend}api/`
  : 'http://localhost:8888/api/';

export const BASE_URL = useRemoteBackend ? remoteBackend : 'http://localhost:8888/';

export const WEBSITE_URL = import.meta.env.VITE_APP_URL
  ? normalizeBaseUrl(import.meta.env.VITE_APP_URL)
  : import.meta.env.PROD
    ? '/'
    : 'http://localhost:3000/';

export const DOWNLOAD_BASE_URL = useRemoteBackend
  ? `${remoteBackend}download/`
  : 'http://localhost:8888/download/';

export const ACCESS_TOKEN_NAME = 'x-auth-token';

export const FILE_BASE_URL = useRemoteBackend ? remoteFiles : 'http://localhost:8888/';
