const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra')
const path = require("path");
const User = require('../models/User')
require('dotenv/config')

exports.register = async (req, res, next) => {
    try {
        const {nama, email, password, rePassword } = req.body;
        // mengatasi error lokal
        console.log('isi req body boy', req.body)
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                message: 'inputan yang anda masukan salah mohon koreksi ulang',
                data: errors.array() });
        }

        if(password !== rePassword){
            return res.status(400).json({
                message: 'password dan ulang password tidak sama',
                data: errors.array() });
        }

        // mengecek apakah email udah ada apa belom
        const emailExist = await User.findOne({email});
        if(emailExist) return res.status(400).json({
            status: res.statusCode,
            message: 'Email Sudah digunakan !'
        })

        // mengencripsi password/ hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const hashRepassword = await bcrypt.hash(rePassword, salt);
        
        // inisialisasi user
        const user = new User({
            nama,
            email,
            password: hashPassword,
            rePassword: hashRepassword
            // imageProfil: `images/${req.file.filename}`
        })
        console.log('isi user', user)
        await user.save();
        res.status(201).json({
            message: 'Berhasil meregister user baru',
            data: user
        });
    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        // pengecekan email
        console.log('isii req', req.body)
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
        const token = jwt.sign({ _id: user._id }, process.env.secret,{ expiresIn: '3h'})

        // res.json({
        //     status: res.statusCode,
        //     user: user,
        //     message: 'Selamat anda berhasil login',
        //     token: token
        // })

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

exports.getUserById = async (req, res, next) => {
    try {
        // if (req.session.user == null || req.session.user == undefined){
        //     res.status(400).json({
        //         status: res.statusCode,
        //         message: 'sesi login anda telah berakhir'
        //     })
        // }
        const user = req.user._id;
        console.log('isi user', user)
        const getUser = await User.findOne({_id: user}).populate({path: 'imageId', select: 'id imageUrl'})
        res.status(200).json({
            message: 'data user berhasil di panggil',
            data: getUser,
        })
    } catch (error) {
        next(error)
    }
}

exports.updateProfil = async (req, res, next) => {
    try {
        const {nama, email, alamat, noHp, asalKota} = req.body;
        console.log('isi req', req.body)
        
        // hash password lagi
        // const salt = await bcrypt.genSalt(10);
        // const hashPassword = await bcrypt.hash(password, salt);

        const user = req.user._id
        const getUser = await User.findById(user);

        if (getUser.imageProfil == undefined) {
            getUser.nama = nama || getUser.nama;
            getUser.email = email || getUser.email;
            getUser.asalKota = asalKota || getUser.asalKota;
            getUser.alamat = alamat || getUser.alamat;
            getUser.noHp = noHp || getUser.noHp;
            getUser.imageProfil = `images/${req.file.filename}`;
    
            await getUser.save()
            res.status(200).json({
                message: 'create berhasil',
                data: getUser
            });
            return
        } else if (getUser.imageProfil != undefined && req.file == undefined) {
            getUser.nama = nama || getUser.nama;
            getUser.email = email || getUser.email;
            getUser.asalKota = asalKota || getUser.asalKota;
            getUser.alamat = alamat || getUser.alamat;
            getUser.noHp = noHp || getUser.noHp;

            await getUser.save()
            res.status(200).json({
                message: 'create berhasil',
                data: getUser
            });
            return
        } else {
            await fs.unlink(path.join(`${getUser.imageProfil}`));
            getUser.nama = nama || getUser.nama;
            getUser.email = email || getUser.email;
            getUser.asalKota = asalKota || getUser.asalKota;
            getUser.alamat = alamat || getUser.alamat;
            getUser.noHp = noHp || getUser.noHp;
            getUser.imageProfil = `images/${req.file.filename}`;
    
            await getUser.save()
            res.status(200).json({
                message: 'create berhasil',
                data: getUser
            });
            return
        }
    } catch (error) {
        next(error)
    }
}
