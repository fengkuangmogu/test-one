const { Schema } = require('./connect');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const articleSchema = new Schema({
    title: String,
    tips: String,
    content: String,
    author: {
        type: ObjectId,
        ref: 'users'
    },
},{
    versionKey: false,
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
})

module.exports = articleSchema;