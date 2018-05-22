(function(w) {
    var jdyFn = {};
    jdyFn.getWindowStyle = function() {
        var w = $(window).width(),
            h = $(window).height();
        if (w <= 1200) {
            w = 1200;
        }
        if (h <= 600) {
            h = 600
        }
        return {
            width: w,
            height: h
        };
    }

    // jdyFn.setStyle = function(id, isWidth) {
    //     var obj = this.getWindowStyle(),
    //         w = obj.width,
    //         h = obj.height,
    //         $id = document.getElementById(id);
    //     $id.style.height = h + 'px';
    //     if (isWidth) {
    //         $id.style.width = (w - 240) + 'px';
    //     }
    // }

    jdyFn.setStyle = function() {
        var obj = this.getWindowStyle(),
            w = obj.width,
            h = obj.height,
            $jdyNav = $('#jdyNav'),
            $jdyMain = $('#jdyMain'),
            $jdyMainScroll = $('.jdy-main-scroll'),
            $head = $('.jdy-header'),
            jdyNavWidth = $jdyNav.outerWidth(),
            aWidth = jdyNavWidth - 4;

        $jdyNav.height(h)
        $jdyMain.height(h);
        $jdyMainScroll.height(h);
        $jdyMain.width(w - jdyNavWidth);
        $head.width(w - jdyNavWidth);
        $head.css('left', jdyNavWidth);
        $('.jdy-nav-title a').width(aWidth);

    }


    jdyFn.setNavActive = function() {
        var arr = ['transfer', 'resources', 'system','finance','sale','report','buyerCenter','console','human'],
            url = location.href,
            i = 0,
            len = arr.length,
            navClass = '.transfer';
        for (; i < len; i++) {
            var str = arr[i];
            if (url.indexOf(str) > 0) {
                navClass = '.' + arr[i];
                break;
            }
        }
        $('.navli .current').removeClass('current');
        $(navClass).addClass('current');
    }

    jdyFn.setAlertStyle = function(alertClass) {
        var obj = this.getWindowStyle(),
            w = obj.width,
            h = obj.height,
            alertClass = '.' + alertClass || '.jdyalert',
            $alert = $(alertClass),
            aw = $alert.outerWidth(),
            ah = $alert.outerHeight(),
            top = (h - ah) / 2,
            left = (w - aw) / 2;
        $alert.css({ top: top, left: left });
        if ($alert.length) {
            $('body').append('<div class="alertbgg"></div>');
        }
    }

    jdyFn.byOneClick = function(callback) {
        $(document).one('click', function() {
            callback && callback();
        });
    }

    jdyFn.scrollToTop = function(num) {
        var num = num || 0;
        $('.jdy-main-scroll').scrollTop(num);
    }

    jdyFn.picHover = function(){
         $('.picwrap li').hover(function(){
            $(this).find('.picwrap-fc').show();
        },function(){
            $(this).find('.picwrap-fc').hide();
        });
    }


    jdyFn.selectCity2  = function(){
        var Arr ={};
        $('.allSelect').bind('click',function(){
            var that = $(this);
            that.parents('.showtfcityaaa').find('.showtfcityaaa-content span').addClass('active');
            Arr=getActive();
        });

        $('.allCancel').bind('click',function(){
            var that = $(this);
            that.parents('.showtfcityaaa').find('.showtfcityaaa-content span').removeClass('active');
            Arr=getActive();
        });

        $('.showtfcityaaa-content span').bind('click',function(){
            $(this).toggleClass('active');
            if($(this).find(".station").length>0){
                $(this).find(".station").toggleClass('active');
            }
            Arr=getActive();
        });

        function getActive(){
            // var $active = $('.showtfcityaaa-content span.active'),
            var $active = $('.showtfcityaaa-content span.station').length>0?$('.showtfcityaaa-content .station.active'):$('.showtfcityaaa-content span.active'),
                arr1 = [];
                let arr2 = [];
            $active.each(function(){
                var id = $(this).attr('dataId');
                arr1.push(Number.parseInt(id));
                var name = $(this).text();
                arr2.push(name);
            });
            return {id:arr1,name:arr2};
        }
        Arr=getActive();
        return Arr;
    }

    //打印页面
    jdyFn.printHtml = function (printpage) {
      var newDiv = document.createElement("div");
      var printHtml = printpage.innerHTML;
      newDiv.innerHTML = printHtml;
      const appId = document.getElementById('app');
      appId.style.display ='none';

      document.body.appendChild(newDiv);
      window.print();
      document.body.removeChild(newDiv);
      appId.style.display ='block';
      return false;
    }
  //对象深拷贝
    jdyFn.deepCopy = function (obj) {
      var str, newobj = obj.constructor === Array ? [] : {};
      if(typeof obj !== 'object'){
        return;
      } else if(window.JSON){
        str = JSON.stringify(obj), //系列化对象
          newobj = JSON.parse(str); //还原
      } else {
        for(var i in obj){
          newobj[i] = typeof obj[i] === 'object' ?
            arguments.callee(obj[i]) : obj[i];
        }
      }
      return newobj;
    }
    //
  jdyFn.moneyTwoPoints = function (val) {
    var returnVal = '0.00';
    if(val == null|| typeof val == 'undefined'){
      returnVal = '0.00';
    }
    else{
      var selVal = $.trim(val.toString());
      if(selVal == ''){
        returnVal = '0.00';
      }
      else{
        if(selVal.indexOf('.') == -1){   //整数
          returnVal = selVal+".00";
        }
        else{
          var arrNum = selVal.split(".");
          var pointNum = arrNum[1];
          if(pointNum.length == 1){ //一位小数
            returnVal = selVal +'0';
          }
          else if(pointNum.length == 2){ //两位小数
            returnVal = selVal;
          }
          else{     //两位以上小数
            arrNum[1] = pointNum.substring(0,2);
            returnVal = arrNum.join('.');
          }
        }
      }
    }
    return returnVal;
  }

   w.jdyFn = jdyFn;
})(window);



