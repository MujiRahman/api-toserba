const express = require ('express');
const router = express.Router();
const ulasan = require('../controler/ulasanProduct');
const verifyToken = require('../middleware/verifyToken');

router.post('/post/:productId', verifyToken, ulasan.addUlasan)
router.get('/post/:productId', ulasan.getAllUlasan)

module.exports = router