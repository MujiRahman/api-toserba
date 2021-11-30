const mongoose = require('mongoose');
const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const Diskusi = new schema({
    comment: { 
        type: String, 
        required: true, 
    },
    userId: {
        type: ObjectId,
        ref: 'User',
    },
    imageProfil: {
        type: String,
    },
    nama:{
        type:String
    },
    productId: {
        type: ObjectId,
        ref: 'Product',
    },
    subDiskusiId: {
        type: ObjectId,
        ref: 'SubDiskusi'
    }
})

module.exports = mongoose.model('DiskusiProduct', Diskusi);