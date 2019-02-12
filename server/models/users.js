const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('mongoose-bcrypt')

const Schema = mongoose.Schema

const usersSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true,
        rounds: 6
    },
    active: Boolean,
    admin: Boolean,
    recipes: [{
        type: Schema.Types.ObjectId,
        ref: 'Recipes'
    }],
    favs: [{
        type: Schema.Types.ObjectId,
        ref: 'Recipes'
    }],

})

mongoose.plugin(uniqueValidator)
mongoose.plugin(bcrypt)

module.exports = mongoose.model('Users', usersSchema)