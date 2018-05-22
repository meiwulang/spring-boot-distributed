import $ from 'jquery';
import _ from '@/assets/js/common/global.js';

export default {
	Plot : function(){
		$(".count .shade").on("click",function(){
            console.log('sreen');
			$(".screen").addClass("active");
			$(".count").addClass('disable');
			$(".record").addClass('disable');
		})
		$(".clear").on("click",function(){
			$(".screen").removeClass("active");
			$(".count").removeClass('disable');
			$(".record").removeClass('disable');
		})

		var wid = document.documentElement.clientWidth;
		var hei = document.documentElement.clientHeight;
		$(".screen").css("width",wid);
		$(".screen").css("height",hei);

		$(".screen .son").css("width",hei);
		$(".screen .son").css("height",wid);
	},
	Currs : function(change){
		var date = new Date();
		// 往前退一天
        //日统计和月统一
		// date.setDate(date.getDate()-1);
		var strMonth = date.getMonth() + 1;//月
		var strDate = date.getDate();//日
		if(strMonth >= 1 && strMonth <= 9){
			strMonth = '0' + strMonth;
		}
		if(strDate >= 1 && strDate <= 9){
			strDate = '0' + strDate;
		}
		var currentdate = date.getFullYear() + '-' + strMonth + '-' + strDate;
		var currentmonth = date.getFullYear() + '-' + strMonth;
		var currentdateFormat = date.getFullYear() + '年' + strMonth + '月' + strDate + '日';
        // $(".switch .day input").val(currentdate);
        $(".switch .day input").val(currentdate).attr('max',currentdate);
        // $(".switch .month input").val(currentmonth);
        $(".switch .month input").val(currentmonth).attr('max',currentmonth);

		//周统计
		var weekNo = $('.switch .tim input').val();
		var getDateFormat = function(date){
			var year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate();
			if( month < 10 ){
				month = '0' + month;
			}
			if( day < 10 ){
				day = '0' + day;
			}
			return {
				year : year,
				month : month, 
				day : day,
				format : year + '-' + month + '-' + day
			}
		}
		// 获取今天年月日
		var today = getDateFormat(new Date()).format;
		var year = getDateFormat(new Date()).year;

		// 算出这年的第一周星期一和星期日
		var date = new Date(year-1,0,1);
		var n = 6 - (date.getDay()+6)%7;
		date.setDate(date.getDate()+n);
		var weekstart,weekend;
		var arr = [];
		do{
			date.setDate(date.getDate()+1);
			weekstart = getDateFormat(date);
			date.setDate(date.getDate()+6);
			weekend = getDateFormat(date);
			arr.push( weekstart.format + ' 至 ' + weekend.format );
		}while( today > weekend.format );
		var htmls = '';

		for(var i = 0; i < arr.length; i++){
			htmls += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
		}
		$("#select_week").html(htmls);
		$("#select_week option:last").prop("selected","selected");


        //获取当前年，月份

        var getSeasonNum = function (n) {
		    var valueS = '';
		    var valueE = '';
		    var nStr='';
            if(n === 1){
                valueS='-01-01';
                valueE='-03-31';
                nStr= '一';
            }
            else if(n === 2){
                valueS='-04-01';
                valueE='-06-30';
                nStr= '二';
            }
            else if(n === 3){
                valueS='-07-01';
                valueE='-09-30';
                nStr= '三';
            }
            else if(n === 4){
                valueS='-10-01';
                valueE='-12-31';
                nStr= '四';
            }
            return{
                valueS:valueS,
                valueE:valueE,
                n:nStr
            }
        }
        var curYear = getDateFormat(new Date()).year;
        var curMonth = getDateFormat(new Date()).month;
        var startYear = getDateFormat(new Date(curYear-1,0,1)).year;

        //季统计

        var seasonArr = []; 

        for (var i=startYear;i<curYear;i++) {
            for (var j=1;j<5;j++) {
              var time = getSeasonNum(j);
              var item = {label:i+'年'+'第'+time.n+'季度',value:i+time.valueS+'至'+i+time.valueE};
              seasonArr.push(item);
            }
        }

        var seasonLen = Math.ceil(curMonth/3);

        for (var m=1;m<seasonLen+1;m++){
            var time = getSeasonNum(m);
            var item = {label:curYear+'年'+'第'+time.n+'季度',value:curYear+time.valueS+'至'+curYear+time.valueE};
            seasonArr.push(item);
        }

        var monthOption = '';

        seasonArr.forEach((item,index)=>{
            monthOption += '<option value="' +item.value + '">' + item.label + '</option>';
        });

        $("#select_season").html(monthOption);
        $("#select_season option:last").prop("selected","selected");

        //年统计
        var yearArr = [];

        for (var i=startYear;i<curYear+1;i++) {
            var item = {label:i+'年',value:i+'-01-01至'+i+'-12-31'};
            yearArr.push(item);
        }
        var yearOption = '';

        yearArr.forEach((item)=>{
            yearOption += '<option value="' +item.value + '">' + item.label + '</option>';
        });

        $("#select_year").html(yearOption);
        $("#select_year option:last").prop("selected","selected");


        this.dateTimeSelect();
	},
	dateTimeSelect:function (callback) {
        var typ = $(".switch ul li.active").attr('typ');
        var sumType = _.GetPage().parentPage; 
        // console.log(sumType);
        var pathname = window.location.pathname;
        pathname = pathname.replace('/wap/n/', '');
        pathname = pathname.replace('/', '');
        switch (pathname) {
            case 'product.html':
            case 'agent.html':
            case 'agent_depart.html':
            case 'agent_user.html':
            case 'sales.html':
                if (sumType === 'day') {
                    $(".tim").find('.day').addClass('active').siblings('div').removeClass('active');
                } else if (sumType === 'month') {
                    $(".tim").find('.month').addClass('active').siblings('div').removeClass('active');
                }else if( sumType === 'week' ){
                    $(".tim").find('.week').addClass('active').siblings('div').removeClass('active');
                } else if (sumType === 'season') {
                    $(".tim").find('.season').addClass('active').siblings('div').removeClass('active');
                } else if (sumType === 'year') {
                    $(".tim").find('.year').addClass('active').siblings('div').removeClass('active');
                }
                break;
            default:
                break;
        }
        if( typeof callback === 'function' ){
            callback();
        }
    }
}