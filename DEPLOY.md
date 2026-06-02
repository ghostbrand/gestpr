# Deploy gestpr (Vercel + Render)

## 1. MongoDB Atlas

Cria um cluster e copia a connection string para `DATABASE`.

## 2. API no Render

1. [render.com](https://render.com) → **New** → **Blueprint** → repositório `gestpr`
2. Define manualmente:
   - `DATABASE` — URI MongoDB
   - `PUBLIC_SERVER_FILE` — `https://<nome-do-servico>.onrender.com/`
   - `PUBLIC_APP_URL` — URL da Vercel (ex. `https://gestpr.vercel.app`)
   - `RESEND_API` / `MAIL_FROM` (opcional, e-mail)
3. Após o primeiro deploy com sucesso: **Shell** → `cd backend && npm run setup`
4. Testa: `https://<teu-api>.onrender.com/api/health` → `{"ok":true,"db":"connected"}`

## 3. Frontend na Vercel

1. Importa o mesmo repositório
2. **Root Directory**: deixa em branco (usa `vercel.json` na raiz) **ou** `frontend`
3. **Environment variables** (Production):
   - `VITE_BACKEND_SERVER` = `https://<teu-api>.onrender.com/`
   - `VITE_FILE_BASE_URL` = mesma URL do API
   - `VITE_APP_URL` = `https://<teu-site>.vercel.app/` (opcional)
4. Redeploy

Não uses a pasta `backend` como root na Vercel — o API é só no Render.

## 4. Local

```bash
# Terminal 1
cd backend && npm install && npm run setup && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev
```
