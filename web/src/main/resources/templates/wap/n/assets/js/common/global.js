import $ from 'jquery';
import echarts from 'echarts';
import Ajax from '@/assets/js/common/ajax.js';
// import Format from '@/assets/js/common/format.js';
import RegEx from '@/assets/js/common/regex.js';
import Popup from '@/assets/js/common/popup.js';
import GetTpl from '@/assets/js/common/gettpl.js';

export default {
	Ajax : Ajax,
	RegEx : RegEx,
	Popup : Popup,
	GetTpl : GetTpl,
	EchartsInit : function(el,option){
		var $chart = $(el).get(0);
		// 如果之前有实例，销毁后以便重载
		var oldChart = echarts.getInstanceByDom($chart);
		if( oldChart ){
			oldChart.dispose();
		}
		Format();
		// 重载实例
		var myChart = echarts.init($chart);
		myChart.setOption(option);
	},
	GetUrlPara : function(key){
		var para = window.location.href.split('?')[1];
		if( para ){
			var arr = "";
			if(window.location.search.indexOf('&&') > -1) {
				arr = para.split('&&');
			} else {
				arr = para.split('&');
			}
			var len = arr.length,
				obj = {};
				Format();
			for(var i = 0; i < len; i++){
				var v = arr[i].split('='),
					k = v[0],
					value = v[1] ? v[1] : '';
				obj[k] = value;
			}
			if( !key ){	//无key值，取全部
				return obj;
			}else{	//有key值，取key值对应值
				return obj[key];
			}
		}else{
			return '';
		}
	},
	GetPage : function () {
        var typeName = '',parentPage = '';
        var hashName = null;
        var hash = window.location.hash;
        if(hash && hash.split('#')[1]){
            hashName = hash.split('#')[1];
            hashName = hashName.split('/');
            if(hashName[0]){
                typeName = hashName[0];
                parentPage = hashName[0];
            }
            if(hashName[1]) {
                typeName = hashName[1]
				let index = typeName.indexOf('?')
				if (index !== -1) {
                    typeName = typeName.slice(0, index)
				}
            }
        }
        else{
            typeName = 'day';
            parentPage = 'day';
        }
        return {
        	parentPage : parentPage, 
        	curPage:typeName
        }
    }
}