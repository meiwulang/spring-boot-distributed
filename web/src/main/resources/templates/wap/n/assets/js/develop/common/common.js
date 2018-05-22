import $ from 'jquery';

import _ from '@/assets/js/common/global.js';

import MyDate from '@/assets/js/common/date_new.js';

export default {
    Init:function() {
        this.dateTabInit();
        this.EventInit();    
    },
    dateDisabled:function(){
        $('.tim input').attr('disabled',true);
        $('.tim input').css('color','#999');
        $('.tim select').attr('disabled',true);   
        $('.tim select').css('color','#999');
    },
    dateEnabled:function(){
        $('.date-wrap .tim input').attr('disabled',false);
        $('.date-wrap .tim input').css('color','#5575e2');
        $('.date-wrap .tim select').attr('disabled',false);
        $('.date-wrap .tim select').css('color','#5575e2');
    },
    getDateFormat: function(date){
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
            monthFormat : year + '-' + month ,
            dateFormat : year + '-' + month + '-' + day
        }
    },
	dateTabInit:function(){
		let route = _.GetPage().parentPage;
		$("#header .ul-bag li").each(function () {
            var self  = $(this);
            var selfAname = self.find('a').attr('href');
            selfAname = selfAname.split('#')[1];
            selfAname = selfAname.split('/')[0];
            if(selfAname === route) {
                self.addClass('active').siblings('li').removeClass('active');
            }
        });

	},
    DateInit : function(){
        var _this = this;
        $("#header .tim select").find('option:last').prop("selected","selected");
        var date = new Date();
        var curDate = _this.getDateFormat(date).dateFormat;
        var curMonth =  _this.getDateFormat(date).monthFormat;
        $("#header .tim .day").find('input').val(curDate);
        $("#header .tim .month").find('input').val(curMonth);
    },
	EventInit:function(){
		var _this = this;
		
        $("#header").on("click",'.ul-bag li',function(){
            $(".switch ul li").removeClass('active');
            $(this).addClass("active");   
            if($("#person")[0]){
                MyDate.clearPersonDate();
            } 
            else{
                MyDate.clearDate();
            }             
        });
        
        //返回上一页
        $("#content,.title_header").on("click",'.bg_ing',function(){
            let curPage = _.GetPage().curPage;
            let route = _.GetPage().parentPage;
            let pathname = window.location.pathname;
            pathname = pathname.replace('/wap/n/', '');
            pathname = pathname.replace('/', '');
            let uDataLimit = localStorage.uDataLimit;

            if(curPage === 'detail' || curPage === 'department'|| curPage === 'time' || curPage === 'system' || curPage === 'departmentOne'){
                    window.history.go(-1);
                    // window.location.href = pathname+'#'+route;
            }else{
                window.location.href = 'list.html';
            }
           
        });
    
        $("#content").on("click",'.count .shade',function(){
            console.log('sreen');
            $(".screen").addClass("active");
            $(".count").addClass('disable');
            $(".record").addClass('disable');
        })
        $("#content").on("click",'.clear',function(){
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
    getNewDay : function(dateTemp, days) {
         var dateTemp = dateTemp.split("-");
         var date = new Date(parseInt(dateTemp[0]),parseInt(dateTemp[1])-1,parseInt(dateTemp[2]));
         date.setDate(date.getDate()+days);
         var year = date.getFullYear(),
             month = date.getMonth() + 1,
             day = date.getDate();
        if( month < 10 ){
            month = '0' + month;
        }
        if( day < 10 ){
            day = '0' + day;
        }
        return year + "-" + month + "-" + day;
    },
    getWeekDate : function(week,startDate){
        const _this =  this;
        switch(week) {
            case '周一':
            var tim = _this.getNewDay(startDate,0);
                break;
            case '周二':
            var tim = _this.getNewDay(startDate,1);
                break;
            case '周三':
            var tim = _this.getNewDay(startDate,2);
                break;
            case '周四':
            var tim = _this.getNewDay(startDate,3);
                break;
            case '周五':
            var tim = _this.getNewDay(startDate,4);
                break;
            case '周六':
            var tim = _this.getNewDay(startDate,5);
                break;
            case '周日':
            var tim = _this.getNewDay(startDate,6);
                break;
        }
      return tim;
    },
     getYearDate : function(season,startDate){
        let year = startDate.substring(0,4);
        console.log( year)
        switch(season) {
            case '第一季度':
                var start = year+'-01-01';
                var end =  year+'-03-31';
                break;
            case '第二季度':
                var start = year+'-04-01';
                var end = year+'-06-30';
                break;
            case '第三季度':
                var start = year+'-07-01';
                var end = year+'-09-30';
                break;
            case '第四季度':
                var start = year+'-10-01';
                var end = year+'-12-31';
                break;
        }
      return {start:start,end:end};
    },
     getTimeDate : function(time){
       var time = time.split('-')[0];
       
      return time+':00';
    },

    getPageTypeByTime : function(route,timeRang,timeName) {
        let _this = this;

        let returnType = '', queryDate = '',start = '',end = '',startTime='';

        switch (route){
            case 'day':
                returnType = '2'; 
                queryDate = timeRang;
                startTime = _this.getTimeDate(timeName);
                break;
            case 'week':
                returnType = '2';
                var dataStart = timeRang.split('至')[0];
                queryDate = _this.getWeekDate(timeName,dataStart);
                start = queryDate;
                startTime = '';
                end ="";
                break;
            case 'month':
                returnType = '2';
                 var dateDay = timeName.replace('年','-');
                 dateDay = dateDay.replace('月','-');
                 dateDay = dateDay.replace('日','');
                 queryDate = dateDay;
                 start = queryDate;
                 startTime = '';
                 end="";
                break;
            case 'season':
                returnType = '1';
                var dateDay = timeName.replace('年','-');
                dateDay = dateDay.replace('月','');
                queryDate = dateDay+'-01';
                start = queryDate;
                startTime = '';
                end="";
                break;
            case 'year':
                returnType = '4';
                var dataStart = timeRang.split('至')[0];
                queryDate = _this.getYearDate(timeName,dataStart).start;
                start = queryDate;
                end = _this.getYearDate(timeName,dataStart).end;
                startTime = '';
                break;
            default:
                break;

        }
        return{
            type:returnType,
            queryDate:queryDate,
            start:start,
            end:end,
            startTime:startTime

        } 
        
    },
    getPageTypeByAgent : function(route,comPram) {
        let _this = this;

        let returnPram = {};

        switch (route){
            case 'day':
                returnPram = {
                    queryDate : comPram.start,
                    queryType : comPram.pagaType
                }
                break;
            case 'week':
                returnPram = {
                    startDate : comPram.start,
                    endDate : comPram.end,
                    queryType : comPram.pagaType                    
                }
                break;
            case 'month':
                returnPram = {
                    queryDate : comPram.start,
                    queryType : comPram.pagaType
                }
                break;
            case 'season':
                returnPram = {
                    startDate : comPram.start,
                    endDate : comPram.end,
                    queryType : comPram.pagaType
                }
                break;
            case 'year':
                returnPram = {
                    startDate : comPram.start,
                    endDate : comPram.end,
                    queryType : comPram.pagaType
                }
                break;
            default:
                break;
        }

        return returnPram;
        
    },
  
}
