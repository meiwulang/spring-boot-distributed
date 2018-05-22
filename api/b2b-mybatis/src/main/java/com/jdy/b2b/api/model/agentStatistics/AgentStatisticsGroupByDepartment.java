package com.jdy.b2b.api.model.agentStatistics;

import java.io.Serializable;
import java.util.List;

/**
 * Created by dugq on 2017/12/4.
 */
public class AgentStatisticsGroupByDepartment extends BaseAgentStatistics implements Serializable {
    private static final long serialVersionUID = 5305324200074024830L;
    private Long companyId;
    private Long departmentId;
    private String departmentName;
    private String principal = "";
    private List<AgentStatistics> firstAgents;

    public AgentStatisticsGroupByDepartment() {
        type = 1;
    }

    public AgentStatisticsGroupByDepartment(List<AgentStatistics> agents){
        type = 1;
        this.departmentId = agents.get(0).getDepartmentId();
        this.departmentName = agents.get(0).getDepartmentName();
        this.firstAgents = agents;
        this.num = agents.stream().reduce(0, (acc, agent1) -> acc + agent1.getNum(), (left, right) -> left + right);
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getPrincipal() {
        return principal;
    }

    public void setPrincipal(String principal) {
        this.principal = principal;
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
