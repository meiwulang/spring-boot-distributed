import $ from 'jquery';
import _ from '@/assets/js/common/global.js';

export default {
	Ready : function(callback){
	    var _this = this;
        callback();
       /* _.GetTpl({
            url : '/common/header.tpl',
            data : {},
            success : function(html){
                $('#header').html(html);
                callback();
            }
        });*/

    },
    checkIP: function(host) {
        var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;

        if (re.test(host)) {
            if( RegExp.$1<256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256 ) return true;
        }

        return false;    
    },
    getDevENV: function() {
        var host = window.location.hostname

        if (this.checkIP(host) || host === 'localhost') {
            host = 'local.baobiao.jdytrip.cn'
        }
        
        return host
    }
}