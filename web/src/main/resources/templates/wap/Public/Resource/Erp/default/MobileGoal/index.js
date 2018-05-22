$(function(){
	var dateTitle = $('.date-title');
	var item = $('.title_list');
	item.on('click',function(){
		var goTOVal = $(this).attr('goto');
		item.removeClass('list_block');
		$(this).addClass('list_block');
		for(var i =0;i<dateTitle.length;i++){
			var dateVal = dateTitle.eq(i).attr('name');
			if(dateVal == goTOVal){
				var dateHeight = dateTitle.eq(i).offset().top;
				$(window).scrollTop(dateHeight-50);
			}
		}
	})

	var arr = ['car','ship','subway','train','plane','bus'];
	var day_title = $('.day_title');
	for(var i = 0;i < day_title.length; i++){
		var str = day_title.eq(i).html();
		var count = (str.split('[@')).length;
		$.each(arr,function(k,va){
			for(var k=1;k<count;k++){
				str = str.replace('[@'+va+']','<i class="fa fa-'+va+'"></i>');
			}
		})
		day_title.eq(i).html(str);
	}

    function add_click(){
        $('.bus-data').unbind('click');
        $('.bus-data').click(function(){
            var data=$(this).attr('to-data');
            if($('.'+data).is(":hidden")){
                $('.'+data).show();
            }else{
                $('.'+data).hide();
            }
        });
    }


    /**
     * 渲染出班期列表
     */
    bus_list_details();
    function bus_list_details(page){
        if(!page) page=0;
        var url=__ZIYO_REN__._URL_;
        var bus_table=$(".bus_table");
        var list_info=bus_table.find(".bl_content_"+page);
        var d={p_id:url[3],page:page,site:url[5]};
        list_info.html('<tr><td colspan="4" style="text-align:center"><div class="load_img"><img src="'+$app_public_images_path+'blue-loading.gif"></div></td></tr>');
        setTimeout(function(){
            $.ajax({
                type:"POST",
                url:$__app__ + "/MobileGoal/get_ticket_data",
                data:d,
                success:function (msg) {
                    var data = msg;
                    if (typeof msg != 'object')
                        data = eval("(" + msg + ")");
                    var row=data.info;
                    if (data.status == 1) {
                        var tpl=bl_dTpl(row);
                        list_info.html(tpl);
                       if(row.length>=1){
                            //加载更多的显示
                            var more_tpl='<tr><td colspan="4" class="load_more" page="'+row.page+'">查看更多班期</td></tr>';
                            bus_table.append('<tbody class="bl_content_'+row.page+'">'+more_tpl+'</tbody>');
                            click_more_bus_list(row.page);
                        }else{
                            click_more_bus_list(false);
                        }
                    } else {
                        //list_info.html("<tr><td colspan='7' style='text-align:center'>没有找到班次数据!</td></tr>");
                        list_info.html("");
                        bus_table.append("<tbody><tr><td colspan='4' style='text-align:center'>没有找到班次数据!</td></tr></tbody>");
                    }

                }
            });
        },500)
    }

    /**
     * 点击查询更多班期
     * @param page
     */
    function click_more_bus_list(page){
        var bus_table=$(".bus_table");
        var old=page-1;
        bus_table.find(".bl_content_"+old).unbind('click');
        var list_info=bus_table.find(".bl_content_"+page);
        list_info.click(function(){
            if(!list_info.find("tr").attr("val")){
                bus_list_details(page);
            }
        })
        add_click();
    }

    /**
     * 班期列表渲染所需要的数据
     * @param data
     * @returns {apply|*}
     */
    function bl_dTpl(data){
        var tpl="";
        $.each(data.bl_data,function(i,val){
            if(!val.price){
                val.price='暂无报价';
            }else{
                val.price=val.price+' 元/人';
            }
            tpl+='<tr class="bus-data" to-data="'+val.bl_start_date+val.bl_num+'">' +
                    '<td align="center">'+val.bl_start_date+'</td>' +
                    '<td align="center">'+val.bl_week+'</td>' +
                    '<td align="center" class="bl_price">'+val.price+'</td>' +
                    '<td align="center">'+val.bl_surplus+'</td>' +
                '</tr>';
            $.each(val.ticket,function(i,t_val){
                tpl+=' <tr style="color: #A1A29B;background-color: #FEFEFE;display: none;" class="'+val.bl_start_date+val.bl_num+'">' +
                        '<td align="center">'+t_val.t_pname+'</td>' +
                        '<td align="center">'+t_val.t_name+'</td>' +
                        '<td align="center">'+t_val.t_price+' 元/人</td>' +
                        '<td align="center">'+t_val.t_preset_type+'</td>' +
                    '</tr>';
            })
        });
        return tpl;
    }



});


