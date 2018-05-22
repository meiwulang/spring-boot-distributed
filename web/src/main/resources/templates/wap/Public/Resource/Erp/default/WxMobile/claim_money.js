/**
 * Created by Administrator on 16-4-7.
 */
$(function(){

    $('.weui_btn_area').click(function(){
        var ad_id=$('input[name=ad_id]').val();
        var cr_claim_remark=$('input[name=cr_claim_remark]').val();
        if(!cr_claim_remark){
            $.alert({msg:'请填写备注信息!'});
            return;
        }
        var data={};
        data['ad_id']=ad_id;
        data['cr_claim_remark']=cr_claim_remark;
        msg_show();
        var obj=$(this).find('a');
        $.ajax({
            url:$__app__+'/Claim/claim',
            type:'POST',
            data:data,
            success:function(v){
                if(v.status==1){
                    window.location.href="/WxMobile/claim";
                }else{
                    $.alert({msg:v.info});
                }
            }
        });
    })

    function msg_show(){
        $('#loadingToast').css({'display':'inline-block'});
        setTimeout(function(){
            $('#loadingToast').css({'display':'none'});
        },2000);
    }



})