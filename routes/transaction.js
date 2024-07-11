import express from 'express';
import { transfer, transactionHistory } from '../controllers/transaction';
import checkAuth from '../middlewares/middleware';

const router = express.Router();

router.post('/transfer', transfer);
router.get('/history', checkAuth,transactionHistory);

export default router;
