import '../../less/guide_write.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
        let _this = this;
        _this.Cate();
        _this.Event();
	}

    GetPara(){
        let team_id = _.GetUrlPara('team_id'),
            type = decodeURIComponent(_.GetUrlPara('type')),
            cate = decodeURIComponent(_.GetUrlPara('cate')),
            action = _.GetUrlPara('action'),
            tpi_id = _.GetUrlPara('tpi_id');
        return {
            team_id : team_id,
            type : type,
            cate : cate,
            action : action,
            tpi_id : tpi_id
        }
    }

    Cate(){
        let _this = this;
        let type = _this.GetPara().type;
        let action = _this.GetPara().action;
        let team_id = _.GetUrlPara('team_id');
        $(".titl").html(type);
        _.Ajax({
            url : '/H5/TeamPlanItem/items_type_list',
            type : 'post',
            data : {
                tpi_pay_type: type,
                team_id : team_id
            },
            success : function(res){
                if( res.code == 200 && res.data ){
                    let cates = [];
                    let c = [], j = 0;
                    for(let i = 0; i < res.data.length; i++){
                        c.push(res.data[i]);
                        j++;
                        if( j >= 6 || i >= res.data.length-1 ){
                            cates.push(c);
                            c = [];
                            j = 0;
                        }
                    }

                    let date = new Date().toISOString();
                    let data = $.extend({
                        date : date.split('T')[0],
                        cates : cates
                    },_this.GetPara());

                    if( action == 'add' ){
                        _this.Render(data);
                    }else{
                        _.Ajax({
                            url : '/H5/TeamPlanItem/get_items_info',
                            type : 'post',
                            data : {
                                tpi_id : _this.GetPara().tpi_id
                            },
                            success : function(res){
                                if( res.code == 200 ){
                                    data = $.extend(data,{ data : res.data });
                                    _this.Render(data);
                                }
                            }
                        })
                    }

                }
            }
        })
    }

    Render(data){
        let _this = this;
        let html = template('tpl-write',data);
        $('.pen .cons').html(html);
        let ind = $('.ban li.active').parents('.swiper-slide').index();
        new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',   //索引class
            initialSlide : ind,
            paginationClickable: true  //索引小圆点是否可点
        });
        _this.RenderEvent();
    }

    Event(){
        let _this = this;
        let UrlPara = _this.GetPara();
        $('.acti_header a.bg_ing,.nos').on('click',function(){
            window.location.href = 'guide_team.html?id='+UrlPara.team_id+'&type='+ UrlPara.type + '&cate=' + UrlPara.cate;
        })

        $('.boot .yes').on('click',function(){
            _this.Save();
        })
        
    }

    RenderEvent(){
        let _this = this;

        $('.settle_type select').on('change',function(){
            let $ul = $(this).parents('ul');
            let v = $(this).val();
            if( v == '签单' ){
                $ul.find('.settle_number').show();
            }else{
                $ul.find('.settle_number').hide();
            }
        })

        let cate = _this.GetPara().cate;
        if( cate == '购物店' ){
            $('.tpi_price input,.tpi_percent input,.tpi_num input,.tpi_money input').on('keyup',function(){
                let price = 0,
                    percent = 0,
                    num = 0,
                    money = 0,
                    reback = 0;
                var tes = $('.tpi_price input').val();
                if(tes){
                    tes = tes.replace(/[^\d^\.]+/g,"");
                $('.tpi_price input').val(tes);
                }
                
                var per = $('.tpi_percent input').val();
                if(per){
                    per = per.replace(/[^\d^\.]+/g,"");
                $('.tpi_percent input').val(per);
                }

                var nu = $('.tpi_num input').val();
                if(nu){
                    nu = nu.replace(/[^\d^\.]+/g,"");
                $('.tpi_num input').val(nu);
                }

                var mon = $('.tpi_money input').val();
                if(mon){
                    mon = mon.replace(/[^\d^\.]+/g,"");
                $('.tpi_money input').val(mon);
                }

                if($('.tpi_price input').val()){
                    price = parseFloat($('.tpi_price input').val());
                }

                if($('.tpi_percent input').val()){
                    percent = parseFloat($('.tpi_percent input').val());
                }

                if($('.tpi_num input').val()){
                    num = parseFloat($('.tpi_num input').val());
                }

                if($('.tpi_money input').val()){
                    money = parseFloat($('.tpi_money input').val());
                }
               
                reback = ((price * num) + (money * percent/100)).toFixed(2);
                // 计算项目：返佣总额不可编辑（=人头单位*进店人数+购物总额*流水比例/100）
                
                $('.tpi_reback input').val(reback);
            })
        }else{
            $('.tpi_price input,.tpi_num input').on('keyup',function(){
                var mon = $('.tpi_price input').val();
                if(mon){
                    mon = mon.replace(/[^\d^\.]+/g,"");
                $('.tpi_price input').val(mon);
                }

                var mons = $('.tpi_num input').val();
                if(mons){
                    mons = mons.replace(/[^\d^\.]+/g,"");
                $('.tpi_num input').val(mons);
                }
                let price = parseFloat($('.tpi_price input').val()),
                    num = parseFloat($('.tpi_num input').val()),
                    money = 0;
                if( price && num ){
                    money = ($.trim(price) * $.trim(num)).toFixed(2);
                    // 计算项目：（单价*数量）
                }
                $('.tpi_money input').val(money);
            })
        }
    }

    Save(){
        let _this = this;

        let UrlPara = _this.GetPara(),
            team_id = UrlPara.team_id,
            type = UrlPara.type,
            cate = UrlPara.cate,
            action = UrlPara.action;

        if( cate == '购物店' ){
            var tpi_date = $('.tpi_date input').val(),
                // 进店日期
                tpi_name = $('.tpi_name input').val(), 
                // 购物店
                tpi_spec = $('.tpi_spec input').val(),
                // 项目规格
                settle_type = $('.settle_type select').val(),
                // 结算类型
                settle_number = $('.settle_number input').val(),
                // 签单号
                tpi_price = $('.tpi_price input').val(),
                // 人头单价
                tpi_percent = $('.tpi_percent input').val(),
                // 流水比例
                tpi_num = $('.tpi_num input').val(),
                // 进店人数
                tpi_money = $('.tpi_money input').val(),
                // 购物总额
                tpi_reback = $('.tpi_reback input').val(),
                // 返佣总额
                tpi_remark = $('.tpi_remark input').val();
                // 备注

            if( !tpi_name ){
                _.Popup.Tip('请填写购物店');
                return false;
            }

            // if( settle_type == '签单' && !settle_number ){
            //     _.Popup.Tip('请填写签单号');
            //     return false;
            // }

            if((!tpi_num || !tpi_price) && (!tpi_percent || !tpi_money)){
                _.Popup.Tip('人头费和购物提成至少填写一组');
                return false;
            }

            var data = {
                tpi_date : tpi_date,
                tpi_name : tpi_name,
                tpi_spec : tpi_spec,
                tpi_settle : settle_type,
                tpi_sign_number : settle_number,
                tpi_price : tpi_price,
                tpi_percent : tpi_percent,
                tpi_num : tpi_num,
                tpi_money : tpi_money,
                tpi_reback : tpi_reback,
                tpi_remark : tpi_remark
            }
        }else{
            var tpi_date = $('.tpi_date input').val(),
                // 游玩日期
                tpi_name = $('.tpi_name input').val(),
                // 项目名称
                tpi_spec = $('.tpi_spec input').val(),
                // 项目规格
                settle_type = $('.settle_type select').val(),
                // 结算类型
                settle_number = $('.settle_number input').val(),
                // 签单号
                tpi_price = $('.tpi_price input').val(),
                // 单价
                tpi_num = $('.tpi_num input').val(),
                // 数量
                tpi_money = $('.tpi_money input').val(),
                // 总额
                tpi_remark = $('.tpi_remark input').val();
                // 备注
                // tpi_pay_class = $('.tpi_pay_class select').val();
                // 是否现退

            if( !tpi_name ){
                _.Popup.Tip('请填写项目名称');
                return false;
            }

            // if( settle_type == '签单' && !settle_number ){
            //     _.Popup.Tip('请填写签单号');
            //     return false;
            // }

            if( !tpi_price ){
                _.Popup.Tip('请填写单价');
                return false;
            }

            if( !tpi_num ){
                _.Popup.Tip('请填写数量');
                return false;
            }

            var data = {
                tpi_date : tpi_date,
                tpi_name : tpi_name,
                tpi_spec : tpi_spec,
                tpi_settle : settle_type,
                tpi_sign_number : settle_number,
                tpi_price : tpi_price,
                tpi_num : tpi_num,
                tpi_money : tpi_money,
                tpi_remark : tpi_remark
                // tpi_pay_class : tpi_pay_class
            }
        }
        data = $.extend(data,{
            tpi_pay_type : type,
            tpi_team_id : team_id,
            tpi_type : cate
        })

        if( action == 'edit' ){
            data['tpi_id'] = UrlPara.tpi_id;
        }

        let pop = _.Popup.Confirm('是否确定保存项目详细',function(){
            _.Ajax({
                url : '/H5/TeamPlanItem/save_items',
                type : 'post',
                data : data,
                success : function(res){
                    console.log(res);
                    if( res.code == 200 ){
                        pop.remove();
                        _.Popup.Tip('保存成功');
                        let t = setTimeout(function(){
                            window.location.href = 'guide_team.html?id='+team_id+'&type='+ type + '&cate=' + cate;
                            clearTimeout(t);
                        },1000)
                    }
                }
            })
        });
    }
}

UserInfo.Ready(function(){
    new Index();
})