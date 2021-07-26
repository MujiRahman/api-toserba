const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra')
const path = require("path");
const User = require('../models/User')
require('dotenv/config')

exports.register = async (req, res, next) => {
    try {
        const {nama, email, password} = req.body;
        // const imageProfil = req.file.filename;
        console.log({nama, email, password})
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
        const hashPassword = await bcrypt.hash(password, salt);
        
        // inisialisasi user
        await User.create({
            nama,
            email,
            password: hashPassword,
            imageProfil: `images/${req.file.filename}`
        })
        res.status(201).json({
            message: 'Berhasil meregister user baru',
            data: User
        });
    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error)
    }
    
}

exports.updateProfil = async (req, res, next) => {
    try {
        const {nama, email, password, alamat, noHp} = req.body;
        

        // hash password lagi
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = req.user._id
        const getUser = await User.findById(user);
        
        // pengecekan email
        const cekEmail = await User.findOne({email});
        if(cekEmail) return res.status(400).json({
            status: res.statusCode,
            message: 'Email yang anda masukan sudah ada yang menggunakan!'
        })
        console.log('isi cek email', cekEmail)

        if (req.file == undefined) {
            getUser.nama = nama;
            getUser.email = email;
            getUser.password = hashPassword;
            getUser.alamat = alamat;
            getUser.noHp = noHp;

            await getUser.save()
            res.status(200).json({
                message: 'create berhasil',
                data: getUser
            });
        } 
        else {
            await fs.unlink(path.join(`${getUser.imageProfil}`));
            getUser.nama = nama;
            getUser.email = email;
            getUser.password = hashPassword;
            getUser.alamat = alamat;
            getUser.noHp = noHp;
            getUser.imageProfil = `images/${req.file.filename}`;
            console.log(getUser.imageProfil)
    
            await getUser.save()
            res.status(200).json({
                message: 'create berhasil',
                data: getUser
            });
        }
    } catch (error) {
        next(error)
    }
}

exports.getUserById = async (req, res, next) => {
    try {
        const user = req.user._id;
        const getUser = await User.findById(user).populate({path: 'imageId', select: 'id imageUrl'})
        res.status(200).json({
            message: 'data user berhasil di panggil',
            data: getUser,
        })
    } catch (error) {
        next(error)
    }
}