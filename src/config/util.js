const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const secret = "$2b$10$OstRst1LWEfDyKEGdKcOKO"

exports.hashPassword = password => {
    return bcrypt.hash(password, secret)
}

exports.comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash)
}

exports.generateJwt = payload => {
    return jwt.sign(payload, secret,{
        expiresIn: '24h'
    })
}

exports.verifyJwt = token => {
    jwt.verify(token, secret)
}