// $(function() {
//   $('.jdy-nav-childul').find('li').off('click').on('click',function(){
//     $('.jdy-nav-childul li').removeClass("current")
//     $(this).addClass("current");
//   });
//   $('.navli').each(function() {
//         $(this).mouseover(function() {
//             var that = $(this),
//                 flag = that.find('.jdy-nav-title').hasClass('noMouse');
//             if (!flag) {
//                 that.find('.jdy-nav-childul').show();
//             }
//         });
//         $(this).mouseout(function() {
//             var that = $(this),
//                 flag = that.find('.jdy-nav-title').hasClass('noMouse');
//             if (!flag) {
//                 that.find('.jdy-nav-childul').hide();
//             }
//         });
//     });

//     $('.header-nav-icon').bind('click', function() {
//         var w = $('#jdyNav').outerWidth();
//         if (w == 60) {
//             $('#jdyNav').width('200px');
//             $('.jdy-nav-childul').removeClass('absolute');
//             $('.jdy-nav-title').addClass('noMouse');
//             console.log('22222222222222')
//             $('.jdy-nav-title').each(function() {
//                 var that = $(this);

//                 if (that.hasClass('current')) {
//                     $('.jdy-nav-childul').hide();
//                     that.next('.jdy-nav-childul').show();
//                 }
//                 var text = that.parents('.navli').find('.jdy-nav-title2').text();
//                 console.log(text);
//                 that.find('a').text(text);

//             });
//             $('.jdy-nav-childul li').addClass('nobgcolor')
//             $('.jdy-nav-title2').hide();
//         } else {
//             $('#jdyNav').width('60px');
//             $('.jdy-nav-title2').show();
//             $('.jdy-nav-title').removeClass('noMouse');
//             $('.jdy-nav-title a').text('');
//             $('.jdy-nav-childul').addClass('absolute').hide();

//         }
//         jdyFn.setStyle();
//     });

//     jdyFn.setNavActive();
//     jdyFn.setStyle();

//     $('.header-nav-icon').click()

//     $(window).resize(function() {
//         jdyFn.setStyle();
//     });

//     jdyFn.picHover();
//     jdyFn.selectCity2();
// });
Array.prototype.max = function() {
var max = this[0];
var len = this.length;
for (var i = 1; i < len; i++){
if (this[i] > max) {
max = this[i];
}
}
return max;
}
Date.prototype.format = function(format) {
    var date = {
           "M+": this.getMonth() + 1,
           "d+": this.getDate(),
           "h+": this.getHours(),
           "m+": this.getMinutes(),
           "s+": this.getSeconds(),
           "q+": Math.floor((this.getMonth() + 3) / 3),
           "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
           format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
           if (new RegExp("(" + k + ")").test(format)) {
                  format = format.replace(RegExp.$1, RegExp.$1.length == 1
                         ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
           }
    }
    return format;
}
/**
 * @description 一个用于数组去重、排序的方法
 * @param flag  默认不传该参数为不排序，传true为正排序，传false为逆排序
*/
Array.prototype.unique = function(flag) {
    var outList=[];
    outList= Array.from(new Set(this));
    if( flag===true || flag===false ){
        for(let i=0;i<outList.length;i++){
            for(let j=0;j<outList.length;j++){
                let tempvar=null;
                let flagInner=( flag==true && outList[i]<outList[j] ) || ( flag==false && outList[i]>outList[j] )
                if( flagInner ){
                    tempvar=outList[j];
                    outList[j]=outList[i];
                    outList[i]=tempvar;
                }
            }
        }
    }
    return outList;
}