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
        _.GetTpl({
            url : '/sales/department_index.tpl',
            data :{},
            success : function(html){
                $('#content').html(html);
                _this.RenderChart();
                _this.RenderTableTime();
            }
        });
                 
    },
    RenderChart :function(){
        var _this = this;
        let comPram = this.GetCommonPram();
        let chartPram = ChartRender.getChartPram(comPram);
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
    RenderTableTime : function(){
        let _this = this;
        
        let comPram = _this.GetCommonPram();
        let pram = {
            queryDate : comPram.start,
            startDate :comPram.start,
            endDate : comPram.end,
            objectType : 1,
            queryType  :comPram.pagaType,
        }
         ajaxCommon.queryDepartmentSaleCount(pram).then(function(resData){
            resData['date'] = comPram.start;    
            resData.sumTime = encodeURIComponent(comPram.value);
            resData.sumType = comPram.route;
            resData.list.forEach((item)=>{
                item.timeName = encodeURIComponent(item.dateTime);
            });
             _.GetTpl({
                url : '/sales/index_time_d.tpl',
                data :resData,
                success : function(html){
                    $('#table-container').html(html);
                }
            })
        });
    },
    RenderTablePerson : function(){
        let _this =this;
        let comPram = _this.GetCommonPram();
        let pram = {
            queryDate : comPram.start,
            startDate :comPram.start,
            endDate : comPram.end,
            objectType : 0,
            queryType  :comPram.pagaType
        }
        ajaxCommon.queryDepartmentSaleCount(pram).then(function(resData){
            resData['date'] = comPram.start;  
            resData.sumTime = encodeURIComponent(comPram.value);
            resData.sumType = comPram.route;
            resData.list.forEach((item)=>{
                item.userNameCode = encodeURIComponent(item.userName);
            });
             _.GetTpl({
                url : '/sales/index_person.tpl',
                data :resData,
                success : function(html){
                    $('#table-container').html(html);
                }
            })
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
    renderFn:function(type){     
        var _this = this;
        if(type == '0'){
            _this.RenderTablePerson();
        }
        else if(type == '1'){
            _this.RenderTableTime();
        }
    },
    Event : function(){
        var _this = this;
         $("#content").off('click','.tab-wrap .tab')
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

    

