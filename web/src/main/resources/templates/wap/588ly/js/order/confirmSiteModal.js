$('#bancheok').click(function(){
	var data = {
		id : '',
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
	var $table = $('.order_touristInfo .tourist-table table');
	var $tr = $table.find('tbody tr').eq(data.pnumber-1);
 	
 	//游客使用方式
	if($("#c1").hasClass("active")){
		$tr.data('site',data);
		$tr.find('.gosite').text(data.gosname);
		$tr.find('.gosite').attr('data-type',data.gotype);
		$tr.find('.backsite').text(data.backsname);
		$tr.find('.backsite').attr('data-type',data.backtype);
	}else if($("#c2").hasClass("active")){
		$tr.parents('tbody').find('tr').each(function(){
			$(this).data('site',data);
			$(this).find('.gosite').text(data.gosname);
			$(this).find('.gosite').attr('data-type',data.gotype);
			$(this).find('.backsite').text(data.backsname);
			$(this).find('.backsite').attr('data-type',data.backtype);
		})
	}else if($("#c3").hasClass("active")){
		$table.find('tbody tr').data('site',data);
		$table.find('tbody tr').find('.gosite').text(data.gosname);
		$table.find('tbody tr').find('.gosite').attr('data-type',data.gotype);
		$table.find('tbody tr').find('.backsite').text(data.backsname);
		$table.find('tbody tr').find('.backsite').attr('data-type',data.backtype);
	}

	$('#select_confirmSiteStepModal').modal('hide');
	Settlement();

	$('.tabAddG li').eq(0).addClass('active').siblings().removeClass('active');
	$(".contSelGo").html('');
	$('.tabAddB li').eq(0).addClass('active').siblings().removeClass('active');
	$('.contSelBack').html('');
})

$('.qchk').click(function(){
	$('.qchk').removeClass("active");
	$(this).addClass("active");
})

$('.close>span').on('click',function() {
    $('.tabAddG li').eq(0).addClass('active').siblings().removeClass('active');
	$(".contSelGo").html('');
	$('.tabAddB li').eq(0).addClass('active').siblings().removeClass('active');
	$('.contSelBack').html('');
})

$('.batch_prevBtn').on('click',function() {
	$("#shopstationData_back li").each(function() {
	    if ($(this).find('i').hasClass('fa-check-circle') || $('#reback').hasClass('active')) {
	        $(this).addClass('active');
	    }
	})
})