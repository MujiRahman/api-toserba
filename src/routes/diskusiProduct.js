const express = require ('express');
const router = express.Router();
const diskusi = require('../controler/diskusiProduct');
const verifyToken = require('../middleware/verifyToken');

router.post('/post/:productId', verifyToken, diskusi.addDiskusiProduct)
router.get('/post/:productId', diskusi.getAllDiskusiProduct)

module.exports = router