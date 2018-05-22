/**
 * Created by Administrator on 16-3-24.
 */
$(function(){

    //点击地图变大
    $('.map-big').click(function(){
        var map_id=$('.map-id');
        if($(this).html()=='点击放大'){
            map_id.css({
                'width':'1002px',
                'height':'500px',
                'margin-left':'0px'
            });
            $(this).html('点击缩小');
        }else{
            map_id.css({
                'width':'250px',
                'height':'240px',
                'margin-left':'10px'
            });
            $(this).html('点击放大');
        }

    });
    var image=$('#box .y-image .tu-image');
    /*image.hover(function(){
     var url=$(this).attr("data_url");
     $('#mouse_img').attr({"src":url});
     $('#mouse_img').show();
     $(this).bind('mouseover',function(event){
     x=event.clientX+'px';
     y=event.clientY+'px';
     $('#mouse_img').css({left:x})
     $('#mouse_img').css({top:y})
     })
     alert($('#mouse_img').css('left'))

     },function(){
     var url=$(this).attr("data_url");
     $('#mouse_img').attr({"src":''});
     $('#mouse_img').hide();
     })*/
    var ShowImage = function () {
        xOffset = 10;
        yOffset = 30;
        image.hover(function (e) {
            var url=$(this).attr("data_url");
            $('#mouse_img').attr("src",url);
            $("#imgshow").css({"top":(e.pageY - xOffset) + "px","left":(e.pageX + yOffset) + "px"}).fadeIn("slow");
        }, function () {
            $('#mouse_img').hide();
        });

    };
    ShowImage();


})

