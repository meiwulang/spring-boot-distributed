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
		_.GetTpl({
	        url : '/sales/system_index.tpl',
	        data :{},
	        success : function(html){
	            $('#content').html(html);
	            _this.RenderChart();
	            _this.RenderTableSystem();
	        }
	    });
		
	},
	RenderChart :function(){
		var _this = this;
		let comPram = this.GetCommonPram();
        let chartPram = ChartRender.getChartPram(comPram);
		ajaxCommon.ChartSystem(chartPram).then(function(chartData){
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
	RenderTableSystem : function(){
		let _this = this;
		
	    let comPram = this.GetCommonPram();
		let pram = {
			date : comPram.start,
			endDate : comPram.end,
			objectType : 0,
			type :comPram.pagaType
		}
		 ajaxCommon.tabbleOfDepartment(pram).then(function(resData){
		 	resData['date'] = comPram.start;	
	        resData.sumTime = encodeURIComponent(comPram.value);
	        resData.sumType = comPram.route;
	        resData.resultList.forEach((item)=>{
	            item.unitName = encodeURIComponent(item.name);
	        });
			 _.GetTpl({
			    url : '/sales/index_system_company.tpl',
	            data :resData,
	            success : function(html){
	                $('#table-container').html(html);
	            }
	        })
		});
	},
	RenderTableTime : function(){
		let _this = this;
		
	    let comPram = this.GetCommonPram();
		let pram = {
			date : comPram.start,
			endDate : comPram.end,
			objectType : 1,
			type :comPram.pagaType
		}
		 ajaxCommon.tabbleOfDepartment(pram).then(function(resData){
			 _.GetTpl({
			    url : '/sales/index_time_system.tpl',
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
 			pagaTypeFF : MyDate['indexOfFF'][route],
 			start :myDateFn.start,
 			end :myDateFn.end,
 			value:myDateFn.value,
 		}
 		return pram;
	},
	renderFn:function(type){		
		var _this = this;
		if(type == 'company'){
			_this.RenderTableSystem();
        }
        else if(type == '1'){
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

	

