import '../../less/guide_team.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
        let _this = this;
        let type = _.GetUrlPara('type');
        if(type){
            $(document).attr("title",decodeURIComponent(type) + "明细");
        }
        _this.Cate();
        _this.Event();
	}

    Cate(){
        let _this = this;
        let type = _.GetUrlPara('type');
        let cate = _.GetUrlPara('cate');
        let team_id = _.GetUrlPara('id');
        if( !type ){
            type = '支出';
        }else{
            type = decodeURIComponent(type);
        }
        if( cate ){
            cate = decodeURIComponent(cate);
        }
        $('.acti_header .type').text(type);
        $('.acti_header .top-type li[v='+type+']').addClass('active').siblings().removeClass('active');
        _.Ajax({
            url : '/H5/TeamPlanItem/items_type_list',
            type : 'post',
            data : {
                tpi_pay_type: type,
                team_id : team_id
            },
            success : function(res){
                if( res.code == 200 ){
                    let html = template('tpl-cates',res);
                    $('.cates').html(html);
                    if( cate ){
                        $('.cates li[v='+cate+']').addClass('active').siblings().removeClass('active');
                    }
                    let w = 0; 
                    $('.cates li').each(function(){
                        w += $(this).width() + 30;
                    })
                    $('.cates ul').width(w);
                    _this.Render();
                    _this.CateEvent();
                }
            }
        })
    }

    Render(){
        let _this = this;
        let team_id = _.GetUrlPara('id');
        let type = $.trim($('.top-type li.active').text());
        let cate = $.trim($('.cates li.active').attr('v'));
        _.Ajax({
            url : '/H5/TeamPlanItem/get_items_list',
            type : 'post',
            data : {
                team_id : team_id,
                tpi_pay_type: type,
                tpi_type : cate
            },
            success : function(res){
                if( res.code == 200 ){
                    let html = template('tpl-render',res);
                    $('.render').html(html);
                    new Swiper('.swiper-container', {
                        slidesPerView: 'auto',
                        resistanceRatio: .00000000000001,
                        slideToClickedSlide: true
                    })
                    _this.RenderEvent();
                }
            }
        })
    }

    Event(){
        let _this = this;
        let team_id = _.GetUrlPara('id');

        $('.acti_header span').on('click',function(e){
            e.stopPropagation();
            $('.acti_header .top-type').toggle();
        })

        $('.acti_header .top-type li').on('click',function(){
            if( $(this).hasClass('active') ){
                return false;
            }
            $(this).addClass('active').siblings().removeClass('active');
            let txt = $(this).text();
            // $('.acti_header .type').text(txt);
            // _this.Cate();
            window.location.href = 'guide_team.html?id='+team_id+'&type='+encodeURIComponent(txt);
        })

        $('.acti_header a.back').on('click',function(){
            window.location.href = 'guide_index.html?id='+ _.GetUrlPara('id');
        })

        $(document).on('click',function(){
            $('.acti_header .top-type').hide();
        })
    }

    CateEvent(){
        let _this = this;
        $('.cates li').on('click',function(){
            if( $(this).hasClass('active') ){
                return false;
            }
            // $(this).addClass('active').siblings().removeClass('active');
            // _this.Render();
            let team_id = _.GetUrlPara('id');
            let type = $('.acti_header .top-type li.active').attr('v');
            let cate = $(this).attr('v');
            window.location.href = 'guide_team.html?id='+team_id+'&type='+ encodeURIComponent(type) + '&cate=' + encodeURIComponent(cate);
        })
    }

    RenderEvent(){
        let _this = this;
        let team_id = _.GetUrlPara('id');

        $('.write').on('click',function(){
            if( $(this).hasClass('disable') ){
                return false;
            }
            let type = encodeURIComponent($.trim($('.top-type li.active').attr('v')));
            let cate = encodeURIComponent($.trim($('.cates li.active').attr('v')));
            window.location.href = 'guide_write.html?type='+type+'&cate='+cate+'&team_id='+team_id+'&action=add';
        })

        $('.list .content').on('click',function(){
            if( $('.write').hasClass('disable') ){
                return false;
            }
            let $li = $(this).parents('li'),
                lid = $li.attr('lid');
            let type = encodeURIComponent($.trim($('.top-type li.active').attr('v')));
            let cate = encodeURIComponent($.trim($('.cates li.active').attr('v')));
            window.location.href = 'guide_write.html?type='+type+'&cate='+cate+'&team_id='+team_id+'&tpi_id='+lid+'&action=edit';
        })

        $('.list .delete').on('click',function(){
            let $li = $(this).parents('li'),
                lid = $li.attr('lid');
            let pop = _.Popup.Confirm('是否确认删除',function(){
                _.Ajax({
                    url : '/H5/TeamPlanItem/items_del',
                    type : 'post',
                    data : {
                        tpi_id : lid,    //明细id
                        tpi_team_id : team_id,     //计划单id
                    },
                    success : function(res){
                        if( res.code == 200 ){
                            _this.Render();
                            pop.remove();
                        }
                    }
                })
            });                
        })
    }
  
}

UserInfo.Ready(function(){
    new Index();
})