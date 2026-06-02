# Deploy gestpr — dois sites na Vercel

## Qual URL abrir?

| Projeto Vercel | Root Directory | Quem abre no browser? |
|----------------|----------------|------------------------|
| **gestpr** (frontend) | `frontend` ou raiz com `vercel.json` da raiz | **Utilizadores** — app React |
| **gestpr-backend** (API) | `backend` | **Ninguém** — só JSON/API |

Se abrires `gestpr-backend.vercel.app` vês erro de Serverless ou uma página “API”. Isso é normal. O ERP está noutro projeto/URL.

---

## 1. MongoDB Atlas

Connection string em `DATABASE`. **Network Access** → `0.0.0.0/0`.

---

## 2. Backend — projeto `gestpr-backend`

- **Root Directory:** `backend`
- **Variáveis:** `DATABASE`, `JWT_SECRET`, `NODE_ENV=production`, `PUBLIC_SERVER_FILE` = `https://gestpr-backend.vercel.app/`, `PUBLIC_APP_URL` = URL do frontend
- Testes (sem MongoDB): `https://gestpr-backend.vercel.app/api/ping`
- Com MongoDB: `https://gestpr-backend.vercel.app/api/health`
- Primeira vez: Shell → `npm run setup`

Alternativa mais estável para PDFs: [Render](https://render.com) com `render.yaml` na raiz.

---

## 3. Frontend — projeto novo na Vercel (ex.: `gestpr`)

1. **Add New Project** → mesmo repo GitHub
2. **Root Directory:** `frontend`
3. **Environment Variables** (Production):
   - `VITE_BACKEND_SERVER` = `https://gestpr-backend.vercel.app/`
   - `VITE_FILE_BASE_URL` = `https://gestpr-backend.vercel.app/`
   - `VITE_APP_URL` = `https://gestpr.vercel.app/` (o URL que a Vercel der a este projeto)
4. Deploy → abre **este** URL no browser (não o do backend)

---

## 4. Local

```bash
cd backend && npm install && npm run setup && npm run dev
cd frontend && npm install && npm run dev
```

---

**Nota:** `.vercelignore` na raiz não pode incluir `backend/`.
