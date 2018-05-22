var strdate, bqid, ticketdatas, pnum, seatnums,bl_right_seat;
function setSeatsPosition() {
    var winH = $(window).height()
      , h = $('.balance_info').height();
    $('#bus').css({
        'max-height': winH - h - 50
    })
}
//下单信息
function getShopinfoData(p_id, bl_id) {
    code = _GetCityCode();
    var getShopinfoUrl = '/b2b/shop/info?p_id=' + p_id + '&bl_id=' + bl_id + '&city_code=' + code;
    ajaxRequest(getShopinfoUrl, 'GET', '', function(ret) {
        //console.log(JSON.stringify(ret))
        if (ret.data && ret.code == 200) {
            var dataInter = ret.data;
            strdate = dataInter.bl_start_date;
            bqid = dataInter.bl_id;
            pnum = dataInter.num;

            if (getCookie('detail_org_id') == getCookie('org_id')) {
               	$('.order_replaceSignUp').show();
                $('.order_settlementDiscount').show();

            }
            var interText = doT.template($("#ShopinfoData-template").text());
            $("#ShopinfoData").html(interText(dataInter));
            //活动促销
            var interTexts = doT.template($("#ShopinfoData-templates").text());
            $("#ShopinfoDatas").html(interTexts(dataInter));
            //选择活动促销类型
            if(dataInter.p_promotion && dataInter.p_promotion.length > 0){
           
                if($(".activi_ul li").length > 0){
                    var $lio = $(".activi_ul li").eq(0).clone().get(0).outerHTML;
                    $("#activi").html($lio);
                }
                $(".activi_ul li").on("click",function(){
                    var $lios = $(this).clone().get(0).outerHTML;
                    $("#activi").html($lios);
                    $(".activi_ul").css("display","");
                    recontion();
                    
                })
                $("#activi").on("click",function(ev){
                    ev.stopPropagation();
                    $(".activi_ul").css("display","block");
                })
                $(document).on("click",function(){
                    $(".activi_ul").css("display","");
                })
            }
            //处理客车座位
            bl_right_seat = dataInter.bl_right_seat
            if (bl_right_seat == "对号入座（人工选择）") {
            	setSeatsPosition();
                $('.seat_select').show();
            }
            var busdata = dataInter.bl_bus;
            busmenuhtml = ''
            for (var i = 0; i < busdata.length; i++) {
               	busmenuhtml += '<li data-id="' + i + '"><a href="javascript:;" tabindex="-1"  >客车' + (Number(i) + 1) + '</a></li>';
            }
            $('#busselect').html(busmenuhtml);
            var businterText = doT.template($("#bus-template").text());
            $("#bus").html(businterText(busdata));
            var seat_numdata = dataInter.seat_num;
            for (k in seat_numdata) {
                for (p in seat_numdata[k]) {
                    $('#bus' + (k - 1) + ' .seats').eq(seat_numdata[k][p] - 1).addClass('active').removeClass('null');
                }
            }
            // 前一辆车坐满自动跳到下一辆车
            (function(bus,seat){
	            var blankBus = 1;
	            for(var i = 0; i < bus.length; i++){
	            	var max = bus[i];
	            	var j = i + 1;
	            	if( !seat || !seat[j] || bus[i] > seat[j].length  ){
	            		blankBus = j;
	            		break;
	            	}
	            }
	            $('#buselsect').text('客车'+blankBus);
	            $('#bus ul').eq(blankBus-1).show().siblings().hide();
            })(busdata,seat_numdata);

            var ticketdata = ret.data.ticket;
            var map = {}
              , dest = [];
            for (var i in ticketdata) {
                var ai = ticketdata[i];
                if (!map[ai.t_room_groups]) {
                    dest.push({
                        t_room_groups: ai.t_room_groups,
                        data: [ai]
                    });
                    map[ai.t_room_groups] = ai;
                    delete ai['t_room_groups']
                } else {
                    for (var j = 0; j < dest.length; j++) {
                        var dj = dest[j];
                        if (dj.t_room_groups == ai.t_room_groups) {
                            dj.data.push(ai);
                            break;
                        }
                    }
                }
            }


            var interticket = doT.template($("#ticketData-template").text());
            $("#ticketData").html(interticket(dest));
            //手动输入人数
            // $(".blc input").on("change",function(){
            //     $(this).val($(this).val().replace(/[^0-9.]/g, ''));
            //     var $leng = $(this).val().length;
            //     if($leng > 0){
            //         recontion();
            //     }else{
            //         $(this).val("0");
            //         recontion();
            //     }
            // })
            for (s in dest) {
                var tickethtml = '<li class="pull-left" data-group="group' + s + '"><span>' + dest[s].t_room_groups + '</span></li>';
                $('.ticketType_select').append(tickethtml);
            }
            //获取班车
            //getShopstationData()
            //点击按产品价格由小到大进行排序
			$(document).on("click",".money_px",function(){
				$(".ticktgroup").each(function(){
            	var money_num = [];
            	var $price = $(this).find(".price");           	
            	for(var j = 0;j < $price.length;j++){
            		var num = $price.eq(j).html();
            		var li_id = $price.eq(j).parent().parent().attr("id");
            		var necy = {
            			num : num,
            			li_id : li_id
            		};           		
            		money_num.push(necy);          		
            	}
          		function compare(property){
          			return function(a,b){
          				var value1 = a[property];
          				var value2 = b[property];
          				return value1 - value2
          			}
          		}                            	
				money_num.sort(compare('num'));
					var oStr = '';
					for(var i = 0; i < money_num.length; i++){
						var li_oid = money_num[i].li_id;
						var s = $("#" + li_oid).clone().get(0).outerHTML;
						oStr += s;
					}
					$(this).find("li").remove();
					$(oStr).appendTo($(this));
			})
				$(".px_right span").removeClass("active");
				$(".sele_t").addClass("active")
				$(".px_right").removeClass("money_px");
				$(".px_right").addClass("money_nece");
			})
			//价格排列2
			$(document).on("click",".money_nece",function(){
				$(".ticktgroup").each(function(){
            	var money_num = [];
            	var $price = $(this).find(".price");           	
            	for(var j = 0;j < $price.length;j++){
            		var num = $price.eq(j).html();
            		var li_id = $price.eq(j).parent().parent().attr("id")
            		var necy = {
          			    num : num,
            			li_id : li_id
            		};           		
            		money_num.push(necy);          		
            	}
          		function compare(property){
          			return function(a,b){
          				var value1 = a[property];
          				var value2 = b[property];
          				return value1 - value2
          			}
          		}                            	
				money_num.sort(compare('num'));
				money_num.reverse(compare('num'))
					var oStr = '';
					for(var i = 0; i < money_num.length; i++){
						var li_oid = money_num[i].li_id;
						var s = $("#" + li_oid).clone().get(0).outerHTML;
						oStr += s;
					}
					$(this).find("li").remove();
					$(oStr).appendTo($(this));	
			}) 
			$(".px_right span").removeClass("active");
			$(".sele_o").addClass("active");
			$(".px_right").removeClass("money_nece");
			$(".px_right").addClass("money_px");
			})
        } else {
            $.MsgBox({
                type: "alert",
                title: '提示',
                msg: ret.message,
                speed: 200,
                callback: function() {
                    window.history.back()
                }
            });
        }

        $(".cityList").html(getCookie("city"));
    });
}
//获取报名人列表
function getBmrList(org_id){
	var getShoppeoplelistUrl = '/b2b/shop/peoplelist?org_id=' + org_id;
    ajaxRequest(getShoppeoplelistUrl, 'GET', '', function(ret) {
        //console.log(JSON.stringify(ret))
        if (ret.data && ret.code == 200) {
        	$('#bmrlist input').val('').attr({
        		uid : 0
        	});
            var str = '';
	        for(var i = 0; i < ret.data.length; i++){
	            str += '<li uid="' + ret.data[i].u_id + '">' + ret.data[i].u_realname + '</li>';
	        }
	        $('#bmrlist .select-simulate-list ul').html(str);
	        $('#bmrlist .select-simulate-list li').on('click',function(e){
	        	e.stopPropagation();
	        	var uid = $(this).attr('uid'),
	                u_realname = $(this).text();
	            $('#bmrlist input').val(u_realname).attr({
	                uid : uid
	            })
	            $(this).addClass('hover').siblings().removeClass('hover');
	            $('#bmrlist .select-simulate-list').hide();
	        })
        }
    })
}
//获报名旅行社列表
function getDbmList(query){
	if( !query ){
		return false;
	}
	datas = {
        query: query,
        //查询字符串，可选
        org_city: '',
        //出发城市
        page: '',
        //当前页，可选
        limit: ''//每页行数，可选
    }
    var Mixed = generateMixed(12);
    var getShopbusinesslistUrl = '/b2b/shop/businesslist?mixed=' + Mixed;
    ajaxRequest(getShopbusinesslistUrl, 'POST', datas, function(ret) {
        //console.log(JSON.stringify(ret))
        if (ret.data && ret.code == 200) {
        	var str = '';
	        for(var i = 0; i < ret.data.length; i++){
	            str += '<li org_id="'+ret.data[i].org_id+'" balance="'+ret.data[i].credit_balance+'">'+ret.data[i].org_name+'</li>';
	        }
	        $('#dbmlist .select-simulate-list ul').html(str);
	        $('#dbmlist .select-simulate-list ul li').on('click',function(e){
	        	e.stopPropagation();
	        	var key = $(this).text(),
	                org_id = $(this).attr('org_id'),
	                balance = $(this).attr('balance');
	            $('#dbmlist input').val(key).attr({
	                org_id : org_id,
	                balance : balance
	            })
	            $('#account-cls span').html(balance);
            	$('#account-cls').show();
	            $(this).addClass('hover').siblings().removeClass('hover');
	            $('#dbmlist .select-simulate-list').hide();
	            getBmrList(org_id);
                $("#ShopinfoDatas").remove(); 
	        })
        }
    })
}

