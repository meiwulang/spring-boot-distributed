$(document).on('click','#pagecount_back .o_page', function(){
	sessionStorage.pagecount = $(this).find('span').html();
	getShopstationData();
})
$(document).on('click','#pagecount_back .p_page', function(){
	if(sessionStorage.pagecount&&sessionStorage.pagecount>1){
		sessionStorage.pagecount = sessionStorage.pagecount-1;
		getShopstationData();
	}
})
$(document).on('click','#pagecount_back .n_page', function(){
	//alert(sessionStorage.pagetotal)
	if(sessionStorage.pagecount&&sessionStorage.pagecount<sessionStorage.pagetotal){
		sessionStorage.pagecount = Number(sessionStorage.pagecount)+1;
		getShopstationData();	
	}
})
$(document).on('click','#searchbackbus', function(){
	sessionStorage.key = $('#backbuskey').val()
	getShopstationData()
})
	
$(document).on('click','#shopstationData_back li.nostop', function(){
	$(this).addClass('active');
	$(this).find("i").addClass('fa-check-circle').removeClass('fa-circle-o');  //选中的li添加选择标识
	$(this).siblings('li.odd').find("i").removeClass("fa-check-circle").addClass('fa-circle-o');  //未选中的li移除选择标识
	$('#custom_site_go').val('');
	$(this).addClass('active').siblings('.odd').removeClass('active');
	$('#shopstationData_back').addClass('active')
	var contS = $(this).find('.radioAndName span').text();
	
	var backid = $(this).attr('data-id');
	$('.contSelBack').attr('data-id',backid);
	var backname = $(this).attr('data-sname');
	$('.contSelBack').attr('data-sname',backname);
	var backprice = $(this).attr('data-price');
	$('.contSelBack').attr('data-price',backprice);
	var backtype = $(this).attr('data-type');
	$('.contSelBack').attr('data-type',backtype);
	$('.contSelBack').html(contS);
	// var backid = $(this).attr('data-id')
	// var backsname = $(this).attr('data-sname')
	// var backprice = $(this).attr('data-price');
	// $('#backprice').html(backprice)
	// $('.reback_siteConfirm>p').html(backsname)
	// sessionStorage.backid = backid
	// sessionStorage.backsname = backsname
	// sessionStorage.backprice = backprice
	$('#reback').removeClass("active");
	
})
	//同去程
$('#reback').click(function(){
    $(this).toggleClass("active");
    if($('#reback').hasClass('active')){
    	$("#shopstationData_back .odd").find("i").removeClass("fa-check-circle").addClass('fa-circle-o');
    	$('#shopstationData_back .odd').removeClass("active");
    	$('.contSelBack').html($('.contSelGo').html());
    	var gbname = $('.contSelGo').attr('data-sname');
    	$('.contSelBack').attr('data-sname',gbname);
    	var gbprice = $('.contSelGo').attr('data-price');
    	$('.contSelBack').attr('data-price',gbprice);
    	var gbtype = $('.contSelGo').attr('data-type');
    	$('.contSelBack').attr('data-type',gbtype);
    	$("#shopstationData_back").removeClass('active');
    } else{
    	$('.contSelBack').html('');
    	$('.contSelBack').attr('data-id','');
    	$('.contSelBack').attr('data-sname','');
    	$('.contSelBack').attr('data-price','');
    	$('.contSelBack').attr('data-type','');
    }
})

//自定义填写  none
$('#custom_site_back').keyup(function(){
	$('#reback').removeClass('active');
	$("#shopstationData_back .odd").find("input").prop("checked",false);
})

	//下一步
$('#goconfirmmodel').click(function(){
	if ($('#shopstationData_back i').hasClass('fa-check-circle') || $('#reback').hasClass('active')) {
		var backid = $('.contSelBack').attr('data-id')
		var backsname = $('.contSelBack').attr('data-sname')
		var backprice = $('.contSelBack').attr('data-price');
		var backtype= $('.contSelBack').attr('data-type');
		if (!backprice) {
			backprice = 0.00;
		}
		// console.log(backid,backsname,backprice);
		$('#backprice').html(backprice)
		$('.reback_siteConfirm>p').html(backsname)
		sessionStorage.backid = backid
		sessionStorage.backsname = backsname
		sessionStorage.backprice = backprice
		sessionStorage.backtype = backtype

		var leng = $('#custom_site_back').val().length;
		if($('#shopstationData_back .odd').hasClass('active')){
			var backprice = $('#backprice').html();
			var goprice = $('#goprice').html();
			$('#allprice').html(parseInt(backprice) + parseInt(goprice));
			$('#select_backSiteStepModal').modal('hide');
			$('#select_confirmSiteStepModal').modal('show');

			$('#shopstationData_back .odd').removeClass('active');
			sessionStorage.backid = sessionStorage.backid;
			sessionStorage.backsname = sessionStorage.backsname;
			sessionStorage.backprice = sessionStorage.backprice;
			$('.reback_siteConfirm>p').html(sessionStorage.backsname);

			$('#reback').parent("label").show();
		}else if($('#reback').hasClass('active')){
			var backprice = $('#backprice').html();
			var goprice = $('#goprice').html();
			$('#allprice').html(parseInt(backprice) + parseInt(goprice));
			$('#select_backSiteStepModal').modal('hide');
			$('#select_confirmSiteStepModal').modal('show');

			sessionStorage.backid = sessionStorage.goid;
			sessionStorage.backsname = sessionStorage.gosname;
			sessionStorage.backprice = sessionStorage.goprice;
			$('.reback_siteConfirm>p').html(sessionStorage.gosname);
			var goprice = $('#goprice').html();
			$('#backprice').html(goprice);
			$('#reback').parent("label").show();
		}else if(leng > 0){
			var backprice = $('#backprice').html();
			var goprice = $('#goprice').html();
			$('#allprice').html(parseInt(backprice) + parseInt(goprice));
			$('#select_backSiteStepModal').modal('hide');
			$('#select_confirmSiteStepModal').modal('show');

			sessionStorage.backid = backid;
			sessionStorage.backsname = sessionStorage.backsname;
			sessionStorage.backprice = 0;
			$('#reback').parent("label").show();
			// $('.select_same').addClass('active');
		}
	}
})
$('#custom_site_back').keyup(function(){
	$('#shopstationData_back .odd').removeClass('active')
	$('.reback_siteConfirm>p').html($(this).val())
	$('#backprice').html('0')
	sessionStorage.backid = ''
	sessionStorage.backsname = $(this).val()
	sessionStorage.backprice = 0;
	
})
$('#back_resort').click(function(){
	$('#shopstationData_back .odd').removeClass('active')
	$('.reback_siteConfirm>p').html('自行前往目的地')
	$('#backprice').html('0')
	sessionStorage.backid = ''
	sessionStorage.backsname = '自行前往目的地'
	sessionStorage.backprice = 0;
	var backprice = $('#backprice').html()
	var goprice = $('#goprice').html()
	$('#allprice').html(parseInt(backprice) + parseInt(goprice))
	$('#select_backSiteStepModal').modal('hide')
	$('#select_confirmSiteStepModal').modal('show')
	
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

$('.close>span').on('click',function() {
    $('.tabAddG li').eq(0).addClass('active').siblings().removeClass('active');
	$(".contSelGo").html('');
	$('.tabAddB li').eq(0).addClass('active').siblings().removeClass('active');
	$('.contSelBack').html('');
	$('.tabAddG li span:nth-child(2)').css({'background':'#ff9b71','color':'#fff'});
})
