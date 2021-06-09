const express = require ('express');
const router = express.Router();
const {body} = require('express-validator');

const authControler = require('../controler/user');

router.post('/register', [
    body('nama').isLength({max:20}).withMessage('nama anda kepanjangan woi!!!'),
    body('email').isLength({max:20}).withMessage('email yang anda masukan salah!!!'),
    body('password').isLength({min:6}).withMessage('password anda terlalu mudah di heck!')],
    authControler.register);

router.post('/login', authControler.login);

module.exports = router;