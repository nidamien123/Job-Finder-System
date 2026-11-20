# SmartJob Rwanda

A React + Vite recruitment platform for job seekers and employers in Rwanda, using Supabase for authentication, PostgreSQL and private file storage.

## Run locally

1. Install Node.js 20+ and run `npm install`.
2. Copy `.env.example` to `.env.local` and set your Supabase project URL and **anon/publishable key**. Never put a Supabase service-role/secret key in a `VITE_` variable.
3. Run `npm run dev`; create a production build with `npm run build`.

## Connect the Supabase project

The project URL for the supplied Supabase project is `https://yagxsvkljellcapdknlk.supabase.co`. Get its anon/publishable key from **Supabase Dashboard → Project Settings → API Keys** and keep it out of source control. Configure these values in `.env.local` locally and in Vercel's project environment-variable settings:

- `VITE_SUPABASE_URL=https://yagxsvkljellcapdknlk.supabase.co`
- `VITE_SUPABASE_ANON_KEY=<your public anon/publishable key>`

In the Supabase SQL Editor, run `supabase/schema.sql`, then `supabase/001_security_and_auth.sql`. The second script creates signup profiles, protects role assignment, makes CV storage private, and tightens policies. If you already ran a previous schema in a live project, back it up and review the SQL before applying changes.

Enable email/password authentication in Supabase Auth. For local/Vercel auth redirects, add the app's local and deployed URLs to **Authentication → URL Configuration**. Only create administrator accounts by changing their profile role through a trusted Supabase SQL Editor/admin process; never expose a service-role key in the browser.

CV bucket: the migration creates the private `candidate-cvs` bucket with a 5 MiB PDF limit and user-folder policies. Store objects under `<auth-user-uuid>/<filename>.pdf`. Private CV downloads must use authorized access or signed URLs.

## Deploy to Vercel

1. Import `nidamien123/Job-Finder-System` at `https://vercel.com/damien-tuyizere` (or use **Add New → Project** in the account).
2. Keep the Vite defaults: build command `npm run build`, output directory `dist`. `vercel.json` includes SPA routing for React Router.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel project settings for Preview and Production. Do not add a service-role key.
4. Deploy. If this GitHub repository is connected to the Vercel project, pushes to the configured production branch trigger a deployment; otherwise deploy from the Vercel import/project UI or Vercel CLI.
5. Add the final Vercel domain to Supabase Auth's allowed redirect URLs.

## Important

A Git push alone cannot create a Supabase database or a Vercel project deployment. This repository contains the SQL and Vercel configuration, but applying the SQL and setting the project secrets/deploying require access to your Supabase and Vercel accounts. The UI displays a setup notice until Supabase environment variables are configured.
