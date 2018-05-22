
<div class="table-wrap">   
     <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th></th>
                <th>部门</th>
                <th>销售总额</th>
                <th>订单总数</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
         { each departmentList as value i }
            <tr>
                <td></td>
                <td>{ departmentList[i].departmentName }</td>
                <td>￥{ departmentList[i].sales }</td>
                <td>{ departmentList[i].orderNum } </td>
                <td></td>
            </tr>
            { /each }
        </tbody>
    </table>
     { if !departmentList || departmentList.length<=0 }
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