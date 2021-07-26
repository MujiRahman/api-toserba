const DiskusiProduct = require("../models/DiskusiProduct");
const SubDiskusi = require("../models/SubDiskusi");

exports.addSubDiskusi = async (req, res, next) => {
    try {
        const { comment } = req.body;
        const userId = req.user._id;
        const diskusiId = req.params.diskusiId;
    
        const diskusi = await DiskusiProduct.findOne({_id: diskusiId})
        const isiComment = new SubDiskusi({
            comment,
            userId
        })
        const buatComment = await SubDiskusi.create(isiComment);
        subDiskusi.diskusiId.push({_id: buatComment._id});
        await diskusi.save();
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

exports.getAllSubDiskusi = async (req, res, next) => {
    try {
        const diskusiId = req.params.diskusiId;
        const subDiskusi = await DiskusiProduct.findOne({_id: diskusiId})
        subDiskusi.diskusiId.find()
        res.status(200).json({
            message: 'data product berhasil dibuat',
            data: getSubDiskusi
        })
    } catch (error) {
        next(error);
    }
}
