// desc : lazyload
// author : zhupinglei
// 344184416@qq.com

import $ from './jquery.2.1.4.js';

class LazyLoad{
	constructor(){
		this.Lazy();
		this.Scroll();
	}

	Lazy(){
		$('img').each(function(){
			let here = this;
			let src = $(here).data('src');
			let winH = $(window).height();
			let imgT = $(here).get(0).getBoundingClientRect().top;
			if( src && imgT <= winH ){
				$(here).attr('src',src);
				let img = new Image();
				img.src = src;
				img.onload = function(){
					$(here).data('src','');
				}
			}
		})
	}

	Scroll(){
		let _this = this;
		$(window).on('scroll',function(){
			_this.Lazy();
		})
	}
}

export default LazyLoad;