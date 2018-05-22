package com.jdy.b2b.api.service.Impl;

import com.jdy.b2b.api.dao.CompanyMapper;
import com.jdy.b2b.api.dao.DepartmentMapper;
import com.jdy.b2b.api.dao.agentStatistics.AgentStatisticsMapper;
import com.jdy.b2b.api.model.agentStatistics.AgentStatistics;
import com.jdy.b2b.api.model.agentStatistics.AgentStatisticsOfAgent;
import com.jdy.b2b.api.model.agentStatistics.AgentStatisticsPram;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Created by dugq on 2017/11/9.
 */
@Service
public class AgentStatisticsServiceImpl implements com.jdy.b2b.api.service.AgentStatisticsService {
    @Autowired
    private AgentStatisticsMapper agentStatisticsMapper;
    @Autowired
    private CompanyMapper companyMapper;
    @Autowired
    private DepartmentMapper departmentMapper;

    @Override
    public List<AgentStatistics> selectTotalAgentNumGroupByDepartment(AgentStatisticsPram param) {
        return agentStatisticsMapper.selectTotalAgentNumGroupByDepartment(param);
    }

    @Override
    public List<AgentStatistics> selectNewAgentNumGroupByDepartmentAndTime(AgentStatisticsPram param) {
        return agentStatisticsMapper.selectTotalNewAgentNumByTimeGroupByDepartment(param);
    }

    @Override
    public List<AgentStatisticsOfAgent> selectotalAgentNumberInDepartmentGroupByAgent(AgentStatisticsPram param) {
        return agentStatisticsMapper.selectotalAgentNumberInDepartmentGroupByAgent(param);
    }
    @Override
    public List<AgentStatistics> agentStatisticsGroupByDepartment(AgentStatisticsPram param) {
        return agentStatisticsMapper.agentStatisticsGroupByDepartment(param);
    }
    @Override
    public List<AgentStatisticsOfAgent> selectAgentsNumByDepartmentIdGroupByAgent(AgentStatisticsPram param) {
        return agentStatisticsMapper.selectAgentsNumByDepartmentIdGroupByAgent(param);
    }
    @Override
    public List<AgentStatistics>   selectFirstLevelAgent(AgentStatisticsPram param) {
        if (!Objects.isNull(param.getCompanyId())){
            String ids = companyMapper.selectPidsById(param.getCompanyId());
            param.setCompanyIds(ids);

        }
        if (!Objects.isNull(param.getDepartmentId())){
            String ids = departmentMapper.selectPidsById(param.getDepartmentId());
            param.setDepartmentIds(ids);
        }
        List<AgentStatistics> agentStatistics = agentStatisticsMapper.selectFirstLevelAgent(param);
        List<AgentStatistics> longAgentStatisticsMap = agentStatisticsMapper.selectAgentsByFirstAgent1(param);
        Map<Long, List<AgentStatistics>> collect = longAgentStatisticsMap.stream().collect(Collectors.groupingBy(agent -> agent.getFirstAgentId()));
        agentStatistics.stream().forEach(agent->agent.setChildren(collect.get(agent.getAgentId())));
        return agentStatistics;
    }
    @Override
    public List<AgentStatistics> selectAgentsByFirstAgent(AgentStatisticsPram param) {
        return agentStatisticsMapper.selectAgentsByFirstAgent(param);
    }
}
