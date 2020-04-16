const { db } = require('../schema/connect')
const userSchema = require('../schema/user');
const User = db.model("users", userSchema);

module.exports = User;