# FTA Masterclass Landing Page — Setup Guide

## What This Is

A landing page for selling the FTA Masterclass ($37), with:
- Sales page with multiple purchase buttons
- Embedded Stripe checkout (buyer doesn't leave your site)
- Post-purchase access page with video embed + PDF download

## Quick Setup (5 minutes)

### 1. Stripe Setup

1. Go to https://dashboard.stripe.com
2. Copy your **Secret Key** from Developers > API Keys
   - Use `sk_test_...` for testing, `sk_live_...` when you're ready to go live

### 2. Deploy to Render

1. Push this folder to a GitHub repo (or use Render's manual deploy)
2. On Render, create a **New Web Service**
3. Connect your repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variables:
   - `STRIPE_SECRET_KEY` = your Stripe secret key
   - `DOMAIN` = your Render URL (e.g., `https://fta-masterclass.onrender.com`)

### 3. Add Your Content

**Video:** In `public/access.html`, replace the video placeholder (around line 140) with:
```html
<!-- YouTube -->
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allowfullscreen></iframe>

<!-- OR Vimeo (recommended for paid content — more control) -->
<iframe src="https://player.vimeo.com/video/YOUR_VIDEO_ID" frameborder="0" allowfullscreen></iframe>
```

**PDF Workbook:** Copy `FTA_Masterclass_Workbook.pdf` into the `public/` folder.

**Logo (optional):** Add `logo.png` to `public/` for the Stripe checkout page image.

### 4. Test

1. Use Stripe test mode (sk_test_ key)
2. Test card number: `4242 4242 4242 4242`, any future expiry, any CVC
3. After "paying," you should land on the access page with your video + download

### 5. Go Live

1. Swap `STRIPE_SECRET_KEY` to your `sk_live_...` key in Render's environment variables
2. That's it — you're live!

## File Structure

```
landing-page/
├── server.js            # Express server + Stripe checkout endpoints
├── package.json         # Dependencies
├── render.yaml          # Render deployment config
├── .env.example         # Environment variable template
├── .gitignore
└── public/
    ├── index.html       # Sales/landing page
    ├── access.html      # Post-purchase access page
    ├── FTA_Masterclass_Workbook.pdf  (you add this)
    └── logo.png         (optional, for Stripe)
```

## How It Works

1. Buyer clicks "Get the Masterclass" on the landing page
2. Server creates a Stripe Checkout Session ($37)
3. Buyer is redirected to Stripe's hosted checkout (on stripe.com)
4. After payment, Stripe redirects back to `/access.html?session_id=...`
5. Access page verifies the session_id with Stripe
6. If paid, they see the video + workbook download

## Notes

- The access page URL with `session_id` is what grants access. Buyers should bookmark it.
- Stripe sends email receipts automatically.
- For extra security, you could add a database to store verified emails, but the session_id verification works fine for a $37 product.
- Video hosting: Vimeo Pro gives you domain-restricted embeds (so only your site can show the video). YouTube unlisted works too but is less secure.
