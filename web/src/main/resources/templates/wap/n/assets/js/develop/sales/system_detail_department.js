import '@/assets/less/develop/sales.less';
import $ from 'jquery';
import _ from '@/assets/js/common/global.js';
import template from 'template';
import MyDate from '@/assets/js/common/date_new.js';
import ajaxCommon from './ajaxCommon.js';
import ChartRender from './ChartRender.js';

function Start(){   
   
    this.Init();
    this.Event();
}

Start.prototype = {
    Init : function(){
       var _this = this;
       let name = decodeURIComponent(_.GetUrlPara('name'));   
       
        _.GetTpl({
            url : '/sales/company_detail_d.tpl',
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
    GetCommonPram: function(){
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
        let uDepartmentCode = _.GetUrlPara('dId');
        let comPram = this.GetCommonPram();
        let chartPram = ChartRender.getChartPram(comPram);
        chartPram.id = uDepartmentCode;
        ajaxCommon.ChartDepartment(chartPram).then(function(chartData){
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
    RenderTableProduct : function(){
        let _this = this;
        
        let comPram = _this.GetCommonPram();
        let uDepartmentCode = _.GetUrlPara('dId');
        let pram = {
            queryDate : comPram.start,
            startDate :comPram.start,
            endDate : comPram.end,
            objectType : 2,
            queryType  :comPram.pagaType,
            uDepartmentCode :uDepartmentCode
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
    RenderTablePerson : function(){
        let _this = this;
        
        let comPram = _this.GetCommonPram();
        let uDepartmentCode = _.GetUrlPara('dId');
        let pram = {
            queryDate : comPram.start,
            startDate :comPram.start,
            endDate : comPram.end,
            objectType : 0,
            queryType  :comPram.pagaType,
            uDepartmentCode :uDepartmentCode
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
    RenderTableTime : function(){
        let _this = this;
        
        let comPram = _this.GetCommonPram();
        let uDepartmentCode = _.GetUrlPara('dId');
        let pram = {
            queryDate : comPram.start,
            startDate :comPram.start,
            endDate : comPram.end,
            objectType : 1,
            queryType  :comPram.pagaType,
            uDepartmentCode :uDepartmentCode
        }

         ajaxCommon.queryDepartmentSaleCount(pram).then(function(resData){
             _.GetTpl({
                url : '/sales/detail_time.tpl',
                data :resData,
                success : function(html){
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
        else  if(type == '1'){
            _this.RenderTableTime();
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
            _this.RenderChart();
            let type = $(".tab-wrap").find('.active').attr('objectType');
            _this.renderFn(type);
              
        });
    } 

}
module.exports = Start;

    

