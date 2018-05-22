import '@/assets/less/develop/sales.less';
import $ from 'jquery';
import _ from '@/assets/js/common/global.js';
import template from 'template';
import MyDate from '@/assets/js/common/date_new.js';
import ajaxCommon from './ajaxCommon.js';
import ChartRender from './ChartRender.js';
import devCommon from '@/assets/js/develop/common/common.js';

function Start(){   
    this.Init();
    this.Event();
    devCommon.dateDisabled();
}

Start.prototype = {
    Init : function(){
       var _this = this;
       let name = decodeURIComponent(_.GetUrlPara('timeName'));   
        _.GetTpl({
            url : '/sales/company_detail_t.tpl',
            data :{
                pageTitle:name
            },
            success : function(html){
                $('#content').html(html);
                _this.RenderChart();
                _this.RenderTableProduct();
            }
        });
        
    },
    GetCommonPram: function(date){
        let _this = this;
        let route = _.GetPage().parentPage;
        let myDateFn =  MyDate.getCurPram(route);
        let pram = {
            route : route,
            pagaType : MyDate['index'][route],
            pagaTypeFF : MyDate['indexOfFF'][route],
            start :myDateFn.start,
            end :myDateFn.end,
            value:myDateFn.value,
        }
        return pram;
    },
    RenderChart :function(){
        var _this = this;
        let comPram = this.GetCommonPram();
        let chartPram = ChartRender.getChartPram(comPram);
    
        ajaxCommon.ChartCompany(chartPram).then(function(chartData){
             _.GetTpl({
                url : '/sales/chart.tpl',
                data :{},
                success : function(html){
                    $('#chart').html(html);
                    ChartRender.render(chartData);
                }
            })
        });
    },
   
    RenderTablePerson : function(){
        let comPram = this.GetCommonPram();

        let sumTime = decodeURIComponent(_.GetUrlPara('sumTime'));
        let timeName = decodeURIComponent(_.GetUrlPara('timeName'));
        let route = _.GetPage().parentPage; 

        let returnNewPram  = devCommon.getPageTypeByTime(route,sumTime,timeName);
        
        let pram = {
            queryDate : returnNewPram.queryDate,
            startDate :returnNewPram.start,
            endDate : returnNewPram.end,
            objectType :'0',
            queryType  :returnNewPram.type,
            startTime:returnNewPram.startTime
        }

        ajaxCommon.queryDepartmentSaleCount(pram).then(function(resData){
             _.GetTpl({
                url : '/sales/detail_person.tpl',
                data :resData,
                success : function(html){
                    $('#table-container').html(html);
                }
            })
        });
    },
   
     RenderTableProduct : function(){
         let sumTime = decodeURIComponent(_.GetUrlPara('sumTime'));
        let timeName = decodeURIComponent(_.GetUrlPara('timeName'));
        let route = _.GetPage().parentPage; 

        let returnNewPram  = devCommon.getPageTypeByTime(route,sumTime,timeName);

        let pram = {
            queryDate : returnNewPram.queryDate,
            startDate : returnNewPram.start,
            endDate : returnNewPram.end,
            objectType : '2',
            queryType : returnNewPram.type,
            startTime : returnNewPram.startTime
        }
        ajaxCommon.queryDepartmentSaleCount(pram).then(function(resData){
             _.GetTpl({
                url : '/sales/detail_product.tpl',
                data :resData,
                success : function(html){
                    $('#table-container').html(html);
                }
            })
        });
    },
     RenderTableDeparment : function(){
        let comPram = this.GetCommonPram();

        let sumTime = decodeURIComponent(_.GetUrlPara('sumTime'));
        let timeName = decodeURIComponent(_.GetUrlPara('timeName'));
        let route = _.GetPage().parentPage; 
        let returnNewPram  = devCommon.getPageTypeByTime(route,sumTime,timeName);

        let pram = {
            date : returnNewPram.queryDate,
            endDate : returnNewPram.end,
            startDate : returnNewPram.start,
            startTime : returnNewPram.startTime,
            type : returnNewPram.type
        }
        ajaxCommon.tabbleOfDepartment(pram).then(function(resData){
             _.GetTpl({
                url : '/sales/detail_department.tpl',
                data :resData,
                success : function(html){
                        console.log(html)
                    $('#table-container').html(html);
                }
            })
        });
    },
    renderFn:function(type){        
        var _this = this;
        if(type == '2'){
            _this.RenderTableProduct();
        }
        else if(type == '0'){
            _this.RenderTablePerson();
        }
        else  if(type == 'department'){
            _this.RenderTableDeparment();
        }
    },
    Event : function(){
        var _this = this;
        $("#content").off('click','.tab-wrap .tab');
        $("#content").on('click','.tab-wrap .tab',function () {
            var _self = $(this);
             let type = _self.attr('objectType');
            _self.addClass('active').siblings('.tab').removeClass('active');
            _this.renderFn(type);
        
        });
        $(".date-wrap").off("change",'.tim input,.tim select');
        $(".date-wrap").on("change",'.tim input,.tim select',function(){
            let type = $(".tab-wrap").find('.active').attr('objectType');
            _this.RenderChart();
            _this.renderFn(type);
              
        });
    } 
     
}
module.exports = Start;

    

