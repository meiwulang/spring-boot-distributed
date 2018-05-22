$(function(){
    var date = new Date();
    var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
    $("#header").load("index_header.html?t="+_TimeStamp);
    $("#footer").load("index_footer.html?t="+_TimeStamp);
    $("#login_mask").load("login.html?t="+_TimeStamp);
	$('#qcode').attr('src',ApiUrl + '/b2b/qrcode/create?url='+ document.URL);
	getCityData()
	var org_id = GetQueryString('org_id');
	if(org_id){
		
	getBusinessdetailData(org_id);
		
	}else{
	    location.href = 'business.html';
        }
	})
	
function getCityData(citycode){
	_GetCityData(citycode,function(ret){
        if (ret.code == 200) {
            getTopconditionData();
        }
    });
}

function getTopconditionData() {
    code = _GetCityCode();
    if(code && 'null' != code) {
        var getTopconditionUrl = '/b2b/product/topcondition?code=' + code;
    } else {
        var getTopconditionUrl = '/b2b/product/topcondition';
    }
    ajaxRequest(getTopconditionUrl, 'GET', '', function(ret) {
        if(ret.data && ret.code == 200) {
            var dataInter = ret.data;
            var intersearchText = doT.template($("#TopconditionsearchDta-template").text());
            $("#TopconditionsearchData").html(intersearchText(dataInter));
        }
    })
}

function getBusinessdetailData(org_id) {

    var getBusinessdetailUrl = '/b2b/business/detail?org_id=' + org_id;

    ajaxRequest(getBusinessdetailUrl, 'GET', '', function (ret) {
        if (ret.data && ret.code == 200) {
            var data = ret.data;
            $('title').html(ret.data.org_sname + ' - 金豆云旅游');
            $('.company_name').html(data.org_name);
            $('#address').html(data.org_addr);
            $('#orgname').html(data.org_sname);
            $('#orglogo').attr('src', data.org_logo);
            $('#telephone').html(data.org_mob);
            $('#telephoneS').html(data.org_service_tel);
            $('#fax').html(data.org_fax);
            $('.content_detail').html(data.org_intro);
            $('#contact').html(data.org_legal);
            $('#area').html(data.org_apply_city);
           
            // $.each(data.product_type, function(i,val) {
            // 	$('#productType').append('<a href= "product_list.html?type='+ i +'&business='+ data.org_sname +'">'+ val +'</a>');
            // });
            $("#productType").append('<a href= "product_list.html?business='+ data.org_sname +'">点击查看</a>');
        } 
    });
}

function Start(){
    // 判断用户状态
    if(_uinfo && _uinfo.u_id){
        $("#user_name").html(_uinfo.u_realname);
        $("#org_name").html(_uinfo.org_sname);
    }else{
        window.location.href = '/index/login.shtml';
    }
}

Start();