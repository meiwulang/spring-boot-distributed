import '../../less/plan_list.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
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
  $('body').addClass('scrolling');
    _.Ajax({
      url : '/h5/team/get_team_list',
      type : 'post',
      data : {
        page : currpage,
        search_key : key,
        key : '',
        start_date : currentdate,
        limit:  "10"
      },
      success : function(res){
        $(".sear").removeClass("in");
        if( res.code == 200 ){
          $('body').removeClass('scrolling');
          let html = template('tpl-condition',res.data);
          _this.pages.total = res.total;
          $('.main_dl').append(html);
          $(".loading").remove();
          _this.Event(); 
        }
      }
    })
  }
  Event(){
      let _this = this;
      $(".lef").on("click",function(){
        // window.history.back();
        window.location.href = 'center.html';
      });
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
        $('.main_dl').html("");
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
    
  }
  // 下拉加载数据列表
   Scrollload(){
    let _this = this;
    $(window).scroll(function () {
      let scrollTop = $(this).scrollTop();
      let scrollHeight = $(document).height();
      let windowHeight = $(this).height();
      if (scrollTop + windowHeight == scrollHeight) {
        // 获取page数,并判断是否是最后一页  
        if(_this.pages.total > 0){
          if( !$('body').hasClass('scrolling') ){
            $(".main_dl").append('<div class="loading" style="text-align:center; line-height:30px;">加载中...</div>');
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