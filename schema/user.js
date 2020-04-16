const { Schema } = require('./connect')

const userSchema = new Schema({
    username: String,
    password: String,
    avatar: {
        type: String,
        default: '/avatar/mm.jpg'
    },
    role: {
        type: Number,
        default: 1, // 普通用户 没有用户管理
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
});

module.exports = userSchema;