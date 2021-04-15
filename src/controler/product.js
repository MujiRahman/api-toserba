const { validationResult } = require("express-validator")

exports.createProduct = (req, res, next) => {
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

}