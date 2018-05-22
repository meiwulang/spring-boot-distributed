// author : zhupinglei
var date = new Date();
var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
$("#login_mask").load("login.html?t="+_TimeStamp);
// 获取参数
// 产品id
var p_id = GetQueryString('p_id');
// 班期id
var bl_id = GetQueryString('bl_id');
// 用户id
// var userid = getCookie('user_id');

// 获取下单信息
function Render(p_id, bl_id){
	var code = GetQueryString('city_code');

    ajaxRequest('/b2b/shop/info','GET',{
    	p_id : p_id,
    	bl_id : bl_id,
    	city_code : code
    },function(res) {
    	if( res.code == 200 ){
    		var detail_org_id = getCookie('detail_org_id'),
				org_id = getCookie('org_id');

			var detail_org_id = res.data.business_id;
			
			// 代报名标记
			res.data['DbmFlag'] = 0;
			if( detail_org_id == org_id ){
				res.data['DbmFlag'] = 1;
			}
			// 票价信息数据按分组重组
			res.data['ticket_group_arr'] = TicketListData(res.data);
			
			INFO_DATA = res.data;

	    	var interText = doT.template($("#order-detail").text());
	        $(".order_detail").html(interText(res.data));
   			// $(".cityList").html(getCookie("city"));
	        // 代报名操作
	        DbmInit(res.data);
	        // 票价信息操作
	        TicketListInit(res.data.ticket);
	        // 车位选择
			SeatInit(res.data);
			// 游客信息相关事件
			TouristInfoEvent();
			// 促销活动
			ActiveEvent();
			// pos单位置炫浮
    		PosPosition();
			// 其他事件
    		OtherEvent();
    		// 下单
		    $('.stylesLoad').on('click',function(){
		    	var index = $(this);
		    	var butText = index.text();
		        Submit(index,butText);
		    })
		    sessionStorage.setItem("order_log","log");
		    var user = res.user.login;//用户信息
		    if(user == '0'){
		    	$.MsgBox({
		            type: "alert", title: '提示', msg: "登录超时,请先登录", speed: 200, callback: function () {
		                $("#myModal").modal("show");
		            }
		        });
		        sessionStorage.setItem("order_log","logs");
		    }
	    }
    })
}

function Start(){
	// 判断用户状态
	if(_uinfo && _uinfo.u_id){
	    $("#user_name").html(_uinfo.u_realname);
	    $("#org_name").html(_uinfo.org_sname);
	    if(p_id && bl_id){
	        Render(p_id, bl_id);
	    }else{
	        window.location.href = 'product_list.html';
	    }
	}else{
	    window.location.href = 'index.html';
	}
}

Start();
