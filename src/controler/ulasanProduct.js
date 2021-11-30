const Ulasan = require("../models/Ulasan");
const Product = require("../models/Product");
const { validationResult } = require("express-validator");
const User = require("../models/User");

exports.addUlasan = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        const { ulasan, rating } = req.body;
        const userId = req.user._id;
        const productId = req.params.productId;
        console.log('isi ulasan', req.body, productId)
        
        if(!errors.isEmpty()){
            const err = new Error('inputan yang anda masukan salah')
            err.errorStatus = 400;
            err.data = errors.array();
            throw err;
        }
        const product = await Product.findOne({_id: productId});
        const user = await User.findOne({_id: userId})
        if(parseInt(product.rating) === 0){
            product.rating= parseInt(rating)
            const isiUlasan = {
                ulasan,
                rating,
                userNama: user.nama,
                gambar: user.imageProfil,
                userId
            }
            const buatUlasan = await Ulasan.create(isiUlasan);
            product.ulasanId.push({_id: buatUlasan._id});
            await product.save();
            res.status(200).json({
                message: 'buat Ulasan berhasil',
                data: buatUlasan,
                isi_id_product: product
            })
        } else{
            const jumlahRating = parseInt(product.rating) + parseInt(rating)
            product.rating = parseInt(jumlahRating) / 2
            const isiUlasan = {
                ulasan,
                rating,
                userNama: user.nama,
                gambar: user.imageProfil,
                userId
            }
            const buatUlasan = await Ulasan.create(isiUlasan);
            product.ulasanId.push({_id: buatUlasan._id});
            await product.save();
            res.status(200).json({
                message: 'buat Ulasan berhasil',
                data: buatUlasan,
                isi_id_product: product
            })
        }
    } catch (error) {
        next(error);
        console.log('isi error Ulasan ', error)
    } 
}

exports.getAllUlasan = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        console.log('isi id product', productId)
        const ulasan = await Product.findOne({_id: productId}).populate('ulasanId')
        res.status(201).json({
            message: 'data product berhasil dibuat',
            data: ulasan
        })
    } catch (error) {
        next(error);
    }
}
