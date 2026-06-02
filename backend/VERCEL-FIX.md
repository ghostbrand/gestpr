# Backend offline (DEPLOYMENT_NOT_FOUND) — resolver

`DEPLOYMENT_NOT_FOUND` = o domínio `gestpr-backend.vercel.app` **não tem nenhum deploy activo**.
Não é bug do código — é configuração na Vercel.

---

## Opção A — Recriar o backend na Vercel (15 min)

### 1. Apaga o projecto antigo (se existir)
Vercel → **gestpr-backend** → Settings → General → **Delete Project**

### 2. Cria projecto novo
1. **Add New → Project**
2. Importa o repo **gestpr** (GitHub)
3. **Project Name:** `gestpr-backend`
4. **Root Directory:** clica **Edit** → escreve `backend` → **Continue**
5. **Framework Preset:** Other
6. **Build Command:** ⚠️ **APAGA / deixa VAZIO** (não uses `cd frontend...`)
7. **Output Directory:** ⚠️ **VAZIO**
8. **Install Command:** `npm install`

> Se aparecer `cd frontend: No such file or directory`, o Build Command está errado no dashboard.
> Vai a Settings → General → Build & Development Settings → apaga o Build Command override.

### 3. Environment Variables (antes de Deploy)
| Nome | Valor |
|------|--------|
| `DATABASE` | URI do MongoDB (copia de `backend/.env`) |
| `JWT_SECRET` | copia de `backend/.env` |
| `NODE_ENV` | `production` |

### 4. Clica **Deploy**
Espera status **Ready** (verde).

### 5. Testa
Abre: `https://gestpr-backend.vercel.app/api/ping`

Deve aparecer:
```json
{"ok":true,"service":"gestpr-api","hasDatabase":true,...}
```

### 6. Setup (primeira vez)
Vercel → gestpr-backend → **Deployments** → último deploy → **Functions** ou **Shell**:
```bash
npm run setup
```

### 7. Redeploy o frontend
Vercel → **gestpr-app** → Redeploy

---

## Opção B — Render (recomendado, Express normal)

A Vercel + Express serverless dá muitos problemas. O Render corre `npm start` como servidor normal.

1. [render.com](https://render.com) → **New → Blueprint**
2. Liga o repo **gestpr** (usa o `render.yaml` na raiz)
3. Preenche `DATABASE`, `PUBLIC_SERVER_FILE`, `PUBLIC_APP_URL`
4. Após deploy: Shell → `npm run setup`
5. Copia o URL (ex: `https://gestpr-api.onrender.com`)
6. Vercel → **gestpr-app** → Environment Variables:
   - `BACKEND_URL` = `https://gestpr-api.onrender.com`
7. Redeploy **gestpr-app**

---

## Checklist rápido

- [ ] `gestpr-backend` Root Directory = **`backend`**
- [ ] Deploy **Ready** (não Error)
- [ ] `/api/ping` responde JSON
- [ ] `gestpr-app` redeployed depois do backend
