var _GetCityCode = function(){
	var city_code = getCookie('city_code');
	if( city_code ){
		return city_code;
	}
	return '';
}
var _GetCityData = function(code,callback){
	if( code ){
		var citycode = code;
	}else{
		var citycode = getCookie('city_code'),
			cityname = getCookie('city_name');
	}

	var data = {};
	if( citycode ){
		data['code'] = citycode;
	}
	
	ajaxRequest('/H5/Adver/getHotCitys','GET',data,function(res){
		if( res.code == 200 ){
			var data = res.data;
			addcookie('city_code',res.data.currentCity.code,36000);
	        addcookie('city_name',res.data.currentCity.name,36000);

	        var hotCitytpl = doT.template($("#hotCity-template").text());
			$('#hotCity').html(hotCitytpl(data.hotCityList));

			var cityListtpl = doT.template($("#cityList-template").text());
			$('.tagBox').html(cityListtpl(data.cityListGroup));

			var cityList = data.cityList;

			$("#searInp").on("input propertychange",function(){  
				var searInp = $("#searInp").val();
				var arrs = [];
		        // 遍历对象
                for(var key in cityList){
                    // 数组
                    var arrayCity=cityList[key]
                    for(var i=0;i<arrayCity.length;i++){
                        var det = match(searInp,arrayCity[i])
                        if (det != undefined) {
                        	arrs.push(det);
                        }
                    }
                }
                var searchCitytpl = doT.template($("#searchCity-template").text());
				$('.searchList').html(searchCitytpl(arrs));
				if (arrs.length == 0) {
					$(".searchList").html('<a>对不起，暂无您搜索内容！</a>')
				}

				if ($("#searInp").val() == '') {
					$(".searchList").html('');
				}
		    })

			function match(key,param){
				var cityArr = [];
                var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
                // 判断是否是中文。为真为汉字
                if(reg.test(key)){
                // param.name 城市名中文
                    var cNam = param.name.split('');   
                    for(var i=0;i<cNam.length;i++){
                    	if (cNam[i].indexOf(key) > -1  || param.name.indexOf(key) > -1 ) {
                    		cityArr.push(param.name);
                    		cityArr.push(param.ename);
                    		cityArr.push(param.code);
                    	}
                    }          
                }else{
                // param.ename 城市名英文
                	if (key.length>0) {
                		var klen = key.length;
	                	var enam = param.ename.substr(0,klen);
	                	if (enam.indexOf(key) > -1) {
	                		cityArr.push(param.name);
                    		cityArr.push(param.ename);
                    		cityArr.push(param.code);
	                	}
                	}
                	
                }  
                if (cityArr.length>0) {
                	return cityArr;
                }    
            }

			$('p.dropdown-toggle').on('click',function() {
				if ($('.city_select').hasClass('open')) {
				}else{
					$("#searInp").val('');
					$(".searchList").html('');
				}
			})

			$('.city').html(data.currentCity.name + ' <span class="caret"></span>')
	      
	        if( typeof callback == 'function' ){
	        	callback(res);
	        }
	        $('.tagBox .title li').eq(0).addClass('active');
	        $('.title li').on('click',function(e) {
	        	e.stopPropagation();
	        	var index = $(this).index();
	        	$(this).addClass('active').siblings().removeClass('active');
	        	$('.allReasult ul').eq(index).show();
	        	$('.allReasult ul').eq(index).siblings().hide();
			});
	    }
	})
}

if (window.location.pathname != '/588ly/rePwd.html') {
	if (_uinfo && _uinfo.passType == 1) {
	    window.location.href = '/588ly/rePwd.html';
	};
}

