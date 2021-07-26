const mongoose = require('mongoose');
const schemaa = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const Order = new schemaa({
    userId:{
        required: true,
        type: ObjectId,
        ref: 'User'
    },
    productId:{
        required: true,
        type: ObjectId,
        ref: 'Product'
    },
    imageId: {
        type: ObjectId,
        ref: 'Image'
    },
    namaBarang:{
        required:true,
        type: String
    },
    jumlahBarang: {
        required:true,
        type: String
    },
    totalHarga:{
        type: Number,
        required: true,
        default: 0.0,
    },
    alamat:{
        required:true,
        type: String
    },
    note:{
        type: String
    },
    dikirim:{
        type: Boolean,
        required: true,
        default: false,
    },
    sampai:{
        type: Boolean,
        required: true,
        default: false,
    },
    sampaiTTD:{
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },

},
{
    timestamps: true,
})

module.exports = mongoose.Model('Order', Order);