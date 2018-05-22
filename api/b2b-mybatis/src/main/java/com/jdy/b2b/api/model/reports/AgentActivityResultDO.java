package com.jdy.b2b.api.model.reports;

import java.math.BigDecimal;

/**
 * 代理人活跃度结果DO
 * @author chris
 * @since Jan 07.18
 */
public class AgentActivityResultDO {

    private String companyName;

    private Integer companyId;

    private String deptName;

    private Integer deptId;

    private String salesManagerName;

    private Integer salesManagerId;

    private String agentName;

    private Integer agentId;

    private Integer agentNums;

    private String agentActivity;

    private BigDecimal salesAmount;

    private Integer orderNums;

    private String agentLevel;

    private Integer hasOrderAgentNums;

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Integer getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Integer companyId) {
        this.companyId = companyId;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

    public Integer getDeptId() {
        return deptId;
    }

    public void setDeptId(Integer deptId) {
        this.deptId = deptId;
    }

    public String getSalesManagerName() {
        return salesManagerName;
    }

    public void setSalesManagerName(String salesManagerName) {
        this.salesManagerName = salesManagerName;
    }

    public Integer getSalesManagerId() {
        return salesManagerId;
    }

    public void setSalesManagerId(Integer salesManagerId) {
        this.salesManagerId = salesManagerId;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    public Integer getAgentId() {
        return agentId;
    }

    public void setAgentId(Integer agentId) {
        this.agentId = agentId;
    }

    public Integer getAgentNums() {
        return agentNums;
    }

    public void setAgentNums(Integer agentNums) {
        this.agentNums = agentNums;
    }

    public String getAgentActivity() {
        return agentActivity;
    }

    public void setAgentActivity(String agentActivity) {
        this.agentActivity = agentActivity;
    }

    public BigDecimal getSalesAmount() {
        return salesAmount;
    }

    public void setSalesAmount(BigDecimal salesAmount) {
        this.salesAmount = salesAmount;
    }

    public Integer getOrderNums() {
        return orderNums;
    }

    public void setOrderNums(Integer orderNums) {
        this.orderNums = orderNums;
    }

    public String getAgentLevel() {
        return agentLevel;
    }

    public void setAgentLevel(String agentLevel) {
        this.agentLevel = agentLevel;
    }

    public Integer getHasOrderAgentNums() {
        return hasOrderAgentNums;
    }

    public void setHasOrderAgentNums(Integer hasOrderAgentNums) {
        this.hasOrderAgentNums = hasOrderAgentNums;
    }

}
