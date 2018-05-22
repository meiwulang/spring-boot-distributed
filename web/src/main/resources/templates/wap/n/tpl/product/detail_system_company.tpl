
<div class="table-wrap table-index">
    <table>
        <thead>
        <tr>
            <th></th>
            <th>销售部门/分公司</th>
            <th>销售总额</th>
            <th>订单总数</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
            { each list as value i }
                {if list[i].type == '1'}
                    <tr>
                        <td></td>
                        <td style="width: 100px; text-align: left;">
                           <a href= '#{ sumType}/department/?departmentId={list[i].departmentId}&&productId={ productId }&&unitName={ list[i].departName }'>
                                { list[i].departmentName }                       
                            </a>
                        </td>
                        <td><a href= '#{ sumType}/department/?departmentId={ list[i].departmentId }&&productId={ productId }&&unitName={ list[i].departName }'>￥{ list[i].sales }</a></td>
                        <td><a href= '#{ sumType}/department/?departmentId={ list[i].departmentId }&&productId={ productId }&&unitName={ list[i].departName }'>{ list[i].orderNum }</a></td>
                        <td class="arrow-right"><a href= '#{ sumType}/department/?departmentId={ list[i].departmentId }&&productId={ productId }&&unitName={ list[i].departName }'></a></td>
                    </tr>
                { /if }
                {if list[i].type == '0'}
                    <tr>
                        <td></td>
                        <td style="width: 100px; text-align: left;">
                           <a href= '#{ sumType}/detail/?companyId={list[i].companyId}&&productId={ productId }&&unitName={ list[i].comName }'>
                                { list[i].companyName } 
                            </a>
                        </td>
                        <td><a href= '#{ sumType}/detail/?companyId={list[i].companyId}&&productId={ productId }&&unitName={ list[i].comName }'>￥{ list[i].sales }</a></td>
                        <td><a href= '#{ sumType}/detail/?companyId={list[i].companyId}&&productId={ productId }&&unitName={ list[i].comName }'>{ list[i].orderNum }</a></td>
                        <td class="arrow-right"><a href= '#{ sumType}/detail/?companyId={list[i].companyId}&&productId={ productId }&&unitName={ list[i].comName }'></a></td>
                    </tr>
                { /if }
            { /each }
        </tbody>
    </table>
    { if (!departmentList && !companyList) || (departmentList.length<=0 && companyList.length<=0) }
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
