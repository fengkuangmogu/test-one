const mongoose = require('mongoose');

const db = mongoose.createConnection('mongodb://localhost:27017/testone', {useNewUrlParser: true});

const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

db.on('error', function(){
    console.log("数据库连接失败。")
})

db.on('open', function(){
    console.log("数据库testone连接成功。");
})

module.exports = {
    db,
    Schema
};