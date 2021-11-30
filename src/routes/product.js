const express = require ('express');
const router = express.Router();
const {body} = require('express-validator');
const { uploadMultiple } = require('../middleware/multer');
const verifyToken = require('../middleware/verifyToken');
const isiProduct = require ('../controler/product');

router.post('/post',verifyToken, uploadMultiple, [
    body('nama').isLength({min:4}).withMessage('input nama tidak sesuai'), 
    body('deskripsi').isLength({min:10}).withMessage('input deskripsi tidak sesuai')], 
    isiProduct.createProduct);
router.get('/posts', isiProduct.getAllProduct);
router.get('/posts/ByUser', verifyToken, isiProduct.getAllProductByUser);
router.get('/post/:productId', isiProduct.getProductById);
router.put('/post/:productId', verifyToken, uploadMultiple, [
    body('nama').isLength({min:4}).withMessage('input title tidak sesuai'), 
    body('deskripsi').isLength({min:10}).withMessage('input deskripsi tidak sesuai')], 
    isiProduct.updateProduct);
router.delete('/post/:productId', verifyToken, isiProduct.deleteProduct);

module.exports = router;