//代报名旅行社列表
function getShopbusinesslistData(query) {
    datas = {
        query: query,
        //查询字符串，可选
        org_city: '',
        //出发城市
        page: 1,
        //当前页，可选
        limit: ''//每页行数，可选
    }
    var Mixed = generateMixed(12);
    var getShopbusinesslistUrl = '/b2b/shop/businesslist?mixed=' + Mixed;
    ajaxRequest(getShopbusinesslistUrl, 'POST', datas, function(ret) {
        //console.log(JSON.stringify(ret))
        if (ret.data && ret.code == 200) {
            var dataInter = ret.data;
            for (var i in dataInter) {
                var dbmhtml = '<option value="' + dataInter[i].org_id + '" data-balance="' + dataInter[i].credit_balance + '" >' + dataInter[i].org_name + '</option>';
                $('#dbmlist').append(dbmhtml);
            }
            $('#dbmlist').comboSelect();
        }
    })
}
//报名人列表	
function getShoppeoplelistData(org_id) {
    $('#bmrlist').html('<option value="">报名人</option>');
    var getShoppeoplelistUrl = '/b2b/shop/peoplelist?org_id=' + org_id;
    ajaxRequest(getShoppeoplelistUrl, 'GET', '', function(ret) {
        //console.log(JSON.stringify(ret))
        if (ret.data && ret.code == 200) {
            var dataInter = ret.data;
            for (i in dataInter) {
                var bmrhtml = '<option value="' + dataInter[i].u_id + '">' + dataInter[i].u_realname + '</option>';
                $('#bmrlist').append(bmrhtml);
            }
            $('#bmrlist').comboSelect();
        }
    })
}
//班车接送站点信息
function getShopstationData() {
    strdate = strdate.replace(/\-/g, '');
    var tid = sessionStorage.tid;
    var spages = '1';
    var key = '';
    if (sessionStorage.pagecount) {
        spages = sessionStorage.pagecount;
    }
    if (sessionStorage.key) {
        key = sessionStorage.key;
    }
    var data = {
        t_id: tid,
        start_date: strdate,
        start_time: '',
        start: spages,
        limit: '10',
        key: key
    }
    var getShopstationtUrl = '/front/b2b/shop/station';
    ajaxRequest(getShopstationtUrl, 'POST', data, function(ret) {
        //console.log(JSON.stringify(ret))
        if (ret.data && ret.code == 200) {
            var dataInter = ret.data.list;
            var map = {}
              , dest = [];
             
            for (var i in dataInter) {
                var ai = dataInter[i];
                if (!map[ai.site_name]) {
                    dest.push({
                        id: ai.id,
                        site_name: ai.site_name,
                        data: [ai]
                    });
                    map[ai.site_name] = ai;
                } else {
                    for (var j = 0; j < dest.length; j++) {
                        var dj = dest[j];
                        if (dj.site_name == ai.site_name) {
                            dj.data.push(ai);
                            break;
                        }
                    }
                }
            }
            //去程、返程序列号 由小到大展示
            for(var i = 0;i < dest.length; i++){
             function compare(property){
          			return function(a,b){
          				var value1 = a[property];
          				var value2 = b[property];
          				return value1 - value2
          			}
          		}                            	
				dest[i].data.sort(compare('id'));
			}
            var shopstationData = doT.template($("#shopstationData-template").text());
            $("#shopstationData_go").html(shopstationData(dest));
            $("#shopstationData_back").html(shopstationData(dest));
            var total = ret.data.total;
            var pages = Math.ceil(total / 10);
            //console.log(JSON.stringify(pages))
            sessionStorage.pagetotal = pages;
            var pagehtml = '<div class="p_page"><span class="next_page"></span></div>';
            for (var i = 1; i <= pages; i++) {
                if (i == spages) {
                    pagehtml += '<div class="o_page active"><span class="page ">' + i + '</span></div>';
                } else {
                    pagehtml += '<div class="o_page"><span class="page">' + i + '</span></div>';
                }
            }
            pagehtml += '<div class="n_page"><span class="prev_page"></span></div>';
            $('#pagecount_go').html(pagehtml);
            $('#pagecount_back').html(pagehtml);
        }
    })
}
//下单啦下单啦
function Postshopplace() {
	// 代下单信息判断
	var dbmv = $('#dbmlist input').val(),
		bmrv = $("#bmrlist input").val();
	if( dbmv && !bmrv ){
		$.MsgBox({
            type: "alert",
            title: '提示',
            msg: '请填写报名人信息',
            speed: 200
        });
        return false;
	}
    
	// 订单用户信息判断
    var ticketlist = $('.order_personalTicket li.row')
    var ticketar = [];
    if (ticketlist.length > 0) {
        $.each(ticketlist, function() {
            var i_n = $(this).find('.passenger_name').val();
            var i_m = $(this).find('.passenger_tel').val();
            var i_c = $(this).find('.passenger_id').val();
            var gosname = $(this).find('.go').attr('data-gosname');
            var backsname = $(this).find('.back').attr('data-backsname');
            var goid = $(this).find('.go').attr('data-goid');
            var backid = $(this).find('.back').attr('data-backid');
            var card_typeval = $(this).find('.card_type').html();
            var limit_typeval = $(this).attr('data-t_limit_type');
            var limit_conditionval = $(this).attr('data-t_limit_condition');
            var tid = $(this).attr('data-t_id');
            // console.log(i_n.length)
            // console.log(i_m)
            // console.log(i_c)

            //if(i_n==''||i_m==''){$.MsgBox({type:"alert",title: '提示',msg:'请完善游客信息',speed:200});return false}
            if (i_m) {
                var mobile_reg = /(^0?[1][34857][0-9]{9}$)/;
                if (!mobile_reg.test(i_m)) {
                    $.MsgBox({
                        type: "alert",
                        title: '提示',
                        msg: '请填写正确的手机号码',
                        speed: 200
                    });
                    return false;
                }
            }
            if (limit_typeval != '无限制' && card_typeval == "身份证") {
                if (i_c == '') {
                    $.MsgBox({
                        type: "alert",
                        title: '提示',
                        msg: '请填写身份证号',
                        speed: 200
                    });
                    return false;
                }
                var opt = {
                    card_type: card_typeval,
                    limit_type: limit_typeval,
                    limit_condition: limit_conditionval
                }
                var rst = chechIdcard(i_c, opt);
                //验证失败
                if (rst.start == 0) {
                    $.MsgBox({
                        type: "alert",
                        title: '提示',
                        msg: rst.info,
                        speed: 200
                    });
                    $(this).find('input.passenger_id').css({
                    	border: '1px solid #f00'
                    })
                    return false;
                }
                //验证成功生成游客数组
                if (rst.start == 1) {
                    ticketar.push({
                        "id": tid,
                        "vip_name": i_n,
                        "vip_mob": i_m,
                        "vip_card_type": card_typeval,
                        "vip_card": i_c,
                        "start_site": gosname,
                        "start_sid": goid,
                        "end_site": backsname,
                        "end_sid": backid,
                        "num": $("#ticket_" + tid + " input").eq(0).val(),
                        "room_num": $("#ticket_" + tid + " input").eq(1).val()
                    });
                }
            } else {
                ticketar.push({
                    "id": tid,
                    "vip_name": i_n,
                    "vip_mob": i_m,
                    "vip_card_type": card_typeval,
                    "vip_card": i_c,
                    "start_site": gosname,
                    "start_sid": goid,
                    "end_site": backsname,
                    "end_sid": backid,
                    "num": $("#ticket_" + tid + " input").eq(0).val(),
                    "room_num": $("#ticket_" + tid + " input").eq(1).val()
                });
            }
        });
        // console.log('ticketar:',ticketar);
        //验证买票数据是否完整
        if( ticketar.length < ticketlist.length ){
            $.MsgBox({
                type: "alert",
                title: '提示',
                msg: '请填写正确的游客信息',
                speed: 200
            });
            return false;
        }

        //格式化数据
        var map = {}
          , tdatas = [];
        for (var i in ticketar) {
            var ai = ticketar[i];
            if (!map[ai.id]) {
                tdatas.push({
                    id: ai.id,
                    num: ai.num,
                    room_num: ai.room_num,
                    seat: [ai]
                });
                map[ai.id] = ai;
                delete ai['id']
                delete ai['num']
                delete ai['room_num']
            } else {
                for (var j = 0; j < tdatas.length; j++) {
                    var dj = tdatas[j];
                    if (dj.id == ai.id) {
                        dj.seat.push(ai);
                        break;
                    }
                }
            }
        }
        //格式化完毕
        ticketdatas = tdatas;
        // console.log('ticketdatas:',ticketdatas);
        
        //座位数据整理
        var buslist = $('.seat_content')
        var busdata = []
        $.each(buslist, function(index) {
            var busnum = $(this).find('.actives');
            var busnums = [];
            $.each(busnum, function(index) {
                busnums.push($(this).text())
            })
            busdata.push({
                "bus": (Number(index) + 1),
                "num": busnums
            })
        })
        // 验证人数跟座位数相等
        if ( bl_right_seat == "对号入座（人工选择）" ){
            var allNum = 0;
            $('.blc').each(function() {
                allNum += parseInt($(this).find('.people_number').val());
            })
            var seats = 0;
            for (var i = 0; i < busdata.length; i++) {
                seats += busdata[i].num.length;
            }
            if (seats != allNum) {
                $.MsgBox({
                    type: "alert",
                    title: '提示',
                    msg: '请选择正确的座位数量',
                    speed: 200
                });
                return false;
            }
        }

        if (ticketdatas.length > 0) {
        	//验证身份证号码是否重复
	        if( ticketdatas.length && ticketdatas[0].seat && ticketdatas[0].seat.length ){
	        	var repeat = 0;
	        	for(var i = 0; i < ticketdatas[0].seat.length; i++){
	        		
	        		for(var j = 0; j < ticketdatas[0].seat.length; j++){
	        			if( i != j ){
//	        				console.log(ticketdatas[0].seat[i].vip_card)
	        				if(ticketdatas[0].seat[i].vip_card && ticketdatas[0].seat[i].vip_card == ticketdatas[0].seat[j].vip_card ){
	        					repeat = 1;
	        					break;
	        				}
	        			}
	        		}
	        		if( repeat == 1 ){
	        			break;
	        		}
	        	}
	        	if( repeat == 1 ){
	        		$.MsgBox({
		                type: "alert",
		                title: '提示',
		                msg: '身份证重复，请从新填写提示',
		                speed: 200
		            });
		            return false;
	        	}
	        }
            //填加去程返程站点
            var go = 0;
            $('.go').each(function(){
                var att = $(this).attr("data-gosname")
                if(!att){
                    go = 1;
                    return false;
                }
            });

            if( go == 1 ){
                $.MsgBox({
                    type: "alert",
                    title: '提示',
                    msg: '请添加去程、返程站点'
                    });
                return false;
            }
            var back = 0;
            $('.back').each(function(){
                var att = $(this).attr("data-backsname")
                if(!att){
                    back = 1;
                    return false;
                }
            });

            if( back == 1 ){
                $.MsgBox({
                    type: "alert",
                    title: '提示',
                    msg: '请添加去程、返程站点'
                    });
                return false;
            }

            var data = {
                "bl_id": bl_id,
               	//班期ID (必需)
                "buy_uid": $("#bmrlist input").attr('uid'),
                //报名者ID (分销报名为空，代报名时必需)
                "o_vip_name": $("#order_emergencyContactName").val(),
                //紧急联系人姓名
                "o_vip_mob": $("#order_emergencyContactTel").val(),
                //紧急联系人手机号
                "o_remark": $("#input_remarkInfo").val(),
                //订单备注(前台标注：填写备注需要后供应商确认)
                "o_out_num": $("#order_outNumber").val(),
                //外部订单号
                "o_deal_num": $("#order_contactNumber").val(),
                //合同号
                "sell_favourable": $("#order_discount").val(),
                //优惠金额
                "settle_favourable": $("#order_settlementDiscount").val(),
                //结算优惠(代报名时可以填写)
                "url_bool": "yes",
                //跳过当天已经报过情况(当跳过提示时第二次提交，默认为空)
                "seat_spread": busdata,
                "ticket": ticketdatas,
                "pp_id" : $("#activi li").eq(0).attr("pp_id")
            }
            //console.log(JSON.stringify(data))
            var PostshopplaceUrl = '/b2b/shop/place';
            ajaxRequest(PostshopplaceUrl, 'POST', data, function(ret) {
                //console.log(JSON.stringify(ret))
                if (ret.data && ret.code == 200) {
                    return false;
                    // if (ret.data.status == '待付款') {
                    //     window.location.href = 'Pay/order/no/' + ret.data.number;
                    // } else if (ret.data.status == '待确认') {
                    //     window.location.href = '/Buy/confirm_wait/no/' + ret.data.number;
                    // } else if (ret.data.status == '已付款') {
                    //     window.location.href = '/Buy/pay_success/no/' + ret.data.number;
                    // }
                } else {
                    $.MsgBox({
                        type: "alert",
                        title: '提示',
                        msg: ret.message,
                        speed: 200
                    });
                }
            })
        }
    } else {
        $.MsgBox({
            type: "alert",
            title: '提示',
            msg: '请添加至少一组游客信息',
            speed: 200
        });
    }
}
function get_batch_info(num) {
    return '共' + $('.order_personalTicket>li').length + '人，已填写' + num + '人。<span style="color: red">多填、空行会被忽略。</span>';
}
;function batch_parse(t, ret) {
    var s = t.val()
      , sn = s.split('\n')
      , row_num = ''
      , r = 0
      , tourist = [];

    for (var i = 0; i < sn.length; i++) {
    	var reg = /(\s|\t|,|，)+/gi;
    	var ns = sn[i].replace(reg,',');
        var vt = verify_tourist(ns)
          , c = vt ? 'blue' : 'red';
        if (vt)
            r++;
        tourist.push(vt);
        row_num += '<p style="color:' + c + '">' + (i + 1) + '</p>';
    }
    ;var tip = get_batch_info(r);
    if (ret)
        return tourist;
    //console.log(JSON.stringify(tourist))
    $('#rs_info').html(tip);
    $('#batch_row_number').html(row_num);
}
;function verify_tourist(row) {
    if (!row)
        return false;
    //姓名，身份证号码，手机号
    var spt = ',';
    if (row.indexOf('\t') > -1)
        spt = '\t';
    if (row.indexOf('，') > -1)
        spt = '，';
    if (row.indexOf(' ') > -1)
        spt = ' ';
    var t = row.split(spt);
    var rst = true;
    var id = id_card(t[1]);
    // if (!id.status)
    //     rst = false;
    // var mobile_reg = /(^0?[1][34857][0-9]{9}$)/
    // if (!mobile_reg.test(t[2]))
    //     rst = false;
    return rst ? {
        name: t[0],
        idcode: t[1],
        mobile: t[2]
    } : false;
}
;function get_tourist() {
    var s = batch_parse($('#batch_textarea'), true);
    //console.log(s);
    var tl = $('.order_personalTicket');
    var i_n = tl.find('.passenger_name');
    var i_m = tl.find('.passenger_tel');
    var i_c = tl.find('.passenger_id');
    //console.log(i_n, i_m, i_c);
    $.each(s, function(index, items) {
        if (items && i_n[index]) {
            i_n[index].value = items['name'];
            if(items['mobile']){
               i_m[index].value = items['mobile']; 
            }
            if(items['idcode']){
              i_c[index].value = items['idcode'];
            }
            
        }
        //console.log(index, items);
    });
}
function id_card(code) {
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };
    var tip = "";
    var pass = true;
    if (!code)
        return {
            status: false,
            msg: '身份证号码不能为空'
        };
    if (typeof code != 'string')
        code = code.toString();
    code = code.toUpperCase();
    if (code.length != 15 && code.length != 18) {
        tip = "身份证号格式错误";
        pass = false;
    } else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += (ai * wi);
            }
            ;var last = parity[sum % 11];
            if (last != code[17]) {
                tip = "校验位错误";
                pass = false;
            }
        }
    }
    ;return {
        status: pass,
        msg: tip
    };
}
function CardChk(idcard) {
    var Errors = new Array("ok","身份证号码位数不对!","身份证号码出生日期超出范围或含有非法字符!","身份证号码校验错误!","身份证地区非法!");
    var area = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    }
    var idcard, Y, JYM;
    var S, M;
    var idcard_array = new Array();
    idcard_array = idcard.split("");
    //地区检验
    var Area = area[parseInt(idcard.substr(0, 2))];
    if (Area == null)
        return {
            start: 0,
            info: Errors[4]
        };
    //身份号码位数及格式检验
    var Birthday = ''
      , sexCode = '';
    switch (idcard.length) {
	    case 15:
	        Birthday = '19' + idcard.substr(6, 2) + '-' + idcard.substr(8, 2) + '-' + idcard.substr(10, 2);
	        sexCode = idcard.substring(14, 15);
	        break;
	    case 18:
	        //18位身份号码检测
	        //出生日期的合法性检查
	        Birthday = idcard.substr(6, 4) + '-' + idcard.substr(10, 2) + '-' + idcard.substr(12, 2);
	        sexCode = idcard.substring(16, 17);
	        //计算校验位
	        S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
	        Y = S % 11;
	        M = "F";
	        JYM = "10X98765432";
	        M = JYM.substr(Y, 1);
	        //判断校验位
	        if (M == idcard_array[17]) {//return Errors[0]; //检测ID的校验位
	        } else {
	            return {
	                start: 0,
	                info: Errors[3]
	            };
	        }
	        break;
	    default:
	        return {
	            start: 0,
	            info: Errors[1]
	        };
	        break;
    }
    var cSex = '';
    if (sexCode % 2 == 0) {
        cSex = '女';
    } else {
        cSex = '男';
    }
    return {
        start: 1,
        data: {
            area: Area,
            birthday: Birthday,
            sex: cSex
        }
    };
}
function CardSex(Card) {
    var cSex = '';
    var isOK = CardChk(Card);
    //检查身份证是否合法
    if (isOK.start != 1) {
        cSex = isOK.info;
        //不合法则返回错误信息
    } else {
        var cLen = Card.length;
        if (cLen == 15) {
            sexCode = Card.substring(14, 15);
        } else if (cLen == 18) {
            sexCode = Card.substring(16, 17);
        }
        if (sexCode % 2 == 0) {
            cSex = '女';
        } else {
            cSex = '男';
        }
    }
    return cSex;
}
function getAge(Card) {
    var Age = '';
    var isOK = CardChk(Card);
    if (isOK.start != 1) {
        Age = isOK.info;
    } else {
        var cLen = Card.length;
        var date = new Date();
        //var CardArr = new Array();
        //CardArr = Card.split("");
        switch (cLen) {
	        case 15:
	            var y = Card.substr(6, 2);
	            //年
	            var m = Card.substr(8, 2);
	            //月
	            var d = Card.substr(10, 2);
	            //日
	            var birth = "19" + y + '-' + m + '-' + d;
	            if (m < 9) {
	                var zs = date.getFullYear() - 1900 - y;
	                //9月份前出生的周岁
	            } else {
	                var zs = date.getFullYear() - 1900 - y - 1;
	                //9月份出生后的周岁
	            }
	            var Age = zs;
	            // 返回周岁
	            break;
	        case 18:
	            var y = Card.substr(6, 4);
	            //年
	            var m = Card.substr(10, 2);
	            //月
	            var d = Card.substr(12, 2);
	            //日
	            var birth = y + '-' + m + '-' + d;
	            if (m < 9) {
	                var zs = date.getFullYear() - y;
	            } else {
	                var zs = date.getFullYear() - y - 1;
	            }
	            var Age = zs;
	            break;
        }
    }
    return Age;
}
function chechIdcard(val, opt) {
    if (opt.card_type != '身份证' || val == '' || val == null)
        return true;
    val = val.replace('x', 'X');
    var rst = CardChk(val);
    //console.log([val,opt,rst]);
    if (rst.start == 0) {
        return rst;
    } else {
        var card = rst.data;
        if (opt.limit_type == "限制性别" || opt.limit_type == "限性别") {
            if (card.sex != opt.limit_condition) {
                return {
                    start: 0,
                    info: "身份证填写错误,此票种" + opt.limit_type + "为" + opt.limit_condition
                };
            } else {
            	// 很奇怪的一个地方，外部调用都要用到rst.start来判断chechIdcard是否验证成功，这儿却return true,不符合逻辑
                // return true;
            }
        }
        //票种限制年龄
        if (opt.limit_type == "限制年龄" || opt.limit_type == "限年龄") {
            var condition = opt.limit_condition
              , where = "";
            var Age = getAge(val);
            if (condition.indexOf("-") >= 0) {
                var bt = condition.split("-");
                where = Age > bt[0] && Age < bt[1];
            } else if (condition.indexOf("<") >= 0) {
                var gt = condition.split("<");
                where = (Age < gt[1]);
            } else if (condition.indexOf(">") >= 0) {
                var gt = condition.split(">");
                where = (Age > gt[1]);
            } else {
                where = (Age == condition);
            }
            if (where) {
            	// 很奇怪的一个地方，外部调用都要用到rst.start来判断chechIdcard是否验证成功，这儿却return true,不符合逻辑
                // return true;
            } else {
                return {
                    start: 0,
                    info: "身份证填写错误,此票种" + opt.limit_type + "为" + opt.limit_condition + '，当前年龄是：' + Age
                };
            }
        }
    }
    return rst;
}
//开始算钱啦
function recontion(){
    
    var ticketprice; //每票总额
    var tpl = ''; //每票html
    $('#ticketData li').each(function() {
                var fcprice = ''; //退房差 补房差html变量
                var t_price = parseInt($(this).attr('data-t_price')); //门市价
                var trade_price = parseInt($(this).attr('data-t_trade_price')); //同行价
                var room_z = parseInt($(this).attr('data-t_spread_price')); //补房差
                var room_out = parseInt($(this).attr('data-t_out_room_price')); //退房差
                var nmb = parseInt($(this).find(".blc input").val()); //人数
                var nmbc = parseInt($(this).find(".bla input").val());//床位数
                var namess = $(this).find(".first>span").html();//票种名称
                var clas = $(this).attr("data-t_preset_type");//票种类型

                if(t_price == 0){
                    return false
                }
                if(nmb > 0){
                    if(clas == '儿童票'){
                        var n = nmbc;
                        if(n > 0){
                        fcprice = '<div class="clearfloat garys small_titleGray"><div class="pull-left"> <span>补房差：</span><span>' + n + '</span><span>人 &#10005 </span><span>' + room_z + '</span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice">' + Number(n) * Number(room_z) + '</span></span> </div></div>'
                        }
                    }else{
                        if (parseInt(nmbc) > parseInt(nmb)) {
                            var n = nmbc - nmb;
                            fcprice = '<div class="clearfloat garys small_titleGray"><div class="pull-left"> <span>补房差：</span><span>' + n + '</span><span>人 &#10005 </span><span>' + room_z + '</span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice">' + Number(n) * Number(room_z) + '</span></span> </div></div>'
                        }else if (parseInt(nmbc) < parseInt(nmb)) {
                            var b = nmb - nmbc;
                            fcprice = '<div class="clearfloat garys small_titleGray"><div class="pull-left"> <span>退房差：</span><span>-' + b + '</span><span>人 &#10005 </span><span>' + room_out + '</span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice">-' + Number(b) * Number(room_out) + '</span></span> </div></div>'
                        }
                    }
                    ticketprice = t_price * nmb; //门市价和
                    ticket = Number(trade_price) * nmb; //同行和
                    var comm = ticketprice - ticket
                    if (fcprice != '') {
                        tpl += '<li class="removes" t_trade_prices="' + ticket + '"><h5>' + namess + '</h5><div title="同行价：' + nmb + '人 X ' + trade_price + ' = ￥' + ticket + '元 (佣金：' + comm +')" class="clearfloat small_titleGray"><div class="pull-left"> <span>报名：</span><span>' + nmb + '</span><span>人 &#10005 </span><span>' + t_price + '</span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice">' + ticketprice + '</span></span></div></div>' + fcprice + '</li>'
                    }else{
                        tpl += '<li class="removes" t_trade_prices="' + ticket + '"><h5>' + namess + '</h5><div title="同行价：' + nmb + '人 X ' + trade_price + ' = ￥' + ticket + '元 (佣金：' + comm +')" class="clearfloat small_titleGray"><div class="pull-left"> <span>报名：</span><span>' + nmb + '</span><span>人 &#10005 </span><span>' + t_price + '</span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice">' + ticketprice + '</span></span></div></div></li>'
                    }
                   // $('.order_balanceDetails').html(tpl); 
                }


     })
    // $(".cuxiaos").remove();
    // $(".cuxiaoss").remove();
    // $(".cuxiao").remove();
    // 票价类型
    var tick = $("#activi li").eq(0).attr("tick");
    //促销类型
    var ptype = $("#activi li").eq(0).attr("ptype");
    //定额类型
    var stype = $("#activi li").eq(0).attr("stype");
    //最大上限
    var max = $("#activi li").eq(0).attr("max");
    //每人优惠
    var mone = $("#activi li").eq(0).attr("mone");
    max = parseFloat(max);
    mone = parseFloat(mone);
    p_moneys = parseFloat(p_moneys);
        if(tick == "all"){
            var allNum = 0;
            $('.blc').each(function() {
                allNum += parseInt($(this).find('.people_number').val());
            })
            if(allNum > 0){
                if(ptype == "quota"){
                    if(stype == "quotaPerson"){
                            if(allNum > 0){
                                var allNum = allNum;
                               tpl += '<li class="cuxiao"><h5>促销活动</h5><div class="clearfloat small_titleGray"><div class="pull-left"> <span>报名：</span><span>' + allNum + '</span><span>人 &#10005 </span><span>' + mone + '</span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice activity-id">-' + allNum * mone + '</span></span></div></div></li>'; 
                               // $('.order_balanceDetails').append(tpll); 
                            }                                          
                    }else{
                        // 定额每单                       
                        tpl += '<li class="cuxiaoss"><h5>促销活动</h5><div class="clearfloat small_titleGray"><div class="pull-left"> <span>活动优惠：</span><span></span><span></span><span></span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice activity-id">-' + mone + '</span></span></div></div></li>';
                        // $('.order_balanceDetails').append(tpll); 
                    }
                }else{
                    //订单总额百分比
                    var p_moneys = 0;
                     $('#ticketData li').each(function() {
                                 p_moneys += parseInt($(this).attr("data-t_trade_price")) * parseInt($(this).find(".blc input").val());
                            })
                    if(p_moneys > 0){
                        var p_moneyss = (p_moneys * mone / 100);
                        p_moneyss = parseFloat(p_moneyss).toFixed(1);
                        if(p_moneyss >= max && max > 0){
                        p_moneyss = max;
                        tpl += '<li class="cuxiaos"><h5>促销活动</h5><div class="clearfloat small_titleGray"><div class="pull-left"> <span>活动优惠：</span><span></span><span></span><span></span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice activity-id">-' + p_moneyss + '</span></span></div></div></li>';   
                        // $('.order_balanceDetails').append(tpll); 
                    }else{
                        tpl += '<li class="cuxiaos"><h5>促销活动</h5><div class="clearfloat small_titleGray"><div class="pull-left"> <span>活动优惠：</span><span>' + p_moneys + '</span><span> &#10005 </span><span>' + mone + '%</span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice activity-id">-' + p_moneyss + '</span></span></div></div></li>';
                        // $('.order_balanceDetails').append(tpll); 
                    }
                    }
                }
            }
        }
        //成人票
        var allNums = 0;
        $('.blc').parent().parent().each(function() {
            var type = $(this).attr('data-t_preset_type');
                if( type == '成人票'){
                    allNums += parseInt($(this).find('.people_number').val());
                }
        })
        if(allNums > 0){
            if(tick == "adult"){
                if(ptype == "quota"){
                    if(stype == "quotaPerson"){                          
                            tpl += '<li class="cuxiao"><h5>促销活动</h5><div class="clearfloat small_titleGray"><div class="pull-left"> <span>报名：</span><span>' + allNums + '</span><span>人 &#10005 </span><span>' + mone + '</span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice activity-id">-' + allNums * mone + '</span></span></div></div></li>'; 
                            // $('.order_balanceDetails').append(tpll);                
                    }else{
                        // 定额每单
                        var allNum = 0;
                            $('.blc').parent().parent().each(function() {
                                var type = $(this).attr('data-t_preset_type');
                                if( type == '成人票'){
                                    allNum += parseInt($(this).find('.people_number').val());
                                }
                            })
                            if(allNum > 0){
                               tpl += '<li class="cuxiaoss"><h5>促销活动</h5><div class="clearfloat small_titleGray"><div class="pull-left"> <span>活动优惠：</span><span></span><span></span><span></span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice activity-id">-' + mone + '</span></span></div></div></li>';
                               // $('.order_balanceDetails').append(tpll);  
                           }
                    }
                }else{
                    //订单总额
                   var p_moneys = 0;
                     $('#ticketData li').each(function() {
                        var type = $(this).attr('data-t_preset_type');
                            if( type == '成人票'){
                                p_moneys += parseInt($(this).attr("data-t_trade_price")) * parseInt($(this).find(".blc input").val());
                            }                                 
                        })
                    if(p_moneys > 0){
                        var p_moneyss = (p_moneys * mone / 100);
                        p_moneyss = parseFloat(p_moneyss).toFixed(1);
                        if(p_moneyss >= max && max > 0){
                        p_moneyss = max;
                        tpl += '<li class="cuxiaos"><h5>促销活动</h5><div class="clearfloat small_titleGray"><div class="pull-left"> <span>活动优惠：</span><span></span><span></span><span></span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice activity-id">-' + p_moneyss + '</span></span></div></div></li>';   
                        // $('.order_balanceDetails').append(tpll); 
                    }else{
                        tpl += '<li class="cuxiaos"><h5>促销活动</h5><div class="clearfloat small_titleGray"><div class="pull-left"> <span>活动优惠：</span><span>' + p_moneys + '</span><span> &#10005 </span><span>' + mone + '%</span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice activity-id">-' + p_moneyss + '</span></span></div></div></li>';
                        // $('.order_balanceDetails').append(tpll); 
                    } 
                    }
                }
            }
        }
        //儿童票
        var allNumsc = 0;
        $('.blc').parent().parent().each(function() {
            var types = $(this).attr('data-t_preset_type');
                if( types == '儿童票'){
                    allNumsc += parseInt($(this).find('.people_number').val());
                }
        })
        if(allNumsc > 0){
            if(tick == "children"){
                if(ptype == "quota"){
                    if(stype == "quotaPerson"){
                            tpl += '<li class="cuxiao"><h5>促销活动</h5><div class="clearfloat small_titleGray"><div class="pull-left"> <span>报名：</span><span>' + allNumsc + '</span><span>人 &#10005 </span><span>' + mone + '</span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice activity-id">-' + allNumsc * mone + '</span></span></div></div></li>'; 
                            // $('.order_balanceDetails').append(tpll);                
                    }else{
                        // 儿童定额每单
                        var allNum = 0;
                            $('.blc').parent().parent().each(function() {
                                var typee = $(this).attr('data-t_preset_type');
                                if( typee == '儿童票'){
                                    allNum += parseInt($(this).find('.people_number').val());
                                }
                            })
                            if(allNum > 0){
                               tpl += '<li class="cuxiaoss"><h5>促销活动</h5><div class="clearfloat small_titleGray"><div class="pull-left"> <span>活动优惠：</span><span></span><span></span><span></span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice activity-id">-' + mone + '</span></span></div></div></li>';
                               // $('.order_balanceDetails').append(tpll);  
                           }
                    }
                }else{
                    //订单总额
                    var p_moneys = 0;
                     $('#ticketData li').each(function() {
                        var type = $(this).attr('data-t_preset_type');
                            if( type == '儿童票'){
                                p_moneys += parseInt($(this).attr("data-t_trade_price")) * parseInt($(this).find(".blc input").val());
                            }                                 
                        })
                    if(p_moneys > 0){
                        var p_moneyss = (p_moneys * mone / 100);
                        p_moneyss = parseFloat(p_moneyss).toFixed(1);
                        if(p_moneyss >= max && max > 0){
                        p_moneyss = max;
                        tpl += '<li class="cuxiaos"><h5>促销活动</h5><div class="clearfloat small_titleGray"><div class="pull-left"> <span>活动优惠：</span><span></span><span></span><span></span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice activity-id">-' + p_moneyss + '</span></span></div></div></li>';   
                        // $('.order_balanceDetails').append(tpll); 
                    }else{
                        tpl += '<li class="cuxiaos"><h5>促销活动</h5><div class="clearfloat small_titleGray"><div class="pull-left"> <span>活动优惠：</span><span>' + p_moneys + '</span><span> &#10005 </span><span>' + mone + '%</span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice activity-id">-' + p_moneyss + '</span></span></div></div></li>';
                        // $('.order_balanceDetails').append(tpll); 
                    }

                    }
                    
                }
            }
        }

        //优惠金额
        var leng = $("#order_discount").val().length;
        if(leng > 0){
            $('#youhui').remove();
            $('#order_discount').val($('#order_discount').val().replace(/[^0-9.]/g, ''));
            var $leng = $('#order_discount').val().length;
            if($leng > 0){
                var posm = $('#order_discount').val();
                
                $('.total-money').html(parseInt(sessionStorage.posprice) - posm);
                tpl += '<li id="youhui"><div class="clearfloat small_titleGray"><div class="pull-left"><span>优惠金额</span></div><div class="pull-right"><span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice">-' + posm + '</span></span></div></div></li>'
                // $('.order_balanceDetails').append(youhuihtml)
             }else{
                var posm = "0";
                $('.total-money').html(parseInt(sessionStorage.posprice) - posm);
                tpl += '<li id="youhui"><div class="clearfloat small_titleGray"><div class="pull-left"><span>优惠金额</span></div><div class="pull-right"><span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice">-' + posm + '</span></span></div></div></li>'
                // $('.order_balanceDetails').append(youhuihtml)
             }

        }
        //去程返程站点
        var count = [];
        $('.go').each(function(){
            var gosname = $(this).attr('data-gosname');
            var go_mon = $(this).attr('go_mon');
            var flag = 0;
            for(var i = 0; i < count.length; i++){
                if( gosname == count[i].gosname && go_mon == count[i].go_mon){
                    count[i].num += 1;
                    flag = 1;
                }
            }
            if( flag == 0 ){
                count.push({
                    gosname : gosname,
                    go_mon : go_mon,
                    num : 1
                })
            }
        })
        var leng = count.length;
        for(var j = 0; j < leng; j++){
            var namess = count[j].gosname;
            var go_mon = Number(count[j].go_mon);
            var nmb = count[j].num;
            var ticketprice = nmb * Number(go_mon);
            if(go_mon > 0){
                // console.log(111)
            tpl += '<li class="removes"><h5>【去程】' + namess + '</h5><div class="clearfloat small_titleGray"><div class="pull-left"> <span>报名：</span><span>' + nmb + '</span><span>人 &#10005 </span><span>' + go_mon + '</span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice">' + ticketprice + '</span></span></div></div></li>'
            // $('.order_balanceDetails').append(tpl)
            }
        }
        //返程
        var counts = [];
        $('.back').each(function(){
            var backsname = $(this).attr('data-backsname');
            var back_mon = $(this).attr('back_mon');
            var flag = 0;
            for(var i = 0; i < counts.length; i++){
                if( backsname == counts[i].backsname && back_mon == counts[i].back_mon){
                    counts[i].num += 1;
                    flag = 1;
                }
            }
            if( flag == 0 ){
                counts.push({
                    backsname : backsname,
                    back_mon : back_mon,
                    num : 1
                })
            }
        })
        // console.log(counts)
        var leng = counts.length;
        for(var j = 0; j < leng; j++){
            var bnamess = counts[j].backsname;
            var back_mon = Number(counts[j].back_mon);
            var nmb = counts[j].num;
            var ticketprice = nmb * Number(back_mon);
            if(back_mon > 0){
            tpl += '<li class="removes"><h5>【返程】' + bnamess + '</h5><div class="clearfloat small_titleGray"><div class="pull-left"> <span>报名：</span><span>' + nmb + '</span><span>人 &#10005 </span><span>' + back_mon + '</span> </div><div class="pull-right"> <span class="price_promptBigFont priceColor_danger"><span>&yen</span><span class="posprice">' + ticketprice + '</span></span></div></div></li>'
            // $('.order_balanceDetails').append(tpl)
            }
        }
           

        $('.order_balanceDetails').html(tpl)



        var posprice = 0
        $(".posprice").each(function() {
            if($(this).hasClass('activity-id'))return true;
            posprice += parseInt($(this).html());
        });
        $('.l_pos_money').html(posprice)
        $('.total-money').html(posprice)
        sessionStorage.posprice = posprice

        setSeatsPosition();
        

}
