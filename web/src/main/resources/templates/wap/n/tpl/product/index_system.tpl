
<div class="table-wrap table-index">
    <table>
        <thead>
        <tr>
            <th></th>
            <th>产品名称<!-- /负责人 --></th>
            <th>销售总额</th>
            <th>订单总数</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
            { each productList as value i }
                <tr>
                    <td></td>
                    <td style="max-width: 160px; text-align: left;">
                        <a href= '#{ sumType}/system/?productId={productList[i].productId}&&productName={ productList[i].productNameCode }'>{ productList[i].productName }</a>
                    </td>
                    <td><a href= '#{ sumType }/system/?productId={productList[i].productId}&&productName={ productList[i].productNameCode }'>￥{ productList[i].sales }</a></td>
                    <td><a href= '#{ sumType }/system/?productId={productList[i].productId}&&productName={ productList[i].productNameCode }'>{ productList[i].orderNum }</a></td>
                    <td class="arrow-right"><a href= '#{ sumType }/system/?productId={productList[i].productId}&&productName={ productList[i].productNameCode }'></a></td>
                </tr>
            { /each }
        </tbody>
    </table>
    { if !productList || productList.length<=0 }
        <div class="mation-txt">暂无数据！</div>
    { /if }
    <div class="tato">
        <div class="sum">
            合计
        </div>
        <div class="col">
            <p class='grey-font'>总销售额</p>
            <p> ￥{ totalSales }</p>
        </div>
         <div class="col">
            <p class='grey-font'>总订单数</p>
            <p>{ totalOrderNum }</p>
        </div>
    </div>
    
</div>
