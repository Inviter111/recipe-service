const Router = require('koa-router')
const jwt = require('jsonwebtoken')

const checkAuth = require('../../middleware/auth')

const Users = require('../../models/users')
const Recipes = require('../../models/recipes')

const router = new Router()

// Recipe creation
router.post('/create', checkAuth, async ctx => {
    const tokenData = DecodeToken(ctx)
    if (!tokenData.username || !tokenData.active) ctx.throw(401)
    const recipe = await Recipes({
        title: ctx.request.body.title,
        description: ctx.request.body.description,
        steps: ctx.request.body.steps,
        completePhoto: {
            data: new Buffer.from(ctx.request.body.image.data, 'base64'),
            contentType: ctx.request.body.image.contentType
        },
        recipeType: ctx.request.body.recipeType,
        author: tokenData.userId,
        likes: 0,
        hashtags: ctx.request.body.hashtags.split(' '),
        active: true,
        editable: tokenData.admin ? ctx.request.body.editable : true,
        private: ctx.request.body.private,
        creationDate: Date.now()
    }).save()
    const user = await Users.findOne({ _id: tokenData.userId })
    user.recipes.push(recipe._id)
    await user.save()
    ctx.body = ctx.request.body
})

// Adding recipe to favorites
router.put('/fav/:id', checkAuth, async ctx => {
    const tokenData = DecodeToken(ctx)
    const userFavs = await Users.findById(tokenData.userId, 'favs')
    userFavs.favs.push(ctx.params.id)
    await userFavs.save()
    ctx.throw(200)
})

// Removing recipe from favorites
router.delete('/fav/:id', checkAuth, async ctx => {
    const tokenData = DecodeToken(ctx)
    const userFavs = await Users.findById(tokenData.userId, 'favs')
    userFavs.favs.remove(ctx.params.id)
    await userFavs.save()
    ctx.body = 200
})

// Editing recipe
router.put('/recipe/:id', checkAuth, async ctx => {
    const tokenData = DecodeToken(ctx)
    const recipe = await Recipes.findById(ctx.params.id)
    const recipeData = ctx.request.body
    if (tokenData.admin || recipe.author == tokenData.userId && recipe.editable) {
        recipe.title = recipeData.title
        recipe.description = recipeData.description
        recipe.steps = recipeData.steps
        recipeData.completePhoto.data && (recipe.completePhoto.data = new Buffer.from(recipeData.completePhoto.data, 'base64'))
        recipeData.completePhoto.contentType && (recipe.completePhoto.contentType = recipeData.completePhoto.contentType)
        recipe.recipeType = recipeData.recipeType
        recipe.hashtags = recipeData.hashtags[0] ? recipeData.hashtags.split(' ') : ['']
        recipe.editable = tokenData.admin ? recipeData.editable : true
        recipe.private = recipeData.private
        recipe.active = tokenData.admin ? recipeData.active : true
        await recipe.save()
    } else ctx.throw(403)
    ctx.body = recipe
})

router.delete('/recipe/:id', checkAuth, async ctx => {
    const tokenData = DecodeToken(ctx)
    const recipe = await Recipes.findById(ctx.params.id)
    if (tokenData.admin || recipe.author == tokenData.userId && recipe.editable) {
        await Recipes.deleteOne({ _id: ctx.params.id })
    }
    ctx.throw(200)
})

function DecodeToken(ctx) {
    const token = ctx.req.headers.authorization.split(' ')[1]
    return jwt.decode(token)
}

module.exports = router