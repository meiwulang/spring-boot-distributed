import $ from 'jquery';
import _ from '@/assets/js/common/global.js';
import template from 'template';
import MyDate from '@/assets/js/common/date_new.js';
import Alert from '@/assets/js/common/popup.js';

function Start(){
	
	this.Init();
	
	this.event();
}

Start.prototype = {
	Init : function(){
		var _this = this;	
 		_this.Render();
		
	},
	Render : function(parm){
		let _this = this;
		_.GetTpl({
			url : '/person/index.tpl',
			data :{},
			success : function(html){
				$('#content').html(html);	
				_this.tableRender();							
			}
		})
	},
	getAjaxPram :function(){
		let route = _.GetPage().parentPage;
		let myDateFn = MyDate.getPersonCurPram(route);
		let tabType = $('.tab-wrap').find('.active').attr('tabType');
 		let parm = {
 			route : route,//路由时间类型 
 			pagaType : MyDate['index'][route],//时间type
 			start :myDateFn.start,
 			end :myDateFn.end,
 			value:myDateFn.value,
 			identityLevel:tabType
 		}
 		return parm;
	},
	tableRender :function(){
		let _this = this;
		let parm = _this.getAjaxPram();
		let levelName = $('.tab-wrap').find('.active').attr('levelName');
		_.Ajax({
			url : '/personalSales/list',
			type : 'post',
			data : {
				type : parm.pagaType,
				startDate : parm.start,
				endDate: parm.end,
				identityLevel :parm.identityLevel
			},
			success : function(res){
				if( res.code == 0 ){
					let resData = res.body;
					resData.levelName = levelName;
					_.GetTpl({
						url : '/person/table.tpl',
						data :resData,
						success : function(html){
							$('#table-contanier').html(html);								
						}
					})
				}
			}
		})
	},
	event:function(){
		let _this = this;
		//$(".date-wrap .tim").off("change",'input,select');
		
		$(".date-wrap .tim").off().on("change",'.month input,select',function(){
		 	const self = $(this);
			_this.tableRender();
			  
        });

        $(".date-wrap .tim").on("change",'.day input.start',function(){
		 	const self = $(this);
		 	let start  = self.val();
			let end = self.parent().find('input.end').val();
		 	if(start>end){
				Alert.Tip('开始日期不能晚于结束日期');
			}
			else{
				_this.tableRender();
			}  
        });
         $(".date-wrap .tim").on("change",'.day input.end',function(){
		 	const self = $(this);
		 	let end  = self.val();
			let start = self.parent().find('input.start').val();
		 	if(start>end){
				Alert.Tip('开始日期不能晚于结束日期');
			}
			else{
				_this.tableRender();
			}  
        });

		$("#content").off('click','.tab-wrap .tab');
        $("#content").on('click','.tab-wrap .tab',function(){
        	var self = $(this);
        	self.addClass('active').siblings('.tab').removeClass('active');
        	_this.tableRender();

        });
     
	}

}

module.exports = Start;