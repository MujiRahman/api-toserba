const { validationResult } = require("express-validator");
const Ulasan = require("../models/Ulasan");

exports.addUlasan = () => {
    try {
        const { ulasan, rating } = req.body;
        const userId = req.params.userId;
        const productId = req.params.productId;
    
        const product = await Product.findOne({_id: productId})
        const isiUlasan = new Ulasan({
            ulasan,
            rating,
            userId
        })
        const buatUlasan = await Ulasan.create(isiUlasan);
        product.ulasanId.push({_id: buatUlasan._id});
        await product.save();
        res.status(200).json({
            message: 'buat Ulasan berhasil',
            data: buatUlasan,
            isi_id_product: product
        })
    } catch (error) {
        next(error);
        console.log('isi error Ulasan ', error)
    } 
}

exports.getAllUlasan = () => {

}
