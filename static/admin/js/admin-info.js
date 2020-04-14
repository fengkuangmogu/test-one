layui.use(['upload'], function(){
    var upload = layui.upload;
    var $ = layui.jquery;

    var uploadInst = upload.render({
        elem: '#avatarUpload',
        url: '/upload',
        // bindAction: '#uploadAction',
        // auto: false,
        choose: function(obj){
          obj.preview(function(index, file, result){
            $("#avatarPreview").prop("src", result)
          })
        },
        done: function(res){
          console.log(res)
        },
        error: function(err){
          console.log(err)
        }
    })
    
})