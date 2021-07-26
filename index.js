const express = require ('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv/config')

const app = express();
const apiAuth = require('./src/routes/user');

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))

// mengatasi err cors origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTION');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}) 

app.use('/api/user',apiAuth);

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