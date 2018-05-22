// import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
// import Popup from '../common/popup.js';
// import template from '../lib/artTemplate.js';
// import UserInfo from '../common/userinfo.js';
// import Api from './api.js';


export default {
    wxConfig:function(){
        var wx_config={
            debug:false, 
            appId: 'wx4f8c668abdd46305', 
            timestamp: null, 
            nonceStr: null, 
            signature: null, 
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo','startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice','onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage','uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation','getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems','hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode','chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']                    
        }        
        _.Ajax({
           url : '/common/getWXconfig',
            data:{
                pageUrl:location.href
            },
            async:false,
            success : function(res) {
                // alert(JSON.stringify(res));
                wx_config.timestamp=res.body.timestamp;
                wx_config.nonceStr=res.body.nonceStr;
                wx_config.signature=res.body.signature;
            }
        }) 
        return wx_config       
    }
}