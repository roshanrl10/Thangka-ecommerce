import express from "express";
import { getOrderSuccess, getOrderHistory, createOrder } from "../controller/orderController.js";

const router = express.Router();

router.post("/create", createOrder);

// Fetch single order for Order Success page
router.get("/order-success/:orderId", getOrderSuccess);

// Fetch all orders for Order History page
router.get("/orders/:userId", getOrderHistory);

// Update order status (Admin/Artist)
import { updateOrderStatus } from "../controller/orderController.js";
import { protectRoute } from "../middleware/auth.middleware.js";

// Custom middleware to allow Admin or Artist
const adminOrArtist = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'artist')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as admin or artist' });
    }
};

router.put("/:orderId/status", protectRoute, adminOrArtist, updateOrderStatus);

export default router;
