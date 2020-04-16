const { db } = require('../schema/connect')
const commentSchema = require('../schema/comment');
const Comment = db.model("comments", commentSchema);

module.exports = Comment;