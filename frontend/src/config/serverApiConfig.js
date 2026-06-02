const useRemoteBackend =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE === 'remote';

const PLACEHOLDER_HOSTS = ['your_backend_url_server.com', 'your_url_backend_server.com'];

function normalizeBaseUrl(url) {
  if (!url || typeof url !== 'string') return '';
  return url.endsWith('/') ? url : `${url}/`;
}

function isPlaceholderUrl(url) {
  if (!url) return true;
  try {
    const host = new URL(url).hostname;
    return PLACEHOLDER_HOSTS.includes(host);
  } catch {
    return true;
  }
}

const remoteBackend = normalizeBaseUrl(import.meta.env.VITE_BACKEND_SERVER);
const remoteFiles = normalizeBaseUrl(
  import.meta.env.VITE_FILE_BASE_URL || import.meta.env.VITE_BACKEND_SERVER
);

if (useRemoteBackend && (!remoteBackend || isPlaceholderUrl(remoteBackend))) {
  console.error(
    '[gestpr] VITE_BACKEND_SERVER inválido ou em falta. Na Vercel (projeto gestpr-app):',
    'VITE_BACKEND_SERVER=https://gestpr-backend.vercel.app/ → depois Redeploy'
  );
}

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

//  console.log(
//    '🚀 Welcome to IDURAR ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@idurarapp.com for more information.'
//  );
