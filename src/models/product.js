const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Product = new schema({
    namaBarang: {
        type: String,
        required: true,
        max: 100
    },
    jumlahBarang: {
        type: Number,
        required: true
    },
    detailBarang: {
        type: String,
        required: true,
        min: 4
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Product', Product)