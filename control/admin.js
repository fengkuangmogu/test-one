const userSchema = require('../schema/user');
const articleSchema = require('../schema/article');
const commentSchema = require('../schema/comment');
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