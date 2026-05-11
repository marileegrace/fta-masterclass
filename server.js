require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || `http://localhost:${PORT}`;

// Create Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'FTA Masterclass: The Complete Trading System',
              description: 'Full video masterclass + interactive workbook PDF',
              images: ['https://fta-masterclass.onrender.com/logo.png'],
            },
            unit_amount: 3700, // $37.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${DOMAIN}/access.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/#pricing`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Verify payment (called from access page)
app.get('/verify-payment', async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ verified: false });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      res.json({ verified: true, email: session.customer_details?.email });
    } else {
      res.json({ verified: false });
    }
  } catch (error) {
    console.error('Verification error:', error.message);
    res.status(400).json({ verified: false });
  }
});

app.listen(PORT, () => {
  console.log(`FTA Masterclass server running on port ${PORT}`);
});
