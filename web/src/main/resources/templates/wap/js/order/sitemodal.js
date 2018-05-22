var site_page_type = 'order';
if( window.location.href.indexOf('order_edit.html') > -1 ){
	site_page_type = 'order-edit';
	$('#c1').addClass('fa-check-circle active').removeClass('fa-circle-o');  //选中的li添加选择标识
}else{
	$('#c3').addClass('fa-check-circle active').removeClass('fa-circle-o');  //选中的li添加选择标识
}

sessionStorage.removeItem('goid');
sessionStorage.removeItem('gosname');
sessionStorage.removeItem('goprice');
sessionStorage.removeItem('gotype');
sessionStorage.removeItem('backid');
sessionStorage.removeItem('backsname');
sessionStorage.removeItem('backprice');
sessionStorage.removeItem('backtype');


// $(document).on('click','#pagecount_go .o_page', function(){
	
// 	sessionStorage.pagecount = $(this).find('span').html();
// 	getShopstationData();
// })

// $(document).on('click','#pagecount_go .p_page', function(){
	
// 	if(sessionStorage.pagecount&&sessionStorage.pagecount>1){
		
// 		sessionStorage.pagecount = sessionStorage.pagecount-1;
// 		getShopstationData();
// 	}
// })
// $(document).on('click','#pagecount_go .n_page', function(){
// 	//alert(sessionStorage.pagetotal)
// 	if(sessionStorage.pagecount&&sessionStorage.pagecount<sessionStorage.pagetotal){
// 		sessionStorage.pagecount = Number(sessionStorage.pagecount)+1;
// 		getShopstationData();
// 	}
// })

	//搜索框
function searchGo(){
	if ($('#gobuskey').val() != '') {
		var datas = ($('#gobuskey').val()).replace(/^\s+/,'').replace(/\s+$/,'');
		$('#shopstationData_go li').hide();

		$('#shopstationData_go li.odd').each(function() {
			if ($(this).attr('data-sname').indexOf(datas) > -1) {
				$(this).show();
			}
		})
	}
}
function searchBack() {
	if ($('#backbuskey').val() != '') {
		var datas = $('#backbuskey').val();
		$('#shopstationData_back li').hide();

		$('#shopstationData_back li.odd').each(function() {
			if ($(this).attr('data-sname').indexOf(datas) > -1) {
				$(this).show();
			}
		})
	}
}

$(document).on('click','#searchgobus',function() {
	searchGo();
})
$(document).on('click','#searchbackbus', function(){
	searchBack();
})

$('#gobuskey').focus(function() {
	document.onkeydown = function(e){
        var ev = document.all ? window.event : e;
        if(ev.keyCode==13) {
            searchGo();
        }
    }
})

$('#backbuskey').focus(function(e) {
	document.onkeydown = function(e){
        var ev = document.all ? window.event : e;
        if(ev.keyCode==13) {
            searchBack();
        }
    }
});

//选择站点
$(document).on('click','#shopstationData_go li.nostop', function(){
	$(this).find("i").addClass('fa-check-circle').removeClass('fa-circle-o');  //选中的li添加选择标识
	$(this).siblings('li.odd').find("i").removeClass("fa-check-circle").addClass('fa-circle-o');  //未选中的li移除选择标识
	$(this).addClass('active').siblings('.odd').removeClass('active');

	var contS = $(this).find('.radioAndName span').text();
	
	var goid = $(this).attr('data-id')
	$('.contSelGo').attr('data-id',goid);
	var gosname = $(this).attr('data-sname')
	$('.contSelGo').attr('data-sname',gosname);
	var goprice = $(this).attr('data-price');
	$('.contSelGo').attr('data-price',goprice);
	var gotype = $(this).attr('data-type');
	$('.contSelGo').attr('data-type',gotype);
	$('.contSelGo').html(contS);

	$('#allprice').html(parseInt($('.contSelGo').attr('data-price')) + parseInt($('.contSelBack').attr('data-price')));
})
$(document).on('click','#shopstationData_back li.nostop', function(){
	$(this).find("i").addClass('fa-check-circle').removeClass('fa-circle-o');  //选中的li添加选择标识
	$(this).siblings('li.odd').find("i").removeClass("fa-check-circle").addClass('fa-circle-o');  //未选中的li移除选择标识
	$(this).addClass('active').siblings('.odd').removeClass('active');
	$('#shopstationData_back').addClass('active')
	var contS = $(this).find('.radioAndName span').text();
	
	var backid = $(this).attr('data-id');
	$('.contSelBack').attr('data-id',backid);
	var backsname = $(this).attr('data-sname');
	$('.contSelBack').attr('data-sname',backsname);
	var backprice = $(this).attr('data-price');
	$('.contSelBack').attr('data-price',backprice);
	var backtype = $(this).attr('data-type');
	$('.contSelBack').attr('data-type',backtype);
	$('.contSelBack').html(contS);

	$('#allprice').html(parseInt($('.contSelGo').attr('data-price')) + parseInt($('.contSelBack').attr('data-price')));
})


