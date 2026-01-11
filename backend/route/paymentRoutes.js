import express from "express";
import {
  createPaymentIntent,
  verifyKhaltiPayment
} from "../controller/paymentController.js";

const router = express.Router();

// Stripe
router.post("/create-payment-intent", createPaymentIntent);

// Khalti
router.post("/khalti/verify", verifyKhaltiPayment);

export default router;
