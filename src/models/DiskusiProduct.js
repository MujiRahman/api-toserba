const mongoose = require('mongoose');
const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const DiskusiProduct = new schema({
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

module.exports = mongoose.model('DiskusiProduct', DiskusiProduct);