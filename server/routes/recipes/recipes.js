const Router = require('koa-router')

const getters = require('./getters')
const setters = require('./setters')

const router = new Router()

router.use(getters.routes())
router.use(setters.routes())

module.exports = router