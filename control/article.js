const Article = require('../model/article');
const Comment = require('../model/comment');

module.exports.addPage = async function(ctx){
    await ctx.render('web/addArticle', {
        title: '添加文章',
        session: ctx.session
    });
}

// 新增文章
module.exports.add = async function(ctx){
    let reqData = ctx.request.body;

    if(ctx.session.isNew){
        return ctx.body = {
            status: "0",
            msg: "用户未登录"
        }
    }

    reqData.author = ctx.session.uid;

    await new Promise(function(reject, resolve){
        new Article(reqData).save(function(data, err){
            if(err) return reject(err);

            resolve(data);
        })
    })
    .then(function(data){
        return ctx.body = {
            status: "1",
            msg: "发表成功"
        }
    })
    .catch(function(err){
        console.log(err)
        return ctx.body = {
            status: "0",
            msg: "发表失败"
        }
    })

}

module.exports.getListByPage = async function(ctx){
    let reqData = ctx.request.body;

    let limitNum = 3;
    let page = ctx.params.page || 1;
    page--;

    // get article counts
    const maxNum = await Article.estimatedDocumentCount().then(function(data){
        return data;
    })
    .catch(function(err){
        console.log(err);
    })

    // get article list refer to page number
    const articleList = await Article
        .find()
        .sort('-created')
        .skip(limitNum * page)
        .limit(limitNum)
        .populate({
            path: 'author',
            select: 'username _id avatar'
        })
        .then(function(data){
            return data;
        })
        .catch(function(err){
            console.log(err)
        });

    await ctx.render('web/index',{
        session: ctx.session,
        title: '首页',
        articleList,
        maxNum,
        limitNum,
    })
}

module.exports.getArticleById = async function(ctx){
    let id = ctx.params.id;
    let page = 1;
    page--;
    let limitNum = 5;

    // get article detail refer to id
    const article = await Article
    .findOne({_id: id})
    .populate({
        path: 'author',
        select: '_id username avatar'
    })
    .then(function(data){
        return data
    })
    .catch(function(err){
        console.log(err);
    })
    
    // get count of comments
    const maxNum = await Comment
    .countDocuments({commentTo: id})
    .then(function(data){
        return data;
    })
    .catch(function(err){
        console.log(err);
    })

    // get  comments refer to article id
    const commentList = await Comment
    .find({commentTo: id})
    .populate({
        path: 'commentTo',
        select: '_id title'
    })
    .populate({
        path: 'user',
        select: '_id username avatar'
    })
    .skip(limitNum * page)
    .limit(limitNum)
    .then(function(data){
        return data;
    })
    .catch(function(err){
        console.log(err);
    })
    
    await ctx.render("web/articleDetail", {
        title: "文章详情",
        session: ctx.session,
        article,
        commentList,
        maxNum,
        limitNum,
    })
}

module.exports.getArticleByIdAndPage = async function(ctx){
    let id = ctx.params.id;
    let page = ctx.params.page;
    page--;

    let limitNum = 5;

     // get article detail refer to id
     const article = await Article
     .findOne({_id: id})
     .populate({
         path: 'author',
         select: '_id username avatar'
     })
     .then(function(data){
         return data
     })
     .catch(function(err){
         console.log(err);
     })
     
     // get count of comments
     const maxNum = await Comment
     .countDocuments({commentTo: id})
     .then(function(data){
         return data;
     })
     .catch(function(err){
         console.log(err);
     })

    // get  comments refer to article id
    const commentList = await Comment
    .find({commentTo: id})
    .populate({
        path: 'commentTo',
        select: '_id title'
    })
    .populate({
        path: 'user',
        select: '_id username avatar'
    })
    .skip(limitNum * page)
    .limit(limitNum)
    .then(function(data){
        return data;
    })
    .catch(function(err){
        console.log(err);
    })

    await ctx.render("web/articleDetail", {
        title: "文章详情",
        session: ctx.session,
        article,
        commentList,
        maxNum,
        limitNum,
    })
}