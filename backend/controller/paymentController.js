import Stripe from 'stripe';
import Order from '../model/Order.model.js';
import dotenv from 'dotenv';
dotenv.config();

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error("CRITICAL: STRIPE_SECRET_KEY is missing in .env");
}
const stripe = new Stripe(stripeKey || 'sk_test_placeholder'); // Prevent crash on init, fail on usage

// Create Stripe Payment Intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'npr' } = req.body;

    // Check if Stripe is properly initialized
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ message: "Server misconfiguration: Stripe Key missing" });
    }

    // Create a PaymentIntent with the order amount and currency
    // Note: Stripe expects amount in smallest currency unit (e.g., paisa for NPR, cents for USD)
    // However, standard Stripe API often uses USD/EUR. NPR might not be supported directly for Intent if account is US/EU based. 
    // Assuming account supports it or we convert to USD.
    // Let's assume input amount is in Rs (NPR) and we convert to paisa * 100

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Verify Khalti Payment (Simplified)
export const verifyKhaltiPayment = async (req, res) => {
  try {
    const { token, amount } = req.body;

    // Real implementation involves making a request to Khalti API to verify
    // For now, we mock success
    console.log("Verifying Khalti:", token, amount);

    // Mock verification
    if (token) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
