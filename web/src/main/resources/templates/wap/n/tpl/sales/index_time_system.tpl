
<div class="table-wrap">
    <table >
        <thead>
            <tr>
                <th></th>
                <th style="max-width: 110px">时间</th>
                <th>销售总额</th>
                <th>收入总额</th>
                <th>订单总数</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
        { each resultList as value i }
            <tr>
                <td></td>
                <td>{ resultList[i].dateTime }</td>
                <td>￥{ resultList[i].moneyCount }</td>
                <td>￥{ resultList[i].incomeAmount }</td>
                <td>{ resultList[i].orderCount }</td>
                <td></td>
            </tr>
        { /each }
        </tbody>
    </table>
    { if !resultList || resultList.length<=0 }
        <div class="mation-txt">暂无数据！</div>
    { /if }
   
    <div class="tato">
        <div class="sum">
            合计
        </div>
        <div class="col">
            <p class='grey-font'>总销售额</p>
            <p> ￥{ totalInfo.moneyTotalCount }</p>
        </div>
        <div class="col">
            <p class='grey-font'>总收入额</p>
            <p> ￥{ totalInfo.totalIncomeAmount }</p>
        </div>
         <div class="col">
            <p class='grey-font'>总订单数</p>
            <p> { totalInfo.orderTotalCount }</p>
        </div>
    </div>

</div>

    

    
