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
            url : '/agent1/user/index_user.tpl',
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
        let chartPram = {
            queryType : comPram.pagaType,
            endDate : comPram.end,
            startDate : comPram.start
        }
        ajaxCommon.ChartAjax(chartPram).then(function(chartData){
             _.GetTpl({
                url : '/agent1/chart.tpl',
                data :{},
                success : function(html){
                    $('#chart').html(html);
                    ChartRender.Render(chartData);
                }
            })
        });
    },
   
    RenderTableTime : function(){
        let _this = this;
        let comPram = this.GetCommonPram();
        let pram = {
            startDate : comPram.start,
            endDate : comPram.end,
            tableType : 322,
            type :comPram.pagaType
        }
         ajaxCommon.tabbleOfAgent(pram).then(function(resData){ 
            resData.sumType = comPram.route;
            resData.list.forEach((item)=>{
                item.timeName = encodeURIComponent(item.timeRange);
            });
             _.GetTpl({
                url : '/agent1/user/index_table_time.tpl',
                data :resData,
                success : function(html){
                    $('#table-container').html(html);
                }
            })
        });
    },
    
    GetCommonPram: function(date){
        let _this = this;
        let route = _.GetPage().parentPage;
        let myDateFn =  MyDate.getCurPram(route);
        let pram = {
            route : route,
            pagaType : MyDate['index'][route],
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
            //let type = $(".tab-wrap").find('.active').attr('tableType');
            _this.RenderTableTime();
              
        });
    }

}
module.exports = Start;

    

