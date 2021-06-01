const jwt = require('jsonwebtoken');
require('dotenv/config')

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token')
    if(!token) return res.status(400).json({
        status: res.statusCode,
        message: 'Access Denied !'
    })
    try {
        const verified = jwt.verify(token, process.env.secret)        
        req.user = verified
        next() 

    }catch(err){
        res.status(400).json({
            status: res.statusCode,
            message: 'Invalid Token !'
        })
    }
}

module.exports = verifyToken