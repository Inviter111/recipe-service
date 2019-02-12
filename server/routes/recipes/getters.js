const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const checkAuth = require('../../middleware/auth')

const Users = require('../../models/users')
const Recipes = require('../../models/recipes')

const router = new Router()

// All recipes
router.get('/', checkAuth, async ctx => {
    const tokenData = DecodeToken(ctx)
    const recipesQuery = await Recipes.find({}, null, {
        sort: {
            creationDate: -1
        }
    })
    const filteredQuery = QueryFilter(recipesQuery, tokenData)
    const recipes = ctx.query.p ? filteredQuery.slice((ctx.query.p - 1) * ctx.query.lim, ctx.query.p * ctx.query.lim) : filteredQuery
    ctx.body = {
        recipes,
        totalRecipes: filteredQuery.length
    }
})

// Get one recipe by id
router.get('/recipe/:id', checkAuth, async ctx => {
    const tokenData = DecodeToken(ctx)
    const recipe = await Recipes.findById(ctx.params.id)
    const author = await Recipes.findById(ctx.params.id, 'author').populate('author')
    recipe.author = author.author.username
    if (tokenData.admin || recipe.active || (tokenData.userId == recipe.author)) {
        ctx.body = {
            recipe,
            author: author.author.username,
            admin: tokenData.admin,
            username: tokenData.username
        }
    }
})

// Recipes by title
router.get('/title', checkAuth, async ctx => {
    const tokenData = DecodeToken(ctx)
    const recipesQuery = await Recipes.find({ title: { $regex: ctx.query.title, $options: 'i' } }, null, {
        sort: {
            creationDate: -1
        }
    })
    const filteredQuery = QueryFilter(recipesQuery, tokenData)
    ctx.body = {
        recipes: filteredQuery.slice((ctx.query.p - 1) * ctx.query.lim, ctx.query.p * ctx.query.lim),
        totalRecipes: filteredQuery.length
    }
})

// Recipes by type
router.get('/recipeType', checkAuth, async ctx => {
    const tokenData = DecodeToken(ctx)
    const recipesQuery = await Recipes.find({ recipeType: ctx.query.recipeType }, null, {
        sort: {
            creationDate: -1
        }
    })
    const filteredQuery = QueryFilter(recipesQuery, tokenData)
    ctx.body = {
        recipes: filteredQuery.slice((ctx.query.p - 1) * ctx.query.lim, ctx.query.p * ctx.query.lim),
        totalRecipes: filteredQuery.length
    }
})

// Recipes by hashtags
router.get('/hashtags', checkAuth, async ctx => {
    const tokenData = DecodeToken(ctx)
    const recipesQuery = await Recipes.find({ hashtags: { $all: ctx.query.hashtags } }, null, {
        sort: {
            creationDate: -1
        }
    })
    const filteredQuery = QueryFilter(recipesQuery, tokenData)
    ctx.body = {
        recipes: filteredQuery.slice((ctx.query.p - 1) * ctx.query.lim, ctx.query.p * ctx.query.lim),
        totalRecipes: filteredQuery.length
    }
})

// Top recipes
router.get('/top', checkAuth, async ctx => {
    const tokenData = DecodeToken(ctx)
    const paginateOptions = {
        sort: {
            likes: -1
        }
    }
    const recipesQuery = await Recipes.find({}, null, paginateOptions)
    const filteredQuery = QueryFilter(recipesQuery, tokenData)
    let sliceTo = 0
    if (ctx.query.total < ctx.query.p * ctx.query.lim) {
        sliceTo = ctx.query.total
    } else {
        sliceTo = ctx.query.p * ctx.query.lim
    }
    ctx.body = {
        recipes: filteredQuery.slice((ctx.query.p - 1) * ctx.query.lim, sliceTo),
        totalRecipes: filteredQuery.length < ctx.query.total ? filteredQuery.length : ctx.query.total
    }
})

// User's recipes
router.get('/myrecipes', checkAuth, async ctx => {
    const tokenData = DecodeToken(ctx)
    const userRecipesRaw = await Users.findById(tokenData.userId, 'recipes').populate('recipes')
    const userRecipes = QueryFilter(userRecipesRaw.recipes, tokenData)
    ctx.body = { recipes: userRecipes }
})

// User's favorite recipes
router.get('/fav', checkAuth, async ctx => {
    const tokenData = DecodeToken(ctx)
    const userFavsRaw = await Users.findById(mongoose.Types.ObjectId(tokenData.userId), 'favs').populate('favs')
    const userFavs = QueryFilter(userFavsRaw.favs, tokenData)
    ctx.body = userFavs
})

function QueryFilter(query, tokenData) {
    return query.filter(recipe => tokenData.admin ? true : !recipe.active ? false : tokenData.userId == recipe.author ? true : !recipe.private)
}

function DecodeToken(ctx) {
    const token = ctx.req.headers.authorization.split(' ')[1]
    return jwt.decode(token)
}

module.exports = router