layui.use(['element'], function(){
    var $ = layui.$;

    $.ajax({
        url: '/admin/commentList',
        method: 'get',
        success: function(data){
            
        }
    })
})