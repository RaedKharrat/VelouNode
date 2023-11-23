import stripePackage from 'stripe';
import Velo from '../models/velo.js';

const stripe = stripePackage('sk_test_51OCrioL5tL8k5XpxbNvuiKIYFrlgpnZwDX2niV0TZxvXy435ZIfAa44TA3g4FNx6YkwKn6gJRqYffiruYWJKbq7500Vk49cjlY');

export async function createCheckoutSession(productDetails) {
  try {
    // Retrieve the necessary data from the database (e.g., Velo object)
    // const velo = await Velo.findById(productDetails.veloId);

    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: "velo jdida",
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://your-website.com/success',
      cancel_url:  'https://your-website.com/cancel',
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }

async function createNewCard(customerId, cardToken) {
  try {
    const card = await stripe.customers.createSource(customerId, {
      source: cardToken,
    });

    return card;
  } catch (error) {
    console.error('Error creating card:', error);
    throw error;
  }
}
}