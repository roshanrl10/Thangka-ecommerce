import express from 'express';
import { register, login, logout, forgotPassword, resetPassword } from '../controller/auth.controller.js';
import { googleLogin } from '../controller/google.auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
