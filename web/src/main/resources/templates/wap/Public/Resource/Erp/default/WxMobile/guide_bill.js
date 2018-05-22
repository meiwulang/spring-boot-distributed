/**
 * Created by Administrator on 16-4-7.
 */
$(function(){
    var money_out=0;
    var money_in=0;
    $('.cost-type .title').each(function(){
        money_out+=parseFloat($(this).html());
    })
    money_out=money_out.toFixed(2);
    $('.income-type .title').each(function(){
        money_in+=parseFloat($(this).html());
    })
    money_in=money_in.toFixed(2);

    $('.money-in').html(money_in);
    $('.money-out').html(money_out);

	$('.click-td').click(function(){
		var obj=$(this).parents('.click-tr').next();
		if(obj.is(':hidden')){
			obj.slideDown();
		}else{
			obj.slideUp();
		}
	});

    $('.pay').click(function(){
        $('.cost-type').show();
        $('.income-type').hide();
        $('.over').removeClass('over');
        $(this).addClass('over');
    });

    $('.earning').click(function(){
        $('.cost-type').hide();
        $('.income-type').show();
        $('.over').removeClass('over');
        $(this).addClass('over');
    });

    $('.fa-times').click(function(){
        var obj=$(this).parents('.click-tr');
        var parent=$(this).parents('.table-body');
        var data={};
        data.si_id=$(this).attr('si_id');
        $.confirm({
            msg:'是否确认删除?',
            ok:function(){
                $.loding({time:-1});
                $.ajax({
                    url:$__app__+'/WxMobile/del_bill',
                    type:'POST',
                    data:data,
                    success:function(v){
                        $.loding({close:true});
                        if(v.status==1){
                            $.toast({
                                msg: v.info,
                                time:2000,
                                callback:function(){
                                    obj.next().remove();
                                    obj.remove();
                                    var title=parseFloat(obj.find('.title').html());
                                    var money=parseFloat(parent.find('.money').html());
                                    parent.find('.money').html(parseFloat(money-title));
                                   /*
                                   var day=obj.attr('day');
                                   if(parent.find('.day-'+day).length<1){
                                        parent.find('.day-'+day).remove();
                                    }
                                    */
                                }
                            });
                        }else{
                            $.toast({
                                msg: v.info,
                                time:2000,
                                error:true
                            });
                        }
                    }
                });
            },
            cancel:function(){

            }
        })
    })


    $('.add-btn').click(function(){
        if($('.pay').hasClass('over')){
            var si_status='支出';
        }else{
            var si_status='收入';
        }
        var si_team_id=$(this).attr('si_team_id');
        location.href=$__app__+"/WxMobile/add_bill_item/team_id/"+si_team_id+'/si_status/'+si_status;
    })

    $('.audit-btn').click(function(){
        var team_id=$(this).attr('si_team_id');
        $.confirm({
            msg:'提交审核后将无法编辑，确认提交？',
            ok:function(){
                $.loding({time:-1});
                $.ajax({
                    url: $__app__ + '/WxMobile/audit_bill',
                    type: 'POST',
                    data: {team_id: team_id},
                    success: function (v) {
                        $.loding({close: true});
                        if (v.status) {
                            $.toast({
                                msg: v.info,
                                time: 2000,
                                callback: function () {
                                    location.href = $__app__ + '/WxMobile/guide_bill/team_id/'+team_id;
                                }
                            });
                        } else {
                            $.toast({
                                msg: v.info,
                                time: 2000,
                                error: true
                            });
                        }
                    },
                    error: function () {
                        $.alert({msg: '数据传输错误'});
                    }
                })
            }
        })
    })
 })