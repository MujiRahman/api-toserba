const mongoose = require('mongoose')
const schema = mongoose.Schema;
const { ObjectId } = mongoose.schema;

const Category = new schema({
    nama: {
        type: String,
        required: true
    },
    productId : {
        type: ObjectId,
        ref: 'Product'
    }
})

module.exports = mongoose.model('Category', Category)