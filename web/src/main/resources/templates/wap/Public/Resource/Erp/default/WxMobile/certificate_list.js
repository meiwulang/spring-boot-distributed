$(function(){
    var ajax_flag=false;
    $('.del-img-span').click(function(){
        var type=$(this).html();
        if(type=='选择'){
            $('.weui_uploader_file').addClass('cert-unselected');
            $(this).text('取消');
        }else{
            $('.weui_uploader_file').removeClass('cert-unselected');
            $('.weui_uploader_file').removeClass('cert-selected');
            $(this).text('选择');
        }
    })
    $(".weui_uploader_file").click(function(e){
        var text=$('.del-img-span').text();
        if(text=='取消'){
            if($(this).hasClass('cert-selected')){
                $(this).removeClass('cert-selected');
                $(this).addClass('cert-unselected');
            }else{
                $(this).removeClass('cert-unselected');
                $(this).addClass('cert-selected');
            }
        }else{
            e.preventDefault();
            alert_show($(this));
        }
    });

    //删除凭证函数
    $('.del-btn').click(function(){
        var ids=[];
        var obj=$('.cert-selected');
        obj.each(function(v){
            ids.push($(this).attr('data-id'));
        })
        if(ids.length<=0){
            $.alert({msg:'请选择要删除的凭证!'});
            return false;
        }
        $.confirm({
            msg:'删除后无法恢复，确认？',
            ok:function(){
                if(ajax_flag){
                    return false;
                }
                ajax_flag=true;
                $.loding({time:-1});
                $.ajax({
                    url:$__app__+'/WxMobile/del_certificate',
                    type:'POST',
                    data:{ids:ids,team_id:$('input[name=team_id]').val()},
                    success:function(v){
                        ajax_flag=false;
                        $.loding({close:true});
                        if(v.status){
                            $.toast({
                                time:2000,
                                msg:v.info,
                                callback:function(){
                                    obj.remove();
                                    $('.del-img-span').click();
                                }
                            });
                        }else{
                            $.alert({msg: v.info});
                        }
                    },
                    error:function(){
                        ajax_flag=false;
                        $.loding({close:true});
                        $.alert({ msg:"传输错误，请重试"});
                    }
                });
            }
        })
    })
    mySwiper = new Swiper('.swiper-container',{
        pagination: '.pagination',
        paginationClickable: true,
        loop:true,
        grabCursor: false
    });

    $('.J-slider').click(function(){
        $('.J-slider').fadeOut(300);
    })

    function alert_show(this_obj){
        $('.notice-div').show();
        $('.notice-div').fadeOut(3000);
        var pic=this_obj.parent();
        var img_obj=pic.find('img');
        var pic_str='';
        var width=Math.floor($(window).width()*0.98);
        var height=Math.floor($(window).height()*0.98);
        var index=img_obj.index(this_obj.find('img'));
        //index=index;
        mySwiper.removeAllSlides();
        img_obj.each(function(index,item){
            pic_str='<img style="vertical-align: middle;max-width:'+width+'px;max-height:'+height+'px;" class="lazy" src="'+$(this).attr('src')+'">';
            mySwiper.createSlide(pic_str,'swiper-slide').append();
        });
        $('.swiper-slide').css('line-height',$(window).height()+'px');
        $('.J-slider').show();
        mySwiper.init();
        mySwiper.swipeTo(index);
    }
})