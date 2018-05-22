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
    let {timeType, start} = pubs.getAjaxParam()
    let deptId = pubs.getQuery('id')
    let deptName = pubs.getQuery('name') || ''
    _.Ajax({
        url : '/agentActivityStatistics/queryAgentActivityOfSalesManagerByDept',
        type : 'post',
        data : {
            queryMonth : start,
            deptId
        },
        success (res){
            if( res.code == 0 ){
                let resData = res.body
                let list = (resData.list || []).map(item => {
                    return {
                        ...item
                    }
                })
                let summary = resData.summary || {}
                $('#table_title').text(`${deptName}总代理${summary.totalAgentNums || 0}人`)
                _.GetTpl({
                    url : '/agent_activity/department_table.tpl',
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