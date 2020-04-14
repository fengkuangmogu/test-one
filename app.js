const Koa = require('koa')
const logger = require('koa-logger')
const router = require('./routers/router')
const static = require('koa-static')
const views = require('koa-views')
const koaBody = require('koa-body')
const session = require('koa-session')
const { join } = require('path')
const fs = require('fs')

const app = new Koa

app.keys = ['some secret hurr'];

let CONFIG = {
  key: 'sid',
  maxAge: 60*60*1000,
  httpOnly: true,
  rolling: true,
}

// 配置请求log
// app.use(logger())

// 配置 post 请求的数据
app.use(koaBody({
  multipart: true
}))

// 配置 session
app.use(session(CONFIG, app))

// 配置静态文件，例如 css js
app.use(static(join(__dirname, "static")));

// 配置页面文件 后缀为pug
app.use(views(join(__dirname, "views"),{extension: 'pug'}))


app
  .use(router.routes()).use(router.allowedMethods())
  .listen(3001,function(){
      console.log('服务器启动在端口3001')
  })

{
  // 项目启动则创建(username:admin password:admin)账户
  const { db } = require('./schema/connect')
  const  userSchema = require('./schema/user')
  const { sha } = require('./util/encrypt')
  const User = db.model("users", userSchema);

  let username = "admin";

  let admin = new User({
    username,
    password: sha(username),
    role: 666,
  })

  User.find({username}, function(err, data){
    if(err) return console.log(err)

    //success
    if(data.length == 0){
      // none user named admin, then save admin user
      admin.save(function(err){
        if(err) return console.log(err);
    
        //saved
        console.log("管理员账号创建成功(username -> admin, password -> admin)");
      })
    }else{
      console.log("管理员账号(username -> admin, password -> admin)");
    }    
  }) 
}
