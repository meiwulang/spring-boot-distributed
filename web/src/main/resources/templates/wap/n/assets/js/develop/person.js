import '@/assets/less/develop/person.less';
import $ from 'jquery';
import _ from '@/assets/js/common/global.js';
import Common from '@/assets/js/common/common.js';
import Index from '@/assets/js/develop/person/index.js';
import devCommon from '@/assets/js/develop/common/common.js';

import MyDate from '@/assets/js/common/date_new.js';


function Start(){

    
    MyDate.initPerson();
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
            _this.Route();
        });
	},

    Route : function(){
        var _this = this;

        $(window).scrollTop(0);

        let dateType = _.GetPage().curPage;
        switch(dateType){
            case 'system':
                Index.System();
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