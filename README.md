# SmartJob Rwanda

A modern job finder and recruitment management system built with React, Vite, Tailwind CSS and Supabase.

## Features
- Job seeker registration and profile management
- Employer job posting and applicant tracking
- Admin moderation dashboard
- Search, filtering, notifications and saved jobs
- Supabase-ready database schema and RLS policies
- Responsive design for mobile, tablet and desktop

## Tech stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Supabase PostgreSQL + Auth + Storage
- Icons: Lucide React

## Local setup
1. Install dependencies:
   npm install
2. Copy `.env.example` to `.env.local` and update Supabase settings.
3. Run the app:
   npm run dev
4. Build for production:
   npm run build

## Supabase setup
1. Create a new Supabase project.
2. Run the SQL in `supabase/schema.sql`.
3. Configure storage buckets for `profiles` and `companies`.
4. Update the environment variables.

## Deployment
This project is designed for Vercel deployment. Set the same environment values in Vercel project settings.
