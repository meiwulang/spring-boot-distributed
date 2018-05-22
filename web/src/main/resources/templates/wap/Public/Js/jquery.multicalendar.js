/**
 * Created with JetBrains PhpStorm.
 * User: asun
 * Date: 13-9-30
 * Time: 上午9:17
 */


/**
 * HTML 代码结构
 <div class="multi_calendar">
     <div class="toolbar">
         <span class="prev">上个月</span>
         <span class="next">下个月</span>
         <div class="title">2013年9月</div>
     </div>

     <div class="calendar_body">
         <div class="c_li"></div>
         <div class="clear"></div>
     </div>
 </div>

 // 需要依托JqueryUI工作
 // http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css
 // http://code.jquery.com/ui/1.10.3/jquery-ui.js

 */

;(function($){
    $.fn.extend({
        multicalendar : function(opt){

            var me = $(this), opt = (typeof opt == 'object')? opt : {},
                url = opt.url, me_id = me.attr('id'),
                toolbar = me.find('div.toolbar'),
                tbody = me.find('div.calendar_body .c_li'),
                month = (opt.month)?opt.month:'',
                year = (opt.year)?opt.year:'',
                prev_a = me.find('.prev'),
                next_a = me.find('.next'),
                title = toolbar.find('.title'),
                title_fld = (opt.title)?opt.title:'title',
                prev_fld = (opt.prev)?opt.prev:'prev',
                next_fld = (opt.next)?opt.prev:'next',
                days_fld = (opt.days)?opt.days:'days',
                fn = (opt.fn && typeof opt.fn == 'function')?opt.fn : null,
                other = opt.params ? opt.params : {};
            if (!url) { tbody.html('您的配置参数不正确！'); } //return; // 参数不完整
            multi_calendar_func(me, opt, url, year, month, prev_a, next_a, tbody, title, fn, title_fld,prev_fld,next_fld,days_fld, other);
        }
    });
})(jQuery);

function multi_calendar_func(me, opt, url, year, month, prev_a, next_a, tbody, title, fn, title_fld,prev_fld,next_fld,days_fld, other){
    prev_a.unbind(); next_a.unbind();
    var dt = other ? other : {};
    if (month) dt['month'] = month;
    if (year) dt['year'] = year;
    if (opt.rows) dt['rows'] = opt.rows;
    $.getJSON(url, dt, function(data){
        //var f = (opt.fromDay)? opt.fromDay : 1; // 处理日历从哪天开始显示
        var calendar = $('<ul>' +
            '<li class="s-hd"><input type="checkbox" class="s-ckb" w-index="0"> 一</li>' +
            '<li class="s-hd"><input type="checkbox" class="s-ckb" w-index="1"> 二</li>' +
            '<li class="s-hd"><input type="checkbox" class="s-ckb" w-index="2"> 三</li>' +
            '<li class="s-hd"><input type="checkbox" class="s-ckb" w-index="3"> 四</li>' +
            '<li class="s-hd"><input type="checkbox" class="s-ckb" w-index="4"> 五</li>' +
            '<li class="s-hd"><input type="checkbox" class="s-ckb" w-index="5"> 六</li>' +
            '<li class="s-hd"><input type="checkbox" class="s-ckb" w-index="6"> 日</li>' +
            '</ul>'), li='';
        $.each(data[days_fld], function(index, info){
            li += '<li d-index="'+ index +'" class="'+ info['css']+'" rel="'+ info['Ymd'] +'" title="'+ info['Y_m_d'] +'\n'+ renderer_calendar(info['info'])+'">'+info['d']+'</li>'
        });
        var li_child = calendar.append(li);
        tbody.html('');
        tbody.append(li_child);
        title.html( data[title_fld] );
        title.dblclick( function(){
            multi_calendar_func(me, opt, url, year, month, prev_a, next_a, tbody, title, fn, title_fld,prev_fld,next_fld,days_fld, other);
        } );

        var p = (data[prev_fld]).split('-'), n = (data[next_fld]).split('-'),
            py = p[0], pm = p[1], ny = n[0], nm = n[1], option=opt;
        prev_a.click(function(){
            multi_calendar_func(me, opt, url, py, pm, prev_a, next_a, tbody, title, fn, title_fld,prev_fld,next_fld,days_fld, other);
        });
        next_a.click(function(){
            multi_calendar_func(me, opt, url, ny, nm, prev_a, next_a, tbody, title, fn, title_fld,prev_fld,next_fld,days_fld, other);
        });

        me.find('.calendar_body').selectable({
            filter:'li',
            stop: function( event, ui ) {
                $('.s-day').each(function(){
                    var dindex = $(this).attr('d-index');
                    if(!$(this).hasClass('ui-selected')){
                        $(".s-ckb[w-index="+dindex+"]").attr('checked',false);
                    }
                })
                var s = $(this).find('li.ui-selected'), v=[];
                $.each(s, function(i, n){
                    var t = $(this);
                    if (!t.hasClass('s-out') && !t.hasClass('s-already')){
                        v.push(t.attr('rel'));
                    }
                });
                if (fn) fn(v.join(','));
            }
        });

        //日历选择
        me.find('.s-ckb').change(function(){
            var windex = $(this).attr('w-index');
            var is_selected = true,v=[];
            if($(this).is(':checked')){
                is_selected = false;
            }
            $('.s-day').each(function(){
                var d = $(this);
                if(d.attr('d-index') % 7 == windex){
                    if(is_selected){
                        d.removeClass('ui-selected');
                    }else{
                        d.addClass('ui-selected');
                    }
                }
                if (!d.hasClass('s-out') && !d.hasClass('s-already') && d.hasClass('ui-selected')){
                    v.push(d.attr('rel'));
                }
            })
            if (fn) fn(v.join(','));
        })
    });
}



function renderer_calendar(info){
    if (!info || typeof(info)=='undefined') return '';
    var tmp = info.split('/');
    var tip = '出发：' + tmp[0] + '，' + tmp[1] + '辆车，共'+ tmp[2] + '座，已售' + tmp[3]+'座';
    return tip;
}