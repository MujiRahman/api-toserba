const express = require ('express');
const router = express.Router();
const {body} = require('express-validator');
const { uploadSingle } = require('../middleware/multer');
const verifyToken = require('../middleware/verifyToken');

const order = require('../controler/order');

router.post('/addOrder/:productId', verifyToken,[
    body('namaBarang').isLength({min:2}).withMessage('input nama tidak sesuai'), 
    body('alamat').isLength({min:4}).withMessage('input deskripsi tidak sesuai')],  order.addOrder)
router.get('/addOrder', verifyToken, order.getAllOrder)
router.get('/addOrderId/:pesenanId', verifyToken, order.getOrderById)
router.post('/upDateOrder/:pesenanId', order.updateOrder)
router.post('/upDateOrder1/:orderId', order.getUpdateOrder)
router.get('/logOrder', verifyToken, order.logClientOrder)

module.exports = router;

