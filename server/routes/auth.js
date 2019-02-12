const Router = require('koa-router')
const jwt = require('jsonwebtoken')

const checkAuth = require('../middleware/auth')
const Users = require('../models/users')

const router = new Router()

router.post('/register', async ctx => {
    await Users({
        username: ctx.request.body.username,
        password: ctx.request.body.password,
        active: true,
        admin: false,
        recipes: [],
        favs: []
    }).save()
    ctx.throw(201)
})

router.post('/login', async ctx => {
    const user = await Users.findOne({ username: ctx.request.body.username })
    if (!user) ctx.throw(401)
    const result = await user.verifyPassword(ctx.request.body.password)
    if (!result) ctx.throw(401)
    const token = jwt.sign({
        username: user.username,
        userId: user._id,
        admin: user.admin,
        active: user.active
    }, 'secretKey', {                               // In case that anybody can decode this token
        expiresIn: '24h'                            // let's say that no one wont take access to it
    })
    ctx.body = { token }
})

router.get('/user', checkAuth, async ctx => {
    const userId = await DecodeToken(ctx)
    const user = await Users.findOne({ _id: userId })
    ctx.body = { user }
})

router.get('/users', checkAuth, async ctx => {
    const userId = await DecodeToken(ctx)
    const user = await Users.findOne({ _id: userId })
    if (!user.admin) ctx.throw(401)
    const users = await Users.find()
    ctx.body = { users }
})

router.get('/user/:id', checkAuth, async ctx => {
    const userId = await DecodeToken(ctx)
    const user = await Users.findOne({ _id: userId })
    if (!user.admin) ctx.throw(401)
    const editUser = await Users.findOne({ _id: ctx.params.id })
    ctx.body = {
        username: editUser.username,
        active: editUser.active,
        admin: editUser.admin,
        createdRecipes: editUser.recipes,
        createdRecipesCount: editUser.recipes.length,
        favorites: editUser.favs
    }
})

router.put('/user/:id', checkAuth, async ctx => {
    const userId = await DecodeToken(ctx)
    const user = await Users.findOne({ _id: userId })
    if (user.admin || ctx.params.id == userId) {
        const password = ctx.request.body.password
        await Users.findOne({ _id: ctx.params.id }, async (err, user) => {
            if (err) ctx.throw(err)
            user.username = ctx.request.body.username
            user.password = password ? password : user.password
            user.active = ctx.request.body.active
            user.admin = ctx.request.body.admin
            await user.save()
        })
        ctx.body = 200
    } else {
        ctx.throw(401)
    }
})

router.delete('/user/:id', checkAuth, async ctx => {
    const userId = await DecodeToken(ctx)
    const user = await Users.findOne({ _id: userId })
    if (!user.admin) ctx.throw(401)
    await Users.findOneAndDelete({ _id: ctx.params.id })
    ctx.body = 200
})

async function DecodeToken(ctx) {
    const token = await ctx.req.headers.authorization.split(' ')[1]
    if (!token) ctx.throw(401)
    return jwt.decode(token).userId
}

module.exports = router