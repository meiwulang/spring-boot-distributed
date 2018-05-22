
<div class="table-wrap">
    <table>
        <thead>
        <tr>
            <th></th>
            <th style="text-align: left;  width: 150px;">销售部门/负责人</th>
            <th>新增代理人总数</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        { each list as value i }
            <tr>
                <td></td>
                <td style="width: 200px;"><a href="#{ sumType}/department/?departmentId={list[i].departmentId}&&name={ list[i].departName }">{ list[i].departmentName }</a></td>
                <td style="width: 200px;"><a href="#{ sumType}/department/?departmentId={list[i].departmentId}&&name={ list[i].departName }">{ list[i].num }</a></td>
                <td class="arrow-right"><a href="#{ sumType}/department/?departmentId={list[i].departmentId}&&name={ list[i].departName }"></a></td>
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
            <p class='grey-font'>新增代理人总数 </p>
            <p> { total }</p>
        </div>
         
    </div>      

</div>
    
    

    
