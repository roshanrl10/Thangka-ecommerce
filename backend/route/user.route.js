
import express from 'express';
import { updateUserProfile, getUserProfile } from '../controller/user.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/profile')
    .get(protectRoute, getUserProfile)
    .put(protectRoute, updateUserProfile);

export default router;
