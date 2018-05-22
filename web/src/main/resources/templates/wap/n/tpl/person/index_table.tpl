<div>   
    
    <div class="table-wrap table-index">
        <table>         
             <thead>
                <tr>
                  <th></th>
                  <th style="padding-left:0;width: 50px;">序号</th>
                  <th style="text-align: left;width: 90px;">销售部门/分公司</th>
                  <th>销售额</th>
                  <th>订单数</th>
                  <th>游客数</th>
                  <th></th>
                </tr>
            </thead>    
            <tbody>
                { each list as value i }
                    {if list[i].type == '1'}
                        <tr>
                            <td></td>
                            <td style="width: 50px;padding-left: 2px">{ i+1 }</td>
                            <td style="width: 90px; text-align: left;">
                               <a href= '#{ sumType}/system/?departmentId={list[i].departmentId}&&name={ list[i].unitName }'>
                                    { list[i].departmentName }                       
                                </a>
                            </td>
                            <td><a href= '#{ sumType}/system/?departmentId={ list[i].departmentId }&&name={ list[i].unitName }'>￥{ list[i].sales }</a></td>
                            <td><a href= '#{ sumType}/system/?departmentId={ list[i].departmentId }&&name={ list[i].unitName }'>{ list[i].orderNum }</a></td>
                            <td><a href= '#{ sumType}/system/?departmentId={ list[i].departmentId }&&name={ list[i].unitName }'>{ list[i].touristNum }</a></td>
                            <td class="arrow-right"><a href= '#{ sumType}/system/?departmentId={ list[i].departmentId }&& name={ list[i].unitName }'></a></td>
                        </tr>
                    { /if }
                    {if list[i].type == '0'}
                        <tr>
                            <td></td>
                            <td style="width: 50px;padding-left: 2px ">{ i+1 }</td>
                            <td style="width: 90px; text-align: left;">
                               <a href= '#{ sumType}/system/?companyId={list[i].companyId}&&name={ list[i].unitName }'>
                                    { list[i].companyName } 
                                </a>
                            </td>
                            <td><a href= '#{ sumType}/system/?companyId={list[i].companyId}&&name={ list[i].unitName }'>￥{ list[i].sales }</a></td>
                            <td><a href= '#{ sumType}/system/?companyId={list[i].companyId}&&name={ list[i].unitName }'>{ list[i].orderNum }</a></td>
                            <td><a href= '#{ sumType}/system/?companyId={list[i].companyId}&&name={ list[i].unitName }'>{ list[i].touristNum }</a></td>
                            <td class="arrow-right"><a href= '#{ sumType}/system/?companyId={list[i].companyId}&&name={ list[i].unitName }'></a></td>
                        </tr>
                    { /if }
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
                <p> ￥{ totalSales }</p>
            </div>
            <!-- <div class="col">
                <p class='grey-font'>返佣金额</p>
                <p>{ totalBrokerage }</p>
            </div> -->
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
