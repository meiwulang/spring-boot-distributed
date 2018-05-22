// 无锡和苏州不能选地址
var user_city_code = getCookie('user_city_code');
var user_org_type = getCookie('user_org_type');
if( (user_city_code == '320200' || user_city_code == '320500' || user_city_code == '320400') && user_org_type == '分销商' ){
	$('.vertMiddle').hide();
}else{
	$('.vertMiddle').show();
}

var type = '';
var listVal = '';
var listCont = '';
var titleArr = {
	"0": "全部类型",
	"10": "周边短线",
	"11": "国内长线",
	"20": "出境游",
	"30": "邮轮"
};
type = GetQueryString('type') ? GetQueryString('type') : '0';
$(".proTypeShowName").html(titleArr[type]);
$(".proTypeShowName").attr("value",type);

$(".proTypeShow").on("click",function(e) {
	e.stopPropagation();
	$(".proTypeLists").toggle();
	$(this).find(".selectDown").toggleClass("glyphicon-triangle-top").toggleClass("glyphicon-triangle-bottom");
});
$(document).on('click', function(e) {
	e.stopPropagation();
	$(".proTypeLists").hide();
 	$('.selectDown').addClass('glyphicon-triangle-bottom').removeClass('glyphicon-triangle-top');
});
$(".proTypeLists li").on('click',function(e) {
 	e.stopPropagation();
 	listCont = $(this).html();
 	listVal = $(this).val();

 	$(".proTypeShowName").text(listCont);
 	$(".proTypeShowName").attr("value",listVal);
 	$(".proTypeLists").hide();
 	$('.selectDown').addClass('glyphicon-triangle-bottom').removeClass('glyphicon-triangle-top');
 });
$("#modal_CityiesBtn").focus(function() {
	$("#modal_Cityies").css("display", "block");
});
$("#modal_CityiesBtn").blur(function() {
	setTimeout(function() {
		$("#modal_Cityies").css("display", "none");
	}, 200);
});

if (GetQueryString('key')) {
	$('.sreachTop').show();
}

$("#search_btn").on("click",function() {
	modelSreach();
})
function modelSreach() {
	if($("#modal_CityiesBtn").val() == '') {
	} else {
		
		if (listVal || listVal === 0) {
			$(".proTypeShowName").attr("value",listVal);
		} else {
			$(".proTypeShowName").attr("value",type);
		}
		var pVal = $(".proTypeShowName").attr("value");

		 window.location.href = 'product_list.html?key=' + $("#modal_CityiesBtn").val() + '&type=' + pVal + '&text=' + $(".proTypeShowName").text();

	}
}



if(_uinfo && _uinfo.u_id) {

	var htmlw = "<div class='pull-right'><div class='pull-left'><span>欢迎您!</span><span class='hotsoso' id='user_name'>" + _uinfo.u_realname + "</span></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><span>" + _uinfo.org_sname + "</span> </div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='/index/main.shtml' target='_blank'>管理中心</a></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='logout.html'>安全退出</a></div></div>"
	var htmlt = "<div class='pull-right'><div class='pull-left'><span>欢迎您!</span><span class='hotsoso' id='user_name'>" + _uinfo.u_realname + "</span></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><span>" + _uinfo.org_sname + "</span> </div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='/index/main.shtml' target='_blank'>管理中心</a></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='logout.html'>安全退出</a></div></div>"

	if (window.location.host == "www.jdytrip.cn") {
		$(".my_navbar .pull-right").html(htmlw);
	} else {
		$(".my_navbar .pull-right").html(htmlt);
	}

	
	$(".raid span").css("display", "none");
	$(".raid a").css("display", "none");
	$(".sp span").css("display", "none");
	var html = "<span> <span class='colorb'>欢迎你！&#x3000;</span>" + _uinfo.u_realname + "</span>";
	$(".adde").html(html);
} else{
	if (window.location.host == "www.jdytrip.cn") {
		$('.help').attr('href','http://help.jdytrip.cn');
		$('.market').attr('href','http://app.jdytrip.cn');
	} else {
		$('.help').attr('href','http://test.help.jdytrip.cn');
		$('.market').attr('href','http://test.app.jdytrip.cn');
	}
	
}


// setTimeout("citynull()", 1000);

// function citynull() {
// 	if( !$('#citylist ul').size() ) {
// 		$('#citylist').parent().css({ "padding": "10px", "width": "120px" });
// 		$('#citylist').html('您暂时无权切换城市。');
// 	}
// };

$('#modal_CityiesBtn').keydown(function() {
	if('13' == event.keyCode) {
		modelSreach();
	}
});


//收藏本站 
function AddFavorite() {
	var url = window.location.href;
	var title = '芒果卉旅游';
	try {
		window.external.AddFavorite(url, title);
	} catch(e) {
		try {
			window.sidebar.addPanel(title, url, "");
		} catch(e) {
			// alert("您的浏览器不支持,请按 Ctrl+D 手动收藏!");
			$.MsgBox({type:"alert",title: '错误',msg: "您的浏览器不支持，请按 Ctrl+D 手动收藏!",speed:200});
		}
	}
}

$('.favorite').on('click',function(){
	AddFavorite();
})

$('#message').load('message.html',function(){
    /*var messageflag = window.sessionStorage.getItem('message');
    if( messageflag != 1 ){
        $('#messageModal').modal({
            show : true
        })
        window.sessionStorage.setItem('message',1);
    }*/
});

var jdy_host = window.location.host, 
    is_production = 'www.jdytrip.cn' == jdy_host;
var _hmt = _hmt || [], 
    baidu_tjid = is_production ? '2d8006ab3fc1b2a194523e3c86f219e3' : '4280ea6b88e6e2cef05f79ae6f7ac3f1';

$(document).ready(function(){
	var hm = document.createElement("script");
	    hm.src = "https://hm.baidu.com/hm.js?" + baidu_tjid;
	var s = document.getElementsByTagName("script")[0]; 
	s.parentNode.insertBefore(hm, s);
})
// setTimeout(
// 	function() {
// 	    var hm = document.createElement("script");
// 	    hm.src = "https://hm.baidu.com/hm.js?" + baidu_tjid;
// 	    var s = document.getElementsByTagName("script")[0]; 
// 	    s.parentNode.insertBefore(hm, s);
// 	},
// 	1000
// );



