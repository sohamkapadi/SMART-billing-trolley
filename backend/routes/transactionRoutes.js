import express from 'express';
import { 
  acceptPayment,
  completeTransaction 
} from '../controllers/transactionController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/accept-payment', auth, acceptPayment);
router.post('/complete', auth, completeTransaction);


export default router;
