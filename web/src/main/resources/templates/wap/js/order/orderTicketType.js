var date = new Date();
var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
// 引入底部html
$("#footer").load("index_footer.html?t="+_TimeStamp);
// 批量填写游客信息
$("#batch_fill").load("batch_fill.html?t="+_TimeStamp);
// 选择去程
$("#select_site").load("select_siteModal.html?t="+_TimeStamp);
// 选择返程
$("#select_rebackSite").load("select_rebackSiteModal.html?t="+_TimeStamp);
// 确认去程返程
$("#select_confirmSite").load("select_confirmSiteModal.html?t="+_TimeStamp);
// 获取参数
// 产品id
var p_id = GetQueryString('p_id');
// 班期id
var bl_id = GetQueryString('bl_id');
// 用户id
// var userid = getCookie('user_id');

if(_uinfo && _uinfo.u_id){
    $("#user_name").html(_uinfo.u_realname);
    $("#org_name").html(_uinfo.org_sname);
    if (p_id && bl_id) {
        getShopinfoData(p_id, bl_id);
    } else {
        window.location.href = 'product_list.html';
    }
}else{
    window.location.href = 'index.html';
}

    //title显示
    $(".l_pos_money").mouseover(function(){
        var titles = $("#activi li").eq(0).attr("titles");
        var oli = $(".order_balanceDetails li");
        var tit = '';
        var pay_type_cls=$('.pay_type_cls').html();
        if(oli.hasClass("cuxiaos")){
            tit = $('.cuxiaos').find(".posprice").html();
        }else if(oli.hasClass("cuxiao")){
            tit = $('.cuxiao').find(".posprice").html();
        }else if(oli.hasClass("cuxiaoss")){
            tit = $('.cuxiaoss').find(".posprice").html();
        }
        tit=parseFloat(tit)?parseFloat(tit):0;
        //结算总额
        var ms = 0;
        var th = 0;
        $('.pricend').each(function() {
                ms += Number($(this).html());
                th += Number($(this).attr("title"));
            })
        //门市价与同行价差
        var msth = ms - th;
        var l_pos_money = Number($(".l_pos_money").html());
        var z_pos_money = l_pos_money - msth;
        z_pos_money=parseFloat(z_pos_money)?parseFloat(z_pos_money):0;
        var settle_money_title='结算总额:' + z_pos_money.toFixed(2) + '元';
        if(pay_type_cls){
            settle_money_title+='\n活动优惠:'+tit.toFixed(2)+'元　【'+pay_type_cls+'】'+titles+'';
        }
        $(".l_pos_money").attr("title",settle_money_title)

    })
    // 右侧滚动粘贴
    $(window).on('scroll', function() {
        var top = $(window).scrollTop();
        var w = $(window).width();
        if (top >= 200) {
            $('.order_balance').css({
                'position': 'fixed',
                'top': 0,
                // 'left': 1080,
                'right': (w - 1220)/2 ,
                'margin-top': 0
            })
        } else {
            $('.order_balance').css({
                'position': 'static',
                'margin-top': 50
            })
        }
    })
    // 代报名操作

    var ov = '';
    getDbmList(ov);

    $('#dbmlist input,#dbmlist .select-down').on('click',function(e){
        e.stopPropagation();
        $('.select-simulate-list').hide();
        var $wrap = $(this).parent(),
            $list = $wrap.find('.select-simulate-list');
        $list.show();

        $list.find('li').on('click',function(){
            var key = $(this).text(),
                org_id = $(this).attr('org_id'),
                balance = $(this).attr('balance');
            $('#dbmlist input').val(key).attr({
                org_id : org_id,
                balance : balance
            })
            $('#account-cls span').html(balance);
            //$('#account-cls').show();
            $(this).addClass('hover').siblings().removeClass('hover');
            $list.hide();
            getBmrList(org_id);
        });
    });

    $('#dbmlist input').on('keyup',function(e){
        e.stopPropagation();
        var key = $.trim($(this).val());
        if( key != ov ){
            ov = key;
            getDbmList(key);
        }
    });

    $('#bmrlist input,#bmrlist .select-down').on('click',function(e){
        e.stopPropagation();
        $('.select-simulate-list').hide();
        var $wrap = $(this).parent(),
            $list = $wrap.find('.select-simulate-list');
        $list.show();
    });

    $(document).on('click',function(){
        $('.select-simulate-list').hide();
    });

    $("#select_site").on('click', ".row.item", function() {
        var val = $(this).children(".col-md-6").children().html();
        $("#signUp_company").val(val);
        //        $("#select_site>.select_site>#selectSite_modal").css("display","none").removeClass("in");
        $("#selectSite_modal").modal("hide");
    });
    $(document).on('click', ".batch_confirmBtn", function() {
        get_tourist();
        // $("#batchFill_modal textarea").val('');
        //        $("#select_site>.select_site>#selectSite_modal").css("display","none").removeClass("in");
        $("#batchFill_modal").modal("hide");
    });
    $(".select_addPassenger").on('click', function() {
        var tlength = $('.order_personalTicket>li').length;
        //alert(tlength)
        if (tlength > 0) {
            $("#batchFill_modal").modal("show");
        } else {
            $.MsgBox({
                type: "alert",
                title: '提示',
                msg: '请选择一个票',
                speed: 200
            });
        }
    })
    ///数字效果
    $(".order_ticketPrice").on('click', '.bla .order_reduceBtn', function() {
        var datalist = $(this).parent().parent().parent();
        var t_store = datalist.attr('data-t_store');
        //最大库存
        var t_spread_price = datalist.attr('data-t_spread_price');
        //补房差
        var t_out_room_price = datalist.attr('data-t_out_room_price');
        //退房差
        var t_id = datalist.attr('data-t_id');
        //票价ID
        var t_limit_type = datalist.attr('data-t_limit_type');
        var t_limit_condition = datalist.attr('data-t_limit_condition');
        var t_trade_price = datalist.attr('data-t_trade_price');
        var numb = parseInt($(this).siblings(".people_number").val());
        var numbers = $(this).parent().parent().siblings(".price_2").children('.blc').children('.people_number').val()
        if (numb > 0) {
            $(this).siblings("input").val(numb - 1);
            var nmbc = $(this).siblings("input").val();
            var price = datalist.attr('data-t_price');
            var ticket_className = $(this).parent().parent().parent().attr("id");
            var ticket_name = $(this).parent().parent().siblings(".first").children(":last-child").html();
            // settlement(ticket_name, price, t_spread_price, t_out_room_price, nmbc, numbers, ticket_className);
            recontion();
        }
    });
    $(".order_ticketPrice").on('click', '.bla .order_addBtn', function() {
        var datalist = $(this).parent().parent().parent();
        var t_store = datalist.attr('data-t_store');
        //最大库存
        var t_spread_price = datalist.attr('data-t_spread_price');
        //补房差
        var t_out_room_price = datalist.attr('data-t_out_room_price');
        //退房差
        var t_id = datalist.attr('data-t_id');
        //票价ID
        var t_limit_type = datalist.attr('data-t_limit_type');
        var t_limit_condition = datalist.attr('data-t_limit_condition');
        var t_trade_price = datalist.attr('data-t_trade_price');
        // 儿童票或成人票
        var t_preset_type = datalist.attr('data-t_preset_type');
        var numb = parseInt($(this).siblings(".people_number").val());
        var deleteTarget = $(this).parent().parent().parent().attr("id");
        var numbers = $(this).parent().parent().siblings(".price_2").children('.blc').children('.people_number').val()
        if (numb >= 0 && numb < numbers * 2) {
            $(this).siblings("input").val(numb + 1);
            var nmbc = $(this).siblings("input").val();
            var price = datalist.attr('data-t_price');
            var ticket_className = $(this).parent().parent().parent().attr("id");
            var ticket_name = $(this).parent().parent().siblings(".first").children(":last-child").html();
            // settlement(ticket_name, price, t_spread_price, t_out_room_price, nmbc, numbers, ticket_className);
            recontion();
        }
    });
    
    var Serial_number = 0
    //————
    $(".order_ticketPrice").on('click', '.blc .order_reduceBtn', function() {
        var datalist = $(this).parent().parent().parent();
        var t_store = datalist.attr('data-t_store');
        //最大库存
        var t_spread_price = datalist.attr('data-t_spread_price');
        //补房差
        var t_out_room_price = datalist.attr('data-t_out_room_price');
        //退房差
        var t_id = datalist.attr('data-t_id');
        //票价ID
        var t_limit_type = datalist.attr('data-t_limit_type');
        var t_limit_condition = datalist.attr('data-t_limit_condition');
        var t_trade_price = datalist.attr('data-t_trade_price');
        // 儿童票或成人票
        var t_preset_type = datalist.attr('data-t_preset_type');
        var numb = parseInt($(this).siblings(".people_number").val());
        if (numb > 0) {
            $(this).siblings("input").val(numb - 1);
            if( t_preset_type != '儿童票' ){
                $(this).parent().parent().siblings(".price_1").children('.bla').children('.people_number').val(numb - 1)
            }
            Serial_number--;
        }
        var deleteTarget = $(this).parent().parent().parent().attr("id");
        var price = datalist.attr('data-t_price');
        var nmb = $(this).siblings("input").val();
        var pricend = $(this).parent().parent().siblings(".priceColor_danger").children(".pricend");
        pricend.html((Number(price) * Number(nmb)));
        var comm = (Number(price) * Number(nmb)) - (Number(t_trade_price) * Number(nmb));//计算佣金
        pricend.attr('title', '同行价：' + (Number(t_trade_price) * Number(nmb)) + ' (佣金：' + comm + ')' );
        var nmb = $(this).siblings("input").val();
        var nmbc = $(this).parent().parent().siblings(".price_1").children('.bla').children('.people_number').val();
        var ticket_name = $(this).parent().parent().siblings(".first").children(":last-child").html();
        // settlement(ticket_name, price, t_spread_price, t_out_room_price, nmbc, nmb, deleteTarget,0,0,0,0,t_trade_price);
        //console.log(deleteTarget);
        $("." + deleteTarget + ":last").remove();
        //删除当前同ClassName下的最后一个节点
        //当人数简为0的时候清除付款金额
        var alls = 0;
        $('.blc').each(function() {
            alls += parseInt($(this).find('.people_number').val());
        })
        if(alls < 1){
            $(".total-money").html("0.00");
            $(".l_pos_money").html("0.00"); 
            $('.order_balanceDetails li').remove(); 
        }
        
            
        
        recontion()
        //退房差为0隐藏
             var alls = 0;
                $('.garys').find(".posprice").each(function() {
                    var type = $(this).html();
                        if( type == '-0'){
                            $(this).parents('.garys').css("display","none");
                        }
                })
    });
    //++
    $(".order_ticketPrice").on('click', '.blc .order_addBtn', function() {
        var datalist = $(this).parent().parent().parent();
        var t_store = datalist.attr('data-t_store');
        //最大库存
        var t_spread_price = datalist.attr('data-t_spread_price');
        //补房差
        var t_out_room_price = datalist.attr('data-t_out_room_price');
        //退房差
        var t_id = datalist.attr('data-t_id');
        //票价ID
        var t_limit_type = datalist.attr('data-t_limit_type');
        var t_limit_condition = datalist.attr('data-t_limit_condition');
        var t_trade_price = datalist.attr('data-t_trade_price');
        // 儿童票或成人票
        var t_preset_type = datalist.attr('data-t_preset_type');
        var randomhmtl = '';
        if (t_limit_type != '无限制') {
            var randomhmtl = "<span class='icon_random'  title='" + t_limit_type + t_limit_condition + "'></span>";
        }
        var numberfc = $(this).parent().parent().siblings(".price_1").children('.bla').children('.people_number').val();
        //床位
        var numb = parseInt($(this).siblings(".people_number").val());
        if (numb < t_store || t_store == -1) {
            $(this).siblings("input").val(numb + 1);
            if (numberfc <= numb && t_preset_type != '儿童票' ) {
                $(this).parent().parent().siblings(".price_1").children('.bla').children('.people_number').val(numb + 1);
            }
            Serial_number++;
            var ticket_type = $(this).parent().parent().siblings(".col-md-1").html();
            var price = datalist.attr('data-t_price');
            var pricend = $(this).parent().parent().siblings(".priceColor_danger").children(".pricend");
            var nmb = $(this).siblings("input").val();
            var nmbc = $(this).parent().parent().siblings(".price_1").children('.bla').children('.people_number').val();
            pricend.html((Number(price) * Number(nmb)));
            var comm = (Number(price) * Number(nmb)) - (Number(t_trade_price) * Number(nmb));//计算佣金
            pricend.attr('title', '同行价：' + (Number(t_trade_price) * Number(nmb)) + ' (佣金：' + comm + ')' );
            //alert(parseInt(price)*nmb)
            var card_type = ['身份证', '护照', '军官证', '回乡证', '台胞证', '国际海员证', '港澳通行证', '赴台证', '其他'];
            var card_html = '';
            for (i in card_type) {
                card_html += "<li role='presentation'><a role='menuitem' tabindex='-1' href='javascript:;'>" + card_type[i] + "</a></li>";
            }
            var ticket_className = $(this).parent().parent().parent().attr("id");
            //为新增票添加Class标记
            //<span class='ion_selectPicket'></span>  在变量number后删掉的单选框
            var ticket_name = $(this).parent().parent().siblings(".first").children(":last-child").html();
            var template = "<li t_trade_price="+ t_trade_price +" class='row " + ticket_className + "' data-t_limit_type='" + t_limit_type + "' data-t_id='" + t_id + "' data-t_limit_condition='" + t_limit_condition + "' data-t_spread_price='" + t_spread_price + "' data-t_out_room_price='" + t_out_room_price + "'><div class='clearfloat info_box'><div class='col-md-2 col-xs-2 first'><div class='pull-left'><span class='order_number'>" + Serial_number + "</span></div><div class='pull-left'><span class='ticket_name'>" + ticket_name + "</span><br><span class='hotsoso'>" + ticket_type + randomhmtl + "</span></div></div><div class='col-md-10 col-xs-10'><div class='top container-fluid'><div class='row'><div class='col-md-2 col-xs-2'><input type='text' class='passenger_name'></div><div class='col-md-3 col-xs-3'><input type='text' class='passenger_tel'></div> <div class='col-md-5 col-xs-5'> <div class='dropdown personalId_select'><p class='btn dropdown-toggle card_type' type='button' id='dropdownMenu1' data-toggle='dropdown' aria-expanded='false'>身份证</p><input type='text' class='passenger_id'><ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu1'>" + card_html + "</ul></div><span class='glyphicon glyphicon-remove resuce_passengerTicket' ></span></div><div class='col-md-2 col-xs-2'><button type='button' class='btn btn-default setcontact' >设为联系人</button></div></div></div><div class='bottom'><span class='hotsoso'>去程:</span><span class='go fontGray  bp" + Serial_number + "'  onclick='selectgobus(" + t_id + "," + Serial_number + ")'>选择站点</span> <span class='fontGreen' >返程:</span><span class='back fontGray bp" + Serial_number + "'  onclick='selectgobus(" + t_id + "," + Serial_number + ")'>选择站点</span></div></div></div> </li>";
            
            if ($('.order_personalTicket .' + ticket_className).length > 0) {
                $('.order_personalTicket .' + ticket_className + ':last').after(template);
            } else {
                $(".order_personalTicket").append(template);
            }
            //结算
            // settlement(ticket_name, price, t_spread_price, t_out_room_price, nmbc, nmb, ticket_className,0,0,0,0,t_trade_price);
            $('.order_personalTicket .order_number').each(function(index, element) {
                //alert(index)
                $(this).html(index + 1);
            });
            recontion();
        }
        //退房差为0隐藏
             var alls = 0;
                $('.garys').find(".posprice").each(function() {
                    var type = $(this).html();
                        if( type == '-0'){
                            $(this).parents('.garys').css("display","none");
                        }
                })
    });
    //移除效果
    $(document).on('click', ".resuce_passengerTicket", function() {
        var str = $(this).parent().parent().parent().parent().parent().parent().attr("class");
        var datalist = $(this).parent().parent().parent().parent().parent().parent();
        var t_store = datalist.attr('data-t_store');
        //最大库存
        var t_spread_price = datalist.attr('data-t_spread_price');
        //补房差
        var t_out_room_price = datalist.attr('data-t_out_room_price');
        //退房差
        var t_id = datalist.attr('data-t_id');
        //票价ID
        var t_limit_type = datalist.attr('data-t_limit_type');
        var t_limit_condition = datalist.attr('data-t_limit_condition');
        var t_trade_price = datalist.attr('t_trade_price');
        var target_className = str.substr(4, str.length);
        var val = $("#" + target_className + " input").val();
        $("#" + target_className + " input").val(val - 1);
        var price = $("#" + target_className + " .price").html();
        var t_price = $("#" + target_className + " .price").parents('li').attr('data-t_trade_price');
        var nmb = $("#" + target_className + " input").eq(0).val();
        var nmbc = $("#" + target_className + " input").eq(1).val();
        //alert(nmb)
        $("#" + target_className + " .pricend").html(Number(price) * Number(nmb));
        var comm = (Number(price) * Number(nmb)) - (Number(t_price) * Number(nmb));
        $("#" + target_className + " .pricend").attr('title', '同行价：' + (Number(t_price) * Number(nmb)) + ' (佣金：' + comm + ')' );
        $(this).parent().parent().parent().parent().parent().parent().remove();
        //删除当前记录
        var ticket_name = datalist.find('.ticket_name').html();
        // settlement(ticket_name, price, t_spread_price, t_out_room_price, nmbc, nmb, target_className,0,0,0,0,t_trade_price);
        $('.order_personalTicket .order_number').each(function(index, element) {
            //alert(index)
            $(this).html(index + 1);
        });

        //当人数简为0的时候清除付款金额
        var alls = 0;
        $('.blc').each(function() {
            alls += parseInt($(this).find('.people_number').val());
        })
        if(alls < 1){
            $(".total-money").html("0.00");
            $(".l_pos_money").html("0.00"); 
            $('.order_balanceDetails li').remove(); 
        }
        recontion();

        //退房差为0隐藏
             var alls = 0;
                $('.garys').find(".posprice").each(function() {
                    var type = $(this).html();
                        if( type == '-0'){
                            $(this).parents('.garys').css("display","none");
                        }
                })

    });
    //设为联系人
    $(document).on('click', ".setcontact", function() {
        var tl = $(this).parent().parent().parent().parent().parent().parent();
        $('#order_emergencyContactName').val(tl.find('.passenger_name').val());
        $('#order_emergencyContactTel').val(tl.find('.passenger_tel').val());
    });
    //选择效果
    $(document).on('click', ".ion_selectPicket", function() {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
        } else {
            $(this).removeClass("active");
        }
    });
    $(document).on('click', ".order_allSelect", function() {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $(".ion_selectPicket").addClass("active");
        } else {
            $(this).removeClass("active");
            $(".ion_selectPicket").removeClass("active");
        }
    });
    //  移除效果
    $('.select_removePassenger').on('click', function() {
        if ($('.ion_selectPicket').hasClass("active")) {
            var datalist = $('.ion_selectPicket.active').parent().parent().parent().parent();
            $.each(datalist, function() {
                var str = $(this).attr("class");
                var t_store = $(this).attr('data-t_store');
                //最大库存
                var t_spread_price = $(this).attr('data-t_spread_price');
                //补房差
                var t_out_room_price = $(this).attr('data-t_out_room_price');
                //退房差
                var t_id = $(this).attr('data-t_id');
                //票价ID
                var t_limit_type = $(this).attr('data-t_limit_type');
                var t_limit_condition = $(this).attr('data-t_limit_condition');
                var t_trade_price = $(this).attr('data-t_trade_price');
                var target_className = str.substr(4, str.length);
                var price = $("#" + target_className + " .price").html();
                var val = $("#" + target_className + " input").val();
                $("#" + target_className + " input").val(val - 1);
                var nmb = $("#" + target_className + " input").eq(0).val();
                var nmbc = $("#" + target_className + " input").eq(1).val();
                var ticket_name = $(this).find('.ticket_name').html();

                //console.log(target_className)
                // settlement(ticket_name, price, t_spread_price, t_out_room_price, nmbc, nmb, target_className);
                recontion();
                $(this).remove();
            })
        }
    })
    //选项卡
    $(document).on('click', '.ticketType_select li', function() {
        $(this).addClass('active').siblings().removeClass('active');
        tiketype = $(this).attr('data-group');
        if (tiketype == 'all') {
            $('.ticktgroup').show();
        } else {
            $('.ticktgroup').hide();
            $('#' + tiketype).show();
        }
    })
    //去程班车选择
    function selectgobus(t_id, pnumber) {
        $("#selectSite_modal").modal("show");
        sessionStorage.pnumber = pnumber;
        sessionStorage.tid = t_id;
        getShopstationData();
    }
    //优惠金额变化
    $('#order_discount').on('blur', function() {
        recontion();
    })
    //页面刷新提示
    window.onunload = function() {
        sessionStorage.clear();
    }
    ;
    $(document).on('click', '.dropdown-menu li', function() {
        $(this).parent().siblings('.dropdown-toggle').html($(this).find('a').html());
    });
    $(document).on('blur', '.passenger_id', function() {
        var card_typevals = $(this).find('.card_type').html();
        if ($(this).val() && card_typevals == "身份证") {
            var id = id_card($(this).val());
            if (!id.status) {
                $(this).css('border', '1px solid red');
                $.MsgBox({
                    type: "alert",
                    title: '提示',
                    msg: '请填写正确的身份证号',
                    speed: 200
                });
            } else {
                $(this).css('border', '1px solid #eaeaea');
            }
        } else {
            $(this).css('border', '1px solid #eaeaea');
        }
    })
    $(document).on('blur', '.passenger_tel', function() {
        if ($(this).val()) {
            var tel = $(this).val();
            var mobile_reg = /(^0?[1][34857][0-9]{9}$)/
            if (!mobile_reg.test(tel)) {
                $(this).css('border', '1px solid red');
                $.MsgBox({
                    type: "alert",
                    title: '提示',
                    msg: '请填写正确的手机号码',
                    speed: 200
                });
            } else {
                $(this).css('border', '1px solid #eaeaea');
            }
        } else {
            $(this).css('border', '1px solid #eaeaea');
        }
    })
    //客车选择
    $(document).on('click', '#busselect li', function() {
        $('.seat_content').hide();
        $('#bus' + $(this).attr('data-id')).show();
    })
    //座位选择
    $(document).on('click', '.null', function() {
        if ($(this).hasClass('actives')) {
            $(this).removeClass('actives');
        } else {
            $(this).addClass('actives');
        }
    })
  