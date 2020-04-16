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
    commentNum: {
       type: Number,
       default: 0,
    },
},{
    versionKey: false,
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
})

articleSchema.post("remove", function(doc){
    // 删除文章的钩子
    // 删除文章下面的所有评论
    const Comment = require('../model/comment');
    Comment.find({commentTo: doc._id})
    .then(function(data){
        data.forEach(function(v, i) {
            v.remove();
        })
    })
    .catch(function(err){
        console.log(err);
    });
})

module.exports = articleSchema;