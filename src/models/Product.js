const mongoose = require('mongoose');
const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const Product = new schema({
    nama: {
        type: String,
        required: true,
        max: 100
    },
    merek:{
        type: String,
        required:true
    },
    harga:{
        type: Number,
        required:true,
        default: 0,
    },
    jumlahBarang: {
        type: Number,
        required: true
    },
    deskripsi: {
        type: String,
        required: true,
        min: 4
    },
    categoryId:{
        type: ObjectId,
        ref: 'Category',
    },
    diskusiId:[{
        type:ObjectId,
        ref: 'DiskusiProduct'
    }],
    imageId: [{
        type: ObjectId,
        ref: 'Image'
    }],
    userId:{
        type: ObjectId,
        ref: 'User'
    },
    ulasanId:[{
        type: ObjectId,
        ref: 'Ulasan',
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
},{
    timestamps: true
});

module.exports = mongoose.model('Product', Product)