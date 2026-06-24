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
