'use strict'
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CollectSchema = new Schema({
    col_id: Number,
    name: String,
    description: String,
    creator: {
        id: Number,
        name: String,
        email: String
    },
    status: String
})

module.exports = mongoose.model('collect', CollectSchema)