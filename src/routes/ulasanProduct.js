const express = require ('express');
const router = express.Router();
const {body} = require('express-validator');
const ulasan = require('../controler/ulasanProduct');
const verifyToken = require('../middleware/verifyToken');

router.post('/post/:productId', 
    [body('ulasan').isLength({min:2}).withMessage('coment yang benerbuat ulasan')], verifyToken, ulasan.addUlasan)
router.get('/post/:productId', ulasan.getAllUlasan)

module.exports = router