import express from "express";
import { addToCart, removeFromCart, decreaseQty, getCart } from "../controller/cart.controller.js";

const router = express.Router();

router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.post("/decrease", decreaseQty);
router.get("/:userId", getCart);

export default router;
