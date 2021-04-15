const jwt = require('jsonwebtoken');
const secret = "$2b$10$OstRst1LWEfDyKEGdKcOKO"

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token')
    if(!token) return res.status(400).json({
        status: res.statusCode,
        message: 'Access Denied !'
    })
    try {
        const verified = jwt.verify(token, secret)        
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