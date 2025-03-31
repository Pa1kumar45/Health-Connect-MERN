import express from 'express';
import { register,getCurrentUser, login, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout)

router.get('/me', protect, getCurrentUser);

export default router;