# PropTrack — Setup Guide

## Step 1: Supabase (Database + Auth)

1. Go to supabase.com → create account → New Project → name it "proptrack"
2. Wait for it to load (~2 min)
3. Go to **Database → SQL Editor → New Query**
4. Paste the entire contents of `supabase_schema.sql` → click Run
5. Go to **Settings → API** and copy:
   - Project URL → paste into `.env` as `VITE_SUPABASE_URL`
   - anon public key → paste into `.env` as `VITE_SUPABASE_ANON_KEY`

## Step 2: Create .env file

Copy `.env.example` to `.env` and fill in your values:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Step 3: Install and run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Step 4: Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → import your GitHub repo
3. Add your environment variables in Vercel's project settings (same as .env)
4. Deploy → you get a live URL instantly

## Step 5: Custom domain (optional)

In Vercel → Domains → add your domain (e.g. proptrackapp.com)
Update your DNS to point to Vercel.

## Step 6: Stripe (payments — do this when ready to charge)

1. Go to stripe.com → create account
2. Create 3 products: Starter ($19/mo), Pro ($39/mo), Lifetime ($299 one-time)
3. Copy the price IDs into `src/lib/firms.js` PLANS array (priceId fields)
4. Copy your publishable key into .env as `VITE_STRIPE_PUBLISHABLE_KEY`
5. Set up a Stripe webhook to update user plans in Supabase when subscriptions change

## Notes

- The app works fully without Stripe for now — users just get "Pro" access by default during beta
- Add Stripe when you're ready to actually charge people
- The `supabase_schema.sql` sets up Row Level Security so users can only see their own data
