import '../../less/guide_list.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
  constructor(){
        let _this = this;
        // 用于计算页数
        _this.pages={
      total:0,
      count:1
    }
    _this.jax = 0;
        _this.sets = 0;
        _this.Show(1);
        _this.Event();
        _this.Scrollload();
  }
    Show(currpage){
    let _this = this;
    _this.jax = 1;
    var currentdate = '';
    var key = '';
    currentdate = $(".dates").val();
    key = $(".datese").val();
        if($('.nol').hasClass("ba")){
          var own = '1';
        }else{
          var own = '0';
        }
    $('body').addClass('scrolling');
    _.Ajax({
      url : '/H5/TeamPlanItem/teamPlanList',
      type : 'post',
      data : {
        page : currpage,
        skey : key,
        is_own : own,
        start_time:  currentdate,
            limit:  "10"
      },
      success : function(res){
        $(".sear").removeClass("in");
        _this.jax = 0;
        if( res.code == 200 ){
          let html = template('tpl-condition',res);
          _this.pages.total = res.total;
          $('.main_t').append(html);
          $(".loading").remove();
          _this.Event();
        }
        $('body').removeClass('scrolling');
      }
    })
  }
  Event(){
    let _this = this;
    if(!(_uinfo && _uinfo.u_id)){
      $(".lef").css("display","none");
    }else{
      $(".noly").css("display","");
    }
    $("").off().change(function(){
      if(_this.jax == 0){
        $('.main_t').html("");
        _this.pages.count=1;
        _this.Show(_this.pages.count);
      }
      
    })
    $(".noly").off().on("click",function(){
      $(".nol").toggleClass("ba");
      $('.main_t').html("");
      _this.pages.count=1;
      _this.Show(_this.pages.count);
    })
    //点击搜索
    $(".acti_header .rig").on("click",function(){
      $(".sear").addClass("in");
    })
    $(".acti_he .lef_two").on("click",function(){
      $(".sear").removeClass("in");
    })
    $(".acti_he .rig_two").on("click",function(){
      $(".dates").val("");
      $(".datese").val("");
      $(".dates").attr("placeholder","选择团队日期");
      // $(".butt").removeClass("butts");
    })
    $(".butt").off().on("click",function(){
      $('.main_t').html("");
      _this.pages.count=1;
      _this.Show(_this.pages.count);
    })
    //input date类型添加提示
    $(".dates").focus(function(){
      $(this).removeAttr('placeholder');
    })
    $(".dates").blur(function(){
      if($(this).val() == ""){
        $(this).attr("placeholder","选择团队日期");
      }
    })
    // $(".datese,.dates").on("input propertychange",function(){
    //   var dates = $(".dates").val();
    //   var key = $(".datese").val();
    //   if($.trim(dates) || $.trim(key)){
    //     $(".butt").addClass("butts");
    //     _this.Saer();
    //   }else{
    //     //没有搜索值
    //     $(".butt").removeClass("butts");
    //   }
    // })
    
  }
  // Saer(){
  //   $(".butts").off().on("click",function(){
  //     var dates = $(".dates").val();
  //     var key = $(".datese").val();
  //     if($.trim(dates) || $.trim(key)){
  //       console.log(1212);
  //     }
  //   })
  // }
  //  下拉加载数据列表
   Scrollload(){
    let _this = this;
    $(window).scroll(function () {
      let scrollTop = $(this).scrollTop();
      let scrollHeight = $(document).height();
      let windowHeight = $(this).height();
      if (scrollTop + windowHeight == scrollHeight) {
        // 获取page数,并判断是否是最后一页  
        if(_this.pages.total > (_this.pages.count * 10)){
          if( !$('body').hasClass('scrolling') ){
            $(".main_t").append('<div class="loading" style="text-align:center; line-height:30px;">加载中...</div>');
            _this.Show(++_this.pages.count);
          }
        }else{
          $(".loading").remove();
        }        
      }
    });     
   }  
}

UserInfo.Ready(function(){
  new Index();
})