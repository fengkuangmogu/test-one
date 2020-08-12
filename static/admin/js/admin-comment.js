layui.use(['element', 'table', 'layer', 'layedit'], function(){
    var $ = layui.$;
    var table = layui.table;
    var layer = layui.layer;
    var layedit = layui.layedit;

    table.render({
        elem: "#commentList",
        limit: 5,
    });
    var lyedit = layedit.build('commentContent', {
        tool:[],
        height: 100
    });

    

    table.on('tool(coList)', function(obj){
        var layEvent = obj.event;
        var data = obj.data;

        if(layEvent == "detail"){

        }else if(layEvent == "delete"){
            var req = {
                commentId: data._id
            }
            $.ajax({
                url: '/admin/removeComment',
                method: 'post',
                data: req,
                success: function(data){
                    
                    if(data.status){
                        table.reload("commentList");
                    }
                }
            })

        }else if(layEvent == "edit"){
            var layerIndex = layer.open({
                type: 1,
                content: $(".box"),
                area: ['600px', '300px'],
                btn:['update', 'close'],
                yes: function(){
                    var content = layedit.getContent(lyedit);
                    var req = {
                        content,
                        commentId: data._id
                    }
                    $.ajax({
                        url: '/admin/updateComment',
                        method: 'post',
                        data: req,
                        success: function(data){
                            layer.msg(data.msg, function(){
                                table.reload("commentList");
                                layer.close(layerIndex);
                            });
                            
                        }
                    })
                },
                cancel: function(index, layero){

                }
            })
        }
    })

    
})