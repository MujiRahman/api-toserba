const express = require ('express');
const router = express.Router();
const {body} = require('express-validator');
const { uploadSingle, uploadMultiple } = require('../middlewares/multer');
const isiProduct = require ('../controler/product');
const verifyToken = require('../middleware/verifyToken');

router.post('/post/:userId', verifyToken, uploadMultiple, [
    body('title').isLength({min:4}).withMessage('input title tidak sesuai'), 
    body('body').isLength({min:10}).withMessage('input deskripsi tidak sesuai')], 
    isiProduct.createProduct);
router.get('/posts', isiProduct.getAllProduct);
router.get('/post/:productId', isiProduct.getProductById);
router.put('/post/:productId', [
    body('title').isLength({min:4}).withMessage('input title tidak sesuai'), 
    body('body').isLength({min:10}).withMessage('input deskripsi tidak sesuai')],
    isiProduct.updateProduct);
router.delete('/post/:productId', isiProduct.deleteProduct);

module.exports = router;