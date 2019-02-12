const jwt = require('jsonwebtoken')

module.exports = async (ctx, next) => {
    try {
        const token = ctx.req.headers.authorization.split(' ')[1] // JWT saves header token in 'Bearer *token*' form
        const decodedToken = await jwt.verify(token, 'secretKey')
        ctx.req.userData = {
            username: decodedToken.username,
            userId: decodedToken.userId
        }
        return next()
    }
    catch (err) {
        ctx.throw(401, { err })
    }
}