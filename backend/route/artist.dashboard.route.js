import express from 'express';
import { getArtistStats, getMyProducts, createproduct, deleteProduct } from '../controller/artist.dashboard.controller.js';
import { protectRoute, artistRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/stats', protectRoute, artistRoute, getArtistStats);
router.get('/products', protectRoute, artistRoute, getMyProducts);
router.post('/products/create', protectRoute, artistRoute, createproduct);
router.delete('/products/:id', protectRoute, artistRoute, deleteProduct);

export default router;
