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
	devCommon.dateEnabled();
}

Start.prototype = {
	Init : function(){
		var _this = this;

       let name = decodeURIComponent(_.GetUrlPara('name'));   
		_.GetTpl({
	        url : '/agent1/system/detail_company.tpl',
	        data :{
	        	pageTitle:name
	        },
	        success : function(html){
	            $('#content').html(html);
	            _this.RenderChart();
	            _this.RenderTableDepartment();
	        }
	    });
		
	},
	RenderChart :function(){
		var _this = this;
		let comPram = this.GetCommonPram();
		let companyId = _.GetUrlPara('companyId');
        let chartPram = {
        	queryType : comPram.pagaType,
			endDate : comPram.end,
			startDate : comPram.start,
			companyId : companyId
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
	RenderTableDepartment : function(){
		let _this = this;
		let tableType =  $('.tab-wrap .tab.active').attr('tableType');
	    let comPram = this.GetCommonPram();
	    let companyId = _.GetUrlPara('companyId');
		let pram = {
			startDate : comPram.start,
			endDate : comPram.end,
			tableType : tableType,
			type :comPram.pagaType,
			companyId : companyId

		}
		 ajaxCommon.tabbleOfAgent(pram).then(function(resData){
	        resData.sumType = comPram.route;
	        resData.list.forEach((item)=>{
	            item.departName = encodeURIComponent(item.departmentName);
	        });
			 _.GetTpl({
			    url : '/agent1/company/index_table_department.tpl',
	            data :resData,
	            success : function(html){
	                $('#table-container').html(html);
	            }
	        })
		});
	},
	RenderTableTime : function(){
		let _this = this;
		let tableType =  $('.tab-wrap .tab.active').attr('tableType');
	    let comPram = this.GetCommonPram();
	    let companyId = _.GetUrlPara('companyId');
		let pram = {
			startDate : comPram.start,
			endDate : comPram.end,
			tableType : tableType,
			type :comPram.pagaType,
			companyId :companyId
		}
		 ajaxCommon.tabbleOfAgent(pram).then(function(resData){	
	        resData.sumType = comPram.route;
	        resData.companyId = companyId;
	        resData.list.forEach((item)=>{
	            item.timeName = encodeURIComponent(item.timeRange);
	        });
			 _.GetTpl({
			    url : '/agent1/system/company_table_time.tpl',
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
	renderFn:function(type){        
        var _this = this;
        if(type == '115'){
            _this.RenderTableDepartment();
        }
        else  if(type == '125'){
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

	

