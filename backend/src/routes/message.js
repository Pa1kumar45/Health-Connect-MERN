import express from 'express';
import { protect } from '../middleware/auth';
import { getUsers,fetchMessages } from '../controllers/messageController';
const router = express.Router();


router.get('/users',protect,getUsers);

router.get("/:receiverId",protect,fetchMessages);

router.post('/send/:receiverId',protect,sendMessage)

export default router;


