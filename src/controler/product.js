const { validationResult } = require("express-validator");
const path = require("path");
const Product = require("../models/Product");
const fs = require("fs");
const User = require("../models/User");
const Image = require("../models/Image");

exports.createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        const userId = req.user._id;
        const { nama, harga, jumlahBarang, deskripsi} = req.body;
        console.log('isi req body product', req.body)
        if(!errors.isEmpty()){
            const err = new Error('inputan yang anda masukan salah')
            err.errorStatus = 400;
            err.data = errors.array();
            throw err;
        }
        if (req.files.length > 0) {
            const user = await User.findOne({_id: userId})
            const newProduct = {
                nama,
                asalKota: user.asalKota,
                harga,
                jumlahBarang,
                deskripsi,
                userId,
            }
            const product = await Product.create(newProduct);
            user.productId.push({ _id: product._id });
            await user.save()
            for (let i = 0; i < req.files.length; i++) {
                const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}`});
                product.imageId.push({_id: imageSave._id});
                await product.save()
            }
            res.status(201).json({
                message: 'create berhasil',
                data: product
            });
        }
    } catch (error) {
        next(error)
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
        return Product.find().populate({ path: 'imageId', select: 'id imageUrl' })
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then( result => {
        res.status(200).json({
            message: 'data product telah berhasil dipanggil',
            data: result,
            total_Data: totalProduct,
            per_page: parseInt(perPage),
            current_page: parseInt(currentPage)
        })
    })
    .catch( err => {
        console.log('isi err get all', err);
        next(err)
    })
}

exports.getAllProductByUser = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findOne({_id: userId})
        .populate('productId')
        // .populate('pesenanId')
        console.log('isi userid', user)
        if (user) {
            res.status(200).json({
                message: 'data order telah berhasil dipanggil',
                data: user.productId ,
                // data2: user.pesenanId ,
            })
        } else{
            res.status(200).json({
                message: 'data product by user kosong',
            })
        }
        
    } catch (error) {
        next(error)
    }
}

exports.getProductById = async (req, res, next) => {
    try {
        const {productId} = req.params;
        const getProductId = await Product.findOne({_id: productId})
        .populate({ path: 'imageId', select: 'id imageUrl' })
        .populate('diskusiId')
        .populate('ulasanId')
        res.status(200).json({
            message: 'data product berhasil dipanggil',
            data: getProductId,
            data2: getProductId.diskusiId,
            data3: getProductId.ulasanId
        })
        // if(getProductId){
        // }
    } catch (error) {
        next(error);
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        const { nama, harga, jumlahBarang, deskripsi } = req.body;
        const {productId} = req.params;
        console.log('isi req body update', req.body)
        if(!errors.isEmpty()){
            const err = new Error('inputan yang anda masukan salah')
            err.errorStatus = 400;
            err.data = errors.array();
            throw err;
        }
        
        const upDateProduct = await Product.findOne({_id: productId})
        .populate({path: 'imageId', Select: 'id imageUrl'})
        if (req.files.length > 0) {
            for (let i = 0; i < upDateProduct.imageId.length; i++) {
                const imageUpdate = await Image.findOne({ _id: upDateProduct.imageId[i]._id });
                fs.unlinkSync(path.join(`${imageUpdate.imageUrl}`));
                imageUpdate.imageUrl = `images/${req.files[i].filename}`;
                await imageUpdate.save();
                console.log('isi image save', imageUpdate)
            }
            upDateProduct.nama = nama;
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
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        const {productId} = req.params;
        const userId = req.user._id;
        const Delete = await Product.findOne({_id: productId}).populate('imageId');
        const hapusUserProduct = await User.findOne({_id: userId}).populate('productId');
        for (let e = 0; e < hapusUserProduct.productId.length; e++) {
            if(hapusUserProduct.productId[e]._id.toString() === Delete._id.toString()) {
                hapusUserProduct.productId.pull({_id: Delete._id});
                await hapusUserProduct.save();
            }
        }
        for (let i = 0; i < Delete.imageId.length; i++) {
            Image.findOne({ _id: Delete.imageId[i]._id })
            .then((image) => {
                fs.unlinkSync(path.join(`${image.imageUrl}`))
                image.remove();
            })
            .catch((err) => {
                next(err)
            });
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