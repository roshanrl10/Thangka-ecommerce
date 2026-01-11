import express from 'express';
import { getPendingArtists, approveArtist, rejectArtist, getDashboardStats, getAllUsers, getAllOrders } from '../controller/admin.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js'; // Import middleware

const router = express.Router();

// Apply middleware to all routes
router.use(protectRoute, adminRoute);

router.get('/pending-artists', getPendingArtists);
router.post('/approve-artist', approveArtist);
router.post('/reject-artist', rejectArtist);
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers); // New
router.get('/orders', getAllOrders); // New

export default router;
