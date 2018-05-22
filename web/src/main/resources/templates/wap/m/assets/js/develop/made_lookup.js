import '../../less/made_lookup.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
		this.Render();
	}

	Render(){
		var dId = _.GetUrlPara('id');
        var status = _.GetUrlPara('status');
		let _this = this;
		_.Ajax({
            url : '/require/historyDesignRequireList/'+dId,
            type : 'get',
            data : {
            
            },
            success : function(res){
                if( res.code == "200" ){
                    res['status'] = status;
                    var html = template('tpl-citylist',res);
                    $('.look').html(html);
                  
                }
            }
        })
  		
	}



	
}

UserInfo.Ready(function(){
	new Index();
})