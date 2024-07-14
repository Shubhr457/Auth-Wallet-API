const express = require('express');
const { transfer, transactionHistory } = require('../controllers/transaction');
const checkAuth = require("../middlewares/middleware")

const router = express.Router();

router.post('/transfer', transfer);
router.get('/history', checkAuth,transactionHistory);

module.exports= router
