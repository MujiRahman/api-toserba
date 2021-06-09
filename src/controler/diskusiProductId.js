const { validationResult } = require("express-validator");
const DiskusiProduct = require("../models/DiskusiProduct");
const Product = require("../models/Product");

exports.addDiskusiProductById = async (req, res, next) => {
    try {
        const { comment } = req.body;
        const userId = req.params.userId;
        const productId = req.params.productId;
    
        const product = await Product.findOne({_id: productId})
        const isiComment = new DiskusiProduct({
            comment,
            userId
        })
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
        console.log('isi error comment ', error)
    }    
}

exports.getAllDiskusiProductById = () => {
    try {
        const diskusiId = req.params.diskudiId;
        const getDiskusiId = await DiskusiProduct.findById(diskusiId)
        res.status(200).json({
            message: 'data product berhasil dibuat',
            data: getDiskusiId
        })
    } catch (error) {
        next(error);
    }
}