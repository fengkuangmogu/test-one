const User = require('../model/user');
const Article = require('../model/article');
const Comment = require('../model/comment');
const fs = require('fs');
const { join } = require('path');

module.exports.addPage = async function(ctx){
    let pageName = ctx.params.pageName;
    let arr = fs.readdirSync(join(__dirname, "../views/admin/"),{
        withFileTypes: true,
    });
    let flag = false;
    let pageNum = -1;
    arr.forEach(function(v,i){
        if(v.isFile()){
            let name = v.name.replace(/^(admin-)|(.pug)$/g, "")
            
            if(name == pageName){
                flag = true;
                pageNum = i;
            }
        }
        
    })
    
    if(flag){
        await ctx.render('./admin/admin-' + pageName,{
            title: '管理页面',
            session: ctx.session,
            pageNum,
        })
    }
}

// get comment list
module.exports.commentList = async function(ctx){
    // 获得当前用户所有的评论 每次5条
    let uid = ctx.session.uid;
    let page = ctx.request.page;
    page--;
    let limit = ctx.request.limit;

    const data = await Comment.find({user: uid})
    .sort('-created')
    .skip(limit * page)
    .limit(limit)
    .populate({
        path: 'commentTo',
        select: 'title'
    })
    .then(function(data){
        return data;
    })
    .catch(function(err){
        console.log(err)
    })

    ctx.body = {
        data,
        count: data.length,
        code: 0,
    }
}

// delete comment
module.exports.removeComment = async function(ctx){
    let res = {
        status: 1,
        msg: "删除成功"
    }
    let comId = ctx.request.body.commentId;
    Comment.findById(comId)
    .then(function(data) {
        data.remove();
    })
    .catch(function(err){
        console.log(err)
        res.status = 0;
        res.msg = err
    })

    ctx.body = res;
}

//update comment
module.exports.updateComment = async function(ctx){
    let comId = ctx.request.body.commentId;
    let content = ctx.request.body.content;
    let res = {
        status: 1,
        msg: "更新成功"
    }

    Comment.updateOne({_id: comId},{$set: {content: content}})
    .then(function(data){
        console.log(data)
    })
    .catch(function(err){
        console.log(err);
        res.status = 0;
        res.msg = err;
    })

    ctx.body = res;
}