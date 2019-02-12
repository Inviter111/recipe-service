const Router = require('koa-router')

const auth = require('./auth')
const recipes = require('./recipes/recipes')
const activity = require('./activity')

const router = new Router()

router.use('/api/auth', auth.routes())
router.use('/api/recipes', recipes.routes())
router.use('/api/activity', activity.routes())

module.exports = router