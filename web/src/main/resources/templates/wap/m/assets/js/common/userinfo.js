import $ from '../lib/jquery.2.1.4.js';
import Api from './api.js';

export default {
	Ready : function(callback){
		$.getScript( Api()+'/wap/m/assets/js/get_consts.js', function(){
			$.getScript( Api()+'/wap/m/assets/js/get_wechat.js', function(){
				var from = window.sessionStorage.getItem("from");
				if(from == 'preview'){
					share_user = {};
				};
				callback();
			})
		})
	}
}
