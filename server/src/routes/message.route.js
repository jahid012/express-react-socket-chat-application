import express from "express";
import { getMessagesByReceiverId, sendMessage, GetAllMessagedUser } from '../controllers/message.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/users', authMiddleware, GetAllMessagedUser);
router.get('/:id', authMiddleware, getMessagesByReceiverId);
router.post('/send/:receiverId',authMiddleware, sendMessage);

export default router;