const commentSchema = require('../schema/comment');
const { db } = require('../schema/connect');

const commentModel = db.model("comments", commentSchema);

exports.addComment = async function(ctx){
    let reqData = ctx.request.body;

    if(ctx.session.isNew){
        return ctx.body = {
            msg: '请登录后评论',
            status: "0",
        }
    }
    
    reqData.user = ctx.session.uid;
    reqData.ups = 0;
    
    await new Promise(function(reject, resolve){
        new commentModel(reqData).save(function(data, err){
            if(err) return reject(err);

            resolve(data);
        })
    })
    .then(function(data){
        ctx.body = {
            msg: '评论成功',
            status: "1",
        }
    })
    .catch(function(err){
        console.log(err)
        ctx.body = {
            msg: '评论失败',
            status: "0",
        }
    })
    
}