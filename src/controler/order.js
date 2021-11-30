const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const e = require('cors');

// client melakukan order barang
exports.addOrder = async ( req, res, next ) => {
    try {
        const userClient = req.user._id;
        const {productId} = req.params;
        const { namaBarang, jumlahBarang, totalHarga, harga, alamat, note } = req.body;
        console.log('isi order', req.body)
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                message: 'inputan yang anda masukan salah mohon koreksi ulang',
                data: errors.array() });
        }
        const clientOrder = await User.findOne({_id: userClient})
        const cariProductAdmin =await Product.findOne({_id: productId})
        if ( cariProductAdmin.jumlahBarang === 0) {
            res.status(400)
            throw new Error('No order items')
        } else {
            cariProductAdmin.jumlahBarang = cariProductAdmin.jumlahBarang - jumlahBarang
            cariProductAdmin.terjual = cariProductAdmin.terjual + jumlahBarang
            
            console.log('isi admin', cariProductAdmin.jumlahBarang,cariProductAdmin.terjual)
            const newOrder = {
                namaBarang,
                jumlahBarang,
                totalHarga,
                alamat,
                note,
                harga,
                product: productId,
                nama: clientOrder.nama,
                userId: userClient,
                imageProduct:  `images/${cariProductAdmin.imageId[0]}`
            }
            const order = await Order.create(newOrder)
            clientOrder.orderId.push({_id: order._id});
            const userAdmin = cariProductAdmin.userId
            const userAdm = await User.findOne({_id: userAdmin})
            userAdm.pesenanId.push({_id: order._id});
            await userAdm.save()
            await clientOrder.save()
            await cariProductAdmin.save()
            res.status(200).json({
                message: 'order berhasil',
                data: order
            });
        }
    } catch (error) {
        next(error)
    }
}

// admin memeriksa apakah ada orderan..
exports.getAllOrder = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findOne({_id: userId}).populate('pesenanId')
        if (user) {
            res.status(200).json({
                message: 'data order telah berhasil dipanggil',
                data: user.pesenanId ,
            })
        } else{
            res.status(200).json({
                message: 'data product by user kosong',
            })
        }
    } catch (error) {
        next(error)
    }
}

// admin mengambill 1 data order
exports.getOrderById = async (req, res, next) => {
    try {
        const pesenan = await Order.findById(req.params.pesenanId)
        if (pesenan) {
            res.status(200).json({
                message: 'update sedang dikirim success',
                data: pesenan
            })
        } else {
            res.status(404)
            throw new Error('Order not found')
        }
    } catch (error) {
        next(error)
    }
}

// admin memnerima update dan langsung mengirim barangnya
exports.updateOrder = async (req, res, next) => {
    try {
        const {pesenanId} = req.params;
        const dikirim = await Order.findOne({_id: pesenanId})
        if(dikirim) {
            dikirim.dikirim= true
            await dikirim.save();
            res.status(200).json({
                message: 'update sedang dikirim success',
                data: dikirim
            })
        } else{
            res.status(404)
            throw new Error('Order not found')
        }
    } catch (error) {
        next(error)
    }
}

// client menerima notifikasi bahwa barang telah dikirim
exports.getUpdateOrder = async (req, res, next) => {
    try {
        const {orderId} = req.params;
        const dikirim = await Order.findOne({_id: orderId})
        console.log('isi order update', orderId, dikirim)
        if(dikirim.dikirim == true) {
            dikirim.sampai = true;
            dikirim.deliveredAt = Date.now()
            const update = await dikirim.save();
            res.status(200).json({
                message: 'update sedang sampai success',
                data: update
            })
        } else{
            res.status(404)
            throw new Error('Order not found')
        }
    } catch (error) {
        next(error)
    }
}

// log client order
exports.logClientOrder = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const client = await User.findOne({_id: userId}).populate('orderId')
        res.status(200).json({
            message: 'update sedang sampai success',
            data: client.orderId
        })
    } catch (error) {
        next(error)
    }
}
