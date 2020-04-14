layui.use(['layedit', 'laypage', 'element', 'layer'],function(){
    var laypage = layui.laypage;
    var layedit = layui.layedit;
    var layer = layui.layer;
    var $ = layui.$;

    var articleId = $(".article h2").attr("data-id");
    var maxNum = $("#laypage").attr("data-max");

    
    var index = layedit.build('layedit'); //建立编辑器

    var $commentBtn = $("#comment-submit");
    $commentBtn.on('click', function(){
        if(layedit.getText(index).trim().length == 0){
            return layer.msg('请输入评论内容')
        }else{
            var commentContent = layedit.getContent(index);
            var commentTo = location.pathname.replace("/article/", "");
            console.log(commentTo)

            var data = {
                content: commentContent,
                commentTo,
            }
            $.post('/comment/add', data, function(data){
                if(data.status){
                    layer.alert(data.msg, function(){
                        location.href = location.pathname;
                    })
                }else{
                    layer.alert(data.msg)
                }
                
            })
        }
        
    })

    if(maxNum == 0) return;

    laypage.render({
        elem: 'laypage',
        count: maxNum,
        limit: $("#laypage").attr("data-limit"),
        groups: 2,
        curr: location.pathname.replace("/article/" + articleId + "/page/","") || 1,
        jump: function(obj, first){
            $("#laypage a").each(function(i, v){
                var page = $(v).attr("data-page");
                $(v).prop("href", "/article/" + articleId +"/page/" + page);
            })
        }
    });

})