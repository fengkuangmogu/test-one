const Router = require('koa-router')
const user = require('../control/user')
const article = require('../control/article')
const comment = require('../control/comment')
const admin = require('../control/admin')

const router = new Router

router.get("/", user.keepLogin, article.getListByPage)

// 获取用户登陆,注册页面
router.get(/^\/user\/(?=reg|login)/, async function(ctx){
    // show为真显示login, show为假显示reg
    let show = /login$/.test(ctx.path);
    let pageName = ctx.path.substring(ctx.path.lastIndexOf("/") + 1);
    let strO = {
        'reg': "注册",
        'login': "登录"
    }
    await ctx.render("web/loginAregist", {
        show, 
        pageName, // 页面名字
        title: strO[pageName], //页面title
    })
})

router.post("/user/reg", user.reg);

router.post("/user/login", user.login);

router.get('/user/logout', user.logout);

router.get('/article', user.keepLogin, article.addPage);

router.post('/article/add', article.add);

router.get('/article/page/:page', article.getListByPage);

router.get('/article/:id', article.getArticleById);

router.get('/article/:id/page/:page', article.getArticleByIdAndPage);

router.post('/comment/add', user.keepLogin, comment.addComment);

router.get('/admin/:pageName', user.keepLogin, admin.addPage);

router.post('/upload', user.keepLogin, user.updateAvatar)





module.exports = router