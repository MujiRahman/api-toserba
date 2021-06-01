const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User')
require('dotenv/config')

exports.register = async (req, res) => {
    // mengatasi error lokal
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            message: 'inputan yang anda masukan salah mohon koreksi ulang',
            data: errors.array() });
    }

    // mengecek apakah email udah ada apa belom
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).json({
        status: res.statusCode,
        message: 'Email Sudah digunakan !'
    })

    // mengencripsi password/ hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // inisialisasi user
    const user = new User({
        nama: req.body.nama,
        email: req.body.email,
        password: hashPassword
    })

    // menyompan user baru ke database
    user.save()
    .then(result => {
        res.status(201).json({
            message: 'Berhasil meregister user baru',
            data: result
        });
    })
    .catch(err => {
        console.log('isi err', err);
        res.status(400).json({
            status: res.statusCode,
            message: 'Gagal registrasi tolong registrasi ulang'
        })
    })
}

exports.login = async (req, res) => {
    // pengecekan email
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).json({
        status: res.statusCode,
        message: 'Email yang anda masukan salah!'
    })

    // pengecekan password
    const validPwd = await bcrypt.compare(req.body.password, user.password)
    if(!validPwd) return res.status(400).json({
        status: res.statusCode,
        message: 'Password Anda Salah!'
    })

    // membuat token menggunkan JWT
    const token = jwt.sign({ _id: user._id }, process.env.secret,{ expiresIn: '24h'})
    res.header('auth-token', token).json({
        status: res.statusCode,
        user: user,
        message: 'Selamat anda berhasil login',
        token: token
    })
}