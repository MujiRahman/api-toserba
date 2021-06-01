const { validationResult } = require("express-validator");
const path = require("path");
const Product = require("../models/product");
const fs = require("fs");
const User = require("../models/User");
const Image = require("../models/Image");
// const verifyToken = require("../middleware/verifyToken"); 
// const Image = require("../models/Image");

exports.createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        const userId = req.params.userId;
        const {title, body, jumlahBarang} = req.body;
        if(!errors.isEmpty()){
            const err = new Error('inputan yang anda masukan salah')
            err.errorStatus = 400;
            err.data = errors.array();
            throw err;
        }
        // if(!req.file) {
        //     const err = new Error('image yang anda masukan tidak sesuai dengan katagori yang kita butuhkan');
        //     err.errorStatus = 422;
        //     throw err;
        // }
        if (req.files.length > 0) {
            const user = await User.findOne({_id: userId})
            const newProduct = new Product({
                title,
                body,
                jumlahBarang,
                image: req.file.path
            })
            // console.log('isi newproduct', newProduct);
            const product = await Product.create(newProduct);
            user.productId.push({ _id: product._id });
            await user.save()
            for (let i = 0; i < req.files.length; i++) {
                const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}` });
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
    const userId = req.params.userId;
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 3;
    let totalProduct;

    const user = await User.findOne({_id: userId})
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

exports.getAllProductByUser = () => {
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

exports.getProductById = (req, res, next) => {
    const productById = req.params.productId;
    Product.findById(productById)
    .then(result => {
        if(!result) {
            const error = new Error('Product tidak di temukan');
            error.errorStatus = 404;
            throw error;
        }
        res.status(200).json({
            message: 'data product berhasil dibuat',
            data: result
        })
    })
    .catch(err =>{
        next(err);
    })
}

exports.updateProduct = (req, res, next) => {
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
    const title = req.body.title;
    const body = req.body.body;
    const jumlahBarang = req.body.jumlahBarang;
    const image = req.file.path;
    const productId = req.params.productId;

    Product.findById(productId)
    .then(pbyId => {
        if(!pbyId) {
            const error = new Error('Product tidak ditemukan');
            error.errorStatus = 404;
            throw error;
        }

        pbyId.title = title;
        pbyId.body = body;
        pbyId.jumlahBarang = jumlahBarang;
        pbyId.image = image;

        return pbyId.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'update berhasil',
            data: result
        });
    })
    .catch(err=> {
        next(err)
        console.log('isi err product', err)
    });
}

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId;

    Product.findById(productId)
    .then(post => {
        if(!post){
            const err = new Error('product Tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }

        removeImage(post.image);
        return Product.findByIdAndRemove(productId);
    })
    .then(result => {
        res.status(200).json({
            massege: 'hapus product berhasil',
            data: result,
        })
    })
    .catch(err => {
        next(err);
    })
}

const removeImage = (filePath) => {
    console.log('isi filepath', filePath);
    console.log('isi dir name', __dirname);
    filePath = path.join(__dirname, '../..', filePath);
    fs.unlink(filePath, err => console.log('isi error hapus image', err));
}

exports.diskusiProductById = () => {

}

exports.subDiskusiProductById = () => {

}

exports.ulasanById = () => {

}

exports.showBanerHero = () => {

}