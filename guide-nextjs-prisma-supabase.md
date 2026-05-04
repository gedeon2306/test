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

import { SessionProvider } from 'next-auth/react'

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}
```

---

### app/layout.tsx

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import SessionWrapper from './SessionWrapper'
import './globals.css'

export const metadata: Metadata = {
  title: 'Auth Demo',
  description: 'OAuth avec NextAuth + Prisma + Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  )
}
```

---

### app/page.tsx — Page de login

```typescript
// app/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export default function LoginPage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f0f0f',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: '20px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Icône */}
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', marginBottom: '20px',
        }}>
          🔐
        </div>

        <h1 style={{
          color: '#f5f5f5', fontSize: '22px', fontWeight: '600',
          margin: '0 0 8px', textAlign: 'center',
        }}>
          Bienvenue
        </h1>
        <p style={{
          color: '#666', fontSize: '14px',
          margin: '0 0 36px', textAlign: 'center',
        }}>
          Connecte-toi pour accéder à ton espace
        </p>

        {/* Bouton Google */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          style={{
            width: '100%', padding: '13px 20px',
            background: '#fff', border: 'none', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', cursor: 'pointer', fontSize: '14px',
            fontWeight: '500', color: '#1a1a1a', marginBottom: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <FcGoogle size={20} />
          Continuer avec Google
        </button>

        {/* Bouton GitHub */}
        <button
          onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          style={{
            width: '100%', padding: '13px 20px',
            background: '#24292e', border: '1px solid #3a3a3a',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', cursor: 'pointer', fontSize: '14px',
            fontWeight: '500', color: '#f5f5f5',
          }}
        >
          <FaGithub size={20} />
          Continuer avec GitHub
        </button>

        <p style={{
          color: '#444', fontSize: '12px',
          marginTop: '28px', textAlign: 'center',
        }}>
          En te connectant, tu acceptes nos conditions d'utilisation
        </p>
      </div>
    </main>
  )
}
```

---

### app/dashboard/page.tsx — Page profil

```typescript
// app/dashboard/page.tsx
'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FaGithub, FaSignOutAlt, FaEnvelope, FaUser } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <main style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: '#0f0f0f',
      }}>
        <p style={{ color: '#555', fontFamily: 'system-ui' }}>Chargement...</p>
      </main>
    )
  }

  if (!session) return null

  const user     = session.user
  const provider = (user as any).provider as string

  return (
    <main style={{
      minHeight: '100vh', background: '#0f0f0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* Header carte */}
        <div style={{
          background: '#1a1a1a', border: '1px solid #2a2a2a',
          borderRadius: '20px', padding: '32px',
          marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '20px',
        }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {user?.image ? (
              <img src={user.image} alt="avatar" style={{
                width: '72px', height: '72px', borderRadius: '50%',
                border: '3px solid #2a2a2a',
              }} />
            ) : (
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', color: '#fff', fontWeight: '600',
              }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            {/* Badge provider */}
            <div style={{
              position: 'absolute', bottom: '-2px', right: '-2px',
              width: '22px', height: '22px', borderRadius: '50%',
              background: provider === 'github' ? '#24292e' : '#fff',
              border: '2px solid #1a1a1a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {provider === 'google'
                ? <FcGoogle size={13} />
                : <FaGithub size={13} color="#f5f5f5" />
              }
            </div>
          </div>

          <div>
            <p style={{
              color: '#f5f5f5', fontSize: '20px',
              fontWeight: '600', margin: '0 0 4px',
            }}>
              {user?.name}
            </p>
            <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>
              Connecté via {provider === 'google' ? 'Google' : 'GitHub'}
            </p>
          </div>
        </div>

        {/* Infos */}
        <div style={{
          background: '#1a1a1a', border: '1px solid #2a2a2a',
          borderRadius: '20px', overflow: 'hidden', marginBottom: '16px',
        }}>
          {[
            { icon: <FaEnvelope size={14} color="#6366f1" />, label: 'Email', value: user?.email },
            { icon: <FaUser    size={14} color="#6366f1" />, label: 'Nom',   value: user?.name  },
          ].map((item, i) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center',
              padding: '16px 24px', gap: '14px',
              borderBottom: i === 0 ? '1px solid #222' : 'none',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(99,102,241,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.icon}
              </div>
              <div>
                <p style={{
                  color: '#555', fontSize: '11px',
                  margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  {item.label}
                </p>
                <p style={{ color: '#e5e5e5', fontSize: '14px', margin: 0, fontWeight: '500' }}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Déconnexion */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{
            width: '100%', padding: '14px',
            background: 'transparent', border: '1px solid #3a1a1a',
            borderRadius: '12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', color: '#e05a5a', fontSize: '14px', fontWeight: '500',
          }}
        >
          <FaSignOutAlt size={14} />
          Se déconnecter
        </button>
      </div>
    </main>
  )
}
```

---

## PARTIE 8 — Lancer le projet

```bash
npm run dev
```

Ouvre **http://localhost:3000**

---

## PARTIE 9 — Flux complet

```
1. Clic "Login Google"  sur localhost:3000
        ↓
2. NextAuth redirige vers Google
        ↓
3. L'utilisateur accepte
        ↓
4. Google redirige vers localhost:3000/api/auth/callback/google
        ↓
5. NextAuth reçoit le profil
        ↓
6. Prisma Adapter crée automatiquement le User + Account dans Supabase
        ↓
7. NextAuth crée une session dans la table Session
        ↓
8. Redirection vers /dashboard
        ↓
9. useSession() retourne le profil → affiché à l'écran
```

---

## PARTIE 10 — Structure finale des fichiers

```
auth-demo/
├── .env
├── prisma/
│   └── schema.prisma
├── lib/
│   └── prisma.ts
└── app/
    ├── layout.tsx
    ├── globals.css
    ├── SessionWrapper.tsx
    ├── page.tsx                         ← login
    ├── dashboard/
    │   └── page.tsx                     ← profil
    └── api/
        └── auth/
            └── [...nextauth]/
                └── route.ts             ← cœur NextAuth
```

## Vérifier les données dans Supabase

Après ta première connexion, va dans :
```
Supabase → Table Editor
```
Tu verras tes tables **User**, **Account**, **Session** remplies automatiquement par Prisma.
