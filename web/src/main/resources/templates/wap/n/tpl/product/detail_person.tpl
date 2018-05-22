 <div class="table-wrap">
      
    <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th></th>
                <th>人员</th>
                <th>部门</th>
                <th>销售总额</th>
                <th>订单总数</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
             { each agentList as value i }
                <tr>
                    <td></td>
                    <td style="width: 60px;">{ agentList[i].agentName }</td>
                    <td>{ agentList[i].departmentName }</td>
                    <td style="width: 80px;">￥{ agentList[i].sales }</td>
                    <td style="width: 60px;">{ agentList[i].orderNum }</td>
                    <td></td>
                </tr>
            { /each }
        </tbody>
    </table>
     { if !agentList || agentList.length<=0 }
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
