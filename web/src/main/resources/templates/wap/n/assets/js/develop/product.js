import '@/assets/less/develop/product.less';
import $ from 'jquery';
import _ from '@/assets/js/common/global.js';
import Common from '@/assets/js/common/common.js';
import Index from '@/assets/js/develop/product/index.js';
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
             MyDate.dateShowByDateRoute();
            _this.Route();
            //devCommon.dateTabInit(); 
           
        });
	},

    Route : function(){
        var _this = this;

        $(window).scrollTop(0);

        let dateType = _.GetPage().curPage;
        switch(dateType){
            case 'detail':
                Index.Detail();
                break;
            case 'system':
                Index.System();
                break;
            case 'department':
                Index.SystemDepartment();
                break;
            default:
                Index.Index();
                break;
        }
    },

}

Common.Ready(function(){
	new Start();
});