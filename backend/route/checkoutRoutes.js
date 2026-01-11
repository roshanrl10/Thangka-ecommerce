import express from "express";
import {
  placeOrderCOD,
  verifyPayment,
  getOrdersForUser
} from "../controller/checkoutController.js";

const router = express.Router();

// COD ORDER
router.post("/place-order-cod", placeOrderCOD);

// ONLINE PAYMENT (Esewa / Khalti / Card)
router.post("/verify", verifyPayment);

// ORDER HISTORY
router.get("/orders/:userId", getOrdersForUser);

export default router;
