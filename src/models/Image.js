const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const imageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Image', imageSchema)