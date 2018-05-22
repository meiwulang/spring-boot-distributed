/**
 * Created with JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-8-7
 * Time: 下午4:09
 * To change this template use File | Settings | File Templates.
 */

Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    //广告位置
    var ad_place_box=SUNLINE.DictComBox({
        id:"ad_place",
        hideLabel:true,
        displayField:"d_text",
        valueField:"d_text",
        renderTo:'ad_place_id',
        editable:false,
        labelAlign:'right',
        width:300
    },{d_type:"广告位置"});

    //开始日期
    var start_date=SUNLINE.ExtDateField({labelSeparator:'',id:'ad_stime',name:'start_date',hideLabel:true,width:175,gang:'ad_etime',start:true,renderTo:'ad_stime_id'});
    //结束日期
    var end_date=SUNLINE.ExtDateField({labelSeparator:'',id:'ad_etime',name:'end_date',hideLabel:true,width:170,gang:'ad_stime',renderTo:'ad_etime_id'});
    //编辑时赋值
    var select_id=['ad_place','ad_stime','ad_etime'];
    for(var si=0;si<select_id.length;si++){
        var this_id=select_id[si];
        var sv=$('input[name='+this_id+']').val();
        if(sv){
            if(this_id=='ad_place'){
                ad_place_box.store.add({d_text:sv});
                if(sv)Ext.getCmp(this_id).setValue(sv);
            }else{
                if(sv)Ext.getCmp(this_id).setValue(int2date(sv));
            }
        }
    }
    Ext.getCmp('ad_place').on({
        select:function(v,r){
            var row= r[0].data;
            $('input[name=ad_place]').val(row.d_text);
        }
    });
    start_date.on({
        select:function(v,r){
            date_fn();
        }
    });
    end_date.on({
        select:function(v,r){
            date_fn();
        }
    });

    function date_fn(){
        var start_val=Ext.Date.format(Ext.getCmp('ad_stime').getValue(),'Ymd');
        var end_val=Ext.Date.format(Ext.getCmp('ad_etime').getValue(),'Ymd');
        $('input[name=ad_stime]').val(start_val);
        $('input[name=ad_etime]').val(end_val);
    }
    /*alert( $app_public_path + 'Js/uploadify/uploadify.swf' );
    $('#file_upload').uploadify({
        auto:true,
        'swf'      : $app_public_path + 'Js/uploadify/uploadify.swf',
        'uploader':$__app__ + '/Upload/ajax_upload',
        // Put your options here
    });*/

    $('input[name=ad_sarea]').click(function(){
        //window.parent.attrWin.show();
        window.parent.attr_fn();
    });
});
//提交表单
function verifyForm(){
    //广告位置不能为空
    var ad_place=$('input[name=ad_place]').val();
    if(!ad_place){
        Ext.Msg.alert('友情提示','请选择对应广告位置！')
        return false;
    }
    return true;
};
window.sarea_val=function(t,c,type){
    var ad_sarea=$('input[name=ad_sarea]');
    var ad_sarea_code=$('input[name=ad_sarea_code]');
    if(type=='add'){
        ad_sarea.val(t);
        ad_sarea_code.val(c);
    }else{
        return ad_sarea.val();
    }
}
window.funcsub=function(t, is_complete){
    if(t == '保存'){
        var st = verifyForm();   //验证表单
        if(st){
            var post=$('#myform').serialize();
            Ext.Ajax.request({
                method: 'post',
                url:$__app__ + '/Adver/saveAdver',
                params: post,
                async:false, //同步
                success: function(data) {
                    var rsr=Ext.decode(data.responseText);
                    var msg=rsr.info;
                    if(rsr.code=='200'){
                        //Ext.Msg.alert("友情提示",msg);
                        //window.parent.parent.win.hide();
                        //window.parent.parent.store.reload();
                        is_complete(msg);
                    }else{
                        Ext.Msg.alert("友情提示",msg);
                        is_complete('');
                    }
                }
            });
        }
    }
};