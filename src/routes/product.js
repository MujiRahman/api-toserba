const express = require ('express');
const router = express.Router();
const {body} = require('express-validator');

const isiProduct = require ('../controler/product');

router.post('/post', [
    body('title').isLength({min:4}).withMessage('input title tidak sesuai'), 
    body('body').isLength({min:10}).withMessage('input isi tidak sesuai')], 
    isiProduct.createProduct);