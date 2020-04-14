layui.use(['layedit', 'form', 'layer', 'element'], function(){
    var layedit = layui.layedit;
    var form = layui.form;
    var layer = layui.layer;
    var $ = layui.$;

    var index = layedit.build('demo',{
        height: 400,
        uploadImage: {url: '/upload/', type: 'post'},
    }); //建立编辑器

    //监听提交
    form.on('submit(addArticle)', function(data){
        var title = data.field.title;
        var tips = data.field.tips;

        var content = layedit.getContent(index);
        if(layedit.getText(index).trim().length == 0){
            return layer.msg('请输入内容')
        }

        var data = {
            title,
            tips,
            content,
        }

        $.post('/article/add', data, function(data){
            console.log(data)
            if(data.status){
                layer.alert(data.msg, function(){
                    location.href = "/";
                })
            }else{
                layer.alert(data.msg)
            }
        })


        
    });
});