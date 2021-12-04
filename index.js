const express = require ('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv/config')
const app = express();
app.use(morgan('dev'))
app.use(cors())

const Image = require('./src/models/Image')
const apiAuth = require('./src/routes/user');
const apiProduct = require('./src/routes/product');
const apiDiskusi = require('./src/routes/diskusiProduct');
const apiSubDiskusi = require('./src/routes/subDiskusiProduct')
const apiUlasan = require('./src/routes/ulasanProduct')
const apiOrder = require('./src/routes/order')


// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true}));

app.use('/images/:fileName', (req,res) => {
    const file = __dirname + `/images/${req.params.fileName}`;
    res.sendFile(file)
} )
app.use('/imagesById/images/:imageId', async (req,res) => {
    const gambar = req.params.imageId
    const image = await Image.findOne({_id: gambar})
    const file = __dirname + `/${image.imageUrl}`;
    res.sendFile(file)
} )
app.use('/imagesId/:imageId', async (req,res) => {
    const gambar = req.params.imageId
    const image = await Image.findOne({_id: gambar})
    const file = __dirname + `/${image.imageUrl}`;
    res.sendFile(file)
} )
app.use('/api/user',apiAuth);
app.use('/api/product', apiProduct);
app.use('/api/diskusi', apiDiskusi);
app.use('/api/subDiskusi', apiSubDiskusi);
app.use('/api/ulasan', apiUlasan);
app.use('/api/order', apiOrder);

app.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
})

mongoose.connect(process.env.DB_CONNECTION, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true,})
.then(()=> {
    app.listen(process.env.PORT, ()=> console.log('conection success'))
})
.catch((err)=>{
    console.log('isi error dimongodb sing angelan nemen coba maneh', err)
})