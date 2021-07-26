const { validationResult } = require("express-validator");
const path = require("path");
const Product = require("../models/product");
const fs = require("fs");
const User = require("../models/User");
const Image = require("../models/Image");
// const { error } = require("console");
// const verifyToken = require("../middleware/verifyToken"); 
// const Image = require("../models/Image");

exports.createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        const userId = req.user._id;
        const { nama, merek, harga, jumlahBarang, deskripsi} = req.body;
        // if(!errors.isEmpty()){
        //     const err = new Error('inputan yang anda masukan salah')
        //     err.errorStatus = 400;
        //     err.data = errors.array();
        //     throw err;
        // }
        if (req.files.length > 0) {
            const user = await User.findOne({_id: userId})
            const newProduct = new Product({
                nama,
                merek,
                harga,
                jumlahBarang,
                deskripsi,
            })
            const product = await Product.create(newProduct);
            user.productId.push({ _id: product._id });
            await user.save()
            for (let i = 0; i < req.files.length; i++) {
                const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}`});
                product.imageId.push({_id: imageSave});
                await product.save()
                res.status(200).json({
                    message: 'create berhasil',
                    data: newProduct
                });
            }
        }
    } catch (error) {
        next(error)
        console.log('isi error add product ', error)
    }
    
}

exports.getAllProduct = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 3;
    let totalProduct;

    
    Product.find()
    .countDocuments()
    .then( count => {
        totalProduct = count;
        return Product.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then( result => {
        res.status(200).json({
            message: 'data product telah berhasil dipanggil',
            data: result,
            total_data: totalProduct,
            per_page: parseInt(perPage),
            current_page: parseInt(currentPage)
        })
    })
    .catch( err => {
        console.log('isi err get all', err);
        next(err)
    })
}

exports.getAllProductByUser = (req, res, next) => {
    const userId = req.user._id;
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 3;
    let totalProduct;

    const user = User.findOne({_id: userId})
    user.productId.find()
    .countDocuments()
    .then( count => {
        totalProduct = count;
        return user.productId.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then( result => {
        res.status(200).json({
            message: 'data product by user telah berhasil dipanggil',
            data: result,
            total_data: totalProduct,
            per_page: parseInt(perPage),
            current_page: parseInt(currentPage)
        })
    })
    .catch( err => {
        console.log('isi err get all', err);
        next(err)
    })
}

exports.getProductById = async (req, res, next) => {
    try {
        const productById = req.params.productId;
        const getProductId = await Product.findById(productById)
        .populate({path: 'imageId', select: 'id imageUrl'})
        .populate({path: 'ulasanId', select: 'id nama rating'})
        .populate({path: 'diskusiId', select: 'id comment'})
        res.status(200).json({
            message: 'data product berhasil dibuat',
            data: getProductId
        })
    } catch (error) {
        next(error);
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            const err = new Error('inputan yang anda masukan salah')
            err.errorStatus = 400;
            err.data = errors.array();
            throw err;
        }
        if(!req.file) {
            const err = new Error('image yang anda masukan tidak sesuai dengan katagori yang kita butuhkan');
            err.errorStatus = 422;
            throw err;
        }
        const { nama, merek, harga, jumlahBarang, deskripsi } = req.body;
        // const image = req.file.path;
        const productId = req.params.productId;

        const upDateProduct = await Product.findById(productId)
        .populate({path: 'imageId', Select: 'id imageUrl'})
        .populate({path: 'categoryId', select: 'id name'});
        if (req.files.length > 0) {
            for (let i = 0; i < upDateProduct.imageId.length; i++) {
                const imageUpdate = await Image.findOne({ _id: upDateProduct.imageId[i]._id });
                await fs.unlink(path.join('{imageUpdate.imageUrl}'));
                imageUpdate.imageUrl = `images/${req.files[i].filename}`;
                await imageUpdate.save();
            }
            upDateProduct.nama = nama;
            upDateProduct.merek = merek;
            upDateProduct.harga = harga;
            upDateProduct.jumlahBarang = jumlahBarang;
            upDateProduct.deskripsi = deskripsi;

            await upDateProduct.save()
            res.status(200).json({
                message: 'create berhasil',
                data: upDateProduct
            });
        } else {
            upDateProduct.nama = nama;
            upDateProduct.merek = merek;
            upDateProduct.harga = harga;
            upDateProduct.jumlahBarang = jumlahBarang;
            upDateProduct.deskripsi = deskripsi;

            await upDateProduct.save()
            res.status(200).json({
                message: 'create berhasil',
                data: upDateProduct
            });
        }
    } catch (error) {
        next(error)
        console.log('isi err product', error)
    }
    
}

exports.deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;

        const Delete = await Product.findById(productId)
        .populate('imageId');
        for ( let i = 0; i < Delete.imageId.length; i++ ) {
            Image.findOne({_id : Delete.imageId[i]._id}).then((image) => {
                fs.unlink(path.join('{ image.imageUrl}'));
                image.remove();
            })
        }
        await Delete.remove();
        res.status(200).json({
            massege: 'hapus product berhasil',
            data: Delete,
        })
    } catch (error ) {
        next(error);
    }
}

// exports.showBanerHero = () => {

// }