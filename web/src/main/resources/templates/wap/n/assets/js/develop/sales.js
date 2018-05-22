import '@/assets/less/develop/sales.less';
import $ from 'jquery';
import _ from '@/assets/js/common/global.js';
import Common from '@/assets/js/common/common.js';
import Index from '@/assets/js/develop/sales/index';
import devCommon from '@/assets/js/develop/common/common.js';
import MyDate from '@/assets/js/common/date_new.js';

function Start(){
	MyDate.init();
    MyDate.dateShowByDateRoute();
    devCommon.Init();
	this.Init();
}

Start.prototype = {
	Init : function(){
		var _this = this;
		_this.Route();
	
		$(window).on('hashchange',function(){
			devCommon.dateTabInit();
            MyDate.dateShowByDateRoute();
            devCommon.dateEnabled();
			_this.Route();	
		});
	},
	Route : function(){
		var _this = this;
		let dateType = _.GetPage().curPage;
        switch(dateType){
			case 'time':
				Index.Time();
				break;
			case 'department':
				Index.Department();
				break;
			case 'departmentOne':
				Index.DepartmentOne();
				break;
            case 'agent':
                Index.Agent();
                break;
            case 'system':
                Index.SystemIndex();
                break;
			default:
				Index.Index();
				break;
		}

	},

}

Common.Ready(function(){
	new Start();
})
	

