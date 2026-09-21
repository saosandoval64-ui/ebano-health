# 🚀 DEPLOY ÉBANO HEARST

## Opción 1: RAILWAY (MÁS SIMPLE - RECOMENDADO)

1. Ir a https://railway.app
2. Click "Start a New Project"
3. "Deploy from GitHub"
4. Seleccionar `saosandoval64-ui/ebano-health`
5. Railway va a detectar Next.js automáticamente
6. Ir a "Variables" y agregar:
   ```
   DATABASE_URL=postgresql://postgres.tctmlkrsdzbiqsofefcf:Ssao2004sp2004@aws-0-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require
   NEXTAUTH_SECRET=afc336c14b5d89800b596f7f353912dc1e3497d21c68c52ba8231665c8ad10ca
   NEXTAUTH_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
   NEXT_PUBLIC_SUPABASE_URL=https://tctmlkrsdzbiqsofefcf.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_pKhLnS7zbvBPVy5eq739IQ_jw9v9Rwt
   ```
7. Click "Deploy"
8. Listo — auto-redeploya en cada push a GitHub

---

## Opción 2: VERCEL

1. Ir a https://vercel.com/new
2. "Import Git Repository"
3. Seleccionar `saosandoval64-ui/ebano-health`
4. En "Environment Variables" agregar las mismas 5 variables de arriba
5. Click "Deploy"
6. Listo — auto-redeploya en cada push a GitHub

---

## Antes de deployar: Correr migraciones (LOCAL)

En tu máquina (una sola vez):
```bash
npx prisma migrate deploy
```

Esto crea las tablas en Supabase (Conversation, Message, etc.)

---

## Variables (COPIA-PEGA)

```
DATABASE_URL=postgresql://postgres.tctmlkrsdzbiqsofefcf:Ssao2004sp2004@aws-0-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require
NEXTAUTH_SECRET=afc336c14b5d89800b596f7f353912dc1e3497d21c68c52ba8231665c8ad10ca
NEXTAUTH_URL=https://[RAILWAY_PUBLIC_DOMAIN o tu_dominio_vercel]
NEXT_PUBLIC_SUPABASE_URL=https://tctmlkrsdzbiqsofefcf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_pKhLnS7zbvBPVy5eq739IQ_jw9v9Rwt
```

---

## ¿Problemas?

- Si Prisma falla: asegúrate de haber corrido `npx prisma migrate deploy` en tu máquina
- Si auth falla: verifica que DATABASE_URL esté bien copiada
- Si Supabase storage falla: verificá que el bucket `medical-documents` exista en Supabase

---

**TL;DR:** Railway → GitHub → Variables → Deploy → Done
