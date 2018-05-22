$(function(){
    window.multiFile_fn();
    var card_img=$('.card-img');
    $.each(card_img,function(i,v){
        var old=$(this).find('.card-content');
        if(old[0]){
            $(this).find('.x-multifile-wrap').hide();
        }
    })
    $('.fa-remove').click(function(){
        $(this).parents('.card-img').find('.x-multifile-wrap').show();
        $(this).parents('.card-l').find('.form-id').val('');
        $(this).parent().remove();
    })

    $('input[name=u_vip_card]').blur(function(){
        var data=$('input[name=u_vip_card]').val();
        var result=CardChk(data);
        if(result.start!=1){
            $('input[name=u_vip_card]').css('border-color','red');
        }else{
            $('input[name=u_vip_card]').css('border-color','#DDD');
        }
    })

      $('.fa-search').click(function(){
            var src=$(this).parents('.card-l').find('img').attr('src');
            top.view_big_pic(src);
     })

})


function multiFile_fn(cls){
    cls=cls?cls:'';
    X.multiFile({ selector: cls+'.card-just .card-img',
        requestText:function(e,t,i){
            var card=url_id(i);
            var row=e.responseText;
            var data = row;
            if (typeof msg != 'object')
                data = eval("(" + row + ")");
            if(data.status==0){
                Ext.Msg.alert('友情提示',data.msg);
                t.deleteFile(0);
            }else{
                var rs=data.msg;
                rs=rs[0];
                card.url.value=rs.at_url;
                card.id.value=rs.id;
            }
        },DeleteIdFn:function(t){
            var card=url_id(t);
            card.url.value='';
            card.id.value='';
        }
    });
    X.multiFile({ selector: cls+'.card-versa .card-img',extraData:{ at_class:'认证附件'},
        requestText:function(e,t,i){
            var card=url_id(i);
            var row=e.responseText;
            var data = row;
            if (typeof msg != 'object')
                data = eval("(" + row + ")");
            if(data.status==1){
                card.url.value=data.info[0]['savepath']+data.info[0]['savename'];
            }else{
                var rs=data.info;
                rs=rs[0];
                card.url.value=rs.savepath+rs.savename;
            }
        },DeleteIdFn:function(t){
            var card=url_id(t);
            card.url.value='';
            //card.id.value='';
        }
    });
};

function url_id(i){
    var _this=i.parentNode;
    var children_id=_this.children;
    var card_url,card_id;
    for(var j=0;j<children_id.length;j++){
        var cls=children_id[j].className;
        if(cls.indexOf('card-url')>=0) card_url=children_id[j];
        if(cls.indexOf('card-id')>=0) card_id=children_id[j];
    }
    return { url:card_url,id:card_id}
}
function cardData(){
    var data={},return_data={};
     data['u_card']=$('input[name=u_vip_card]').val();
     data['u_card_back']=$('#u_card_back').val();
     data['u_card_front']=$('#u_card_front').val();
     data['gu_card']=$('input[name=g_vip_card]').val();
     data['gu_card_front']=$('#gu_card_front').val();
     var result=CardChk(data['u_card']);
     if(result.start!='1'){
         return_data.status=false;
         return_data.msg='请输入正确的身份证号';
     }else if(data['u_card_front']==''){
         return_data.status=false;
         return_data.msg='请上传身份证正面图片';
     }else if(data['u_card_back']==''){
         return_data.status=false;
         return_data.msg='请上传身份证反面图片';
     }else if(data['gu_card']==''){
         return_data.status=false;
         return_data.msg='请输入导游证号';
     }else if(data['gu_card_front']==''){
         return_data.status=false;
         return_data.msg='请上传导游证图片';
     }else{
         return_data.status=true;
         return_data.data=data;
     }
     return return_data;
}
