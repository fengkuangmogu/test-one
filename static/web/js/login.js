layui.use('form', function(){
    var form = layui.form;
    
    //监听提交
    form.on('submit(login)', function(data){
        console.log(data);
        layer.msg(JSON.stringify(data.field));
        
    });

    //监听提交
    form.on('submit(reg)', function(data){
        console.log(data);
        layer.msg(JSON.stringify(data.field));
        
    });
});