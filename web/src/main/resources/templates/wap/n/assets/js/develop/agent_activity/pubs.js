import $ from 'jquery'
import Alert from '@/assets/js/common/popup'
import MyDate from '@/assets/js/common/date_new'

function getPath() {
    let sp = '/'
    let ret
    let hash = window.location.hash
    if (hash) {
        hash = hash.slice(hash.charAt(1) === sp ? 2 : 1)
        let index = hash.indexOf('?')
        ret = hash.slice(0, index !== -1 ? index : hash.length).split(sp)
    }
    return ret || []
}
function getQuery(key) {
    let ret = {}
    let hash = window.location.hash
    if (hash) {
        let index = hash.indexOf('?')
        if (index !== -1) {
            hash.slice(index + 1).split('&').forEach(value => {
                if (value) {
                    let arr = value.split('=')
                    if (arr[0]) {
                        ret[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1])
                    }
                }
            })
        }
    }
    return key ? ret[key] : ret
}
function getTimeParam(timeType) {
    let $container = MyDate.container
    let start = ''
    let end = ''
    let value = ''
    switch (timeType){
        case 'total':
            break
        case 'day':
            value = start = $.trim($container.find('.day input.start').val());
            end = $.trim($container.find('.day input.end').val());
            break
        case 'week':
            let selectedWeek= $container.find('.week select option:selected');
            ({start, end, value} = MyDate.getSelectStartEnd(selectedWeek))
            break
        case 'month':
            value = $.trim($container.find('.month input').val())
            start = value + '-01'
            break
        case 'season':
            let selectedSeason = $container.find('.season select option:selected');
            ({start, end, value} = MyDate.getSelectStartEnd(selectedSeason))
            break
        case 'year':
            let selectedYear = $container.find('.year select option:selected');
            ({start, end, value} = MyDate.getSelectStartEnd(selectedYear))
            break
        default:
            break
    }
    return {start, end, value}
}
function getTimeType() {
    return getPath()[0] || 'total'
}
function renderTime() {
    let totalHtml = '<div class="total active" style="display: none"></div>'
    let monthHtml = MyDate.month()
    MyDate.container.html(totalHtml + monthHtml)
}
export default {
    getPath,
    getQuery,
    getTimeType,
    getAjaxParam () {
        let timeType = getTimeType()
        let timeParam = getTimeParam(timeType) || {}
        let tabType = $('.tab-wrap').find('.active').data('type')
        return {
            timeType,
            tabType,
            start :timeParam.start,
            end :timeParam.end,
            value:timeParam.value
        }
    },
    renderTime,
    refreshTimeStyle () {
        let timeType = getTimeType()
        //tab-head
        $('#header').find('.ul-bag li').each(function () {
            let $this  = $(this);
            let href = $this.find('a').attr('href')
            href = href.split('#')[1]
            href = href.split('/')[0]
            if(href === timeType) {
                $this.addClass('active').siblings('li').removeClass('active')
            }
        })
        //tab-content
        MyDate.container.find('.'+timeType).addClass('active').siblings('div').removeClass('active')
        if (!location.hash) {
            $('.date-wrap .tim .total').addClass('active').siblings('div').removeClass('active')
        }
    },
    initEvent () {
        /* 链接跳转，不要绑定事件，注释 */
        /*$('#header').on('click','.ul-bag li',function(){
            if (!$(this).is('.active')) {
                $('.switch ul li').removeClass('active')
                $(this).addClass('active')
                renderTime()
            }
        })*/
        //返回上一页
        $('#content,.title_header').on('click','.bg_ing',function(){
            let [timeType] = getPath()

            if(timeType){
                window.history.go(-1)
            }else{
                window.location.href = 'list.html'
            }
        })
    },
    initTimeEvent (cb) {
        cb = cb || $.noop
        $('.date-wrap').find('.tim').off().on('change','.month input,select',function(){
            cb()
        }).on('change','.day input.start',function(){
            const $this = $(this)
            const start  = $this.val()
            const end = $this.parent().find('input.end').val()
            if(start>end){
                Alert.Tip('开始日期不能晚于结束日期')
            } else{
                cb()
            }
        }).on('change','.day input.end',function(){
            const self = $(this)
            const end  = self.val()
            const start = self.parent().find('input.start').val()
            if(start>end){
                Alert.Tip('开始日期不能晚于结束日期')
            } else{
                cb()
            }
        })
    },
    initTabEvent (cb) {
        cb = cb || $.noop
        $('#content').off('click','.tab-wrap .tab').on('click','.tab-wrap .tab',function(){
            $(this).addClass('active').siblings('.tab').removeClass('active');
            cb()
        });
    }
}