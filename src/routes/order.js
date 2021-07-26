const express = require ('express');
const router = express.Router();
const {body} = require('express-validator');
const { uploadSingle } = require('../middlewares/multer');
const verifyToken = require('../middleware/verifyToken');

const order = require('../controler/order');

router.post()