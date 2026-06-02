# Variáveis na Vercel — projeto `gestpr-backend`

Vercel → projeto **gestpr-backend** → **Settings** → **Environment Variables** → **Add**

Copia os **mesmos nomes** do teu `backend/.env` local (não faças upload do ficheiro `.env`).

| Nome | Obrigatório | Exemplo |
|------|-------------|---------|
| `DATABASE` | Sim | `mongodb+srv://user:pass@cluster.mongodb.net/gestpr?...` |
| `JWT_SECRET` | Sim | igual ao `.env` local |
| `NODE_ENV` | Sim | `production` |
| `PUBLIC_SERVER_FILE` | Sim | `https://gestpr-backend.vercel.app/` |
| `PUBLIC_APP_URL` | Sim | URL do frontend (ex. `https://gestpr.vercel.app`) |

Marca **Production**, **Preview** e **Development** se quiseres o mesmo em todos.

Depois: **Deployments** → ⋮ no último deploy → **Redeploy**.

Teste: `https://gestpr-backend.vercel.app/api/ping` → `"hasDatabase": true`

---

**Root Directory** (Settings → General): deve ser `backend`.
