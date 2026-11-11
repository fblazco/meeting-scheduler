# Meeting Scheduler — Backend

Express + TypeScript + Sequelize + PostgreSQL API.

## Local development

```bash
npm install
cp .env.example .env   # fill in your values
npm run dev            # http://localhost:5001/api
```

`npm run dev` syncs the schema automatically (with `alter` outside production).

## Deploy to Vercel

1. **Database** — create a Postgres database (e.g. Neon from Vercel's Storage → Marketplace) and copy its connection string.
2. **Create the tables once** from your machine, pointing at the production database:
   ```bash
   DATABASE_URL="<neon-url>" NODE_ENV=production npm run db:sync
   ```
   Use `npm run db:sync -- --alter` later to apply model changes to existing tables.
3. **Vercel project** — *Add New → Project*, import the repo, and set:
   - **Root Directory:** `backend`
   - **Framework Preset:** `Express` (it picks up the default export of `src/app.ts`)
   - Build / Output / Install commands: leave as default
4. **Environment variables** (Project → Settings → Environment Variables):

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | Neon connection string |
   | `JWT_SECRET` | long random string (required in production) |
   | `JWT_EXPIRES_IN` | e.g. `7d` (optional) |
   | `NODE_ENV` | `production` |

5. Deploy and check `https://<your-backend>.vercel.app/api/health`.
6. In the frontend project, set `VITE_API_URL=https://<your-backend>.vercel.app/api`.

Note: on Vercel the API runs as a serverless function, so `src/server.ts` (`app.listen` + `sync`) is only used locally.
