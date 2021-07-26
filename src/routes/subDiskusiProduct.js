const express = require ('express');
const router = express.Router();
const subDiskusi = require('../controler/subDiskusiProduct');
const verifyToken = require('../middleware/verifyToken');

router.post('/post/:productId/:diskusiId', verifyToken, subDiskusi.addsubDiskusi)
router.get('/post/:productId/:diskusiId', subDiskusi.getAllsubDiskusi)

module.exports = router