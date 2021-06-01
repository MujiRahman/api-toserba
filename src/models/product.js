const mongoose = require('mongoose');
const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const Product = new schema({
    title: {
        type: String,
        required: true,
        max: 100
    },
    jumlahBarang: {
        type: Number,
        required: true
    },
    body: {
        type: String,
        required: true,
        min: 4
    },
    imageId: [{
        type: ObjectId,
        required: 'Image'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId:{
        type: ObjectId,
        ref: 'User'
    },
},{
    timestamps: true
});

module.exports = mongoose.model('Product', Product)