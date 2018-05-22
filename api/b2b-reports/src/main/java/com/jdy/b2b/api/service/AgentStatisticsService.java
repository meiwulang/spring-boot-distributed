package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.agentStatistics.AgentStatistics;
import com.jdy.b2b.api.model.agentStatistics.AgentStatisticsOfAgent;
import com.jdy.b2b.api.model.agentStatistics.AgentStatisticsPram;

import java.util.List;

/**
 * Created by dugq on 2017/11/9.
 */
public interface AgentStatisticsService {
    List<AgentStatistics> selectTotalAgentNumGroupByDepartment(AgentStatisticsPram param);

    List<AgentStatistics> selectNewAgentNumGroupByDepartmentAndTime(AgentStatisticsPram param);

    List<AgentStatisticsOfAgent> selectotalAgentNumberInDepartmentGroupByAgent(AgentStatisticsPram param);

    List<AgentStatistics> agentStatisticsGroupByDepartment(AgentStatisticsPram param);

    List<AgentStatisticsOfAgent> selectAgentsNumByDepartmentIdGroupByAgent(AgentStatisticsPram param);

    List<AgentStatistics> selectFirstLevelAgent(AgentStatisticsPram param);

    List<AgentStatistics> selectAgentsByFirstAgent(AgentStatisticsPram param);
}
