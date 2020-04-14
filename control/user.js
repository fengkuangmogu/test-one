const { db } = require('../schema/connect');
const userSchema = require('../schema/user');
const { sha } = require('../util/encrypt')
const fs = require('fs');
const { join } = require('path')


// 通过db创建一个操作数据库的模型对象
const userModel = db.model("users", userSchema);

// 用户注册
module.exports.reg = async function(ctx){
    let reqData = ctx.request.body;

    let username = reqData.username;
    let password = reqData.password;

    // 去数据库查询是否存在此username
    await new Promise(function(resolve,reject){
        userModel.find({username}, function(err, data){
            if(err) return reject(err);
            if(data.length !== 0){
                // 数据库存在此username
                return resolve("");
            }else{
                // 数据库不存在此username
                let userNew = new userModel({
                    username,
                    password: sha(password),
                })

                userNew.save(function(err, data){
                    if(err){
                        reject(err)
                    }else[
                        resolve(data)
                    ]
                })
            }
        })
    })
    .then(async function(data){
        if(data){
            // 注册成功
            await ctx.render('web/isOk', {
                status: '注册成功',
            })
        }else{
            // 用户名已经存在
            await ctx.render('web/isOk', {
                status: '用户名已经存在',
            })
        }
    })
    .catch(async function(err){
        await ctx.render('web/isOk', {
            status: '注册失败，请重试'
        })
    })
}

// 用户登录
module.exports.login = async function(ctx){
    let reqData = ctx.request.body;

    let username = reqData.username;
    let password = reqData.password;
    let encryPasswrd = sha(password);

    await new Promise(function(resolve, reject){
        userModel.find({username}, function(err, data){
            if(err) return reject(err);

            if(data.length === 0){
                return reject("");
            }

            if(data[0].password === sha(password)){
                return resolve(data);
            }

            resolve("");
        })
    })
    .then(async function(data){
        if(!data){
            await ctx.render('web/isOk', {
                status: '密码错误'
            })
        }else{
            // 登录成功则注册下前端的cookie

            ctx.cookies.set("username", username, {
                domain: 'localhost',
                path: '/',
                maxAge: 36e5,
                overwrite: false,
                httpOnly: true,
            })

            ctx.cookies.set("uid", data[0]._id, {
                domain: 'localhost',
                path: '/',
                maxAge: 36e5,
                overwrite: false,
                httpOnly: true,
            })

            ctx.cookies.set("role", data[0].role, {
                domain: 'localhost',
                path: '/',
                maxAge: 36e5,
                overwrite: false,
                httpOnly: true,
            })

            ctx.cookies.set("avatar", data[0].avatar, {
                domain: 'localhost',
                path: '/',
                maxAge: 36e5,
                overwrite: false,
                httpOnly: true,
            })

            ctx.session = {
                username,
                uid: data[0]._id,
                avatar: data[0].avatar,
                role: data[0].role,
            }

            await ctx.render('web/isOk', {
                status: '登录成功'
            })
        }
       
    })
    .catch(async function(err){
        if(!err){
            await ctx.render('web/isOk', {
                status: '用户名不存在'
            })
        }else{
            await ctx.render('web/isOk', {
                status: '登录失败'
            })
        }
    })
}

// 判断用户登录状态 是否保持登录
module.exports.keepLogin = async function(ctx, next){
    if(ctx.session.isNew){
        // user has not logged in
        if(ctx.cookies.get('username')){
            ctx.session = {
                username: ctx.cookies.get('username'),
                uid: ctx.cookies.get('uid'),
                avatar: ctx.cookies.get('avatar'),
                role: ctx.cookies.get('role'),
            }
        }
        
    }else{
        // user has already logged in
    }

    await next()
}

// 用户退出登录
module.exports.logout = async function(ctx){
    ctx.session = null;
    ctx.cookies.set('username', null, {
        maxAge: 0,
    });
    ctx.cookies.set('uid', null, {
        maxAge: 0,
    })

    ctx.redirect('/');
}

//
module.exports.updateAvatar = async function(ctx){
    let resp = {
        status: "0",
        msg: "上传失败"
    }

    if(ctx.session.isNew){
        resp.status = "1";
        resp.msg = "请用户登录之后再上传";
        return ctx.body = resp;
    }

    let image = ctx.request.files.file;
    let filePath = join(__dirname, "../static/upload/");

    if(!fs.existsSync(filePath)){
        fs.mkdir(filePath, function(err){
            if(err) {
                resp.status = "0";
                resp.msg = "上传文件夹创建失败"
                return console.log(err);
            }
        })
    }

    let fullName = image.name;
    let name = fullName.substring(0, fullName.lastIndexOf("."));
    fullName = fullName.replace(name, name + new Date().getTime());
    let fileResource = filePath + fullName;

    let reader = fs.createReadStream(image.path);
    let upstream = fs.createWriteStream(fileResource);

    reader.pipe(upstream);

    let user = new userModel({
        _id: ctx.session.uid,
        avatar: "/upload" + fullName
    })

    // 数据库里存上传的图片
    userModel
    .updateOne({_id: ctx.session.uid}, {avatar: "/upload/" + fullName}, function(err, data){
        if(err) {
            resp.status = "0";
            resp.msg = "数据库更新失败";
            return console.log(err);
        }
    })
    
    // 删除服务器上以前的头像
    if(new RegExp(/upload/).test(ctx.session.avatar)){
        let oldName = ctx.session.avatar.replace("/upload/", "");
        fs.unlink(filePath + oldName, (err) => {
            if (err) return console.log(err);
            console.log('文件已删除');
        });
    }
    
    // session中的头像地址变化
    ctx.session.avatar = "/upload/" + fullName;

    resp.status = "1";
    resp.msg = "上传成功"
    ctx.body = resp;
}