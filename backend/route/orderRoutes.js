import express from "express";
import { getOrderSuccess, getOrderHistory, createOrder } from "../controller/orderController.js";

const router = express.Router();

router.post("/create", createOrder);

// Fetch single order for Order Success page
router.get("/order-success/:orderId", getOrderSuccess);

// Fetch all orders for Order History page
router.get("/orders/:userId", getOrderHistory);

export default router;
