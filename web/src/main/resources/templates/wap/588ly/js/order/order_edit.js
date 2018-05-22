// author : zhupinglei

// 获取参数
// 订单号
var order_no = GetQueryString('no');
var sign = GetQueryString('sign');
var time_stamp = GetQueryString('time_stamp');
var state = GetQueryString('state');
// 用户id
// var userid = getCookie('user_id');

function SetActiveData(){
	var active_id = INFO_DATA.activity;
	var activity_old_id = INFO_DATA.activity_old;
	var ind = 0, old_ind = 0;
	for(var i = 0; i < INFO_DATA.p_promotion.length; i++){
		if( active_id == INFO_DATA.p_promotion[i].pp_id ){
			ind = i;
		}
		if( activity_old_id == INFO_DATA.p_promotion[i].pp_id ){
			old_ind = i;
		}
	}
	return {
		ind : ind,
		old_ind : old_ind
	}
}

function PriceInit(){
	var $TicketTable = $('.order_ticketlist .ticket-table table'),
		$InfoTable = $('.order_touristInfo .tourist-table table');
	// 显示每项价格
	$TicketTable.find('tr[type=normal],tr[type=group]').each(function(){
		var tid = $(this).attr('tid'),
			people_num = parseInt($(this).find('.people_num input').val()),
			base_num = parseInt(people_num/INFO_DATA.ticket[tid].num);
		if( base_num > 0 ){
			var tr_price = (INFO_DATA.ticket[tid].t_price * base_num).toFixed(2);
			var trade_price = (INFO_DATA.ticket[tid].t_trade_price * base_num).toFixed(2),
            	commission_price = (tr_price - trade_price).toFixed(2);

            $(this).find('.tr_total').text('￥'+tr_price);
        	$(this).find('.tr_total').attr('title','同行价：￥'+trade_price+' (佣金：￥'+commission_price+')');
		}
	})
	// 构建去程返程数据
	$InfoTable.find('tbody').each(function(){
		var type = $(this).attr('type'),
			tid = $(this).attr('tid');

		switch(type){
			case 'normal':
				var this_data = INFO_DATA.ticket[tid].seat;
				for(var i = 0; i < this_data.length; i++){
					var data = {
						gotype: this_data[i].start_site_type,
                        backtype: this_data[i].end_site_type,
						id : this_data[i].id,
						goid : this_data[i].start_sid,
						gosname : this_data[i].start_site,
						goprice : this_data[i].start_price,
						backid : this_data[i].end_sid,
						backsname : this_data[i].end_site,
						backprice : this_data[i].end_price,
						tid : tid,
						bus_num : this_data[i].bus_num,
						num : this_data[i].num
					}
					$(this).find('tr').eq(i).data('site',data);
				}
				break;
			case 'group':
				$(this).find('tr').each(function(){
					var $tbody = $(this).parents('tbody'),
						tid = $tbody.attr('tid'),
						ttid = $(this).attr('tid');
					var $trlist = $InfoTable.find('tbody[tid='+tid+'][type=group] tr[tid='+ttid+']');
					if( !$(this).hasClass('dataed') ){
						$trlist.addClass('dataed');
						var this_data = INFO_DATA.ticket[tid].list[ttid].seat;
						$trlist.each(function(index){
							var data = {
								gotype: this_data[index].start_site_type,
                        		backtype: this_data[index].end_site_type,
								id : this_data[index].id,
								goid : this_data[index].start_sid,
								gosname : this_data[index].start_site,
								goprice : this_data[index].start_price,
								backid : this_data[index].end_sid,
								backsname : this_data[index].end_site,
								backprice : this_data[index].end_price,
								tid : ttid,
								bus_num : this_data[index].bus_num,
								num : this_data[index].num
							}
							$(this).data('site',data);
						})
					}
				})
				break;
		}
	})
	// 遍历单项价格
	Settlement();
}

function SeatEdit(){
	for(var i in INFO_DATA.seat_spread ){
		if( INFO_DATA.seat_spread[i].length ){
			for(var j = 0; j < INFO_DATA.seat_spread[i].length; j++){
				$('#bus' + (i - 1) + ' .seats').eq(INFO_DATA.seat_spread[i][j]-1).addClass('actives');
			}
		}
	}
}

