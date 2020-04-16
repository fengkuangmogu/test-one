const { Schema } = require('./connect');
const ObjectId = Schema.Types.ObjectId;

const commentSchema = new Schema({
    user: {
        type: ObjectId,
        ref: "users"
    },
    content: String,
    ups: Number,
    commentTo: {
        type: ObjectId,
        ref: "articles"
    }
},{
    versionKey: false,
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
    }
})

commentSchema.post("save", function(doc){
    // 评论保存的钩子hooks 
    // article表里的commentNum++
    const Article = require('../model/article');
    Article.findByIdAndUpdate(doc.commentTo, { $inc : { commentNum : 1}}, function(err, data){
        if(err) return console.log(err);
    })
    // user表里的commentNum++
    const User = require('../model/user');
    User.findByIdAndUpdate(doc.user, { $inc : { commentNum : 1}}, function(err, data){
        if(err) return console.log(err);
    })
})

commentSchema.post("remove", function(doc){
    // 评论删除的钩子
    // article表里的commentNum--
    const Article = require('../model/article');
    Article.findByIdAndUpdate(doc.commentTo, { $inc : { commentNum : -1}}, function(err, data){
        if(err) return console.log(err);
    })
    // user表里的commentNum--
    const User = require('../model/user');
    User.findByIdAndUpdate(doc.user, { $inc : { commentNum : -1}}, function(err, data){
        if(err) return console.log(err);
    })
})

module.exports = commentSchema;