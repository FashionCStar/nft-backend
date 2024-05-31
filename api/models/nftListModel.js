'use strict'
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var NFTSchema = new Schema({
    nft_id: Number,

    collects: String,
    artType: String,
    name: String,
    description: String,
    creatorAddr: String,

    hash: String,
    imgURL: String,

    price: Number,
    ownerAddr: String,

    favUserIds: [Number],

    img: { data: Buffer, contentType: String}
}, {collection: 'nft'})

module.exports = mongoose.model('nft', NFTSchema)