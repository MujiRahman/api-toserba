const DiskusiProduct = require("../models/DiskusiProduct");
const Product = require("../models/Product");
const { validationResult } = require("express-validator");
const User = require("../models/User");

exports.addDiskusiProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        const {comment}  = req.body
        const userId = req.user._id;
        const {productId} = req.params;
        console.log('isi coment',req.body)
        
        if(!errors.isEmpty()){
            const err = new Error('inputan yang anda masukan salah')
            err.errorStatus = 400;
            err.data = errors.array();
            throw err;
        }
    
        const product = await Product.findOne({_id: productId})
        const user = await User.findOne({_id: userId})
        const isiComment ={
            comment,
            userId,
            nama: user.nama,
            imageProfil: user.imageProfil
        }
        console.log('isi comment', isiComment)
        const buatComment = await DiskusiProduct.create(isiComment);
        product.diskusiId.push({_id: buatComment._id});
        await product.save();
        res.status(200).json({
            message: 'buat comment berhasil',
            data: buatComment,
            isi_id_product: product
        })
    } catch (error) {
        next(error);
        console.log('isi error comment sing rada aneh', error)
    }    
}

exports.getAllDiskusiProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const diskusi = await Product.findOne({_id: productId}).populate('diskusiId')
        res.status(200).json({
            message: 'data product berhasil dibuat',
            data: diskusi
        })
    } catch (error) {
        next(error);
    }
}