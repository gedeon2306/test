# Guide complet — Auth OAuth avec Next.js + NextAuth + Prisma + Supabase

## Architecture finale

```
Next.js
├── NextAuth      → gère OAuth Google/GitHub, crée la session
├── Prisma        → ORM, parle à la BDD
└── Supabase      → PostgreSQL hébergé (gratuit)
```

Zéro backend séparé. Tout est dans Next.js.

---

## PARTIE 1 — Prérequis

- **Node.js 18+** → https://nodejs.org
- **Un compte Supabase** → https://supabase.com (gratuit)
- **Un compte Google Cloud** → https://console.cloud.google.com
- **Un compte GitHub** → https://github.com

---

## PARTIE 2 — Supabase

### Créer le projet

1. Va sur https://supabase.com → **Start for free**
2. **New Project** :
   ```
   Name     : auth-demo
   Password : un mot de passe fort (note-le !)
   Region   : West EU (ou le plus proche)
   ```
3. Attends ~2 minutes.

### Récupérer la DATABASE_URL

```
Settings → Database → Connection string → URI
```

Elle ressemble à :
```
postgresql://postgres:[MOT-DE-PASSE]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
```

---

## PARTIE 3 — Credentials Google & GitHub

### Google

1. https://console.cloud.google.com → nouveau projet `auth-demo`
2. **APIs & Services** → **OAuth consent screen**
   - User Type : **External**
   - App name : `auth-demo`, ton email → Save
3. **APIs & Services** → **Credentials** → **+ Create Credentials** → **OAuth Client ID**
   - Type : **Web application**
   - Authorized redirect URIs :
     ```
     http://localhost:3000/api/auth/callback/google
     ```
4. Copie `CLIENT_ID` et `CLIENT_SECRET`

### GitHub

1. https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**
   ```
   Application name       : auth-demo
   Homepage URL           : http://localhost:3000
   Authorization callback : http://localhost:3000/api/auth/callback/github
   ```
2. Copie `CLIENT_ID` et génère un `CLIENT_SECRET`

---

## PARTIE 4 — Création du projet Next.js

```bash
npx create-next-app@latest auth-demo --typescript --app --no-src-dir
cd auth-demo
```

### Installation des dépendances

```bash
npm install next-auth @prisma/client @auth/prisma-adapter
npm install react-icons
npm install -D prisma
```

### Initialiser Prisma

```bash
npx prisma init
```

Cela crée :
```
auth-demo/
├── prisma/
│   └── schema.prisma   ← ton schéma de BDD
└── .env                ← tes variables d'environnement
```

---

## PARTIE 5 — Configuration
