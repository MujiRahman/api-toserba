const mongoose = require('mongoose');
const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const Ulasan = new schema({
    nama: {
        type: String,
        required: true
    },
    rating: { 
        type: Number,
        required: true 
    },
    comment: { 
        type: String, 
        required: true 
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User',
    },
    productId: {
        type: ObjectId,
        ref: 'Product',
        required: true,
    }

})

module.exports = mongoose.model('Ulasan', Ulasan)