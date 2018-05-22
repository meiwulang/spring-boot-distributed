
<div class="table-wrap">
    
    <table>
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
                <td tim="{resultList[i].dateTime}">
                    <a href="#{ sumType }/time/?cId={ resultList[i].companyId }&timeName={ resultList[i].timeName }&dId={ resultList[i].dId }&sumTime={ sumTime }">
                        { resultList[i].dateTime }
                    </a>
                </td>
                <td><a href="#{ sumType }/time/?cId={ resultList[i].companyId }&timeName={ resultList[i].timeName }&sumTime={ sumTime }">￥{ resultList[i].moneyCount }</a></td>
                <td><a href="#{ sumType }/time/?cId={ resultList[i].companyId }&timeName={ resultList[i].timeName }&sumTime={ sumTime }">￥{ resultList[i].incomeAmount }</a></td>
                <td><a href="#{ sumType }/time/?cId={ resultList[i].companyId }&timeName={ resultList[i].timeName }&sumTime={ sumTime }">{ resultList[i].orderCount }</a></td>
                <td class="arrow-right"><a href="#{ sumType }/time/?cId={ resultList[i].companyId }&timeName={ resultList[i].timeName }&sumTime={ sumTime }"></a></td>
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
            <p>{ totalInfo.orderTotalCount }</p>
        </div>
    </div>

   
</div>

    
    

    
