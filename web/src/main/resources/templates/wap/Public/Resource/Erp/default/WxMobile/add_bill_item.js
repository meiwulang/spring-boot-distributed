/**
 * Created by Administrator on 16-4-7.
 */
$(function(){
    var edit_flag=$('#si_id').val();
    if(edit_flag!=''){
        var subject=$('#si_subject').val();
        if(subject!='其它'){
            var si_name_id=$('#si_name_id').val();
            if(si_name_id){
                var param={type:subject,org_id:si_name_id};
                $.ajax({
                    url:$__app__+'/WxMobile/get_resource_item',
                    type:'post',
                    data:param,
                    success:function(data){
                        if(data.status){
                            var html='';
                            var si_name_input=$('#si_name_input').val();
                            $.each(data.info,function(i,item){
                                if(item.sp_name==si_name_input){
                                    var select_html=' selected';
                                }else{
                                    var select_html='';
                                }
                                html+='<option value="'+item.sp_id+'" class="org-li" data-settle="'+item.sp_type+'" data-money="'+item.sp_money+'" '+select_html+'>'+item.sp_name+'</option>';
                            })
                            $('#si_name_input').hide();
                            $('#si_name_select').show();
                            $('#si_name_select').html(html);
                        }else{
                            $.toast({
                                msg: data.info,
                                time:2000
                            })
                        }
                    },
                    error:function(){
                        $.alert({
                            msg:'传输错误'
                        })
                    }
                })
            }
        }
    }

    $('#si_insti_name').focus(function(){
        var subject=$('#si_subject').val();
        var si_id=$('#si_id').val();
        if(subject=='其他'){
            return false;
        }
        var param={};
        param['type']=subject;
        $('#si_insti_name').blur();
        $.choose_company({
            param:param,
            callback:function(org_id,org_name){
                $('#si_insti_name').val(org_name);
                $('#si_name_id').val(org_id);
                var subject=$('#si_subject').val();
                if(subject!='接送'){
                    var param={type:subject,org_id:org_id};
                    $.ajax({
                        url:$__app__+'/WxMobile/get_resource_item',
                        type:'post',
                        data:param,
                        success:function(data){
                            if(data.status){
                                var html='';
                                $.each(data.info,function(i,item){
                                    html+='<option value="'+item.sp_id+'" class="org-li" data-settle="'+item.sp_type+'" data-money="'+item.sp_money+'">'+item.sp_name+'</option>';
                                })
                                $('#si_name_input').hide();
                                $('#si_name_select').show();
                                $('#si_name_select').html(html);
                                update_money();
                            }else{
                                $.toast({
                                    msg: data.info,
                                    time:2000
                                })
                            }
                        },
                        error:function(){
                            $.alert({
                                msg:'传输错误'
                            })
                        }
                    })
                }else{
                    $('#si_name_select').hide();
                    $('#si_name_input').show();
                }
            }
        });
    })
    $('#si_name_select').change(function(){
        update_money();
    });

    function update_money(){
        var si_name=$('#si_name_select').val();
        var subject=$('#si_subject').val();
        if(si_name==''){
            $('#si_settle_type').val('签单');
            $('#si_settle').val('');
            $('#si_spid').val('');
        }else{
            var select_obj=$('#si_name_select option:selected');
            var si_money=select_obj.attr('data-money');
            var si_settle=select_obj.attr('data-settle');
            $('#si_settle_type').val(si_settle);
            $('#si_settle').val(si_money);
            $('#si_spid').val(si_name);
            $('#si_settle').blur();
        }
    }

    $('#si_subject').change(function(){
        $('#si_insti_name').val('');
        $('#si_name_id').val('');
        $('#si_name_input').val('');
        $('#si_name_select').val('');
        $('#si_name_select').html('');
        if($(this).val()=='其他'){
            $('#si_name_input').show();
            $('#si_name_select').hide();
        }else{
            $('#si_name_input').hide();
            $('#si_name_select').show();
        }
    })

    //单价
    $('#si_settle').blur(function(){
        var settle=$(this).val();
        var count=$('#si_count').val();
        if(count!=''){
            var num=parseFloat(settle)*parseFloat(count);
            num=num.toFixed(2);
            $('#si_money').val(num);
        }
    });

     //总价
    $('#si_money').blur(function(){
        var settle=$(this).val();
        var count=$('#si_count').val();
        if(count!=''){
            var num=parseFloat(settle)/parseFloat(count);
            num=num.toFixed(2);
            $('#si_settle').val(num);
        }
    });

    //人数
    $('#si_count').blur(function(){
        var count=$(this).val();
        var settle=$('#si_settle').val();
        if(settle!=''){
            var num=parseFloat(settle)*parseFloat(count);
            num=num.toFixed(2);
            $('#si_money').val(num);
        }else{
            settle=$('#si_money').val();
            var num=parseFloat(settle)/parseFloat(count);
            num=num.toFixed(2);
            $('#si_settle').val(num);
        }
    });

    $('.upload-btn').click(function(){
        if($('#si_subject').val()=='其他'){
            var si_name=$('#si_name_input').val();
        }else{
            var si_name=$('#si_name_select option:selected').text();
        }
        var data={};
        if($('#si_id').val()==''){
            var si_insti_name=$('#si_insti_name').val();
            if(si_insti_name==''){
                $.alert({msg:'请填写结算单位'});
                return false;
            }
            if($('#si_subject').val()!='其他' && si_name==''){
                $.alert({msg:'请填写项目'});
                return false;
            }
            var si_money=$('#si_money').val();
            data['si_team_id']=$('#si_team_id').val();
            data['si_status']=$('#si_status').val();
            data['si_subject']=$('#si_subject').val();
            data['si_insti_name']=$('#si_insti_name').val();
            data['si_name_id']=$('#si_name_id').val();
            data['si_name']=si_name;
            data['si_settle_type']=$('#si_settle_type').val();
            data['si_settle']=$('#si_settle').val();
            data['si_count']=$('#si_count').val();
            data['si_money']=$('#si_money').val();
            data['si_day']=$('#si_day').val();
            data['si_remark']=$('#si_remark').val();
            data['si_spid']=$('#si_spid').val();
        }else{
            data['si_id']=$('#si_id').val();
            if(si_name==''){
                $.alert({msg:'请填写项目'});
                return false;
            }
            data['si_name_id']=$('#si_name_id').val();
            data['si_insti_name']=$('#si_insti_name').val();
            data['si_subject']=$('#si_subject').val();
            data['si_name']=si_name;
            data['si_settle_type']=$('#si_settle_type').val();
            data['si_settle']=$('#si_settle').val();
            data['si_count']=$('#si_count').val();
            data['si_money']=$('#si_money').val();
            data['si_remark']=$('#si_remark').val();
            data['si_spid']=$('#si_spid').val();
        }
        $.loding({time:-1});
        $.ajax({
            url:$__app__+'/WxMobile/save_bill_item',
            type:'post',
            data:data,
            success:function(data){
                $.loding({close:true});
                if(data.status){
                    if(data.info.add_flag){
                        $.confirm({
                            msg:'添加成功!是否继续为该项目上传凭证？',
                            ok:function(){
                                location.href=$__app__+'/WxMobile/add_certificate/team_id/'+$('#si_team_id').val()+'/si_id/'+data.info.si_id;
                            },
                            cancel:function(){
                                location.href=$__app__+'/WxMobile/guide_bill/team_id/'+$('#si_team_id').val();
                            }
                        })
                    }else{
                        $.toast({
                            msg:'保存成功',
                            time:2000,
                            callback:function(){
                                location.href=$__app__+'/WxMobile/guide_bill/team_id/'+$('#si_team_id').val();
                            }
                        })
                    }
                }else{
                    $.toast({
                        msg: data.info,
                        time:2000,
                        error:true
                    })
                }
            },
            error:function(){
                $.loding({close:true});
                $.alert({
                    msg:'传输错误'
                })
            }
        })
    })
})