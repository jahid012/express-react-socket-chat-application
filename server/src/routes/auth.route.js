import express from "express";
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', login)

router.post('/signup', signup)

router.post('/logout', logout)

router.put('/user/update-profile',authMiddleware, updateProfile)

router.get('/user/check-auth', authMiddleware, checkAuth);

export default router;