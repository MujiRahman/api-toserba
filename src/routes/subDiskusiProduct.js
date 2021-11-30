const express = require ('express');
const router = express.Router();
const {body} = require('express-validator');
const subDiskusi = require('../controler/subDiskusiProduct');
const verifyToken = require('../middleware/verifyToken');

router.post('/post/:diskusiId', verifyToken, [body('comment').isLength({min:2}).withMessage('coment yang bener')],subDiskusi.addSubDiskusi)
router.get('/post/:diskusiId', subDiskusi.getAllSubDiskusi)

module.exports = router