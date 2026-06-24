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

### .env

```env
# Supabase
DATABASE_URL="postgresql://postgres:[MOT-DE-PASSE]@db.xxxxxxxxxxxx.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=une-chaine-aleatoire-longue-ici

# Google
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx

# GitHub
GITHUB_CLIENT_ID=xxxxx
GITHUB_CLIENT_SECRET=xxxxx
```

> Pour générer un NEXTAUTH_SECRET :
> ```bash
> openssl rand -base64 32
> ```

---

## PARTIE 6 — Schéma Prisma

Remplace tout le contenu de `prisma/schema.prisma` :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Table des comptes OAuth (Google, GitHub...)
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

// Table des sessions actives
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Table des utilisateurs
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}

// Table pour la vérification email (requis par NextAuth)
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### Envoyer le schéma à Supabase

```bash
npx prisma db push
```

Prisma crée toutes les tables dans ta BDD Supabase automatiquement.

### Générer le client Prisma

```bash
npx prisma generate
```

---

## PARTIE 7 — Code Next.js

### lib/prisma.ts

Ce fichier crée une instance unique de Prisma (important en dev pour éviter trop de connexions) :

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

---

### app/api/auth/[...nextauth]/route.ts

C'est le cœur de NextAuth. Il utilise l'adapter Prisma pour tout gérer en BDD automatiquement.

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
  // L'adapter Prisma gère tout en BDD automatiquement
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Ajoute le provider dans la session pour l'afficher côté client
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id       = user.id
        // Récupère le provider depuis la table Account
        const account = await prisma.account.findFirst({
          where: { userId: user.id },
          select: { provider: true },
        })
        ;(session.user as any).provider = account?.provider ?? ''
      }
      return session
    },
  },

  pages: {
    signIn: '/',   // notre page de login custom
  },
})

export { handler as GET, handler as POST }
```

---

### app/SessionWrapper.tsx

```typescript
// app/SessionWrapper.tsx
'use client'
