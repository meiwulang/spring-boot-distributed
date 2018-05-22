function Mango(){
	this.Init();
}

Mango.prototype = {
	Init : function(){
		this.banner_t = null;
		clearInterval(this.banner_t);
		this.Banner();
		this.BannerEvent();
	},
	BannerChange : function(ind){
		$('.banner li.active').fadeOut(500,function(){
			$(this).removeClass('active');
		})
		$('.banner li').eq(ind).fadeIn(500,function(){
			$(this).addClass('active');
		})
		$('.banner .menu a').removeClass('active').eq(ind).addClass('active');
	},
	BannerEvent : function(){
		var _this = this;
		$('.banner .menu a').off().on('click',function(){
			if( $(this).hasClass('active') ){
				return false;
			}
			clearInterval(_this.banner_t);
			var ind = $(this).index();
			_this.BannerChange(ind);
		})
	},
	Banner : function(){
		var _this = this;
		this.banner_t = setInterval(function(){
			var len = $('.banner li').length;
			var ind = $('.banner li.active').index();
			if( ind < (len - 1) ){
				ind++;
			}else{
				ind = 0;
			}
			_this.BannerChange(ind);
		},5000)
	}
}