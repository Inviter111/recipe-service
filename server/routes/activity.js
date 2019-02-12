const Router = require('koa-router')
const jwt = require('jsonwebtoken')

const checkAuth = require('../middleware/auth')
const Users = require('../models/users')
const Recipes = require('../models/recipes')

const router = new Router()

router.get('/', checkAuth, async ctx => {
    const userId = await DecodeToken(ctx)
    const user = await Users.findOne({ _id: userId })
    if (!user.admin) ctx.throw(401)
    const recipes = await Recipes.find({}, 'creationDate', {
        sort: {
            creationDate: -1
        }
    })
    let date = new Date()
    const oneHour = 60 * 60 * 1000
    let count, counts = []
    for (let i = 1; i < 49; i++) {
        count = 0
        for (recipe of recipes) {
            if (recipe.creationDate.getHours() == date.getHours() && recipe.creationDate.getDate() == date.getDate() && recipe.creationDate.getMonth() == date.getMonth() && recipe.creationDate.getFullYear() == date.getFullYear()) {
                count++
            }
        }
        date = new Date(date.getTime() - oneHour)
        counts.push(count)
    }
    ctx.body = { counts }
})

async function DecodeToken(ctx) {
    const token = await ctx.req.headers.authorization.split(' ')[1]
    if (!token) ctx.throw(401)
    return jwt.decode(token).userId
}

module.exports = router