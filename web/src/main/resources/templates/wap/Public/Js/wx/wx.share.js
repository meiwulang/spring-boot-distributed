/**
 * 组织分享数据
 * @param opt 提供的分组内容
 * @param s 成功时调用函数
 * @param e 失败时调用函数
 * @returns {{title: *, desc: (*|string), link: *, imgUrl: *, type: string, dataUrl: *, success: Function, cancel: Function}}
 * @constructor
 */
function ShareData(opt,type,s,e){
    var def={
        title: opt.title, // 分享标题
        desc: opt.desc, // 分享描述
        link: opt.url?opt.url:'', // 分享链接
        imgUrl: opt.pic?opt.pic:'', // 分享图标
        type: opt.type?opt.type:'',// 分享类型,music、video或link，不填默认为link
        dataUrl: opt.dataUrl?opt.dataUrl:'', // 如果type是music或video，则要提供数据链接，默认为空,
        success: opt.success?opt.success:''
    };
    var flied=['title','desc','link','imgUrl','success'];
    if(type=='AppMessage'){
        flied=['title','desc','link','imgUrl','type','dataUrl','success'];
    }else if(type=='Timeline'){
        flied=['title','link','imgUrl','success'];
    };
    var share={};
    for(var i in flied){
        share[flied[i]]=def[flied[i]];
    };
    /*share.success=function () {
        if(s)s(opt);
        // 用户确认分享后执行的回调函数
    };*/
    share.cancel=function () {
        if(e)e(opt);
        // 用户取消分享后执行的回调函数
    };
    return share;
}

//所有分享的定义
function ShareApp(opt,s,e){
    //分享到朋友圈
    wx.onMenuShareTimeline(ShareData(opt,'Timeline',s,e));
    //分享给朋友
    wx.onMenuShareAppMessage(ShareData(opt,'AppMessage',s,e));
    //分享到QQ
    wx.onMenuShareQQ(ShareData(opt,'QQ',s,e));
    //分享到腾讯微博
    wx.onMenuShareWeibo(ShareData(opt,'Weibo',s,e));
    //分享到QQ空间
    wx.onMenuShareQZone(ShareData(opt,'QZone',s,e));
}
