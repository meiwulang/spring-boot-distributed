
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
            url : '/product/system_detail.tpl',
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
                    res.body.productId = productId;
                    res.body.sumType = parm.route;
                    _this.RenderChart(res.body);
                    _this.RenderTableCompany(res.body);
                   
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
    RenderTableCompany : function(resData){   
       
        resData.list.forEach((item,index)=>{
            if(item.type == '0'){
                item.comName = encodeURIComponent(item.companyName)
            }
            else if(item.type == '1'){
                item.departName = encodeURIComponent(item.departmentName)
            }     
        });   
         _.GetTpl({
            url : '/product/detail_system_company.tpl',
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
        
    
	},
    
}

module.exports = Start;