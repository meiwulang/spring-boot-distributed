/**
 * 微信分享
 * @param opt
 */

import $ from './jquery.2.1.4.js';

var nodeId;

function weixin_share(opt){
    this.opt = opt;
    this.share_uid=opt.share_uid;
    this.products=opt.products;
    this.role='processRead';
    this.node_id=opt.products.node_id;
    this.city_code=opt.city_code;
    this.Host=opt.Host;
    this.wx_msg();
 }

weixin_share.prototype={
     /**
     * 微信分享操作
     */
    wx_msg:function(){
        //微信分享操作
        //读者阅读方法数据调用
        var products=this.products;
        var share_data={
            pId:products.p_id,
            pName:products.p_name,
            pType:products.p_type,
            pImgUrl:products.p_cover,
            oId:products.org_id,
            oName:products.business,
            nodeId:this.node_id,
            role:'processRead'
        };
        this.wx_share_process_read('wx_process_read',share_data);
        this.product_share();
    },
    /**
     * 微信分享
     * [product_share description]
     * @return {[type]} [description]
     */
    product_share:function (node_id){
        var _this = this;
        var products=this.products;
        var share_uid=this.share_uid;
        if(products){
            var wx_url='http://'+this.Host+'/detail.html?p_id='+products.p_id+'&city_code='+this.city_code+'&oid='+products.oid;
            if(node_id)wx_url+='&node_id='+node_id;
            if(share_uid && (_this.opt.products.org_id != _this.opt.userinfo_orgid) ) wx_url+='&u_id='+share_uid;
            var desc=products.p_sname?products.p_sname:'请点击查看详情';
            var wx_data={
                title: products.p_name,
                desc: desc,
                pic: products.p_cover,
                url:wx_url,
                success:function(){
                    //微信分享事件后调用
                    var process_forward={
                        role:'processForward',
                        oId:products.org_id,
                        pId:products.p_id,
                        nodeId:_this.node_id,
                        cnodeId:nodeId
                    };
                    if(nodeId){
                        _this.wx_share_process_read('wx_process_forward',process_forward);
                    }
                }
            };
        }
        // else if(products.type){
        //     var wx_url='http://' + this.Host + '/list.html?type=' + products.type + '&city_code=' + this.city_code;
        //     if(node_id)wx_url+='&node_id='+node_id;
        //     if(share_uid && (_this.opt.products.org_id != _this.opt.userinfo_orgid) )wx_url+='&u_id='+share_uid;
        //     var desc=products.p_sname?products.p_sname:'请点击查看详情';
        //     var wx_data={
        //         title: products.p_name,
        //         desc: desc,
        //         pic: products.p_cover,
        //         url:wx_url,
        //         success:function(){
        //             //微信分享事件后调用
        //             var process_forward={
        //                 role:'processForward',
        //                 oId:products.org_id,
        //                 pId:products.p_id,
        //                 nodeId:_this.node_id,
        //                 cnodeId:nodeId
        //             };
        //             if(nodeId){
        //                 _this.wx_share_process_read('wx_process_forward',process_forward);
        //             }
        //         }
        //     };
        // }
        
        
        ShareApp(wx_data);
    },
    /**
     * 读者阅读方法
     * @param  role      角色权限
     * @param  post_data 产品相关数据
     */
    wx_share_process_read:function (role,post_data){
        var _this = this;
        var api = '';
        // if( window.location.host == 'local.b2b.jdytrip.cn' ){
        //     api = 'http://test.b2b.jdytrip.cn';
        // }
        $.ajax({
            type:"POST",
            url: api + '/Wap/'+role,
            data:post_data,
            success:function (msg) {
                var data = msg;
                if (typeof msg != 'object')
                    data = eval("(" + msg + ")");
                if(data.code==200){
                    if( data.data && data.data.nodeId){
                        nodeId=data.data.nodeId;
                    }
                    if(role=='wx_process_read' && nodeId){
                        _this.product_share(nodeId);
                    }
                }
            }
        });
    }
};

/**
 * 组织分享数据
 * @param opt 提供的分组内容
 * @param s 成功时调用函数
 * @param e 失败时调用函数
 * @returns {{title: *, desc: (*|string), link: *, imgUrl: *, type: string, dataUrl: *, success: Function, cancel: Function}}
 * @constructor
 */
function  ShareApp(opt,s,e){
    wx.config(wx_config);
    wx.ready(function () {
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
    })
}


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
    share.cancel=function () {
        if(e)e(opt);
        // 用户取消分享后执行的回调函数
    };
    return share;
}

export default {
    DetailShare : weixin_share,
    CommonShare : ShareApp
};