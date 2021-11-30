const mongoose = require('mongoose');
const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const ulasanProduct = new schema({
    rating: { 
        type: Number,
        required: true 
    },
    ulasan: { 
        type: String, 
        required: true 
    },
    userId: {
        type: ObjectId,
        ref: 'User',
    },
    productId: {
        type: ObjectId,
        ref: 'Product',
    },
    userNama:{
        type: String
    },
    gambar:{
        type:String
    }

})

module.exports = mongoose.model('Ulasan', ulasanProduct);