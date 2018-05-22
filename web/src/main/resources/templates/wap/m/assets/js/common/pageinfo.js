import $ from '../lib/jquery.2.1.4.js';
import Popup from './popup.js';

export default {
	Get : function(req,res){
		let uinfo = '';
		if( typeof _uinfo != 'undefined' ){
			uinfo = _uinfo;
		}
		let client = window.navigator.userAgent;
		let href = window.location.href;
		let session = JSON.parse(window.sessionStorage.getItem('PageInfo'));
		console.log(share_user + 'ee');
		if( !session || session.href != href ){
			session = {
				'_uinfo' : uinfo,
				'share_user' : share_user,
				'href' : href,
				'client' : client,
				'api' : []
			}
		}
		session.api.push({
			'url' : req.url,
			'request' : req,
			'response' : res
		});
		window.sessionStorage.setItem('PageInfo',JSON.stringify(session));
	},
	Send : function(api){
		if( $('#pageinfo-pop').size() ){
			return false;
		}
		let session = window.sessionStorage.getItem('PageInfo');
		let size = ((session.length)/1024).toFixed(2);
		let str = 	'<div id="pageinfo-pop">'+
						'<h3>我要反馈</h3>'+
						'<div class="info"><textarea placeholder="提交您的反馈信息(本次提交数据量'+size+'K,请尽量在wifi环境下提交)"></textarea></div>'+
						'<div class="btn clearfix">'+
							'<a class="cancel" href="javascript:;">取消</a>'+
							'<a class="submit" href="javascript:;">提交</a>'+
						'</div>'+
					'</div>';
		Popup.Info(str);
		$('#pageinfo-pop a.cancel').on('click',function(){
			if( $(this).hasClass('disable') ){
				return false;
			}
			Popup.PopupRemove();
		})
		$('#pageinfo-pop a.submit').on('click',function(){
			if( $(this).hasClass('disable') ){
				return false;
			}
			let message = $('#pageinfo-pop textarea').val();
			$(this).text('提交中...');
			$('#pageinfo-pop a').addClass('disable');
			$.ajax({
				url : api + '/H5/Adver/errorInfo',
				type : 'post',
				dataType : 'json',
				contentType : "application/json; charset=utf-8",
				xhrFields: {
           			withCredentials: true
       			},
	       		crossDomain: true,
				data : JSON.stringify({
					content : session,
					remark : message,
					url : window.location.href,
					source : 'm'
				})
			}).done(function(res){
				if( res.code == 200 ){
					$('#pageinfo-pop h3').remove();
					$('#pageinfo-pop .info').html('<p class="num">'+res.data+'</p><p>请记住反馈码用来向客服查询</p>');
					$('#pageinfo-pop .btn').html('<a class="close" href="javascript:;">关闭</a>');
					$('#pageinfo-pop a.close').on('click',function(){
						Popup.PopupRemove();
					})
				}
			})
		})
	}
}