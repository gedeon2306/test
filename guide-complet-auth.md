# Guide complet — Authentification OAuth avec Next.js, NextAuth, Prisma & Supabase

> Ce guide explique **tout** de A à Z : pourquoi on fait chaque chose, comment ça fonctionne,
> et tout le code nécessaire. Lis-le dans l'ordre, chaque partie s'appuie sur la précédente.

---

## Table des matières

- [Guide complet — Authentification OAuth avec Next.js, NextAuth, Prisma \& Supabase](#guide-complet--authentification-oauth-avec-nextjs-nextauth-prisma--supabase)
  - [Table des matières](#table-des-matières)
  - [1. C'est quoi OAuth ?](#1-cest-quoi-oauth-)
    - [Le principe en 3 étapes](#le-principe-en-3-étapes)
    - [Pourquoi c'est bien ?](#pourquoi-cest-bien-)
    - [OAuth vs ta propre auth](#oauth-vs-ta-propre-auth)
  - [2. Architecture du projet](#2-architecture-du-projet)
  - [3. Les technologies utilisées](#3-les-technologies-utilisées)
    - [Next.js](#nextjs)
    - [NextAuth.js](#nextauthjs)
    - [Prisma](#prisma)
    - [Supabase](#supabase)
    - [react-icons](#react-icons)
  - [4. Prérequis](#4-prérequis)
    - [Node.js 18+](#nodejs-18)
    - [Git](#git)
    - [Comptes nécessaires](#comptes-nécessaires)
  - [5. Création du projet Next.js](#5-création-du-projet-nextjs)
  - [6. Supabase — la base de données](#6-supabase--la-base-de-données)
    - [Créer un compte et un projet](#créer-un-compte-et-un-projet)
    - [Récupérer la DATABASE\_URL](#récupérer-la-database_url)
  - [7. Google Cloud — Credentials](#7-google-cloud--credentials)
    - [Étape 1 — Créer un projet](#étape-1--créer-un-projet)
    - [Étape 2 — Configurer l'écran de consentement OAuth](#étape-2--configurer-lécran-de-consentement-oauth)
    - [Étape 3 — Créer les credentials](#étape-3--créer-les-credentials)
  - [8. GitHub — Credentials](#8-github--credentials)
  - [9. Installation des dépendances](#9-installation-des-dépendances)
    - [Initialiser Prisma](#initialiser-prisma)
  - [10. Configuration Prisma](#10-configuration-prisma)
    - [prisma/schema.prisma](#prismaschemaprisma)
    - [prisma/prisma.config.ts](#prismaprismaconfigts)
    - [Envoyer le schéma à Supabase](#envoyer-le-schéma-à-supabase)
    - [Générer le client Prisma](#générer-le-client-prisma)
  - [11. Variables d'environnement](#11-variables-denvironnement)
  - [12. Code — lib/prisma.ts](#12-code--libprismats)
  - [13. Code — NextAuth route.ts](#13-code--nextauth-routets)
  - [14. Code — SessionWrapper.tsx](#14-code--sessionwrappertsx)
  - [15. Code — layout.tsx](#15-code--layouttsx)
  - [16. Code — page.tsx (Login)](#16-code--pagetsx-login)
  - [17. Code — dashboard/page.tsx](#17-code--dashboardpagetsx)
  - [18. Lancer le projet](#18-lancer-le-projet)
    - [Vérifier que tout fonctionne](#vérifier-que-tout-fonctionne)
    - [Voir les données dans Supabase](#voir-les-données-dans-supabase)
  - [19. Le flux complet expliqué](#19-le-flux-complet-expliqué)
  - [20. Structure finale des fichiers](#20-structure-finale-des-fichiers)
  - [21. Les tables Supabase expliquées](#21-les-tables-supabase-expliquées)
    - [Table `User`](#table-user)
    - [Table `Account`](#table-account)
    - [Table `Session`](#table-session)
    - [Relation entre les tables](#relation-entre-les-tables)
  - [22. Concepts clés à retenir](#22-concepts-clés-à-retenir)
    - [useSession()](#usesession)
    - [signIn()](#signin)
    - [signOut()](#signout)
    - [Prisma Adapter](#prisma-adapter)
    - [Client Component vs Server Component](#client-component-vs-server-component)
  - [23. Erreurs courantes et solutions](#23-erreurs-courantes-et-solutions)
    - [`redirect_uri_mismatch` (Google)](#redirect_uri_mismatch-google)
    - [`redirect_uri not associated` (GitHub)](#redirect_uri-not-associated-github)
    - [`OAuthAccountNotLinked`](#oauthaccountnotlinked)
    - [`PrismaClient is not configured`](#prismaclient-is-not-configured)
    - [Le bouton bloque après "retour arrière"](#le-bouton-bloque-après-retour-arrière)
    - [Session non disponible dans le dashboard](#session-non-disponible-dans-le-dashboard)

---

## 1. C'est quoi OAuth ?

OAuth (Open Authorization) est un protocole qui permet à un utilisateur de se connecter
à ton application **via un service tiers** (Google, GitHub...) sans jamais te donner son mot de passe.

### Le principe en 3 étapes

```
1. L'utilisateur clique "Se connecter avec Google"
        ↓
2. Il est redirigé vers Google, il accepte le partage de ses infos
        ↓
3. Google renvoie son profil (email, nom, photo) à ton application
```

### Pourquoi c'est bien ?

- **Sécurité** : tu ne stockes jamais de mot de passe dans ta BDD
- **Simplicité** : l'utilisateur n'a pas à créer un nouveau compte
- **Confiance** : les gens font confiance à Google/GitHub

### OAuth vs ta propre auth

| Auth classique | OAuth |
|---|---|
| Email + mot de passe | Email + token Google/GitHub |
| Tu stockes les mots de passe (risqué) | Tu ne stockes rien de sensible |
| L'utilisateur doit créer un compte | Il utilise un compte existant |
| Tu gères la sécurité toi-même | Google/GitHub gèrent la sécurité |

---

## 2. Architecture du projet

```
┌─────────────────────────────────────────────────┐
│                   Next.js                       │
│                                                 │
│  ┌─────────────┐    ┌──────────────────────┐    │
│  │   Pages     │    │      NextAuth        │    │
│  │             │    │                      │    │
│  │  / (login)  │    │  - Gère OAuth        │    │
│  │  /dashboard │    │  - Crée les sessions │    │
│  └─────────────┘    │  - Protège les routes│    │
│                     └──────────┬───────────┘    │
│                                │                │
│  ┌─────────────────────────────▼───────────┐    │
│  │              Prisma ORM                 │    │
│  │  - Parle à la BDD                       │    │
│  │  - Traduit le code en requêtes SQL      │    │
│  └─────────────────────────────┬───────────┘    │
└────────────────────────────────│────────────────┘
                                 │
                    ┌────────────▼───────────┐
                    │       Supabase         │
                    │  (PostgreSQL hébergé)  │
                    │                        │
                    │  Tables:               │
                    │  - User                │
                    │  - Account             │
                    │  - Session             │
                    └────────────────────────┘
```

**Résumé** :
- **Next.js** = le framework, gère les pages et l'API
- **NextAuth** = la bibliothèque qui gère tout OAuth
- **Prisma** = l'ORM qui parle à la base de données
- **Supabase** = la base de données PostgreSQL dans le cloud

---

## 3. Les technologies utilisées

### Next.js
Framework React pour créer des applications web. Il gère à la fois
le frontend (ce que l'utilisateur voit) et le backend (l'API).
Dans notre projet, on utilise l'**App Router** (le dossier `app/`).

### NextAuth.js
Bibliothèque d'authentification pour Next.js. Elle s'occupe de :
- Gérer le flux OAuth avec Google et GitHub
- Créer et gérer les sessions utilisateur
- Fournir des hooks comme `useSession()` pour accéder à l'utilisateur connecté

### Prisma
ORM (Object Relational Mapper) qui te permet d'interagir avec ta base de données
en TypeScript au lieu d'écrire du SQL brut.

Au lieu d'écrire :
```sql
SELECT * FROM "User" WHERE email = 'test@gmail.com';
```

Tu écris :
```typescript
prisma.user.findUnique({ where: { email: 'test@gmail.com' } })
```

### Supabase
Service hébergé qui fournit une base de données PostgreSQL gratuite dans le cloud.
Pas besoin d'installer PostgreSQL sur ta machine.

### react-icons
Bibliothèque d'icônes React. On utilise :
- `FcGoogle` → icône Google colorée
- `FaGithub` → icône GitHub
- `FaSignOutAlt` → icône déconnexion
- `FaEnvelope` → icône email
- `FaUser` → icône utilisateur

---

## 4. Prérequis

Avant de commencer, assure-toi d'avoir installé sur ta machine :

### Node.js 18+
Télécharge sur https://nodejs.org (choisis la version LTS)

Vérifie l'installation :
```bash
node --version    # doit afficher v18.x.x ou plus
npm --version     # doit afficher 9.x.x ou plus
```

### Git
Télécharge sur https://git-scm.com

Vérifie :
```bash
git --version
```

### Comptes nécessaires
- **Supabase** → https://supabase.com (gratuit)
- **Google Cloud** → https://console.cloud.google.com (gratuit)
- **GitHub** → https://github.com (tu en as déjà un)

---

## 5. Création du projet Next.js

Ouvre un terminal et exécute :

```bash
npx create-next-app@latest auth-demo --typescript --app --no-src-dir
```

**Explication des options :**
- `auth-demo` → le nom du dossier/projet
- `--typescript` → utilise TypeScript (meilleur que JS pour détecter les erreurs)
- `--app` → utilise l'App Router (la nouvelle façon de faire dans Next.js)
- `--no-src-dir` → les fichiers sont directement dans `app/` sans dossier `src/`

Quand il te pose des questions :
```
Would you like to use Tailwind CSS? → No (on utilise des styles inline)
Would you like to customize the import alias? → No
```

Ensuite entre dans le dossier :
```bash
cd auth-demo
```

---

## 6. Supabase — la base de données

### Créer un compte et un projet

1. Va sur https://supabase.com → **Start for free**
2. Connecte-toi avec GitHub (plus rapide)
3. Clique **New Project**
4. Remplis :
   ```
   Organization : ton nom ou "Personal"
   Name         : auth-demo
   Database Password : choisis un mot de passe fort (note-le !)
   Region       : West EU (le plus proche)
   ```
5. Attends environ 2 minutes que le projet se crée

### Récupérer la DATABASE_URL

Une fois le projet créé :
```
Settings (icône engrenage) → Database → Connection string → URI
```

Tu verras quelque chose comme :
```
postgresql://postgres:[TON-MOT-DE-PASSE]@db.abcdefghijkl.supabase.co:5432/postgres
```

**Important** : remplace `[TON-MOT-DE-PASSE]` par le mot de passe que tu as choisi.
Copie cette URL, tu en auras besoin dans le fichier `.env`.

---

## 7. Google Cloud — Credentials

### Étape 1 — Créer un projet

1. Va sur https://console.cloud.google.com
2. En haut à gauche, clique sur le sélecteur de projet
3. Clique **New Project**
4. Nom : `auth-demo` → **Create**

### Étape 2 — Configurer l'écran de consentement OAuth

C'est la page que l'utilisateur voit quand Google lui demande l'autorisation.

```
APIs & Services → OAuth consent screen
→ User Type : External → Create
→ App name : auth-demo
→ User support email : ton email
→ Developer contact email : ton email
→ Save and Continue (répète jusqu'à la fin)
```

### Étape 3 — Créer les credentials

```
APIs & Services → Credentials → + Create Credentials → OAuth Client ID
→ Application type : Web application
→ Name : auth-demo-web
→ Authorized redirect URIs → Add URI :
   http://localhost:3000/api/auth/callback/google
→ Create
```

Une popup apparaît avec :
```
Client ID     : xxxxxxxxx.apps.googleusercontent.com  ← copie ça
Client Secret : GOCSPX-xxxxxxxxx                      ← copie ça
```

> L'URI de callback pointe vers le port **3000** (Next.js).
> C'est NextAuth qui reçoit le retour de Google, pas un backend séparé.

---

## 8. GitHub — Credentials

C'est beaucoup plus simple que Google.

1. Va sur https://github.com/settings/developers
2. **OAuth Apps** → **New OAuth App**
3. Remplis :
   ```
   Application name         : auth-demo
   Homepage URL             : http://localhost:3000
   Authorization callback   : http://localhost:3000/api/auth/callback/github
   ```
4. **Register application**
5. Sur la page suivante :
   - Copie le **Client ID**
   - Clique **Generate a new client secret** → copie le **Client Secret**

---

## 9. Installation des dépendances

Dans le dossier `auth-demo`, installe tout ce dont on a besoin :

```bash
npm install next-auth @prisma/client @auth/prisma-adapter react-icons
npm install @prisma/adapter-pg pg
npm install -D prisma @types/pg
```

**Explication de chaque paquet :**

| Paquet | Rôle |
|---|---|
| `next-auth` | Gère OAuth, sessions, callbacks |
| `@prisma/client` | Le client généré par Prisma pour parler à la BDD |
| `@auth/prisma-adapter` | Connecte NextAuth à Prisma (crée les users auto) |
| `react-icons` | Les icônes Google, GitHub, etc. |
| `@prisma/adapter-pg` | Adapter PostgreSQL pour Prisma v7 |
| `pg` | Driver PostgreSQL pour Node.js |
| `prisma` | L'outil CLI de Prisma (génération, migrations) |
| `@types/pg` | Types TypeScript pour pg |

### Initialiser Prisma

```bash
npx prisma init
```

Cela crée :
- `prisma/schema.prisma` → définit la structure de ta BDD
- `prisma/prisma.config.ts` → configuration de la connexion (Prisma v7)
- `.env` → tes variables d'environnement

---

## 10. Configuration Prisma

### prisma/schema.prisma

Ce fichier décrit la **structure de ta base de données**.
Remplace tout son contenu par ceci :

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

// Table des comptes OAuth
// Chaque fois qu'un user se connecte via Google ou GitHub,
// une ligne est créée ici avec les infos du provider
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String        // "google" ou "github"
  providerAccountId String        // l'ID de l'utilisateur chez Google/GitHub
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
// Chaque utilisateur connecté a une session ici
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Table des utilisateurs
// Un utilisateur = une ligne, peu importe le provider utilisé
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?           // URL de l'avatar
  accounts      Account[]         // ses comptes OAuth liés
  sessions      Session[]         // ses sessions actives
}

// Table pour la vérification d'email
// Requise par NextAuth même si on ne l'utilise pas directement
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

**Pourquoi ces 4 tables ?**
- `User` → les informations de base de l'utilisateur
- `Account` → les connexions OAuth (un user peut avoir Google ET GitHub liés)
- `Session` → les sessions actives (qui est connecté en ce moment)
- `VerificationToken` → requis par NextAuth (pour la vérification email si besoin)

### prisma/prisma.config.ts

Prisma v7 utilise ce fichier pour la configuration.
Il est généré automatiquement par `npx prisma init` et doit ressembler à ça :

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

### Envoyer le schéma à Supabase

```bash
npx prisma db push
```

Cette commande lit ton `schema.prisma` et **crée les tables dans Supabase**.

### Générer le client Prisma

```bash
npx prisma generate
```

Cela génère le code TypeScript qui te permet d'utiliser Prisma dans ton projet.

---

## 11. Variables d'environnement

Crée ou modifie le fichier `.env` à la racine du projet :

```env
# Base de données Supabase
DATABASE_URL="postgresql://postgres:[TON-MOT-DE-PASSE]@db.xxxx.supabase.co:5432/postgres"

# NextAuth — URL de ton app
NEXTAUTH_URL=http://localhost:3000

# NextAuth — clé secrète pour signer les sessions
# Génère-en une avec : openssl rand -base64 32
NEXTAUTH_SECRET=une-chaine-aleatoire-tres-longue-ici

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# GitHub OAuth
GITHUB_CLIENT_ID=xxxxx
GITHUB_CLIENT_SECRET=xxxxx
```

**Pourquoi NEXTAUTH_SECRET ?**
NextAuth utilise cette clé pour signer (chiffrer) les cookies de session.
Sans elle, quelqu'un pourrait falsifier une session.

Pour générer une clé sécurisée :
```bash
openssl rand -base64 32
```

> Ne commite JAMAIS le fichier `.env` sur GitHub !
> Ajoute-le dans `.gitignore` : `echo ".env" >> .gitignore`

---

## 12. Code — lib/prisma.ts

Crée le dossier `lib` et le fichier `lib/prisma.ts` :

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Ce pattern évite de créer trop de connexions en développement.
// Next.js recharge les modules à chaque modification,
// sans ça on créerait une nouvelle connexion à chaque reload.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Crée l'adapter PostgreSQL avec l'URL de connexion
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
})

// Crée le client Prisma (ou réutilise celui déjà créé)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

// En développement, on sauvegarde l'instance dans globalThis
// pour éviter de recréer une connexion à chaque hot-reload
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

**Pourquoi ce fichier ?**
Prisma a besoin d'une seule instance pour toute l'application.
Si on créait une nouvelle instance à chaque import, on aurait
trop de connexions ouvertes vers la base de données.

---

## 13. Code — NextAuth route.ts

C'est **le fichier le plus important**. Il configure toute l'authentification.

Crée les dossiers et le fichier `app/api/auth/[...nextauth]/route.ts` :

```typescript
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
  // L'adapter Prisma gère automatiquement :
  // - La création du User en BDD lors de la première connexion
  // - La création de l'Account (lien entre User et provider)
  // - La création et suppression des Sessions
  adapter: PrismaAdapter(prisma),

  providers: [
    // Configuration du provider Google
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Permet de lier Google et GitHub sur le même email
      allowDangerousEmailAccountLinking: true,
    }),
    // Configuration du provider GitHub
    GithubProvider({
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // Permet de lier Google et GitHub sur le même email
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    // Ce callback est appelé à chaque fois que useSession() est utilisé.
    // Il te permet d'ajouter des infos supplémentaires dans la session.
    async session({ session, user }) {
      if (session.user) {
        // Ajoute l'ID de l'utilisateur dans la session
        (session.user as any).id = user.id

        // Récupère le provider depuis la table Account
        // pour savoir si l'user s'est connecté via Google ou GitHub
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
    // Redirige vers notre page de login custom au lieu de celle de NextAuth
    signIn: '/',
  },
})

// Next.js App Router : on exporte le handler pour GET et POST
export { handler as GET, handler as POST }
```

**Explication du `[...nextauth]` dans le nom du dossier :**
C'est une route dynamique "catch-all" de Next.js. Elle capture toutes les URLs qui commencent par `/api/auth/` :
- `/api/auth/signin` → page de connexion
- `/api/auth/callback/google` → retour de Google
- `/api/auth/callback/github` → retour de GitHub
- `/api/auth/session` → infos de session
- `/api/auth/signout` → déconnexion

**Pourquoi `allowDangerousEmailAccountLinking` ?**
Par défaut, NextAuth refuse de connecter un compte si l'email existe déjà
via un autre provider (sécurité). Cette option l'autorise pour que le même
utilisateur puisse se connecter indifféremment via Google ou GitHub.

---

## 14. Code — SessionWrapper.tsx

Crée `app/SessionWrapper.tsx` :

```typescript
'use client'

import { SessionProvider } from 'next-auth/react'

// Ce composant enveloppe toute l'app avec le SessionProvider de NextAuth.
// Il rend useSession() disponible dans tous les composants enfants.
// Il doit être un Client Component ('use client') car il utilise
// le contexte React côté navigateur.
export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}
```

**Pourquoi un fichier séparé ?**
Le `layout.tsx` est un Server Component par défaut dans Next.js App Router.
Mais `SessionProvider` nécessite d'être dans un Client Component.
On crée donc ce wrapper pour séparer les responsabilités.

---

## 15. Code — layout.tsx

Modifie `app/layout.tsx` :

```typescript
import type { Metadata } from 'next'
import SessionWrapper from './SessionWrapper'
import './globals.css'

export const metadata: Metadata = {
  title: 'Auth Demo',
  description: 'Authentification OAuth avec NextAuth, Prisma et Supabase',
}

// RootLayout enveloppe toutes les pages de l'application.
// SessionWrapper rend la session disponible partout.
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

## 16. Code — page.tsx (Login)

Modifie `app/page.tsx` :

```typescript
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export default function LoginPage() {
  // Garde en mémoire quel provider est en cours de chargement
  // null = personne, 'google' = Google en cours, 'github' = GitHub en cours
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleSignIn = async (provider: string) => {
    setLoadingProvider(provider)
    // signIn redirige automatiquement vers Google ou GitHub
    // callbackUrl = où aller après une connexion réussie
    await signIn(provider, { callbackUrl: '/dashboard' })
    // Pas besoin de reset loadingProvider car la page va changer
  }

  // Composant spinner réutilisable
  const Spinner = ({ color = '#1a1a1a' }: { color?: string }) => (
    <div style={{
      width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
      border: `2px solid ${color}25`,       // bordure semi-transparente
      borderTop: `2px solid ${color}`,      // bordure du haut colorée = effet rotation
      animation: 'spin 0.7s linear infinite',
    }} />
  )

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f0f0f',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

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
          onClick={() => handleSignIn('google')}
          disabled={!!loadingProvider}
          style={{
            width: '100%', padding: '13px 20px',
            background: '#fff', border: 'none', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px',
            cursor: loadingProvider ? 'not-allowed' : 'pointer',
            fontSize: '14px', fontWeight: '500', color: '#1a1a1a',
            marginBottom: '12px',
            // Semi-transparent si l'autre provider est en cours
            opacity: loadingProvider && loadingProvider !== 'google' ? 0.5 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loadingProvider === 'google'
            ? <Spinner color="#1a1a1a" />
            : <FcGoogle size={20} />
          }
          {loadingProvider === 'google' ? 'Connexion en cours...' : 'Continuer avec Google'}
        </button>

        {/* Bouton GitHub */}
        <button
          onClick={() => handleSignIn('github')}
          disabled={!!loadingProvider}
          style={{
            width: '100%', padding: '13px 20px',
            background: '#24292e', border: '1px solid #3a3a3a', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px',
            cursor: loadingProvider ? 'not-allowed' : 'pointer',
            fontSize: '14px', fontWeight: '500', color: '#f5f5f5',
            opacity: loadingProvider && loadingProvider !== 'github' ? 0.5 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loadingProvider === 'github'
            ? <Spinner color="#f5f5f5" />
            : <FaGithub size={20} />
          }
          {loadingProvider === 'github' ? 'Connexion en cours...' : 'Continuer avec GitHub'}
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

## 17. Code — dashboard/page.tsx

Crée le dossier `app/dashboard/` et le fichier `app/dashboard/page.tsx` :

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FaGithub, FaSignOutAlt, FaEnvelope, FaUser } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

export default function DashboardPage() {
  // useSession() retourne :
  // - data (session) : les infos de l'utilisateur connecté (ou null)
  // - status : 'loading' | 'authenticated' | 'unauthenticated'
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  // Redirige vers la page de login si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  const handleSignOut = async () => {
    setLoggingOut(true)
    await signOut({ callbackUrl: '/' })
  }

  const Spinner = ({ color = '#e05a5a', size = 14 }: { color?: string; size?: number }) => (
    <div style={{
      width: `${size}px`, height: `${size}px`, borderRadius: '50%', flexShrink: 0,
      border: `2px solid ${color}25`,
      borderTop: `2px solid ${color}`,
      animation: 'spin 0.7s linear infinite',
    }} />
  )

  if (status === 'loading') {
    return (
      <main style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: '#0f0f0f',
      }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spinner color="#6366f1" size={32} />
          </div>
          <p style={{ color: '#555', fontSize: '14px', marginTop: '16px', fontFamily: 'system-ui' }}>
            Chargement...
          </p>
        </div>
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* Carte du haut : avatar + nom + provider */}
        <div style={{
          background: '#1a1a1a', border: '1px solid #2a2a2a',
          borderRadius: '20px', padding: '32px',
          marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '20px',
        }}>
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
            {/* Badge provider en bas à droite de l'avatar */}
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
            <p style={{ color: '#f5f5f5', fontSize: '20px', fontWeight: '600', margin: '0 0 4px' }}>
              {user?.name}
            </p>
            <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>
              Connecté via {provider === 'google' ? 'Google' : 'GitHub'}
            </p>
          </div>
        </div>

        {/* Carte du milieu : infos détaillées */}
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
                  color: '#555', fontSize: '11px', margin: '0 0 2px',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
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

        {/* Bouton de déconnexion */}
        <button
          onClick={handleSignOut}
          disabled={loggingOut}
          style={{
            width: '100%', padding: '14px',
            background: 'transparent', border: '1px solid #3a1a1a',
            borderRadius: '12px',
            cursor: loggingOut ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', color: '#e05a5a', fontSize: '14px', fontWeight: '500',
            opacity: loggingOut ? 0.7 : 1, transition: 'opacity 0.2s',
          }}
        >
          {loggingOut
            ? <Spinner color="#e05a5a" size={14} />
            : <FaSignOutAlt size={14} />
          }
          {loggingOut ? 'Déconnexion...' : 'Se déconnecter'}
        </button>

      </div>
    </main>
  )
}
```

---

## 18. Lancer le projet

```bash
npm run dev
```

Ouvre http://localhost:3000 dans ton navigateur.

### Vérifier que tout fonctionne

1. Tu vois la page de login avec les deux boutons
2. Clique sur "Continuer avec Google" → tu es redirigé vers Google
3. Accepte → tu reviens sur `/dashboard` avec ton profil affiché
4. Clique "Se déconnecter" → tu reviens sur la page de login

### Voir les données dans Supabase

```bash
npx prisma studio
```

Ouvre http://localhost:5555 — tu peux voir toutes tes tables et les données.

---

## 19. Le flux complet expliqué

Voici exactement ce qui se passe quand quelqu'un clique "Continuer avec Google" :

```
[1] L'utilisateur clique le bouton
        ↓
    signIn('google', { callbackUrl: '/dashboard' }) est appelé

[2] NextAuth redirige vers Google
        ↓
    https://accounts.google.com/o/oauth2/...
    avec client_id, scope (email + profil), redirect_uri

[3] L'utilisateur voit la page de consentement Google
        ↓
    "auth-demo veut accéder à votre nom et email"
    L'utilisateur clique "Autoriser"

[4] Google redirige vers notre app avec un code
        ↓
    http://localhost:3000/api/auth/callback/google?code=xxxxx

[5] NextAuth intercepte ce callback
        ↓
    Il échange le code contre un access_token auprès de Google
    Avec ce token, il appelle l'API Google pour récupérer le profil

[6] NextAuth reçoit le profil Google
        ↓
    { name: "Jean Dupont", email: "jean@gmail.com", image: "https://..." }

[7] Le Prisma Adapter crée les entrées en BDD
        ↓
    - Vérifie si un User avec cet email existe déjà
    - Si non : crée un nouveau User dans la table User
    - Crée un Account dans la table Account (lien User <-> Google)
    - Crée une Session dans la table Session

[8] NextAuth crée un cookie de session sécurisé
        ↓
    Un cookie chiffré est stocké dans le navigateur
    Il contient un token qui pointe vers la Session en BDD

[9] Redirection vers /dashboard
        ↓
    callbackUrl = '/dashboard'

[10] Le dashboard charge
        ↓
    useSession() lit le cookie → fait une requête vers /api/auth/session
    → NextAuth lit la Session en BDD → retourne les infos du User
    → Le composant affiche le profil
```

---

## 20. Structure finale des fichiers

```
auth-demo/
│
├── .env                          ← variables d'environnement (secret !)
├── .gitignore                    ← .env doit être dedans
├── package.json                  ← liste des dépendances
│
├── prisma/
│   ├── schema.prisma             ← structure de la BDD
│   └── prisma.config.ts          ← config connexion Prisma v7
│
├── lib/
│   └── prisma.ts                 ← instance unique du client Prisma
│
└── app/
    ├── globals.css               ← styles globaux
    ├── layout.tsx                ← layout racine avec SessionWrapper
    ├── SessionWrapper.tsx        ← Client Component pour SessionProvider
    │
    ├── page.tsx                  ← page de login (/)
    │
    ├── dashboard/
    │   └── page.tsx              ← page profil (/dashboard)
    │
    └── api/
        └── auth/
            └── [...nextauth]/
                └── route.ts      ← configuration NextAuth
```

---

## 21. Les tables Supabase expliquées

Après ta première connexion, va dans **Supabase → Table Editor** pour voir :

### Table `User`
```
id            : cuid_abc123        ← identifiant unique généré automatiquement
name          : Jean Dupont        ← nom récupéré de Google/GitHub
email         : jean@gmail.com     ← email récupéré de Google/GitHub
emailVerified : null               ← date de vérification email (pas utilisé ici)
image         : https://...        ← URL de la photo de profil
```

### Table `Account`
```
id                : cuid_def456
userId            : cuid_abc123    ← référence vers User.id
type              : oauth
provider          : google          ← 'google' ou 'github'
providerAccountId : 11234567890    ← ton ID chez Google
access_token      : ya29.xxx       ← token d'accès (expiré rapidement)
```

### Table `Session`
```
id           : cuid_ghi789
sessionToken : abc123xyz...        ← token stocké dans le cookie
userId       : cuid_abc123         ← référence vers User.id
expires      : 2025-06-01...       ← date d'expiration de la session
```

### Relation entre les tables
```
User (1) ──────< Account (N)    un user peut avoir Google ET GitHub liés
User (1) ──────< Session (N)    un user peut avoir plusieurs sessions actives
```

---

## 22. Concepts clés à retenir

### useSession()
Hook NextAuth pour accéder à la session dans un Client Component.

```typescript
const { data: session, status } = useSession()

// status peut être :
// 'loading'         → la session est en cours de chargement
// 'authenticated'   → l'utilisateur est connecté
// 'unauthenticated' → l'utilisateur n'est pas connecté

// session.user contient :
// name  : string       → nom complet
// email : string       → adresse email
// image : string       → URL de l'avatar
```

### signIn()
Fonction NextAuth pour déclencher la connexion.

```typescript
// Redirige vers Google et revient sur /dashboard après
signIn('google', { callbackUrl: '/dashboard' })

// Redirige vers GitHub
signIn('github', { callbackUrl: '/dashboard' })
```

### signOut()
Fonction NextAuth pour se déconnecter.

```typescript
// Supprime la session et redirige vers /
signOut({ callbackUrl: '/' })
```

### Prisma Adapter
La magie de ce projet. Sans écrire une seule ligne de code BDD,
il gère automatiquement la création des users, des accounts et des sessions.

### Client Component vs Server Component
Dans Next.js App Router :
- **Server Component** (par défaut) : s'exécute côté serveur, pas d'interactivité
- **Client Component** (`'use client'`) : s'exécute dans le navigateur, peut utiliser useState, useEffect

`useSession()`, `signIn()`, `signOut()` nécessitent un Client Component.

---

## 23. Erreurs courantes et solutions

### `redirect_uri_mismatch` (Google)
**Cause** : L'URI de callback dans Google Cloud ne correspond pas.
**Solution** : Dans Google Cloud Console, vérifie que l'URI autorisée est exactement :
```
http://localhost:3000/api/auth/callback/google
```

### `redirect_uri not associated` (GitHub)
**Cause** : L'URL de callback dans GitHub ne correspond pas.
**Solution** : Dans GitHub Developer Settings, vérifie :
```
http://localhost:3000/api/auth/callback/github
```

### `OAuthAccountNotLinked`
**Cause** : Tu essaies de te connecter avec un provider dont l'email existe déjà via un autre provider.
**Solution** : Ajoute `allowDangerousEmailAccountLinking: true` dans les providers (déjà fait dans notre code).

### `PrismaClient is not configured`
**Cause** : L'adapter Prisma v7 nécessite un adapter PG.
**Solution** : Vérifie que `lib/prisma.ts` utilise `PrismaPg` et que `schema.prisma` a `previewFeatures = ["driverAdapters"]`.

### Le bouton bloque après "retour arrière"
**Cause** : Le cache du navigateur conserve l'état du bouton.
**Solution** : Utilise `signIn(provider, { redirect: false })` et gère la redirection manuellement avec `useRouter`.

### Session non disponible dans le dashboard
**Cause** : `SessionProvider` absent ou mal placé.
**Solution** : Vérifie que `SessionWrapper` est bien dans `layout.tsx` et qu'il enveloppe `{children}`.

---

*Guide rédigé pour le projet auth-demo — Next.js 14 + NextAuth 4 + Prisma 7 + Supabase*
