import express from 'express';
import { addItems, getItems, updateQuantity } from '../controllers/itemController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:trolleyId', auth, getItems);
router.patch('/:itemId/quantity', auth, updateQuantity);
router.post('/add',addItems);

export default router;