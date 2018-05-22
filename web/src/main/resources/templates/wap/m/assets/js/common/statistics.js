/**
 * 获取网站浏览相关信息
 * Created by Mark pony on 2017/7/14.
 */
import $ from '../lib/jquery.2.1.4.js';

export default function(){
    /*限定域名记录浏览记录
     if(window.location.host!='www.jdytrip.cn')
     {
     return;
     }
     */
    var start = new Date();
    var strStart = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate() + " " +
        start.getHours() + ":" + start.getMinutes() + ":" + start.getSeconds();
    var len = 0;
    var end;
    var status = "in";
    var second = 30;
    var params = {};
    var debug = 1;
    // console.log(window);
    //Document对象数据
    if (document) {
        params.domain = document.domain || '';
        params.url = document.URL || '';
        params.title = document.title || '';
        params.referer = document.referrer || '';
    }
    //Window对象数据
    if (window && window.screen) {
        params.screenHeight = window.screen.height || 0;
        params.screenWidth = window.screen.width || 0;
    }
    //navigator对象数据
    if (navigator) {
        params.language = navigator.language || '';
        params.appName = navigator.appName || '';
        params.appVersion = navigator.appVersion || '';
        params.appCodeName = navigator.appCodeName || '';
        params.userAgent = navigator.userAgent || '';
    }
    window.setInterval(function () {
        second -= 1;
        if (0 == second) {
            end = new Date();
            len += (end.getTime() - start.getTime()) / 1000;
            status = "out";
        }
    }, 1000);
    //监控网页事件操作
    option_view();
    //关闭或刷新记录数据
    window.onbeforeunload = function () {
        //window.event.returnValue ="";
        end = new Date();
        var strEnd = end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate() + " " +
            end.getHours() + ":" + end.getMinutes() + ":" + end.getSeconds();
        len += (end.getTime() - start.getTime()) / 1000;//访问时长
        params.end_time = strEnd;
        params.start_time = strStart;
        params.burning_time = len;
        save();
    };

    function revive() {
        if (status == "out") {
            start = new Date();
            status = "in";
        }
        second = 30;
    }

    //保存浏览记录
    function save() {
        $.ajax(
            {
                url: '/webStatistics/webStatistics',
                type: 'post',
                timeout: 10000,
                dataType: "json",
                data: params,
                success: function (result) {
                    console.log(result);
                },
                error: function (result) {
                    if (debug) {
                        console.log(result);
                    }
                }
            })
    }

    //监控网页操作 鼠标点击、移动、滑轮无操作，键盘无按键操作
    function option_view() {
        var body = $('body');
        body.click(function (e) {
            var xy=getMousePos(e);
            params.screen_x = xy.x;
            params.screen_y = xy.y;
            revive();
        });
        body.mousedown(function () {
            revive();
        });
        body.mouseup(function () {
            revive();
        });
        body.mousemove(function () {
            revive();
        });
        body.bind('DOMMouseScroll', function () {
            revive();
        });
        body.bind('mousewheel', function () {
            revive();
        });
        body.keydown(function () {
            revive();
        });
        body.keyup(function () {
            revive();
        });
        body.keypress(function () {
            revive();
        });
    }

    //记录点击坐标
    function getMousePos(event) {
        var e = event || window.event;
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var x = e.pageX || e.clientX + scrollX;
        var y = e.pageY || e.clientY + scrollY;
        return {'x': x, 'y': y};
    }
}