// 审核驳回
function OrderReject(){
	if( $('.ordercheck-reject').hasClass('disable') ){
		return false;
	}
	$('.ordercheck-reject').addClass('disable');
	ajaxRequest('/b2b/shop/refuse_order', 'POST', {
		no : order_no
	}, function(res) {
		$.MsgBox({
            type: "alert",
            title: '提示',
            msg: res.message,
            speed: 200
        });
		if( res.code == 200 ){
            $('.ordercheck-reject').text('已驳回').css('background','#ccc');
            $('.ordercheck-pass').remove();
            var t = setTimeout(function(){
                window.location.href = '/OrderDetail/index/id/'+res.data.number+'/source/frame/order_type/org_type='+res.data.org_type;
                clearTimeout(t);
            },2000);
		}else{
			$('.ordercheck-reject').text('审核驳回').removeClass('disable').css('background','#fdc967');
		}
	})
}

function OrderCheck(){
	switch(state){
		case 'checkAudit':
			$('.checktype-box .checktype-state').on('click',function(e){
				e.stopPropagation();
				$(this).next().slideToggle(100);
			})
			$('.ordercheck-reject').on('click',function(){
				OrderReject();
			})
			$('.ordercheck-pass').on('click',function(){
				Submit();
			})
			break;
		default:
			// 下单
		    $('.stylesLoad').on('click',function(){
		        Submit();
		    })
			break;
	}
}

// 获取下单信息
function Render(order_no,sign,time_stamp){
    ajaxRequest('/b2b/shop/get_order_info','POST',{
    	no : order_no,
		sign : sign,
		time_stamp : time_stamp,
		state : state
    },function(res) {
    	if( res.code == 200 ){
    		var detail_org_id = getCookie('detail_org_id'),
				org_id = getCookie('org_id');
			// 代报名标记
			res.data['DbmFlag'] = 0;
			if( detail_org_id == org_id ){
				res.data['DbmFlag'] = 1;
			}

			// 页面操作状态
			res.data['state'] = state;
			INFO_DATA = res.data;

			// 票价信息数据按分组重组
			res.data['ticket_group_arr'] = TicketListData(res.data);

			// 选中已选活动数据
			var pd = SetActiveData();
			res.data['active_p_promotion_ind'] = pd.ind;
			res.data['active_p_promotion_old_ind'] = pd.old_ind;
			
			INFO_DATA = res.data;

			// 普通订单编辑加 del_seat_num 字段
			for(var i in INFO_DATA.ticket ){
				if( !INFO_DATA.ticket[i].del_seat_num ){
					INFO_DATA.ticket[i]['del_seat_num'] = 0;
				}
			}
	    	var interText = doT.template($("#order-detail").text());
	        $(".order_detail").html(interText(res.data));
	        // $(".cityList").html(getCookie("city"));
	        // 代报名操作
	        DbmInit();
	        // 票价信息操作
	        TicketListInit(res.data.ticket);
	        // 车位选择
			SeatInit(res.data);
			// 游客信息相关事件
			TouristInfoEvent();
			TouistEvent();
			// 促销活动
			ActiveEvent();
    		// pos单位置炫浮
    		PosPosition();
    		// 其他事件
    		OtherEvent();
    		// 座位编辑
    		SeatEdit();
    		// 计算初始价
			PriceInit();
		    // 订单审核
		    OrderCheck();
	    }else{
	    	$.MsgBox({
	            type: "alert",
	            title: '提示',
	            msg: res.message,
	            speed: 200
	        });
	    }
    })
}

function Start(){
	// 判断用户状态
	if(_uinfo && _uinfo.u_id){
	    $("#user_name").html(_uinfo.u_realname);
	    $("#org_name").html(_uinfo.org_sname);
	    if( order_no ){
	        Render(order_no,sign,time_stamp);
	    }else{
	        window.location.href = 'product_list.html';
	    }
	}else{
	    window.location.href = 'index.html';
	}
}

Start();