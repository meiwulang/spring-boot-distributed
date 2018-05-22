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
}

Start.prototype = {
    Init : function(){
       var _this = this;
       let name = decodeURIComponent(_.GetUrlPara('name'));   
        _.GetTpl({
            url : '/sales/company_detail_agent.tpl',
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
    RenderTablePerson : function(){
        let _this = this;
        
        let comPram = _this.GetCommonPram();
        let uDepartmentCode = decodeURIComponent(_.GetUrlPara('dCode'));
        let pram = {
            queryDate : comPram.start,
            startDate :comPram.start,
            endDate : comPram.end,
            objectType : 0,
            queryType  :comPram.pagaType,
            uDepartmentCode :uDepartmentCode
        }

         ajaxCommon.queryDepartmentSaleCount(pram).then(function(resData){
            resData['date'] = comPram.start;  
            resData.sumTime = encodeURIComponent(comPram.value);
            resData.sumType = comPram.route;
            resData.list.forEach((item)=>{
                let name = '['+item.userName+'] 一';
                item.userNameCode = encodeURIComponent(name);
            });
             _.GetTpl({
                url : '/sales/detail_person_c_d.tpl',
                data :resData,
                success : function(html){
                    $('#table-container').html(html);
                }
            })
        });
    },
    
    Event : function(){
        var _this = this;
        $(".date-wrap").off("change",'.tim input,.tim select');
        
        $(".date-wrap").on("change",'.tim input,.tim select',function(){
            _this.RenderChart();
            _this.RenderTablePerson();
              
        });
    }   
}
module.exports = Start;

    

