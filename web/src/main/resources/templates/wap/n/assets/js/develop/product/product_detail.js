
import $ from 'jquery';
import _ from '@/assets/js/common/global.js';
import template from 'template';
import MyDate from '@/assets/js/common/date_new.js';
import ChartRender from './chartRender.js';

function Start(){
    this.resDate = '';
	this.Init();
    this.Event();
}

Start.prototype = {
	Init : function(){

        let name = decodeURIComponent(_.GetUrlPara('productName'));
		var _this = this;
        _.GetTpl({
            url : '/product/company_detail.tpl',
            data :{
                pageTitle:name
            },
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

        var productId = _.GetUrlPara('productId');

        _.Ajax({
            url : '/productStatistics/detailList',
            type : 'post',
            data : {
                type : parm.pagaType,
                startDate : parm.start,
                endDate: parm.end,
                 productId:Number(productId),
            },
            success : function(res){
                if( res.code == 200 ){
                    _this.resDate = res.body;
                    _this.RenderChart(res.body);
                    _this.RenderTableDepartment(res.body);
                   // _this.RenderTablePerson(res.body);
                   
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
    RenderTableDepartment : function(resData){      
         _.GetTpl({
            url : '/product/detail_department.tpl',
            data :resData,
            success : function(html){
                $('#table-container').html(html);
            }
        }) 
    },
    RenderTablePerson : function(resData){      
         _.GetTpl({
            url : '/product/detail_person.tpl',
            data :resData,
            success : function(html){
                $('#table-container').html(html);
            }
        }) 
    },
   
   
	Event : function(){
		var _this = this;

        let curPage = _.GetPage().curPage;

        $(".date-wrap").off("change",'.tim input,.tim select');
        
        $(".date-wrap").on("change",'.tim input,.tim select',function(){
            _this.Render(); 
            
        });
        

        $("#content").off('click','.tab-wrap .tab');

		$("#content").on('click','.tab-wrap .tab',function () {
            var _self = $(this);
            var activeTab = _self.attr('tabType');
            _self.addClass('active').siblings('.tab').removeClass('active');
            if(activeTab === 'department'){
                _this.RenderTableDepartment(_this.resDate);
        
            }
            else if(activeTab === 'person'){
                _this.RenderTablePerson(_this.resDate);
            }   

        });
    
	},
    
}

module.exports = Start;