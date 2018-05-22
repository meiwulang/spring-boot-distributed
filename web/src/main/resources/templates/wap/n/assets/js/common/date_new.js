import $ from 'jquery'; 
import _ from '@/assets/js/common/global.js';


export default {
	container:$(".date-wrap .tim"),
	GetSelectDate:function(date) {
		let dateArr = date.split('至');
		return{
			start:dateArr[0].trim(),
			end:dateArr[1].trim()
		}
	},
	GetDateFormat : function(date){
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
			date : date,
			year : year,
			month : month, 
			day : day,
			dayFormat : year + '-' + month + '-' + day,
			monthFormat : year + '-' + month
		}
	},
	Today : function(){
		let _this = this;
		var date = new Date();
		return _this.GetDateFormat(date);
	},
	day : function(){
		let _this = this;
		let start = _this.Today().dayFormat;
		let html = 	'<div class="day active"><input type="date" value="' + start +'" /></div>';
		return html;
	},
	dayTwo:function(){
		let _this = this;
		let start = _this.Today().dayFormat;
		let htmlS = '<div class="day active"><input class="start" type="date" value="' + start +'" />';
		let htmlE = '<span> 至 </span><input class="end" type="date" value="' + start +'" /></div>';
		return htmlS + htmlE;
	},
	//周数据
	week : function(){
		let _this = this;

		// 获取今天年月日
		var today = _this.Today().dayFormat;
		var year = _this.Today().year;

		// 算出这年的第一周星期一和星期日
		var date = new Date(year-1,0,1);
		var n = 6 - (date.getDay()+6)%7;
		date.setDate(date.getDate()+n);
		var weekstart,weekend;
		var arr = [];
		var weeks = [];
		do{
			date.setDate(date.getDate()+1);
			weekstart = _this.GetDateFormat(date);
			date.setDate(date.getDate()+6);
			weekend = _this.GetDateFormat(date);
			arr.push( weekstart.dayFormat + '至' + weekend.dayFormat );
			weeks.push({
				start : weekstart.dayFormat,
				end : weekend.dayFormat
			})
		}while( today > weekend.dayFormat );

		let start,end,dateValue;
		let curDate = { start:'',end:''};
		
		curDate.start = today;
		curDate.end = today;
		
		var html = '<div class="week"><select>';
		for(var i = 0; i < arr.length; i++){  

			if( curDate.start >= weeks[i].start && curDate.end  <= weeks[i].end ){
				start =  weeks[i].start;
				end =  weeks[i].end;
				dateValue = arr[i];
				html += '<option selected="selected" start="'+ weeks[i].start +'" end="'+ weeks[i].end +'" value="' + arr[i] + '">' + arr[i] + '</option>';
			}
			else{
				html += '<option start="'+ weeks[i].start +'" end="'+ weeks[i].end +'" value="' + arr[i] + '">' + arr[i] + '</option>';
			}

		}
		html += '</select></div>';


		return html;
	},
	month : function(){
		let _this = this;
		let start = _this.Today().monthFormat;
		let	html = '<div class="month"><input type="month" value="' + start + '" /></div>';

		return html;
	},
	season : function(){ 
		let _this = this; 
        //季统计
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

        var today = _this.Today().dayFormat;
        var curYear = _this.Today().year;
        var curMonth = _this.Today().month;
        var startYear = _this.GetDateFormat(new Date(curYear-1,0,1)).year;

        var seasonArr = []; 
	
        for (var i=startYear;i<curYear;i++) {
            for (var j=1;j<5;j++) {
              var time = getSeasonNum(j);
              var item = {label:i+'年'+'第'+time.n+'季度',value:i+time.valueS+'至'+i+time.valueE,start:i+time.valueS,end:i+time.valueE};
              seasonArr.push(item);
            }
        }

        var seasonLen = Math.ceil(curMonth/3);

        for (var m=1;m<seasonLen+1;m++){
            var time = getSeasonNum(m);
            var item = {label:curYear+'年'+'第'+time.n+'季度',value:curYear+time.valueS+'至'+curYear+time.valueE,start:curYear+time.valueS,end:curYear+time.valueE};
            seasonArr.push(item);
        }

  		let start,end,dateValue;
		let curDate = { start:'',end:''};
		
		curDate.start = today;
		curDate.end = today;
		

        var html = '<div class="season"><select>';

        seasonArr.forEach((item,index)=>{
      
        	if( curDate.start >= item.start && curDate.end  <= item.end ){
        		start = item.start;
        		end = item.end;
        		dateValue = item.value;
	            html += '<option start="'+item.start +'" end="'+item.end +'" selected="selected" value="' +item.value + '">' + item.label + '</option>';
	        }
	        else{
				html += '<option start="'+item.start +'" end="'+item.end +'" value="' +item.value + '">' + item.label + '</option>';
	        }
        });

        html += '</select></div>';

        return html;
	},
	year : function(){
		let _this = this;
		//年统计
        var yearArr = [];

        var today = _this.Today().dayFormat;
        var curYear = _this.Today().year;
        var startYear = _this.GetDateFormat(new Date(curYear-1,0,1)).year;
        

        for (var i=startYear;i<curYear+1;i++) {
            var item = {label:i+'年',value:i+'-01-01至'+i+'-12-31',start:i+'-01-01',end:i+'-12-31'};
            yearArr.push(item);
        }

        let start,end,dateValue;
		let curDate = { start:'',end:''};
		
		curDate.start = today;
		curDate.end = today;
		

        var html = '<div class="year"><select>';

        yearArr.forEach((item)=>{
       
        	if( curDate.start >= item.start && curDate.end <= item.end ){
        		start = item.start;
        		end = item.end;
        		dateValue = item.value;
	            html += '<option start="'+item.start +'" end="'+item.end +'" selected="selected" value="' +item.value + '">' + item.label + '</option>';
	        }
	        else{
				html += '<option start="'+item.start +'" end="'+item.end +'" value="' +item.value + '">' + item.label + '</option>';
	        }
          
        });

        html += '</select></div>'

        return html;
	},
	init :function(container){
		let _this = this;
		//_this.container = container;
		let dayHtml = _this.day();
		let weekHtml = _this.week();
		let monthHtml = _this.month();
		let seasonHtml = _this.season();
		let yearHtml = _this.year();
		let temp = dayHtml + weekHtml + monthHtml + seasonHtml + yearHtml;
		//$(".date-wrap .tim").htm(temp);
		_this.container.html(temp);
	},
	clearDate:function(){
		this.init();
	},
	getSelectStartEnd:function(selectedOption){
		let value = $.trim(selectedOption.val());
	    let start = $.trim(selectedOption.attr('start'));
	    let end = $.trim(selectedOption.attr('end'));
	    let returnPram = {
		  	start : start,
			end : end,
			value : value
		 };
		 return returnPram;
	},
	getCurPram:function(route){
		let _this = this;
		let returnPram = {};
		switch (route){
			case 'day':
				 let dayVal = $.trim(_this.container.find('.day input').val());
				 returnPram = {
				  	start : dayVal,
					end : '',
					value : dayVal
				 }
				 break;
			case 'week':
			 	let selectedWeek= _this.container.find('.week select option:selected');
			    returnPram = _this.getSelectStartEnd(selectedWeek);
				 break;
			case 'month':

				 const monthVal = $.trim(_this.container.find('.month input').val());
				 returnPram = {
				  	start : monthVal + '-01',
					end : '',
					value : monthVal
				 }
				 break;
		 	case 'season':
			 	let selectedSeason = _this.container.find('.season select option:selected');
			    returnPram = _this.getSelectStartEnd(selectedSeason);
				 break;
		 	case 'year':
			 	let selectedYear = _this.container.find('.year select option:selected');
			    returnPram = _this.getSelectStartEnd(selectedYear);
				break;
			 default:
			 	break;
		}
		return returnPram;
	},

	initPerson :function(container){
		let _this = this;
		let dayHtml = _this.dayTwo();
		let weekHtml = _this.week();
		let monthHtml = _this.month();
		let seasonHtml = _this.season();
		let yearHtml = _this.year();
		let temp = dayHtml + weekHtml + monthHtml + seasonHtml + yearHtml;
		_this.container.html(temp);
	},
	getPersonCurPram:function(route){
		let _this = this;
		let returnPram = {};
		switch (route){
			case 'day':
				 let start = $.trim(_this.container.find('.day input.start').val());
				 let end = $.trim(_this.container.find('.day input.end').val());
				 returnPram = {
				  	start : start,
					end : end,
					value : start
				 }
				 break;
			case 'week':
			 	let selectedWeek= _this.container.find('.week select option:selected');
			    returnPram = _this.getSelectStartEnd(selectedWeek);
				 break;
			case 'month':
				 const monthVal = $.trim(_this.container.find('.month input').val());
				 returnPram = {
				  	start : monthVal + '-01',
					end : '',
					value : monthVal
				 }
				 break;
		 	case 'season':
			 	let selectedSeason = _this.container.find('.season select option:selected');
			    returnPram = _this.getSelectStartEnd(selectedSeason);
				 break;
		 	case 'year':
			 	let selectedYear = _this.container.find('.year select option:selected');
			    returnPram = _this.getSelectStartEnd(selectedYear);
				break;
			 default:
			 	break;
		}
		return returnPram;
	},
	clearPersonDate:function(){
		this.initPerson();
	},
	dateShowByDateRoute:function(){
		let _this = this;
        var route = _.GetPage().parentPage;
        _this.container.find('.'+route).addClass('active').siblings('div').removeClass('active');         
	},

	index : {
		'day' : 2,
		'week' : 3,
		'month' : 1,
		'season' : 4,
		'year' : 5
	},
	indexOfFF : {
		'day' : 1,
		'week' : 2,
		'month' : 3,
		'season' : 4,
		'year' : 5
	},
}