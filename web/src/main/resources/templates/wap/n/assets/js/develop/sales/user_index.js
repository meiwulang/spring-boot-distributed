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
            url : '/sales/user_index.tpl',
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
        ajaxCommon.ChartUser(chartPram).then(function(chartData){
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
        
        let comPram = this.GetCommonPram();
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
   
    Event : function(){
        var _this = this;
    
        $(".date-wrap").off("change",'.tim input,.tim select');
        $(".date-wrap").on("change",'.tim input,.tim select',function(){
            _this.RenderChart();
            _this.RenderTableTime();
              
        });
    }

}
module.exports = Start;

    

