const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const SubDiskusi = new Schema({
    comment: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User',
    },
    diskusiProductId: {
        type: ObjectId,
        required: true,
        ref: 'DiskusiProduct'
    }
})

module.exports = mongoose.model('SubDiskusi', SubDiskusi)