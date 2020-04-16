const { db } = require('../schema/connect')
const articleSchema = require('../schema/article');
const Article = db.model("articles", articleSchema);

module.exports = Article;