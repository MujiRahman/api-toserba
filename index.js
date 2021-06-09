const express = require ('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const multer = require('multer');
// const path = require('path');
require('dotenv/config')

const app = express();
const apiAuth = require('./src/routes/user');
const apiProduct = require('./src/routes/product');

// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images');
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().getTime() + '' + file.originalname)
//     }
// })

// const fileFilter = (req, file, cb) => {
//     if(
//         file.mimetype === 'image/png' ||
//         file.mimetype === 'image/jpg' ||
//         file.mimetype === 'image/jpeg'
//     ) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }

app.use(bodyParser.json());
// app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

// mengatasi err cors origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTION');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}) 

app.use('/api/user',apiAuth);
app.use('/api/product',apiProduct);


app.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({message: message, data: data});
})

mongoose.connect(process.env.DB_CONNECTION1, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true,})
.then(()=> {
    app.listen(process.env.PORT, ()=> console.log('conection success'))
})
.catch((err)=>{
    console.log('isi error dimongodb sing angelan nemen coba maneh', err)
})