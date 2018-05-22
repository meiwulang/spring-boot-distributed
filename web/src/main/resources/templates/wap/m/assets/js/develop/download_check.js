import '../../less/download_check.less';
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
		var viewpdf_url = decodeURIComponent(_.GetUrlPara('viewpdf_url')),
		    download_url = decodeURIComponent(_.GetUrlPara('download_url'));
		if(download_url){ //下载合同
		 	$(".btns .to-index").attr("href",download_url);
		 };
		 if(viewpdf_url){ //查看合同
		 	$(".btns .to-order").attr("href",viewpdf_url);
		 }
		
	}
}

UserInfo.Ready(function(){
	new Index();
})