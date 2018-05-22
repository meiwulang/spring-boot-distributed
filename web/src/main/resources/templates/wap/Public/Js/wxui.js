/**
 * Created by chaos on 2015/10/16.
 */
$(function() {
    $.confirm = function (opt) {
        var obj = $('#-confirm-box');
        if (!obj[0]) {
            $('body').append('' +
                ' <div class="weui_dialog_confirm" id="-confirm-box" style="display: none;">' +
                '   <div class="weui_mask"></div>' +
                '   <div class="weui_dialog">' +
                '       <div class="weui_dialog_hd"><strong class="weui_dialog_title">' + (opt.title ? opt.title : '提示') + '</strong></div>' +
                '       <div class="weui_dialog_bd -msg">' + opt.msg + '</div>' +
                '       <div class="weui_dialog_ft">' +
                '           <a href="javascript:;" class="weui_btn_dialog default" id="-no-btn">取消</a>' +
                '           <a href="javascript:;" class="weui_btn_dialog primary" id="-yes-btn">确定</a>' +
                '       </div>' +
                '   </div>' +
                '</div>');
        } else {
            if (opt.title) {
                obj.find('.weui_dialog_title').html(opt.title);
            } else {
                obj.find('.weui_dialog_title').html('提示');
            }
            obj.find('.-msg').html(opt.msg);
        }
        $('#-confirm-box').show();
        $('#-yes-btn').unbind();
        $('#-no-btn').unbind();
        $('#-yes-btn').click(function () {
            $('#-confirm-box').hide();
            if (opt.ok) {
                opt.ok();
            }
        });
        $('#-no-btn').click(function () {
            $('#-confirm-box').hide();
            if (opt.cancel) {
                opt.cancel();
            }
        });
    };
    $.alert = function (opt) {
        var obj = $('#-alert-box');
        if (!obj[0]) {
            $('body').append('' +
                '<div class="weui_dialog_alert" id="-alert-box" style="display: none;">' +
                '   <div class="weui_mask"></div>' +
                '   <div class="weui_dialog" style="z-index:10000;">' +
                '       <div class="weui_dialog_hd"><strong class="weui_dialog_title">' + (opt.title ? opt.title : '提示') + '</strong></div>' +
                '       <div class="weui_dialog_bd -msg">' + opt.msg + '</div>' +
                '       <div class="weui_dialog_ft">' +
                '           <a href="javascript:;" class="weui_btn_dialog primary" id="-alert-yes">确定</a>' +
                '       </div>' +
                '    </div>' +
                '</div>');
            obj = $('#-alert-box');
        } else {
            if (opt.title) {
                obj.find('.weui_dialog_title').html(opt.title);
            }
            obj.find('.-msg').html(opt.msg);
        }
        obj.show();
        var alert_yes_obj = $('#-alert-yes');
        alert_yes_obj.unbind();
        alert_yes_obj.click(function () {
            obj.hide();
            if (opt.ok) {
                opt.ok();
            }
        })
    };
    $.toast = function (opt) {
        var obj = $('#-toast-box');
        if (!obj[0]) {
            var error_class = '';
            if (opt.error) {
                error_class = ' weui_icon_error_toast';
            } else {
                error_class = '';
            }
            $('body').append('' +
                '  <div id="-toast-box" style="display: none;">' +
                '    <div class="weui_mask_transparent"></div>' +
                '    <div class="weui_toast">' +
                '       <i class="weui_icon_toast' + error_class + '"></i>' +
                '       <p class="weui_toast_content">' + (opt.msg ? opt.msg : '已完成') + '</p>' +
                '    </div>' +
                ' </div>');
            obj = $('#-toast-box');
        } else {
            if (opt.error) {
                $('.weui_icon_toast').removeClass('weui_icon_error_toast').addClass('weui_icon_error_toast');
            } else {
                $('.weui_icon_toast').removeClass('weui_icon_error_toast');
            }
            obj.find('.weui_toast_content').html(opt.msg ? opt.msg : '已完成');
        }
        obj.show();
        var time = opt.time ? opt.time : 3000;
        setTimeout(function () {
            obj.hide();
            if (opt.callback) {
                opt.callback();
            }
        }, time);
    };
    $.loding = function (opt) {
        var obj = $('#-loding-box');
        if (!obj[0]) {
            $('body').append('' +
                '<div id="-loding-box" class="weui_loading_toast" style="display:none;">' +
                '   <div class="weui_mask_transparent"></div>' +
                '   <div class="weui_toast">' +
                '       <div class="weui_loading">' +
                '           <div class="weui_loading_leaf weui_loading_leaf_0"></div>' +
                '           <div class="weui_loading_leaf weui_loading_leaf_1"></div>' +
                '           <div class="weui_loading_leaf weui_loading_leaf_2"></div>' +
                '           <div class="weui_loading_leaf weui_loading_leaf_3"></div>' +
                '           <div class="weui_loading_leaf weui_loading_leaf_4"></div>' +
                '           <div class="weui_loading_leaf weui_loading_leaf_5"></div>' +
                '           <div class="weui_loading_leaf weui_loading_leaf_6"></div>' +
                '           <div class="weui_loading_leaf weui_loading_leaf_7"></div>' +
                '           <div class="weui_loading_leaf weui_loading_leaf_8"></div>' +
                '           <div class="weui_loading_leaf weui_loading_leaf_9"></div>' +
                '           <div class="weui_loading_leaf weui_loading_leaf_10"></div>' +
                '           <div class="weui_loading_leaf weui_loading_leaf_11"></div>' +
                '       </div>' +
                '       <p class="weui_toast_content">数据传输中</p>' +
                '   </div>' +
                '</div>');
            obj = $('#-loding-box');
        }
        if (opt.close) {
            obj.hide();
            return;
        }
        obj.show();
        if (opt.time != -1) {
            var time = opt.time ? opt.time : 3000;
            setTimeout(function () {
                obj.hide();
            }, time);
        }
    };
})
