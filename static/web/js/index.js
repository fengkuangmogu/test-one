layui.use(['element', 'laypage'], function(){
    var element = layui.element;
    var laypage = layui.laypage;
    var $ = layui.$;
    var maxNum = $("#laypage").attr("data-max")

    if(maxNum == 0) return;

    laypage.render({
        elem: 'laypage',
        count: maxNum,
        limit: $("#laypage").attr("data-limit"),
        groups: 2,
        curr: location.pathname.replace("/article/page/",""),
        jump: function(obj, first){
            $("#laypage a").each(function(i, v){
                var page = $(v).attr("data-page");
                $(v).prop("href", "/article/page/" + page);
            })
        }
    });     
});

