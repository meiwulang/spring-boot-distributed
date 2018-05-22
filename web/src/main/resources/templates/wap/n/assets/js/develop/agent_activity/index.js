import $ from 'jquery'
import _ from '@/assets/js/common/global'
import Alert from '@/assets/js/common/popup'
import pubs from './pubs'

function render () {
    _.GetTpl({
        url : '/agent_activity/index.tpl',
        data :{},
        success (tpl) {
            $('#content').html(tpl)
            renderTable()
        }
    })
}

function renderTable() {
    let {timeType, start} = pubs.getAjaxParam();
    _.Ajax({
        url : '/agentActivityStatistics/queryAgentActivityOfTotalCompany',
        type : 'post',
        data : {
            queryMonth : start
        },
        success (res){
            if( res.code == 0 ){
                let resData = res.body
                let list = (resData.list || []).map(item => {
                    let queryStr = $.param({
                        id: item.companyId,
                        name: item.companyName
                    })
                    let linkTo = `#${timeType}/company?${queryStr}`
                    return {
                        ...item,
                        linkTo
                    }
                })
                let summary = resData.summary || {}
                $('#table_title').text(`全公司总代理${summary.totalAgentNums || 0}人`)
                _.GetTpl({
                    url : '/agent_activity/index_table.tpl',
                    data :{
                        list,
                        summary
                    },
                    success (tpl){
                        $('#table-contanier').html(tpl)
                    }
                })
            } else {
                Alert.Tip(res.message)
            }
        }
    })
}

function initEvent() {
    pubs.initTimeEvent(renderTable)
}

function init () {
    render()
    initEvent()
}

export default {
    init
}