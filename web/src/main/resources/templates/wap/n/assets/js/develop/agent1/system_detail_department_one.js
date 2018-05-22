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
            url : '/agent1/company/department_detail_index.tpl',
            data :{
                pageTitle:name
            },
            success : function(html){
                $('#content').html(html);
                _this.RenderChart();
                _this.RenderTablePerson();
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
            start :myDateFn.start,
            end :myDateFn.end,
            value:myDateFn.value,
        }
        return pram;
    },
    RenderChart :function(){
        var _this = this;
        let departmentId = _.GetUrlPara('departmentId');
        let comPram = this.GetCommonPram();
        let chartPram = {
            queryType : comPram.pagaType,
            endDate : comPram.end,
            startDate : comPram.start,
            departId : departmentId
        }
        ajaxCommon.ChartAjax(chartPram).then(function(chartData){
             _.GetTpl({
                url : '/agent1/chart.tpl',
                data :{},
                success : function(html){
                    console.log(html)
                    $('#chart').html(html);
                    ChartRender.Render(chartData);
                }
            })
        });
    },
    RenderTablePerson : function(){
        let _this = this;
        
        let comPram = _this.GetCommonPram();
        let departmentId = _.GetUrlPara('departmentId');
        let tableType =  $('.tab-wrap .tab.active').attr('tableType');
        let pram = {
            tableType : tableType,
            type : comPram.pagaType,
            endDate : comPram.end,
            startDate : comPram.start,
            departmentId : departmentId
        }

         ajaxCommon.tabbleOfAgent(pram).then(function(resData){
             _.GetTpl({
                url : '/agent1/company/department_table_person.tpl',
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
        let departmentId = _.GetUrlPara('departmentId');
        let tableType =  $('.tab-wrap .tab.active').attr('tableType');
        let pram = {
            tableType : tableType,
            type : comPram.pagaType,
            endDate : comPram.end,
            startDate : comPram.start,
            departmentId : departmentId
        }

         ajaxCommon.tabbleOfAgent(pram).then(function(resData){
             _.GetTpl({
                url : '/agent1/company/department_table_time.tpl',
                data :resData,
                success : function(html){
                    $('#table-container').html(html);
                }
            })
        });
    },
    renderFn:function(type){        
        var _this = this;
        if(type == '231'){
            _this.RenderTablePerson();
        }
        else  if(type == '221'){
            _this.RenderTableTime();
        }
    },
    Event : function(){
        var _this = this;
        $("#content").off('click','.tab-wrap .tab');
        $("#content").on('click','.tab-wrap .tab',function () {
            var _self = $(this);
             let type = _self.attr('tableType');
            _self.addClass('active').siblings('.tab').removeClass('active');
            _this.renderFn(type);
        
        });
        $(".date-wrap").off("change",'.tim input,.tim select');
        $(".date-wrap").on("change",'.tim input,.tim select',function(){
            _this.RenderChart();
            let type = $(".tab-wrap").find('.active').attr('tableType');
            _this.renderFn(type);
              
        });
    } 

}
module.exports = Start;

    

