import $ from 'jquery'
import _ from '@/assets/js/common/global'
import Alert from '@/assets/js/common/popup'
import pubs from './pubs'

function render () {
    _.GetTpl({
        url : '/agent_activity/company.tpl',
        data :{},
        success (tpl) {
            $('#content').html(tpl)
            renderTable()
        }
    })
}

function renderTable() {
    let {timeType, tabType, start} = pubs.getAjaxParam()
    let companyId = pubs.getQuery('id')
    let companyName = pubs.getQuery('name') || ''
    let urlMap = {
        department: '/agentActivityStatistics/queryAgentActivityOfDeptByCompany',
        person: '/agentActivityStatistics/queryAgentActivityOfSalesManagerByCompany'
    }
    _.Ajax({
        url : urlMap[tabType],
        type : 'post',
        data : {
            queryMonth : start,
            companyId
        },
        success (res){
            if( res.code == 0 ){
                let resData = res.body
                let paramMap = {
                    department: {
                        idKey:'deptId',
                        columnKey:'deptName',
                        columnName: '部门名称'
                    },
                    person: {
                        idKey:'salesManagerId',
                        columnKey:'salesManagerName',
                        columnName: '销售经理'
                    }
                }
                let param = paramMap[tabType] || {}
                let list = (resData.list || []).map(item => {
                    let queryStr = $.param({
                        id: item[param.idKey],
                        name: item[param.columnKey]
                    })
                    let linkTo = `#${timeType}/${tabType}?${queryStr}`
                    return {
                        ...item,
                        linkTo
                    }
                })
                let summary = resData.summary || {}
                $('#table_title').text(`${companyName}总代理${summary.totalAgentNums || 0}人`)
                _.GetTpl({
                    url : '/agent_activity/company_table.tpl',
                    data :{
                        ...param,
                        list,
                        summary
                    },
                    success (tpl){
                        $('#table-contanier').html(tpl);
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
    pubs.initTabEvent(renderTable)
}

function init () {
    render()
    initEvent()
}

export default {
    init
}