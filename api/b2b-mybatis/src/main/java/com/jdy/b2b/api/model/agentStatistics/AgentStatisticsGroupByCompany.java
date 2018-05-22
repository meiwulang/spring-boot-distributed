package com.jdy.b2b.api.model.agentStatistics;

import java.io.Serializable;
import java.util.List;

/**
 * Created by dugq on 2017/12/4.
 */
public class AgentStatisticsGroupByCompany extends BaseAgentStatistics implements Serializable {
    private static final long serialVersionUID = 5305324200074024830L;
    private Long companyId;
    //新增companyName]
    private String companyName;
    private List<AgentStatistics> firstAgents;

    public AgentStatisticsGroupByCompany() {
        type = 0;
    }

    public AgentStatisticsGroupByCompany(List<AgentStatistics> agents){
       type = 0;
        this.companyId = agents.get(0).getCompanyId();
        this.companyName = agents.get(0).getCompanyName();
        this.firstAgents = agents;
        this.num = agents.stream().reduce(0, (acc, agent1) -> acc + agent1.getNum(), (left, right) -> left + right);
    }


    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }


    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Integer descNum() {
        return -num;
    }

    public List<AgentStatistics> getFirstAgents() {
        return firstAgents;
    }

    public void setFirstAgents(List<AgentStatistics> firstAgents) {
        this.firstAgents = firstAgents;
    }
}
