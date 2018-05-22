import '../../less/order_search.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
        let _this = this;
        
        _.GetCityCode(function(citycode){
            _this.citycode = citycode;
            _this.Enter();
        })
	}

	Enter(){
		let _this = this;
		// $('input').on('keydown',function(e) {
		// 	if( 13 == e.keyCode) {
		// 		_this.Render();
		// 	}
			
		// });

        $(".inp input").on('input propertychange',function() {
            if( !$('body').hasClass('scrolling') ){
                _this.Render();
            }
            let key = $('input').val();
        });

		
        $('.go-back a.left').on('click',function() {
            history.go(-1);
        });
 	}

 	Render(){
        let _this = this;
        let key = $('input').val();
        $('body').addClass('scrolling');
        _.Ajax({
            // url : '/h5/shop/search_order_keyword',
            url : '/front/order/m/searchOrderList',
            type : 'post',
            data : {
                key : key
            },
            success : function(res){
                if( res.code == 200 ){
                    let order_type = _.GetUrlPara('order_type');
                    res['order_type'] = order_type;
                    let html = template('tpl-search',res);
                    if (res.data.length != 0) {
                        $('.detail').html(html);
                    } else {
                        $('.detail').html('<li class="no-infor">暂无数据</li>');
                    }
                    $('body').removeClass('scrolling');
                }
            }
        })
    }

 	
}
UserInfo.Ready(function(){
    new Index();
})


