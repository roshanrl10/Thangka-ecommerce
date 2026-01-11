import express from 'express';
import { applyArtist, getArtistProfile, getAllArtists, updateArtistProfile, getArtistOrders } from '../controller/artist.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllArtists);
router.get('/:id', getArtistProfile);

// Protected routes
// Note: Middleware imported in server.js but not applied here globally. 
// We must import middleware or ensure it's applied in server.js.
// Inspecting server.js: app.use("/api/artist", artistRoutes); -> No middleware.
// So we need to import and apply it here for the update route.
import { protectRoute, artistRoute } from '../middleware/auth.middleware.js';


router.get('/orders', protectRoute, artistRoute, getArtistOrders);
router.put('/profile', protectRoute, artistRoute, updateArtistProfile);
router.post('/apply', applyArtist); // This should probably be protected too if we want only logged in users to apply, but logic handles it.

export default router;
