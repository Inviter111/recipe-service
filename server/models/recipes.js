const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('mongoose-bcrypt')

const Schema = mongoose.Schema

const recipesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    steps: {
        type: String,
        required: true
    },
    completePhoto: {
        data: Buffer,
        contentType: String
    },
    recipeType: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    likes: {
        type: Number,
        required: true
    },
    hashtags: [String],
    active: {
        type: Boolean,
        required: true
    },
    editable: {
        type: Boolean,
        required: true
    },
    private: {
        type: Boolean,
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    }
})

mongoose.plugin(uniqueValidator)
mongoose.plugin(bcrypt)

module.exports = mongoose.model('Recipes', recipesSchema)