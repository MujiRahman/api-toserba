const mongoose = require('mongoose');
const schemaa = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const Order = new schemaa({
    userId:{
        type: ObjectId,
        ref: 'User'
    },
    nama:{
        // required:true,
        type: String
    },
    product:{
        type: String
    },
    imageProduct: {
        type: String,
        
    },
    namaBarang:{
        required:true,
        type: String
    },
    jumlahBarang: {
        required:true,
        type: Number
    },
    harga:{
        require: true,
        type:Number
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

module.exports = mongoose.model('Order', Order);