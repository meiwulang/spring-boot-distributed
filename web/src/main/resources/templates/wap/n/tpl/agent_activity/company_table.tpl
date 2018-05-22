<div>
    <div class="table-wrap table-index">
        <table>
            <thead>
            <tr>
                <th></th>
                <th style="padding-left:0;text-align: left;width: 120px;">{ columnName }</th>
                <th>代理人数</th>
                <th>出单人数</th>
                <th>活跃度</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            { each list as value i }
            <tr class='border-bottom'>
                <td></td>
                <td style="padding-left: 2px;text-align: left;"><a href= "{ value.linkTo}">{ value[columnKey] }</a></td>
                <td><a href= "{ value.linkTo}">{ value.agentNums }</a></td>
                <td><a href= "{ value.linkTo}">{ value.hasOrderAgentNums }</a></td>
                <td><a href= "{ value.linkTo}">{ value.agentActivity }</a></td>
                <td class="arrow-right"><a href= "{ value.linkTo}"></a></td>
            </tr>
            <tr class="tr-bottom">
                <td></td>
                <td class='div-wrap' colspan="2">
                    <p class="wrap">
                        <span>销售额：￥{ value.salesAmount }</span>
                    </p>
                </td>
                <td class='div-wrap' colspan="2">
                    <p class="wrap">
                        <span>订单数：{ value.orderNums }</span>
                    </p>
                </td>
                <td></td>
            </tr>
            { /each }
            </tbody>
        </table>

        { if  !list || list.length <= 0 }
        <div class="mation-txt">暂无数据！</div>
        { /if }
        <div class="tato">
            <div class="sum">
                合计
            </div>
            <div class="col">
                <p class='grey-font'>总代理人数</p>
                <p>{ summary.totalAgentNums }</p>
            </div>
            <div class="col">
                <p class='grey-font'>总出单人数</p>
                <p>{ summary.totalHasOrderAgentNums }</p>
            </div>
            <div class="col">
                <p class='grey-font'>总活跃度</p>
                <p>{ summary.totalAgentActivity }</p>
            </div>
        </div>
    </div>
</div>
