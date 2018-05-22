
<div class="table-wrap">
    
    <div class="person">
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th style="max-width: 110px">销售经理</th>
                    <th>销售总额</th>
                    <th>收入总额</th>
                    <th>订单总数</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            { each list as value i }
                <tr>                       
                   <td></td>
                    <td>{  list[i].userName }</td>
                    <td>￥{list[i].amount }</td>
                    <td>￥{list[i].incomeAmount }</td>
                    <td>{ list[i].orderNum }</td>
                    <td></td>
                </tr>
            { /each }
            </tbody>
        </table>
        { if !list || list.length<=0 }
            <div class="mation-txt">暂无数据！</div>
        { /if }
        
        <div class="tato">
            <div class="sum">
                合计
            </div>
            <div class="col">
                <p class='grey-font'>总销售额</p>
                <p> ￥{ totalInfo.totalAmount }</p>
            </div>
            <div class="col">
                <p class='grey-font'>总收入额</p>
                <p> ￥{ totalInfo.totalIncomeAmount }</p>
            </div>
             <div class="col">
                <p class='grey-font'>总订单数</p>
                <p> { totalInfo.totalNum }</p>
            </div>
        </div>
    </div>
   
</div>

    
    

    
