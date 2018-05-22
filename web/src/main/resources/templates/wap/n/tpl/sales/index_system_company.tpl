
<div class="table-wrap">
    <div class="cont department" style="display: block;">
        <table>
            <thead>
            <tr>
                <th></th>
                <th style="text-align: left;max-width: 110px">销售部门/分公司</th>
                <th>销售总额</th>
                <th>收入总额</th>
                <th>订单总数</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            { each resultList as value i }
                { if resultList[i].type == '1' } 
                    <tr>
                        <td></td>
                        <td style="text-align: left;">
                            <a href="#{ sumType }/departmentOne/?dId={ resultList[i].groupConcat }&name={ resultList[i].unitName }&&sumTime={ sumTime }">
                               { resultList[i].name }
                            </a>
                        </td>
                        <td><a href="#{ sumType }/departmentOne/?dId={ resultList[i].groupConcat }&name={ resultList[i].unitName }&&sumTime={ sumTime }">￥{ resultList[i].moneyCount }</a></td>
                        <td><a href="#{ sumType }/departmentOne/?dId={ resultList[i].groupConcat }&name={ resultList[i].unitName }&&sumTime={ sumTime }">￥{ resultList[i].incomeAmount }</a></td>
                        <td><a href="#{ sumType }/departmentOne/?groupConcat={ resultList[i].groupConcat }&name={ resultList[i].unitName }sumTime={ sumTime }">{ resultList[i].orderCount }</a></td>
                        <td class="arrow-right"><a href="#{ sumType }/departmentOne/?dId={ resultList[i].groupConcat }&name={ resultList[i].unitName }}&&Time={ sumTime }"></a></td>
                    </tr>
                { /if }
                { if resultList[i].type == '0' }
                    <tr>
                        <td></td>
                        <td style="text-align: left;">
                            <a href="#{ sumType }/system/?cId={ resultList[i].id }&name={ resultList[i].unitName }&&sumTime={ sumTime }">
                               { resultList[i].name }
                            </a>
                        </td>
                        <td><a href="#{ sumType }/system/?cId={ resultList[i].id }&name={ resultList[i].unitName }&&sumTime={ sumTime }">￥{ resultList[i].moneyCount }</a></td>
                        <td><a href="#{ sumType }/system/?cId={ resultList[i].id }&name={ resultList[i].unitName }&&sumTime={ sumTime }">￥{ resultList[i].incomeAmount }</a></td>
                        <td><a href="#{ sumType }/system/?cId={ resultList[i].id }&name={ resultList[i].unitName }&&sumTime={ sumTime }">{ resultList[i].orderCount }</a></td>
                        <td class="arrow-right"><a href="#{ sumType }/system/?cId={ resultList[i].id }&name={ resultList[i].unitName }&&Time={ sumTime }"></a></td>
                    </tr>
                { /if }
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

</div>
    
    

    
