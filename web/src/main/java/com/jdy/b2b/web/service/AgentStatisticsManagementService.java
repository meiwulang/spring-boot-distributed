package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.agentNumberStatistics.AgentStatisticsPram;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by dugq on 2017/11/10.
 */
public interface AgentStatisticsManagementService {
    @Deprecated
    ResultBean totalAgentNumberTrend(AgentStatisticsPram param);

    @Deprecated
    ResultBean totalAgentNumberTrendByDepartment(AgentStatisticsPram param);

    @Deprecated
    ResultBean totalAgentNumberGroupByDepartment(AgentStatisticsPram param);

    @Deprecated
    ResultBean newAgentNumberStatisticsByDepartment(AgentStatisticsPram param);

    @Deprecated
    ResultBean totalAgentNumberInDepartmentGroupByAgent(AgentStatisticsPram param);

    @Deprecated
    ResultBean newAgentNumberStatistics(AgentStatisticsPram param);

    ResultBean companyLevelGroupByDepartment(AgentStatisticsPram param);

    ResultBean departmentLevelGroupByAgent(AgentStatisticsPram param);

    ResultBean agentLevelGroupByTime(AgentStatisticsPram param);

    ResultBean companyLevelGroupByTime(AgentStatisticsPram param);

    ResultBean TimeLevelGroupByDepartment(AgentStatisticsPram param);

    ResultBean timeLevelGroupByAgent(AgentStatisticsPram param);

    ResultBean systemLevelGroupByChildCompanyOrFirstDepart(AgentStatisticsPram param);

    ResultBean systemLevelGroupByTime(AgentStatisticsPram param);

    ResultBean dealAgent(AgentStatisticsPram param);


}
