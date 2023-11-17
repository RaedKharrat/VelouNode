// stripe.js

import stripePackage from 'stripe';
import velo from '../models/velo.js';

const stripe = stripePackage('pk_test_51OCrioL5tL8k5Xpx1oqocFMpIrM3p7sMKIb2GyOdk3H4R54fMKWsMkpg9DSjFzHqutAdYafEdxGbK6sfCXZsEgea006Vuc77WL');

export function createCheckoutSession(productDetails) {
  return stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: velo.description,
          },
          unit_amount: velo.prixTotal,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: productDetails.successUrl || 'https://your-website.com/success',
    cancel_url: productDetails.cancelUrl || 'https://your-website.com/cancel',
  });
}
