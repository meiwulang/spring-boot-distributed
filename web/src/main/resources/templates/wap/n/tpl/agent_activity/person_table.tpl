<div>
    <div class="table-wrap table-index">
        <table>
            <thead>
            <tr>
                <th></th>
                <th style="padding-left:0;text-align: left;width: 120px;">代理人姓名</th>
                <th>代理人等级</th>
                <th>销售额</th>
                <th>订单数</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            { each list as value i }
            <tr class='border-bottom'>
                <td></td>
                <td style="padding-left: 2px;text-align: left;">{ value.agentName }</td>
                <td>{ value.agentLevel }</td>
                <td>￥{ value.salesAmount }</td>
                <td>{ value.orderNums }</td>
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
                <p class='grey-font'>总销售额</p>
                <p>￥{ summary.totalSalesAmount }</p>
            </div>
            <div class="col">
                <p class='grey-font'>总订单数</p>
                <p>{ summary.totalOrderNums }</p>
            </div>
        </div>
    </div>
</div>
