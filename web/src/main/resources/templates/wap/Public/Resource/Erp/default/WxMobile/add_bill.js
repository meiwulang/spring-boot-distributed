/**
 * Created by Administrator on 16-4-7.
 */
$(function(){

    //选择购物店 获取到所有购物店
    $('.subject_type').blur(function(){
        var type=$(this).val();
        var st_obj=$('#st_id');
        var  sp_obj=$('#sp_id');
        if(type=='购物店'){
            $('#si_money').val(0);
            $('#si_money').attr('readonly','readonly');
            $('#si_settle').val(0);
            $('#si_insti_name').val('');
            $('.no-store').css({'display':'none'});
            $('.store').css({'display':'block'});
            $.ajax({
                url:$__app__+'/WxMobile/get_store',
                type:'POST',
                success:function(v){
                    if(v.status=1){
                        var data= v.info;
                       var html='';
                        for(var i=0;i< data.length;i++){
                            html+='<option value="'+data[i]['st_id']+'">'+data[i]['st_name']+'</option>';
                        }
                        st_obj.html(html);
                        get_price();
                    }
                }
            });
        }else{
            st_obj.html('');
            sp_obj.html('');
            $('#sp_day_money').val(0);
            $('#sp_one_price').val(0);
            $('#sp_pct_num').val(0);
            $('#sp_name').val('');
            $('#st_name').val('');
            $('#sp_id').val('');
            $('#si_money').val(0);
            $('#si_money').removeAttr('readonly');
            $('.store').css({'display':'none'});
            $('.no-store').css({'display':'block'});
        }
    })

    //选择到购物店 获取政策信息
    function get_price(){
        $('#st_id').blur(function(){
            var store=$(this).val();
            $('#st_name').val($(this).find("option:selected").text());
            var obj=$('#sp_id');
            $.ajax({
                url:$__app__+'/WxMobile/get_store_price',
                type:'POST',
                data:{'st_id':store},
                success:function(v){
                    if(v.status==1){
                        var data= v.info;
                        var html='';
                        for(var i=0;i< data.length;i++){
                            html+='<option value="'+data[i]['sp_id']+'">'+data[i]['sp_one_price']+'元/人,'+data[i]['sp_pct_num']+'%</option>';
                        }
                        obj.html(html);
                    }
                }
            });
        })
    }

    //单价
    $('#si_settle').blur(function(){
        var settle=$(this).val();
        var count=$('#si_count').val();
        var num=parseFloat(settle*count).toFixed(2);
        $('#si_money').val(num);
    });

     //总价
    $('#si_money').blur(function(){
        var type=$('input[name=subject_type]').val();
        if(type!='购物店'){
            var money=$(this).val();
            var count=$('#si_count').val();
            var num=parseFloat(money/count).toFixed(2);
            $('#si_settle').val(num);
        }
    });

    //流水金额
    $('#sp_day_money').blur(function(){
        var str=$('#sp_id').find("option:selected").text();
        $('#sp_name').val(str);
        var arr=str.split(',');
        $('#sp_one_price').val(arr[0]);
        $('#sp_pct_num').val(arr[1]);
        var pct_num=parseFloat(arr[1]);
        var one_price=parseFloat(arr[0]);
        var sp_day_money=parseFloat($('#sp_day_money').val());
        var si_count=parseFloat($('#si_count').val());
        var num=(parseFloat(pct_num*sp_day_money/100)+parseFloat(one_price*si_count)).toFixed(2);
        $('#si_money').val(num);
    });

    //人数
    $('#si_count').blur(function(){
        var type=$('input[name=subject_type]').val();
        if(type!='购物店'){
            var settle=$(this).val();
            var count=$('#si_settle').val();
            $('#si_money').val((settle*count).toFixed(2));
        }else{
            var str=$('#sp_id').find("option:selected").text();
            $('#sp_name').val(str);
            var arr=str.split(',');
            $('#sp_one_price').val(arr[0]);
            $('#sp_pct_num').val(arr[1]);
            var pct_num=parseFloat(arr[1]);
            var one_price=parseFloat(arr[0]);
            var sp_day_money=parseFloat($('#sp_day_money').val());
            var si_count=parseFloat($('#si_count').val());
            var num=(parseFloat(pct_num*sp_day_money/100)+parseFloat(one_price*si_count)).toFixed(2);
            $('#si_money').val(num);
        }

    });

    //结算类型
    $('#si_settle_type').blur(function(){
        var obj=$('.si_qd_num');
        if($(this).val()=='签单'){
            obj.css({'display':'inline-block'});
        }else{
            $('#si_qd_num').val('');
            obj.css({'display':'none'});
        }
    });

    $('.upload-btn').click(function(){
        var data={};
        var type_list={
            项目名称:'si_name',
            结算单位:'si_insti_name',
            项目类型:'si_status',
            结算类型:'si_settle_type',
            费用类型:'si_subject',
            第几天:'si_day',
            单价:'si_settle',
            人数:'si_count'
        };
        var store_list={
            项目名称:'si_name',
            购物店:'st_name',
            项目类型:'si_status',
            商店政策:'sp_name',
            结算类型:'si_settle_type',
            费用类型:'si_subject',
            第几天:'si_day',
            人数:'si_count',
            流水金额:'si_day_money'
        };

        var list={
            si_id:'si_id',
            si_team_id:'si_team_id',
            si_status:'si_status',
            si_name:'si_name',
            si_insti_name:'si_insti_name',
            si_settle_type:'si_settle_type',
            si_subject:'si_subject',
            si_day:'si_day',
            si_settle:'si_settle',
            si_money:'si_money',
            si_qd_num:'si_qd_num',
            si_count:'si_count',
            si_remark:'si_remark',
            si_edit_num:'si_edit_num',
            st_name:'st_name',
            sp_id:'sp_id',
            sp_name:'sp_name',
            sp_pct_num:'sp_pct_num',
            sp_one_price:'sp_one_price',
            sp_day_money:'sp_day_money'
        };
        if($('#si_subject').val()!='购物店'){
            for(index in type_list){
                if($('#'+type_list[index]).val()==''){
                    $.alert({msg:index+'不能为空'});
                    return false;
                }
            }
        }else{
            for(index_store in store_list){
                if($('#'+store_list[index_store]).val()==''){
                    $.alert({msg:index_store+'不能为空'});
                    return false;
                }
            }
        }
        for(index in list){
            if($('#'+list[index]).val()!=''){
                data[index]=$('#'+list[index]).val();
            }
        }
        var obj=$(this).find('a');
        $.ajax({
            url:$__app__+'/WxMobile/addbill',
            type:'POST',
            data:data,
            success:function(v){
                if(v.status==1){
                    $.toast({
                        msg: v.info,
                        time:2000,
                        callback:function(){
                            window.location.href=$__app__+"/WxMobile/guide_bill?team_id="+data['si_team_id']+'&status=1';
                        }
                    });
                }else{
                    $.toast({
                        msg: v.info,
                        time:2000,
                        error:true,
                        callback:function(){
                            obj.html('提交');
                        }
                    });
                }
            }
        });
    })

})