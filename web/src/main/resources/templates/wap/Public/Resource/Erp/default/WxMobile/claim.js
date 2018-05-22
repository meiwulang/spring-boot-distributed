/**
 * Created by Administrator on 16-4-7.
 */
$(function(){
    $('.click-td').click(function(){
        var obj=$(this).parents('.click-tr').next();
        if(obj.is(':hidden')){
            obj.slideDown();
        }else{
            obj.slideUp();
        }
    });

    $('.guide-tab .tab-body div').click(function(){
        $('.over').removeClass('over');
        $(this).addClass('over');
    });

    $('.pay').click(function(){
        $('.guide').css({'display':'none'});
        $('.guidebill').css({'display':'inline-block'});
    });

    $('.earning').click(function(){
        $('.guide').css({'display':'inline-block'});
        $('.guidebill').css({'display':'none'});
    });

    function msg_show(){
        $('#msg').css({'display':'inline-block'});
        setTimeout(function(){
            $('#msg').css({'display':'none'});
        },2000);
    }

    $('.fa-edit').click(function(){
        var ad_id=$(this).attr('ad_id');
        window.location.href=$__app__+"/WxMobile/claim_money?ad_id="+ad_id;
    })

})