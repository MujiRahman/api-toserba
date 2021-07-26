const Product = require("../models/product");
const Order = require("../models/Order");
const User = require("../models/User")

// kranjang
// proses
// dikirim
// sampai

// client melakukan order barang
export const addOrder = async ( req, res, next ) => {
    try {
        const { nama, jumlahBarang, totalHarga, alamat, note } = req.body;
        const userClient = req.user._id;
        const productIdAdmin = req.params.productId;
        const clientOrder = await User.findOne({_id: userClient})
        const cariProductAdmin =await Product.findOne({_id: productIdAdmin})
        // const order = await Product.findOne({_id: cariProductAdmin})
        if (cariProductAdmin.jumlahBarang === 0) {
            res.status(400)
            throw new Error('No order items')
        } else {
            cariProductAdmin.jumlahBarang - jumlahBarang
            const newOrder = new Order({
                nama,
                jumlahBarang,
                totalHarga,
                alamat,
                note,
                userId: userClient,
                imageId:  `images/${req.file.filename}`
            })
            const order = await Order.create(newOrder)
            clientOrder.orderId.push({_id: order._id});
            await cariProductAdmin.userId.save()
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
export const getAllOrder = async (req, res, next) => {
    try {
        const userId = req.user._id;
        // const currentPage = req.query.page || 1;
        // const perPage = req.query.perPage || 3;
        let totalProduct;
    
        const user = await User.findOne({_id: userId})
        user.orderId.find()
        res.status(200).json({
            message: 'data product by user telah berhasil dipanggil',
            data: user,
            // total_data: totalProduct,
            // per_page: parseInt(perPage),
            // current_page: parseInt(currentPage)
        })
        // .countDocuments()
        // .then( count => {
        //     totalProduct = count;
        //     return user.orderId.find()
        //     .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        //     .limit(parseInt(perPage));
        // })
        // .then( result => {
        //     res.status(200).json({
        //         message: 'data product by user telah berhasil dipanggil',
        //         data: result,
        //         total_data: totalProduct,
        //         per_page: parseInt(perPage),
        //         current_page: parseInt(currentPage)
        //     })
        // })
    } catch (error) {
        next(error)
    }
    // .catch( err => {
    //     console.log('isi err get all', err);
    //     next(err)
    // })
}

// admin mengambill 1 data order
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId).populate(
            {path:'userId',
            select:'name email'}
        )
        if (order) {
            res.json(order)
        } else {
            res.status(404)
            throw new Error('Order not found')
        }
    } catch (error) {
        next(error)
    }
}

// admin memnerima update dan langsung mengirim barangnya
export const updateOrder = async (req, res, next) => {
    try {
        const order = req.params.orderId;
        const dikirim = await Order.findOne({_id: order})
        if(dikirim) {
            dikirim.dikirim= true
            const update = await dikirim.save();
            res.status(200).json({
                message: 'update sedang dikirim success',
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

// client menerima notifikasi bahwa barang telah dikirim
export const getUpdateOrder = async (req, res, next) => {
    try {
        const order = req.params.orderId;
        const dikirim = await Order.findOne({_id: order})
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
export const logClientOrder = async (req, res, next) => {
    try {
        const logClient = await User.orderId.find({user : req.user._id})
    } catch (error) {
        next(error)
    }
}
