import $ from 'jquery';
import _ from '@/assets/js/common/global.js';
import template from 'template';
import MyDate from '@/assets/js/common/date_new.js';
import ChartRender from './chartRender.js';

function Start(){
	
	this.Init();
	
	this.Event();
}

Start.prototype = {
	Init : function(){
        var _this = this;
        _.GetTpl({
            url : '/product/com_index.tpl',
            data :{},
            success : function(html){
                $('#content').html(html);
                _this.Render();
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
            start :myDateFn.start,
            end :myDateFn.end,
            value:myDateFn.value,
        }
        return pram;
    },
    Render : function(){
        let _this = this;

        let parm = this.GetCommonPram();
        _.Ajax({
            url : '/productStatistics/list',
            type : 'post',
            data : {
                type : parm.pagaType,
                startDate : parm.start,
                endDate: parm.end
            },
            success : function(res){
                if( res.code == 200 ){              
                    let resData = res.body;
                    _this.RenderChart(res.body);
                    _this.RenderTableProduct(resData);
                }
            }
        })
    },
    RenderChart :function(chartData){
        var _this = this;   
         _.GetTpl({
            url : '/product/chart.tpl',
            data :{},
            success : function(html){
                $('#chart').html(html);
                ChartRender.Render(chartData);
            }
        })
    
    },
    RenderTableProduct : function(resData){      
         _.GetTpl({
            url : '/product/index_product_u.tpl',
            data :resData,
            success : function(html){
                $('#table-container').html(html);
            }
        })
        
    },
   
   
    Event : function(){
        var _this = this;
    
        $(".date-wrap").off("change",'.tim input,.tim select');
        $(".date-wrap").on("change",'.tim input,.tim select',function(){
            _this.Render();
              
        });
    }
	

}

module.exports = Start;