$(".tabAddG li").on('click',function() {
	$("#shopstationData_go li").hide();
	$(this).addClass('active').siblings().removeClass('active');
	$(this).find('span:nth-child(2)').css({'background':'#fff','color':'#ffa600'});
	$(this).siblings().find('span:nth-child(2)').css({'background':'#ff9b71','color':'#fff'})
	var text = $(this).find('span:first-child').text();
	$("#shopstationData_go li").each(function() {
		if ($(this).attr('data-type') == text) {
			$(this).show();
		} 
	})
	if ('全部' == text) {
		$("#shopstationData_go li").show();
	}
})
$(".tabAddB li").on('click',function() {
	$("#shopstationData_back li").hide();
	$(this).addClass('active').siblings().removeClass('active');
	$(this).find('span:nth-child(2)').css({'background':'#fff','color':'#ffa600'});
	$(this).siblings().find('span:nth-child(2)').css({'background':'#ff9b71','color':'#fff'})
	var text = $(this).find('span:first-child').text();
	$("#shopstationData_back li").each(function() {
		if ($(this).attr('data-type') == text) {
			$(this).show();
		} 
	})
	if ('全部' == text) {
		$("#shopstationData_back li").show();
	}
})



$('.quickBtns div').on('click',function() {
	$(this).find("i").addClass('fa-check-circle active').removeClass('fa-circle-o');  //选中的li添加选择标识
	$(this).siblings().find("i").removeClass("fa-check-circle active").addClass('fa-circle-o');  //未选中的li移除选择标识
})
$('#bancheok').on('click',function() {
	var goid = $('.contSelGo').attr('data-id')
	var gosname = $('.contSelGo').attr('data-sname')
	var goprice = $('.contSelGo').attr('data-price');
	var gotype= $('.contSelGo').attr('data-type');
	var backid = $('.contSelBack').attr('data-id')
	var backsname = $('.contSelBack').attr('data-sname')
	var backprice = $('.contSelBack').attr('data-price');
	var backtype= $('.contSelBack').attr('data-type');
	sessionStorage.goid = goid;
	sessionStorage.gosname = gosname;
	sessionStorage.goprice = goprice;
	sessionStorage.gotype = gotype;
	sessionStorage.backid = backid;
	sessionStorage.backsname = backsname;
	sessionStorage.backprice = backprice;
	sessionStorage.backtype = backtype;
	if ($('#shopstationData_go li.odd').hasClass('active') && $('#shopstationData_back li.odd').hasClass('active')) {
		var data = {
			goid : sessionStorage.getItem('goid'),
			gosname : sessionStorage.getItem('gosname'),
			goprice : sessionStorage.getItem('goprice'),
			gotype : sessionStorage.getItem('gotype'),
			backid : sessionStorage.getItem('backid'),
			backsname : sessionStorage.getItem('backsname'),
			backprice : sessionStorage.getItem('backprice'),
			backtype : sessionStorage.getItem('backtype'),
			tid : sessionStorage.getItem('tid'),
			pnumber : sessionStorage.getItem('pnumber')
		}
		if( site_page_type == 'order' ){
			data['id'] = '';
		}
		var $table = $('.order_touristInfo .tourist-table table');
		var $tr = $table.find('tbody tr').eq(data.pnumber-1);
	 	
	 	//游客使用方式
		if($("#c1").hasClass("active")){
			if( site_page_type == 'order' ){
				$tr.data('site',data);
			}else{
				var trdata1 = $tr.data('site');
				var n1_data = $.extend(trdata1,data);
				$tr.data('site',n1_data);
			}
			$tr.find('.gosite').text(data.gosname);
			$tr.find('.gosite').attr('data-type',data.gotype);
			$tr.find('.backsite').text(data.backsname);
			$tr.find('.backsite').attr('data-type',data.backtype);
		}else if($("#c2").hasClass("active")){
			$tr.parents('tbody').find('tr').each(function(){
				if( !$(this).hasClass('has-del') ){
					if( site_page_type == 'order' ){
						$(this).data('site',data);
					}else{
						var trdata2 = $(this).data('site');
						var n2_data = $.extend(trdata2,data);
						$(this).data('site',n2_data);
					}
					
					$(this).find('.gosite').text(data.gosname);
					$(this).find('.gosite').attr('data-type',data.gotype);
					$(this).find('.backsite').text(data.backsname);
					$(this).find('.backsite').attr('data-type',data.backtype);
				}
			})
		}else if($("#c3").hasClass("active")){
			$table.find('tbody tr').each(function(){
				if( !$(this).hasClass('has-del') ){
					if( site_page_type == 'order' ){
						$(this).data('site',data);
					}else{
						var trdata3 = $(this).data('site');
						var n3_data = $.extend(trdata3,data);
						$(this).data('site',n3_data);
					}
					$(this).find('.gosite').text(data.gosname);
					$(this).find('.gosite').attr('data-type',data.gotype);
					$(this).find('.backsite').text(data.backsname);
					$(this).find('.backsite').attr('data-type',data.backtype);
				}
			})
		}

		$('#selectSite_modal').modal('hide');
		$('.contSelGo').html('');
		$('.contSelBack').html('');
		$('#allprice').html(0);
		Settlement();
	} else{
		$.MsgBox({
            type: "alert",
            title: '提示',
            msg: '请添加完整去/返程信息',
            speed: 200
        });
	}
})