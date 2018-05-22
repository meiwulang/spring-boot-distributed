import '../../less/made_plan.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Popup from '../common/popup.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';

class Index{
	constructor(){
		var _this = this;
		_.CheckLogin(function(){

			_this.pages={
				total:0,
				count:1
			}

		    _.GetCityCode(function(citycode){
		        _this.citycode = citycode;
		        _this.Render(1);
		        
			}) 
		})
	}

 	Render(currpage){
 		let _this = this;
 		let status = $('.infor-bar ul li a.active').attr('typeNum');
 		let projectId = _.GetUrlPara('id');
 		let typeedit = _.GetUrlPara('type');
		
		let data = {
			'edit' : '0',
			'projectId' : projectId,
			'currPage' : currpage,
			'pageSize' : '999'
		}
		$('body').addClass('scrolling');
 		_.Ajax({
 			url : '/require/queryProjectDetail',
 			type : 'post',
 			data : data,
 			success : function(res) {
 				if (res.code == 200) {
 					res.body['typeedit'] = typeedit;
 					let html = template('tpl-lists',res.body);
					$(".loading").remove();
					$('.content').html(html);
                    $('body').removeClass('scrolling');

                    // let Htid = res.body.id;
                    var designId = res.body.designId;
                    _this.Event(designId);

 				}
 			}

 		})
 	}

 	Event(Htid){
 		let _this = this;
 		$(".plan_sure").on("click",function(){
            Popup.Info('是否确认方案？');
            _this.Ht(Htid);
        })
 	}

 	Ht(Htid){
        var html = '<div class="lesse">取消</div><div class="yer">确定</div>';

        let imgHtml = '<div><p class="success-icon"></p><p>操作成功！</p></div>';
        $("#popup-info").append(html);
        $(".yer").on("click",function(){
            _.Ajax({
	            url : '/require/status/update',
	            type : 'post',
	            data : {
	            	dStatus : '4',
	            	id : Htid
	            },
                success : function(res){
                    if( res.code == 0 ){
                    	Popup.Info(imgHtml);
                    	setTimeout(function(){
							window.location.href = 'made_list.html';
                    	},500);
                    }
                }
            })
        })
        $(".lesse").on("click",function(){
            Popup.PopupRemove();
        })
    }
}
new Index();


