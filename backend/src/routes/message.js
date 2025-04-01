import express from 'express';
import { protect } from '../middleware/auth.js';
import { getUsers,fetchMessages,sendMessage } from '../controllers/messageController.js';
const router = express.Router();


router.get('/users/:id',protect,getUsers);

router.get("/:receiverId",protect,fetchMessages);

router.post('/send/:receiverId',protect,sendMessage)

export default router;


