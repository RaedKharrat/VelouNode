import stripePackage from 'stripe';

// Define your Stripe secret key
const stripeSecretKey = 'sk_test_51OCrioL5tL8k5XpxbNvuiKIYFrlgpnZwDX2niV0TZxvXy435ZIfAa44TA3g4FNx6YkwKn6gJRqYffiruYWJKbq7500Vk49cjlY';

// Create a new instance of the Stripe package with your secret key
const stripe = stripePackage(stripeSecretKey);

// Define a constant for the base URL
const baseUrl = 'http://172.16.9.211:27017/reservation/reservation/655e87de5c69918a939e20f9/655d1d936d213ea3741af704';

// Create the checkout session
export async function createCheckoutSession() {
  try {
    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'New bike',
            },
            unit_amount: 55,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

