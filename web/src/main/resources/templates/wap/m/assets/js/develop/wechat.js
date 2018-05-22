import '../../less/wechat.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
		this.Render();
		
	}
	Render(){
		let _this = this;
		var no = _.GetUrlPara('n');
		_.Ajax({
            url : '/h5/Payment/paytype_list',
            type : 'get',
            data : {
                no : no
            },
            success : function(res){
                if( res.code == 200 ){
                    var html = template('tpl-list',res.data);
                    $('.main').html(html);
                    _this.Bala();
                }
            }
        })
	}
	Bala(){
		let _this = this;
		var no = _.GetUrlPara('n');
		_.Ajax({
            url : '/h5/Payment/gateway',
            type : 'get',
            data : {
                no : no,
                payType : 30
            },
            success : function(res){
                if( res.code == 200 ){
                    var html = template('tpl-img',res.data);
                    $('.phon').html(html);
                    _this.Event();
                }
            }
        })
	}
	Event(){
		let _this = this;
		$(".buttonss").on("click",function(){
			var html = '<div>取消</div><div class="but_yes">确认</div>';
			_.Popup.Info('实际支付按微信支付成功为准！' + html);
			_this.Events();
		})

	}
	Events(){
		$(".but_yes").on("click",function(){
			var no = _.GetUrlPara('n');
			window.location.href = 'order_success.html?n=' + no;
		})
	}
	
}

UserInfo.Ready(function(){
	new Index();
})