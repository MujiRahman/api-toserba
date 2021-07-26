const mongoose = require('mongoose');
const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const UserSchema = new schema({
    nama: {
        type:String,
        required: true,
        max: 255
    },
    imageProfil: {
        type: String,
    },
    // imageId: [{
    //     type: ObjectId,
    //     ref: 'Image'
    // }],
    email: {
        type: String,
        required: true,
        max: 100
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    noHp: {
        type: String,
    },
    alamat: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    productId: [{
        type: ObjectId,
        ref: 'Product'
    }],
    orderId: [{
        type: ObjectId,
        ref: 'Product'
    }]
})

module.exports = mongoose.model('User', UserSchema);