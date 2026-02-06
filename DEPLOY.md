# ∞8 ARCH - Vercel Deployment Guide

## ✅ Pre-Deployment Checklist
- [x] RainbowKit theme updated (brutalist)
- [x] Prisma schema configured for PostgreSQL
- [x] All code committed to GitHub

---

## 🚀 Deployment Steps (15 minutes)

### Step 1: Deploy to Vercel

1. Go to https://vercel.com/new
2. Sign in with GitHub using `bomac1193@gmail.com`
3. Import repository: `bomac1193/O8`
4. **Framework Preset**: Next.js (auto-detected)
5. **Root Directory**: `frontend`
6. Click **Deploy** (will fail - needs env vars, that's OK)

---

### Step 2: Add Vercel Postgres Database

1. In Vercel project dashboard → **Storage** tab
2. Click **Create Database** → **Postgres**
3. Database name: `o8-declarations-db`
4. Click **Create**
5. ✅ Vercel automatically adds `DATABASE_URL` to environment variables

---

### Step 3: Run Prisma Migration

After Postgres is created, run migration in Vercel:

1. Go to **Settings** → **Environment Variables**
2. Copy the `DATABASE_URL` value
3. In your local terminal:

```bash
cd /home/sphinxy/o8/frontend
DATABASE_URL="<paste-vercel-postgres-url>" npx prisma db push
```

This creates the Declaration, LicenseRequest, and RewardHistory tables.

---

### Step 4: Add Required Environment Variables

Go to **Settings** → **Environment Variables** in Vercel and add:

#### 🔑 Already Configured (from Vercel Postgres)
- `DATABASE_URL` ✓ (auto-added by Vercel Postgres)

#### 🔑 Need to Add Manually

**1. Pinata (IPFS Storage)**

Get free API key from https://app.pinata.cloud/developers/api-keys

```
NEXT_PUBLIC_PINATA_JWT=<your-pinata-jwt>
```

**2. WalletConnect Project ID**

Get free project ID from https://cloud.walletconnect.com/sign-in

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<your-project-id>
```

**3. Alchemy RPC URL (for Polygon Amoy testnet)**

Get free API key from https://dashboard.alchemy.com/

```
NEXT_PUBLIC_ALCHEMY_AMOY_URL=https://polygon-amoy.g.alchemy.com/v2/<your-api-key>
```

**4. Contract Addresses (Optional - can deploy contracts later)**

Leave these empty for now:

```
NEXT_PUBLIC_O8_REGISTRY_ADDRESS=
NEXT_PUBLIC_O8_TOKEN_ADDRESS=
NEXT_PUBLIC_O8_SCORE_ADDRESS=
```

---

### Step 5: Redeploy

1. After adding all environment variables
2. Go to **Deployments** tab
3. Click **⋯** on latest deployment → **Redeploy**
4. Wait 2-3 minutes for build to complete

---

## ✅ Post-Deployment Checklist

- [ ] Site loads at `<your-app>.vercel.app`
- [ ] Homepage displays ∞8 ARCH branding
- [ ] Wallet connect button works (RainbowKit modal opens)
- [ ] Can navigate to `/new` (declaration form)
- [ ] Can navigate to `/gallery` (empty for now - that's OK)

---

## 🔧 Environment Variables Summary

| Variable | Where to Get | Required? |
|----------|-------------|-----------|
| `DATABASE_URL` | Vercel Postgres (auto-added) | ✅ Yes |
| `NEXT_PUBLIC_PINATA_JWT` | https://app.pinata.cloud | ✅ Yes (for IPFS uploads) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | https://cloud.walletconnect.com | ✅ Yes (for wallet connect) |
| `NEXT_PUBLIC_ALCHEMY_AMOY_URL` | https://dashboard.alchemy.com | ✅ Yes (for blockchain reads) |
| `NEXT_PUBLIC_O8_REGISTRY_ADDRESS` | Deploy smart contracts | ⏸️ Later |
| `NEXT_PUBLIC_O8_TOKEN_ADDRESS` | Deploy smart contracts | ⏸️ Later |
| `NEXT_PUBLIC_O8_SCORE_ADDRESS` | Deploy smart contracts | ⏸️ Later |

---

## 🎯 Custom Domain (Later)

Once you acquire `inf8.io`:

1. Go to **Settings** → **Domains** in Vercel
2. Add `inf8.io` and `www.inf8.io`
3. Update DNS records at your registrar (Vercel shows exact records needed)

---

## 💰 Monetization Timeline (Agreed Strategy)

```
NOW (v1.0):        100% FREE
                   - No paywall, no limits
                   - Goal: 1,000 declarations

Month 3 (v1.5):    Freemium GBP
                   - Free: Unlimited declarations (always)
                   - Pro (£8/mo): Badges 🏷️👥, export API
                   - Label (£79/mo): Team accounts, white-label

Month 6+ (v2.0):   Badge Marketplace
                   - One-time badge purchases (£15-50)
                   - Status signaling for non-subscribers

Year 2 (v3.0):     On-chain minting fees
                   - Optional $1-5 for permanent blockchain storage
```

**Currency**: GBP primary (London-based), show $ equivalent

---

## 📊 Success Metrics (First 30 Days)

- [ ] 100 declarations created
- [ ] 10 "showcase tracks" in gallery (complex workflows)
- [ ] 5 producer testimonials
- [ ] Featured in 1 music production blog/podcast

---

**Last updated:** 2026-02-06
**Status:** Ready to deploy
**Next:** Get Pinata + WalletConnect + Alchemy API keys
