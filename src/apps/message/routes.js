import express from 'express';
import { chatController } from './controller.js';

const router = express.Router();

router.get('/messages',chatController );  // To fetch all messages via HTTP (optional)

export default router;
