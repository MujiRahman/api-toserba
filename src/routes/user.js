const express = require ('express');
const router = express.Router();
const {body} = require('express-validator');
const { uploadSingle } = require('../middleware/multer');
const verifyToken = require('../middleware/verifyToken');

const authControler = require('../controler/user');

router.post('/register', uploadSingle, [
    body('nama').isLength({max:20}).withMessage('nama anda kepanjangan woi!!!'),
    body('email').isLength({max:40}).withMessage('email yang anda masukan salah!!!'),
    body('password').isLength({min:6}).withMessage('password anda terlalu mudah di heck!')], 
    authControler.register);

router.post('/login', authControler.login);
router.put('/profil', verifyToken, uploadSingle, authControler.updateProfil);
router.get('/profil', verifyToken, authControler.getUserById);
router.post('/logout', authControler.logOut)

module.exports = router;
