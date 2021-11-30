const DiskusiProduct = require("../models/DiskusiProduct");
const SubDiskusi = require("../models/SubDiskusi");
const { validationResult } = require("express-validator");

exports.addSubDiskusi = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        const { comment } = req.body;
        const userId = req.user._id;
        const diskusiId = req.params.diskusiId;

        if(!errors.isEmpty()){
            const err = new Error('inputan yang anda masukan salah')
            err.errorStatus = 400;
            err.data = errors.array();
            throw err;
        }
    
        const diskusi1 = await DiskusiProduct.findOne({_id: diskusiId})
        const isiComment1 ={
            comment,
            userId,
        }
        const buatComment1 = await SubDiskusi.create(isiComment1)
        diskusi1.subDiskusiId.push({_id: buatComment1._id})
        await diskusi1.save();
        res.status(200).json({
            message: 'buat comment berhasil',
            data: buatComment1,
            isi_id_product: diskusi1
        })
    } catch (error) {
        next(error);
    } 
}

exports.getAllSubDiskusi = async (req, res, next) => {
    try {
        const diskusiId = req.params.diskusiId;
        const subDiskusi = await DiskusiProduct.findOne({_id: diskusiId}).populate('subDiskusiId')
        res.status(200).json({
            message: 'data product berhasil dibuat',
            data: subDiskusi
        })
    } catch (error) {
        next(error);
    }
}
