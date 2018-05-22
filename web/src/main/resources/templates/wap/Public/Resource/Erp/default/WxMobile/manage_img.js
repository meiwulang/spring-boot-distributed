$(function(){
    mySwiper = new Swiper('.swiper-container',{
        pagination: '.pagination',
        paginationClickable: true,
        loop:true,
        grabCursor: false
    });
    $(".weui_uploader_file").click(function(e){
        var text=$('.del-img-span').text();
        if(text=='取消'){
            if($(this).hasClass('new')){
                $(this).removeClass('new');
                $(this).addClass('old');
            }else{
                $(this).removeClass('old');
                $(this).addClass('new');
            }
        }else{
            e.preventDefault();
            alert_show($(this))
        }
    });

    $('.J-slider').click(function(){
        $('.J-slider').fadeOut(300);
        $(document).scrollTop(topheight);
    })

    $('.del-img-span').click(function(){
        if($(this).text()=='选择'){
            $('.weui_uploader_file').addClass('old');
            $(this).text('取消');
        }else if($(this).text()=='取消'){
            $('.weui_uploader_file').removeClass('old');
            $('.weui_uploader_file').removeClass('new');
            $(this).text('选择');
        }
    })

    //上传凭证按钮
    $('.upload-button').click(function(){
        var team_id=$(this).attr('team_id');
        window.location.href=$__app__+"/WxMobile/upload_img?team_id="+team_id;
    })

    //删除凭证函数
    $('.del-button').click(function(){
        var ids=[];
        var obj=$('.new');
        obj.each(function(v){
            ids.push($(this).attr('data-id'));
        })
        if(ids.length<=0){
            $.alert({msg:'请选择要删除的凭证!'});
            return false;
        }
        $('#loadingToast').css({ 'display':'block'});
        $.ajax({
            url:$__app__+'/WxMobile/del_img',
            type:'POST',
            data:{ 'ids':ids},
            success:function(v){
                if(v.status==1){
                    obj.css({ 'display':'none'});
                    $('#loadingToast').css({ 'display':'none'});
                    msg_show();
                }else{
                    $.alert({msg: v.info});
                    $('#loadingToast').css({ 'display':'none'});
                }
            }
        });
    })

    function msg_show(){
        $('#msg').css({'display':'block'});
        setTimeout(function(){
            $('#msg').css({'display':'none'});
        },1500);
    }

    function alert_show(this_obj){
        $('#alert').css({'display':'block'});
        setTimeout(function(){
            $('#alert').css({'display':'none'});
            var pic=this_obj.parent();
            var img_obj=pic.find('img');
            var pic_str='';
            var width=Math.floor($(window).width()*0.98);
            var height=Math.floor($(window).height()*0.98);
            var index=img_obj.index(this_obj.find('img'));
            //index=index;
            mySwiper.removeAllSlides();
            img_obj.each(function(index,item){
                // pic_str+='<div class="swiper-slide"><img style="vertical-align: middle;" class="lazy" src="http://weyoui-timeline.qiniudn.com/'+$(this).attr('key')+'?imageMogr2/thumbnail/'+width+'x'+height+'>"></div>';
                pic_str='<img style="vertical-align: middle;max-width:'+width+'px;max-height:'+height+'px;" class="lazy" src="'+$(this).attr('src')+'">';
                // alert(pic_str);
                mySwiper.createSlide(pic_str,'swiper-slide').append();
            });
            topheight=$(document).scrollTop();
            $('.swiper-slide').css('line-height',$(window).height()+'px');
            $('.J-slider').show();
            mySwiper.init();
            mySwiper.swipeTo(index);
        },800);
    }
})