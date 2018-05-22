<div>   
    
    <div class="table-wrap table-index">
        <table>         
             <thead>
                <tr>
                  <th></th>
                  <th style="padding-left:0;width: 50px;">序号</th>
                  <th style="text-align: left;">姓名</th>
                  <th>销售额</th>
                 <!--  <th>返佣金额</th> -->
                  <th>订单数</th>
                  <th>游客数</th>
                  <th></th>
                </tr>
            </thead>    
            <tbody>
                { each list as value i }
                    <tr class='border-bottom'>
                        <td></td>
                        <td style="width: 50px;padding-left: 2px">{ i+1 }</td>
                        <td style="width: 80px;text-align: left;">
                            { list[i].userName }
                        </td>
                        <td>￥{ list[i].sales }</td>
                        <td>{ list[i].orderNum }</td>
                        <td>{ list[i].touristNum }</td>
                        <td></td>
                    </tr>
                    <tr class="tr-bottom">
                        <td></td>
                        <td class='div-wrap'>
                            <p class="wrap">
                                { if list[i].parentName }
                                <span>{ list[i].parentName }</span>
                                { /if }
                                <span>战队：{ list[i].departmentName }</span>
                            </p>     
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
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
                <p> ￥{ totalSales }</p>
            </div>
            <div class="col">
                <p class='grey-font'>总订单数</p>
                <p>{ totalOrderNum }</p>
            </div>
             <div class="col">
                <p class='grey-font'>游客数</p>
                <p>{ totalTouristNum }</p>
            </div>
        </div>
    </div>
</div>
