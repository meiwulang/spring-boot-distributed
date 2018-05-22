import '../../less/guide_proof.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
        let _this = this;
        _this.Showlist();
        _this.Config();
        
	}
  	Show(){
  		let _this = this;
  		var id = _.GetUrlPara("id");
        var siid = $("#mysele").children('option:selected').val();
  		_.Ajax({
  			url : '/H5/TeamPlanItem/attach_list',
  			type : 'post',
  			data : {
  				si_id : siid,
  				at_pid : id,
  			},
  			success : function(res) {
  				if(res.code == '200'){
  					let html = template('tpl-conditions',res);
	  				$(".phon_uls").html(html);
	  				$(".pro_rig").html('当前(' + res.total + '张)');
                    if(res.total == 0){
                        $(".comp").css("display","none");
                    }
                    _this.Event();
                    _this.BigImg();
  				}
  			}
  		})
  	}
    Showlist(){
        let _this = this;
        var id = _.GetUrlPara("id");
        _.Ajax({
            url : '/H5/TeamPlanItem/get_items_list',
            type : 'post',
            data : {
                team_id : id
            },
            success : function(res) {
                if(res.code == '200'){
                    let html = template('tpl-condition',res);
                    $(".mainse").append(html);
                    _this.Show();
                }
            }
        })
    }
  	Event(){
        var _this = this;
        $(".del").css("display","");
        $(".clee").css("display","");
        $(".len").find(".sc").remove();
          //返回
        $(".boot .nos").off().on("click",function(){
            _this.Show();
            $(".upsed").removeClass("in");
        })
  		$(".upse").on("click",function(){
            $(".del").css("display","");
            $(".comp").css("display","");
            $(".clee").css("display","");
            $(".len").find(".sc").remove();
            $('.upsed .phon_ul .lis').remove();
            $(".upsed").addClass("in");
        })
        $(".lefs").off().on("click",function(){
            _this.Show();
            $(".upsed").removeClass("in");
        })
        //返回上一页
        $(".lef").on("click",function(){
            window.history.back();
        })
        //切换展示凭证
        $("#mysele").off().change(function(){
            $(".del").css("display","");
            $(".comp").css("display","");
            $(".clee").css("display","");
            var siid = $("#mysele").children('option:selected').val();
            $(".upsed select option").each(function(){
                if($(this).val() == siid){
                    $(this).prop("selected",true);
                }
            })
            _this.Show();
        })
        //编辑删除
        $(".comp").off().on("click",function(){
            $(".comp").css("display","none");
            $(".clee").css("display","block");
            $(".len").prepend('<div class="sc"></div>');
            _this.Sc();
        })
        //取消编辑
        $(".clee").off().on("click",function(){
            $(".del").css("display","");
            $(".comp").css("display","");
            $(".clee").css("display","");
            $(".len").find(".sc").remove();
        })
        //照片高度
        var wid = $(".len").css("width");
        $(".len").css("height",wid);
        //图片剪切
        var wh = $(".len").height();
        $(".len img").each(function(){
            var imgs = $(this).attr("src");
            $(this).attr("src",imgs + '?x-oss-process=image/resize,m_fill,h_' + wh + ',w_' + wh);
        })
  	}
    BigImg(){
        $('.phon_uls li').on('click',function(){
            var list = [];
            var ind = $(this).index();
            $('.phon_uls li').each(function(){
                var src = $(this).find('img').attr('d-src');
                list.push(src);
            })
            var data = {
                list : list
            }
            var html = template('tpl-bigimg',data);
            var $html = $(html).appendTo('body');
            new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',   //索引class
                paginationClickable: true,  //索引小圆点是否可点
                initialSlide : ind,
                loop : true,
                effect : 'flip'
            });
            $html.find('.close').on('click',function(){
                $('#bigimg').remove();
            })
        })
    }
    Sc(){
        var _this = this;
        //删除凭证
        $(".main .len").off().on("click",function(){
            if($(this).find(".sc")){
               $(this).find(".sc").toggleClass("scs"); 
               _this.Dele();
               var len = $(".scs").length;
               if(len > 0){
                $(".del").css("display","block");
               }else{
                $(".del").css("display","");
               }

            }
        })
    }
    Dele(){
        var _this = this;
        $(".del").off().on("click",function(){
            var data = {
                at_id : []
            }
            $(".len").each(function(){
                if($(this).find(".sc").hasClass("scs")){
                   var lid = $(this).attr("lid"); 
                   data['at_id'].push(lid);
                }
            })
            _.Popup.Confirm('是否确定删除凭证！',function(){
                _.Ajax({
                    url : '/H5/TeamPlanItem/attach_del',
                    type : 'post',
                    data : data,
                    success : function(res) {
                        _.Popup.PopupRemove();
                        if(res.code == '200'){
                            $(".del").css("display","");
                            $(".comp").css("display","");
                            $(".clee").css("display","");
                            _this.Show();
                        }
                    }
                })
            });
        })
    }
  	//上传凭证
    Config(){
    var _this = this;
    wx.config(wx_config);
    wx.ready(function(){
        $(".add").off().on("click",function(){
           wx.chooseImage({
              count: 9, // Ä¬ÈÏ9
              //sizeType: ['original', 'compressed'], // ¿ÉÒÔÖ¸¶¨ÊÇÔ­Í¼»¹ÊÇÑ¹ËõÍ¼£¬Ä¬ÈÏ¶þÕß¶¼ÓÐ
              sizeType: [ 'compressed'], // ¿ÉÒÔÖ¸¶¨ÊÇÔ­Í¼»¹ÊÇÑ¹ËõÍ¼£¬Ä¬ÈÏ¶þÕß¶¼ÓÐ
              sourceType: ['album', 'camera'], // ¿ÉÒÔÖ¸¶¨À´Ô´ÊÇÏà²á»¹ÊÇÏà»ú£¬Ä¬ÈÏ¶þÕß¶¼ÓÐ
              success: function (res) {
                  var localIds = res.localIds; // ·µ»ØÑ¡¶¨ÕÕÆ¬µÄ±¾µØIDÁÐ±í£¬localId¿ÉÒÔ×÷Îªimg±êÇ©µÄsrcÊôÐÔÏÔÊ¾Í¼Æ¬
                  var html='';
                  for(var i=0;i<localIds.length;i++){
                      html+=' <li class="lis"><div class="sc"></div><img src="' + localIds[i] + '" d-src="' + localIds[i] + '" alt=""></li>';
                  }
                    $('.upsed .phon_wx').prepend(html);
                    //照片高度
                    var wid = $(".lis").css("width");
                    $(".lis").css("height",wid);
                    //图片剪切
                    // var wh = $(".lis").height();
                    // $(".lis img").each(function(){
                    //   var imgs = $(this).attr("d-src");
                    //   $(this).attr("d-src",imgs + '?x-oss-process=image/resize,m_fill,h_' + wh + ',w_' + wh);
                    // })
                    $(".upsed .phon_wx .sc").off().on("click",function(){
                        $(this).parent().remove();
                    })
              }
          });
        })

        function wx_ajax(prolist){
            _.Popup.LoadingRemove();
            var id = _.GetUrlPara("id");
            var siid = $("#mysele_two").children('option:selected').val();
            _.Ajax({
                url : '/H5/TeamPlanItem/upload_pic',
                type : 'post',
                data : {
                  file : prolist,
                  at_table_id : siid,
                  at_pid : id
                },
                success : function(res) {
                    _.Popup.Tip(res.message);
                   if(res.code == 200){
                        $('.upsed .phon_ul .lis').remove();
                        $(".upsed").removeClass("in");
                        _this.Show();
                   }
                }
            })
        }
        function wx_img(index,leng,prolist){
            var local = $('.upsed .phon_wx .lis').eq(index).find('img').attr("d-src");
            wx.uploadImage({
                localId: local, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    prolist.push(serverId);
                    index = index + 1;
                    if(index < leng){
                        wx_img(index,leng,prolist);
                    }else{
                        wx_ajax(prolist);
                    }
                }
            }); 
        }

        $(".boot .yes").off().on("click",function(){
            var prolist = [];
            var leng = $('.upsed .phon_wx .lis').length;
            if(leng < 1){
                _.Popup.Tip('请添加图片！');
                return false;
            }
            var index = 0;
            _.Popup.Loading();
            wx_img(index,leng,prolist);
        })
         
      })  
    }
}

UserInfo.Ready(function(){
    new Index();
})