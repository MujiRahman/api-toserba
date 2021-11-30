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
    rePassword: {
        type: String
    },
    noHp: {
        type: String,
    },
    alamat: {
        type: String
    },
    asalKota: {
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
        ref: 'Order'
    }],
    pesenanId: [{
        type: ObjectId,
        ref: 'Order'
    }]
})

module.exports = mongoose.model('User', UserSchema);