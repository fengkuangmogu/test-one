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

module.exports = commentSchema;