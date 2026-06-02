# Deploy gestpr — passos obrigatórios

## Problema comum: 404 no login

Significa que o **backend está offline** ou o **frontend não fez redeploy** com o proxy.

Teste directo: https://gestpr-backend.vercel.app/api/ping  
→ Se der erro ou `DEPLOYMENT_NOT_FOUND`, o backend precisa de redeploy.

---

## 1. Backend — projeto `gestpr-backend`

1. Vercel → **gestpr-backend** → Settings → General  
   **Root Directory** = `backend` → Save

2. Settings → Environment Variables:
   - `DATABASE` = URI MongoDB Atlas
   - `JWT_SECRET` = string segura
   - `NODE_ENV` = `production`

3. Deployments → **Redeploy** → espera **Ready**

4. Testa: https://gestpr-backend.vercel.app/api/ping  
   → `{"ok":true,"hasDatabase":true,...}`

5. Shell (primeira vez): `npm run setup`

---

## 2. Frontend — projeto `gestpr-app`

1. **Root Directory** = `frontend`

2. (Opcional) `BACKEND_URL` = `https://gestpr-backend.vercel.app`

3. Deployments → **Redeploy** → espera **Ready**

4. Login: https://gestpr-app.vercel.app/login

O frontend chama `/api/login` (mesmo domínio) → proxy → backend.

---

## 3. MongoDB Atlas

Network Access → Allow `0.0.0.0/0`
