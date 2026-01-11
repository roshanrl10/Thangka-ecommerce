import express from "express";
import { getProduct, getProductById, createProduct, updateProduct, deleteProduct, getArtistProducts } from "../controller/product.controller.js";
import { protectRoute, adminRoute, artistRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Artist Route
// getArtistProducts must come BEFORE /:id because "my-products" matches /:id pattern if placed after
router.get("/my-products", protectRoute, artistRoute, getArtistProducts);

router.get("/", getProduct); // Public: List all products
router.get("/:id", getProductById); // Public: Get single product

// Protected Routes
// Allow Admin OR Artist to create (Actually artist uses dashboard route, but this can be fallback)
// We will use 'artistRoute' middleware which allows both Admin and Artist.
router.post("/", protectRoute, artistRoute, createProduct);
router.put("/:id", protectRoute, artistRoute, updateProduct);
router.delete("/:id", protectRoute, artistRoute, deleteProduct);

export default router;