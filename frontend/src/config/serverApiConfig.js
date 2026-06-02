const useRemoteBackend =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE === 'remote';

function normalizeBaseUrl(url) {
  if (!url || typeof url !== 'string') return '';
  return url.endsWith('/') ? url : `${url}/`;
}

const remoteBackend = normalizeBaseUrl(import.meta.env.VITE_BACKEND_SERVER);
const remoteFiles = normalizeBaseUrl(
  import.meta.env.VITE_FILE_BASE_URL || import.meta.env.VITE_BACKEND_SERVER
);

if (useRemoteBackend && !remoteBackend) {
  console.error(
    '[gestpr] Defina VITE_BACKEND_SERVER na Vercel (ex.: https://teu-api.onrender.com/)'
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
