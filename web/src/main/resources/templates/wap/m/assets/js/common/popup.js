import $ from '../lib/jquery.2.1.4.js';

export default {
	Loading : function(){
		let str = '<div id="loading"><div id="popup-mask"></div><div id="popup-loading"></div></div>';
		let $html = $(str).appendTo('body');
	},
	LoadingRemove : function(){
		$('#loading').remove();
	},
	Tip : function(content,call){
		let str = '<div id="popup"><div id="popup-mask"></div><div id="popup-tip">'+content+'</div></div>';
		let $html = $(str).appendTo('body');

		let t = setInterval(function(){
			$html.fadeOut(function(){
				$html.remove();
				if( typeof call === 'function' ){
					call();
				}
				clearInterval(t);
			});
		},1000);
	},
	Info : function(content){
		let _this = this;
		let str = '<div id="popup"><div id="popup-mask"></div><div id="popup-info">'+content+'</div></div>';
		let $html = $(str).appendTo('body');

		// $('#popup-mask').on('click',function(){
		// 	_this.PopupRemove();
		// })
		return $html;
	},
	PopupRemove : function(){
		$('#popup').remove();
	},
	Confirm : function(content,ok,cancel){
		let _this = this;
		let contents = 	'<div class="popup-confirm">'+
							'<div class="popup-content"><div class="popup-txt">'+content+'</div></div>' +
			    			'<div class="popup-foot">'+
			    				'<div class="popup-cancel">取消</div><div class="popup-ok">确认</div>'+
			    			'</div>'+
			    		'</div>';
		let conf = this.Info(contents);
		
		conf.find('.popup-confirm .popup-ok').on('click',function(){
			if( typeof ok == 'function' ){
				ok();
			}
		})

		conf.find('.popup-confirm .popup-cancel').on('click',function(){
			if( typeof cancel == 'function' ){
				cancel();
			}
			conf.remove();
		})

		return conf;
	}
	
}