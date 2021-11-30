const express = require ('express');
const router = express.Router();
const {body} = require('express-validator');
const diskusi = require('../controler/diskusiProduct');
const verifyToken = require('../middleware/verifyToken');

router.post('/post/:productId', verifyToken,[body('comment').isLength({min:1}).withMessage('coment yang bener')], diskusi.addDiskusiProduct)
router.get('/post/:productId', diskusi.getAllDiskusiProduct)

module.exports = router