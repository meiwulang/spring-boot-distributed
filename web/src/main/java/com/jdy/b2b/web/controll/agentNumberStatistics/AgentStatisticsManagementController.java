package com.jdy.b2b.web.controll.agentNumberStatistics;

import com.jdy.b2b.web.pojo.agentNumberStatistics.AgentStatisticsPram;
import com.jdy.b2b.web.service.AgentStatisticsManagementService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Objects;

/**
 * Created by dugq on 2017/11/10.
 */
@RestController
@RequestMapping("agentStatistics")
@Api(value = "AgentStatisticsManagementController",description = "代理人统计")
public class AgentStatisticsManagementController extends BaseController{

    @Autowired
    private AgentStatisticsManagementService agentStatisticsManagementService;

//    @ApiOperation(value = "代理人累计趋势和代理人日新增人数趋势 (折线图)", notes = "无参",httpMethod = "POST")
//    @RequestMapping("totalAgentNumberTrend")
    @Deprecated
    public ResultBean totalAgentNumberTrend(){
        AgentStatisticsPram param = new AgentStatisticsPram();
        LocalDate now = LocalDate.now();
        param.setStartDate( now.minusDays(30));
        param.setEndDate(now);
        return agentStatisticsManagementService.newAgentNumberStatistics(param);
    }
//    @ApiOperation(value = "按部门查询代理人累计趋势和代理人日新增人数趋势",notes = "departmentId需要传入  例：{departmentId:400}",httpMethod = "POST")
//    @RequestMapping("totalAgentNumberTrendByDepartment")
    @Deprecated
    public ResultBean totalAgentNumberTrendByDepartment(@RequestBody AgentStatisticsPram param){
        LocalDate now = LocalDate.now();
        param.setStartDate(now.minusDays(30));
        param.setEndDate(now);
        return agentStatisticsManagementService.totalAgentNumberTrendByDepartment(param);
    }


//    @ApiOperation(value = "查询代理人统计，按部门分组",notes = "参数只需要startDate。 例如：选择2017-10 传 参数只需要startDate = 2017-10-01 按周:{startDate : '2017-10-01',type:3}   总计： {type:2} 按月：{startDate : '2017-10-01',type:1}  按天：{startDate : '2017-10-01',type:0}",httpMethod = "POST")
//    @RequestMapping("AgentNumberGroupByDepartment")
    @Deprecated
    public ResultBean monthAgentNumberGroupByDepartment(@RequestBody AgentStatisticsPram param){
        param.initDateByType();
        param.setDepartmentId(null);
       return param.excute(agentStatisticsManagementService::newAgentNumberStatistics,agentStatisticsManagementService::newAgentNumberStatistics,agentStatisticsManagementService::newAgentNumberStatistics);
    }


//    @ApiOperation(value = "统计代理人下线总数",notes = " 例：按周:{startDate : '2017-10-01',type:3} 总计： {departmentId:401,type:2} 按月：{departmentId:401,startDate : '2017-10-01',type:1}  按天：{departmentId:400,startDate : '2017-10-01',type:0}",httpMethod = "POST")
//    @RequestMapping("totalAgentStatistic")
    @Deprecated
    public ResultBean totalAgentStatistic(@RequestBody AgentStatisticsPram param){
        param.initDateByType();
        return agentStatisticsManagementService.totalAgentNumberInDepartmentGroupByAgent(param);
    }


    @RequestMapping("agentStatistics")
    public ResultBean agentStatistics(@RequestBody AgentStatisticsPram param){
        if(Objects.isNull(param.getTableType())){
            return new ResultBean("-1","no tableType");
        }
        //调用枚举实例中的init方法进行初始化
        param.initByTableType();
//        return param.excute(agentStatisticsManagementService::companyLevelGroupByDepartment,
//                            agentStatisticsManagementService::departmentLevelGroupByAgent,
//                            agentStatisticsManagementService::agentLevelGroupByTime,
//                            agentStatisticsManagementService::companyLevelGroupByTime,
//                            agentStatisticsManagementService::TimeLevelGroupByDepartment,
//                            agentStatisticsManagementService::timeLevelGroupByAgent,
//                            agentStatisticsManagementService::systemLevelGroupByChildCompanyOrFirstDepart,
//                            agentStatisticsManagementService::systemLevelGroupByTime);
        return agentStatisticsManagementService.dealAgent(param);
    }



}
